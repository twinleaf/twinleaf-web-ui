use anyhow::{anyhow, Context, Result};
#[allow(unused_imports)]
use log::{self, debug, info};
use std::io::{self, Write};
use std::time::Duration;
use structopt::StructOpt;
use termcolor::{Color, ColorChoice, ColorSpec, StandardStream, WriteColor};
use tio::{Device, UpdatingInformation, Replies, ErrorCode};
use tio_packet::{Packet, RPCRequest, TYPES};
use std::str;
use std::convert::TryInto;

/// Pretty simple/small CLI implementation. I copied this from another CLI tool I wrote, and as a
/// result it is a bit over-engineered and pulls in a bunch of dependencies which aren't really
/// needed, like fancy argument parsing (structopt) and terminal color. These are fun but increase
/// binary size for the CLI, and build times even if the CLI isn't used (eg, when `tio` is compiled
/// in to Tauri app as a library). Could work around this by making the CLI a separate crate (in
/// the same "workspace"); have the CLI features be controlled by a config flag; making the CLI an
/// "example" not a binary; maybe something else.
///
/// Do recommend keeping at least 'anyhow' for error processing in the CLI.

// I love the API of the structopt crate. It does unfortunately pull in the 'clap' crate, which is
// fairly large.
#[derive(StructOpt)]
#[structopt(
    rename_all = "kebab-case",
    about = "Simple CLI interface to TIO Devices"
)]
struct Opt {
    #[structopt(subcommand)]
    cmd: Command,
}

#[derive(StructOpt)]
enum Command {
    Enumerate,
    CatRaw { uri: String },
    Cat { uri: String },
    Rpc {uri: String, rpc_call: String, arg: Option<String>},
    Proxy,
}
pub fn send_rpc(rpc_call: String, arg: Option<String>, device: &Device, updating_information: &mut UpdatingInformation, rpc_type:TYPES) -> Packet {
    let resp;
    let existing_arg;
    let mut req_struct = RPCRequest::named_simple(rpc_call);
    let request_id = req_struct.req_id;
    use TYPES::*;
    match arg{
        Some(s) => {existing_arg = s;
            match rpc_type {
                U8 => {println!("u8"); req_struct.add_payload(u8::to_le_bytes(existing_arg.parse::<u8>().unwrap()).to_vec());}
                I8 => {println!("i8"); req_struct.add_payload(i8::to_le_bytes(existing_arg.parse::<i8>().unwrap()).to_vec());}
                U16 => {println!("u16"); req_struct.add_payload(u16::to_le_bytes(existing_arg.parse::<u16>().unwrap()).to_vec());}
                I16 => {println!("i16"); req_struct.add_payload(i16::to_le_bytes(existing_arg.parse::<i16>().unwrap()).to_vec());}
                U32 => {println!("u32"); req_struct.add_payload(u32::to_le_bytes(existing_arg.parse::<u32>().unwrap()).to_vec());}
                I32 => {println!("i32"); req_struct.add_payload(i32::to_le_bytes(existing_arg.parse::<i32>().unwrap()).to_vec());}
                U64 => {println!("u64"); req_struct.add_payload(u64::to_le_bytes(existing_arg.parse::<u64>().unwrap()).to_vec());}
                I64 => {println!("i64"); req_struct.add_payload(i64::to_le_bytes(existing_arg.parse::<i64>().unwrap()).to_vec());}
                F32 => {println!("f32"); req_struct.add_payload(f32::to_le_bytes(existing_arg.parse::<f32>().unwrap()).to_vec());}
                F64 => {println!("f64"); req_struct.add_payload(f64::to_le_bytes(existing_arg.parse::<f64>().unwrap()).to_vec());}
                StringType => {println!("string"); req_struct.add_payload(existing_arg.as_bytes().to_vec());}
                NoneType => {}
                _ => {}
            }
        }//req_struct.add_payload(s.as_bytes().to_vec())}
        None => {}
    }
    let req = Packet::RpcReq(req_struct);
    device.tx.send(req).unwrap();
    loop{
        let packet = device.rpc.recv();
        updating_information.interpret_packet(packet.unwrap());
        match updating_information.rpc_hash.get(&request_id){
            Some(response) => {
                resp = response;
                break;}
            None => { 
                continue;}
        };
                
    }
    return resp.clone();
}

pub fn send_and_interpret_rpc(rpc_call: String, arg: Option<String>, device: &Device, updating_information: &mut UpdatingInformation) ->  (Option<TYPES>, Packet){
    let packet = send_rpc("rpc.info".to_string(), Some(rpc_call.clone()), device, updating_information, TYPES::StringType);
    let rpc_type;
    match packet {
        Packet::RPCErrorData(ref _sd) => {return (None, packet)},
        Packet::RPCResponseData(sd) => {rpc_type = Some(TYPES::from_u8(sd.reply_payload[0]).unwrap());}
        _ => {panic!("Error!");}
    }
    //println!("{:?}", rpc_type);
    let response = send_rpc(rpc_call, arg, device, updating_information, rpc_type.unwrap());
    return (rpc_type, response);

}

fn main() -> Result<()> {
    let opt = Opt::from_args();

    // env_logger is the most common simple rust logging crate. You can control log verbosity by
    // setting an environment variable on the command line.
    env_logger::from_env(env_logger::Env::default()).init();
    debug!("Args parsed, starting up");

    if let Err(err) = run(opt) {
        // Be graceful about some errors
        if let Some(io_err) = err.root_cause().downcast_ref::<std::io::Error>() {
            if let std::io::ErrorKind::BrokenPipe = io_err.kind() {
                // presumably due to something like writing to stdout and piped to `head -n10` and
                // stdout was closed
                debug!("got BrokenPipe error, assuming stdout closed as expected and exiting with success");
                std::process::exit(0);
            }
        }

        // gratuitous terminal color handling, for pretty-printing errors
        let mut color_stderr = StandardStream::stderr(if atty::is(atty::Stream::Stderr) {
            ColorChoice::Auto
        } else {
            ColorChoice::Never
        });
        color_stderr.set_color(ColorSpec::new().set_fg(Some(Color::Red)).set_bold(true))?;
        eprintln!("Error: {:?}", err);
        color_stderr.set_color(&ColorSpec::new())?;
        std::process::exit(1);
    }

    Ok(())
}

fn run(opt: Opt) -> Result<()> {
    match opt.cmd {
        Command::Enumerate => {
            // prints to stdout
            Device::enumerate_devices();
        }
        // "cat-raw" was used when developing to just dump CSV-style data rows to stdout from
        // serial ports (it does not try to parse binary packets)
        Command::CatRaw { uri } => {
            let mut port = serialport::new(uri, 115_200)
                .timeout(Duration::from_millis(20))
                .open()?;
            let mut serial_buf: Vec<u8> = vec![0; 1000];
            loop {
                match port.read(serial_buf.as_mut_slice()) {
                    Ok(t) => io::stdout().write_all(&serial_buf[..t]).unwrap(),
                    Err(ref e) if e.kind() == io::ErrorKind::TimedOut => (),
                    Err(e) => eprintln!("{:?}", e),
                }
            }
        }
        Command::Cat { uri } => {
            let device = Device::connect(uri)?;
            println!("device: {:?}", device.info);
            // form rpc request packet and send with dev.name as payload and transmit
            // device.tx 
            loop {
                let packet = device.rx.recv()?;
                println!("{:?}", packet);
                // use tio_packet::Packet
                // ]if let Packet::StreamData(sd) = packet {
                //     // TODO: this is a temporary hack to make debugging easier
                //     println!("\tdata as f32: {:?}", sd.as_f32());
                // }
            }
        }
        Command::Rpc{ uri, rpc_call, arg} => {
            let mut updating_information = UpdatingInformation::default();
            let device = Device::connect(uri)?;
            let (rpc_type, response) = send_and_interpret_rpc(rpc_call, arg, &device, &mut updating_information);
            let reply;
            match response {
                Packet::RPCErrorData(sd) => { 
                    reply = Replies::Error(ErrorCode::give_message(ErrorCode::from_u16(sd.error_code).unwrap()));
                    println!("RPC {:?}", reply);}
                Packet:: RPCResponseData(sd) => {reply = Replies::Response(sd.reply_payload);}
                _ => {panic!("Error")}
            }

            match rpc_type {
                Some(resp_type) => { 
                    if let Replies::Response(payload) = reply{
                        use TYPES::*;
                        match resp_type {
                            U8 => {println!("RPC {:?}", payload);}
                            I8 => {println!("RPC {:?}", payload);}
                            U16 => {println!("RPC {:?}", u16::from_le_bytes(payload.try_into().unwrap()));}
                            I16 => {println!("RPC {:?}", i16::from_le_bytes(payload.try_into().unwrap()));}
                            U32 => {println!("RPC {:?}", u32::from_le_bytes(payload.try_into().unwrap()));}
                            I32 => {println!("RPC {:?}", i32::from_le_bytes(payload.try_into().unwrap()));}
                            U64 => {println!("RPC {:?}", u64::from_le_bytes(payload.try_into().unwrap()));}
                            I64 => {println!("RPC {:?}", i64::from_le_bytes(payload.try_into().unwrap()));}
                            F32 => {println!("RPC {:?}", f32::from_le_bytes(payload.try_into().unwrap()));}
                            F64 => {println!("RPC {:?}", f64::from_le_bytes(payload.try_into().unwrap()));}
                            StringType => {println!("RPC {:?}", str::from_utf8(&payload).unwrap());}
                            NoneType => {println!("RPC {:?}", payload);}
                            _ => {println!("RPC {:?}", payload);}
                        }
                    }
                }
                None => {}
            }

            // match str::from_utf8(response_payload) {
            //     Ok(v) => {println!("Rpc Response {:?}", v)}
            //     Err(_) => {println!("Rpc Response {:?}", response_payload)}
            // };
        }

        Command::Proxy => {
            return Err(anyhow!("not implemented"))
                .with_context(|| "trying to open serial port".to_string());
        }
    }
    Ok(())
}
