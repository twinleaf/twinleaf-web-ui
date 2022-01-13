use anyhow::{anyhow, Context, Result};
#[allow(unused_imports)]
use log::{self, debug, info};
use std::io::{self, Write};
use std::time::Duration;
use structopt::StructOpt;
use termcolor::{Color, ColorChoice, ColorSpec, StandardStream, WriteColor};
use tio::Device;

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
    Proxy,
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
            loop {
                let packet = device.rx.recv()?;
                println!("{:?}", packet);
                // use tio_packet::Packet;
                // if let Packet::StreamData(sd) = packet {
                //     // TODO: this is a temporary hack to make debugging easier
                //     println!("\tdata as f32: {:?}", sd.as_f32());
                // }
            }
        }
        Command::Proxy => {
            return Err(anyhow!("not implemented"))
                .with_context(|| "trying to open serial port".to_string());
        }
    }
    Ok(())
}
