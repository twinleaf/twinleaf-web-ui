use anyhow::{anyhow, Context, Result};
use crossbeam_channel as channel;
use serialport::SerialPortType;
use std::io::{self, Read, Write};
use std::net::{IpAddr, Ipv4Addr, Shutdown, SocketAddr, TcpStream};
use std::thread;
use std::time::Duration;
use tio_packet::{LogMessage, Packet, PacketType, RawPacket, RawPacketHeader, StreamData};

/// Represents metadata about a device that would be returned by StreamDesc and/or other RPC calls
/// at device initialization time
#[derive(Debug)]
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

#[derive(Debug)]
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
        println!("dummy://dummy");
        let mut devices = vec!["dummy://dummy".to_string()];
        // see if proxy is running locally
        if let Ok(conn) = TcpStream::connect_timeout(
            &SocketAddr::new(IpAddr::V4(Ipv4Addr::new(127, 0, 0, 1)), 7855),
            Duration::from_millis(100),
        ) {
            conn.shutdown(Shutdown::Both).unwrap();
            println!("tcp://localhost:7855");
            devices.push("tcp://localhost:7855".to_string());
        }
        if let Ok(ports) = serialport::available_ports() {
            for p in ports.iter() {
                match &p.port_type {
                    SerialPortType::UsbPort(info) => {
                        println!(
                            "serial://{}   [USB VID:{:04x} PID:{:04x} NUM:{}]",
                            p.port_name,
                            info.vid,
                            info.pid,
                            info.serial_number.as_ref().map_or("", String::as_str)
                        );
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
            Device::connect_serial(uri)
        } else if uri.starts_with("tcp://") {
            Device::connect_tcp(uri)
        } else if uri.starts_with("dummy://") {
            Device::connect_dummy()
        } else {
            Err(anyhow!("unsupported URI schema: {}", uri))
        }
    }

    fn connect_tcp(uri: String) -> Result<Device> {
        let host_port = (&uri)[6..].to_string();
        println!("connecting to: {}", host_port);
        let mut stream = TcpStream::connect(host_port)?;
        //let mut stream = TcpStream::connect_timeout(&host_port.parse()?, Duration::from_secs(3))?;
        stream.set_nonblocking(true)?;
        let (tx_sender, tx_receiver) = channel::bounded(0);
        let (rx_sender, rx_receiver) = channel::bounded(0);
        thread::spawn(move || {
            let mut header_buf = [0; 4];
            let mut packet_buf = [0; 512];
            loop {
                // do a non-blocking recv for any outgoing packets
                match tx_receiver.try_recv() {
                    Ok(packet) => {
                        // TODO: send this packet down the pipe as bytes
                        //stream.write(packet.as_bytes());
                        continue;
                    }
                    Err(channel::TryRecvError::Empty) => (),
                    //Err(e) => return Err(e).with_context(|| "problem with tx_receiver TCP channel"),
                    Err(e) => Err(e).unwrap(),
                };
                // non-blocking reads for data
                match stream.peek(&mut header_buf) {
                    Ok(4) => {
                        let hdr = RawPacketHeader::from_bytes(&header_buf)
                            .or(Err(anyhow!("parsing raw packet header")))
                            .unwrap();
                        let total_len: usize =
                            4 + hdr.payload_len as usize + hdr.routing_len as usize;
                        assert!(total_len < packet_buf.len());
                        match stream.read(&mut packet_buf[..total_len]) {
                            Ok(len) if len == total_len => {
                                let raw_packet = RawPacket::from_bytes(&packet_buf[..total_len])
                                    .or(Err(anyhow!("parsing raw packet from bytes")))
                                    .unwrap();
                                use PacketType::*;
                                let packet = match raw_packet.packet_type {
                                    Log => Packet::Log(LogMessage::from_bytes(&raw_packet.payload)),
                                    StreamZero => Packet::StreamData(StreamData::from_bytes(
                                        &raw_packet.payload,
                                    )),
                                    Heartbeat => Packet::Empty,
                                    // TODO: actually parse/handle these
                                    Timebase | Source | Text | RPCResponse => Packet::Empty,
                                    _ => unimplemented!(),
                                };
                                match packet {
                                    Packet::Log(_) | Packet::StreamData(_) => {
                                        rx_sender.send(packet).unwrap()
                                    }
                                    _ => (),
                                };
                            }
                            Ok(_) => unimplemented!("partial message in TCP receive"),
                            Err(e) => Err(e).unwrap(),
                        }
                    }
                    Ok(_) => unimplemented!("partial header in TCP receive"),
                    Err(e) if e.kind() == io::ErrorKind::WouldBlock => (),
                    //Err(e) => return Err(e).with_context(|| "TCP read"),
                    Err(e) => Err(e).unwrap(),
                };
            }
        });
        Ok(Device {
            uri: uri,
            tx: tx_sender,
            rx: rx_receiver,
            info: DeviceInfo::new_vmr("Dummy VMR Device".into()),
        })
    }

    fn connect_serial(uri: String) -> Result<Device> {
        let path = (&uri)[8..].to_string();
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
                rx_sender
                    .send(Packet::Log(LogMessage::warn(
                        "this is a dummy log message".into(),
                    )))
                    .unwrap();
            }
            rx_sender
                .send(Packet::StreamData(StreamData::from_f32(
                    count,
                    &[
                        time_sec.sin() as f32,
                        time_sec.cos() as f32,
                        time_sec as f32,
                        time_sec.sin() as f32,
                        time_sec.cos() as f32,
                        time_sec as f32,
                        time_sec.sin() as f32,
                        time_sec.cos() as f32,
                        time_sec as f32,
                    ],
                )))
                .unwrap();
        }
    }
}
