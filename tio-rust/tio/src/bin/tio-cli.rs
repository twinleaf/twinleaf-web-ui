
use std::io::{self, Write};
use std::time::Duration;
use anyhow::{anyhow, Context, Result};
use structopt::StructOpt;
use termcolor::{Color, ColorChoice, ColorSpec, StandardStream, WriteColor};
#[allow(unused_imports)]
use log::{self, debug, info};
use tio::Device;


#[derive(StructOpt)]
#[structopt(rename_all = "kebab-case", about = "Simple CLI interface to TIO Devices")]
struct Opt {
    #[structopt(subcommand)]
    cmd: Command,
}

#[derive(StructOpt)]
enum Command {
    Enumerate,
    CatRaw {
        uri: String,
    },
    Cat{
        uri: String,
    },
    Proxy,
}

fn main() -> Result<()> {
    let opt = Opt::from_args();

    env_logger::from_env(env_logger::Env::default())
        .init();
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
        },
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
        },
        Command::Cat { uri } => {
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
        },
        Command::Proxy => {
            return Err(anyhow!("not implemented"))
                .with_context(|| "trying to open serial port".to_string());
        },
    }
    Ok(())
}
