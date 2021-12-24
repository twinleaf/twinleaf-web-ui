
use anyhow::{anyhow, Result};
use serialport::SerialPortType;
use tio_packet::{Packet, LogMessage, StreamData};
use std::time::Duration;
use std::net::{IpAddr, Ipv4Addr, SocketAddr, Shutdown, TcpStream};
use crossbeam_channel as channel;
use std::thread;


/// Represents metadata about a device that would be returned by StreamDesc and/or other RPC calls
/// at device initialization time
pub struct DeviceInfo {
    pub name: String,
    pub channels: Vec<String>,
    // TODO: channel data types? rate? etc
    // TODO: firmware version?
    // TODO: hw version?
    // TODO: serial number?
}

impl DeviceInfo {
    pub fn new_vmr(name: String) -> DeviceInfo {
        DeviceInfo {
            name,
            channels: vec![
                "gmr.x".into(),
                "gmr.y".into(),
                "gmr.z".into(),
                "accel.x".into(),
                "accel.y".into(),
                "accel.z".into(),
                "gyro.x".into(),
                "gyro.y".into(),
                "gyro.z".into(),
            ],
        }
    }
}

pub struct Device {
    pub uri: String,
    pub info: DeviceInfo,
    pub rx: channel::Receiver<Packet>,
    pub tx: channel::Sender<Packet>,
}

impl Device {

    /// Creates a list of possible devices to connect to. Mostly hunting for serial ports, but also
    /// checks for a local TCP proxy (on the default port) and includes a dummy device. In the
    /// future could do mDNS discovery.
    pub fn enumerate_devices() -> Vec<String> {
        let mut devices = vec!["dummy://dummy".to_string()];
        // see if proxy is running locally
        if let Ok(conn) = TcpStream::connect_timeout(&SocketAddr::new(IpAddr::V4(Ipv4Addr::new(127, 0, 0, 1)), 7855), Duration::from_millis(100)) {
            conn.shutdown(Shutdown::Both).unwrap();
            devices.push("tcp://localhost:7855".to_string());
        }
        if let Ok(ports) = serialport::available_ports() {
            for p in ports.iter() {
                match &p.port_type {
                    SerialPortType::UsbPort(info) => {
                        println!("serial://{}   [USB VID:{:04x} PID:{:04x} NUM:{}]",
                            p.port_name, info.vid, info.pid, info.serial_number.as_ref().map_or("", String::as_str));
                    }
                    SerialPortType::BluetoothPort => {
                        println!("serial://{}   [Bluetooth]", p.port_name);
                    }
                    SerialPortType::PciPort => {
                        println!("serial://{}   [PCI]", p.port_name);
                    }
                    SerialPortType::Unknown => {
                        println!("serial://{}", p.port_name);
                    }
                }
                devices.push(format!("serial://{}", p.port_name));
            }
        } else {
            // TODO: real error handling (or at least warning)
            println!("Error fetching serial ports");
        }
        devices
    }

    pub fn connect(uri: String) -> Result<Device> {
        if uri.starts_with("serial://") {
            Device::connect_serial((&uri)[8..].to_string())
        } else if uri.starts_with("tcp://") {
            Device::connect_tcp((&uri)[6..].to_string())
        } else if uri.starts_with("dummy://") {
            Device::connect_dummy()
        } else {
            Err(anyhow!("unsupported URI schema: {}", uri))
        }
    }

    fn connect_tcp(host_port: String) -> Result<Device> {
        unimplemented!();
    }

    fn connect_serial(host_port: String) -> Result<Device> {
        unimplemented!();
    }

    fn connect_dummy() -> Result<Device> {
        // log: "starting dummy data loop"
        let (tx_sender, tx_receiver) = channel::bounded(0);
        let (rx_sender, rx_receiver) = channel::bounded(0);
        thread::spawn(move || Device::loop_dummy(rx_sender, tx_receiver));
        Ok(Device {
            uri: "dummy://".into(),
            tx: tx_sender,
            rx: rx_receiver,
            info: DeviceInfo::new_vmr("Dummy VMR Device".into()),
        })
    }

    /// This "dummy data" event loop runs at 25 Hz and pushes  random data to the app
    fn loop_dummy(rx_sender: channel::Sender<Packet>, done_receiver: channel::Receiver<Packet>) {
        let mut time_sec = 0f64;
        let mut count = 0u32;
        loop {
            let resp = done_receiver.recv_timeout(Duration::from_millis(40));
            if let Err(channel::RecvTimeoutError::Disconnected) = resp {
                return;
            }
            time_sec += 0.040;
            count += 1;
            if count % 25 == 0 {
                rx_sender.send(Packet::Log(LogMessage::warn("this is a dummy log message".into()))).unwrap();
            }
            rx_sender.send(Packet::StreamData(StreamData::from_f32(count, &[
                time_sec.sin() as f32,
                time_sec.cos() as f32,
                time_sec as f32,
                time_sec.sin() as f32,
                time_sec.cos() as f32,
                time_sec as f32,
                time_sec.sin() as f32,
                time_sec.cos() as f32,
                time_sec as f32,
            ]))).unwrap();
        }
    }
}
