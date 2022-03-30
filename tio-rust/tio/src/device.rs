use crate::slip::{tio_slip_decode, tio_slip_encode};
use anyhow::{anyhow, Result};
use crossbeam_channel as channel;
use serde::Serialize;
use serialport::SerialPortType;
use std::io::BufRead;
use std::io::BufReader;
use std::io::{self, Read, Write};
use std::net::{IpAddr, Ipv4Addr, Shutdown, SocketAddr, TcpStream};
use std::{thread};
use std::time::Duration;
use tio_packet::{
    LogMessage, Packet, PacketType, RPCRequest, RawPacket, RawPacketHeader, StreamData, TimebaseData, SourceData, StreamDescription, RPCResponseData, TYPES, RPCErrorData,
};
use std::collections::HashMap;
use std::convert::TryInto;
use std::str;

//Esme: enum to hold types, this allows me to return values of different types - helpful because different packets/fields come in with different data types
#[derive(Debug, Clone, Serialize)]
pub enum Value {
    U8(u8),
    I8(i8),
    U16(u16),
    I16(i16),
    U32(u32),
    I32(i32),
    U64(u64),
    I64(i64),
    F32(f32),
    F64(f64),
    StringType(String),
    NoneType(),
}

// Esme: this is just a function to convert a backed to a raw packet.  this is used to write in the tcp function.  
// Esme: this is sort of a temporary fix that doesn't handle the different routing bytes for different sensors
fn packet_to_raw(packet: Packet, routing_bytes: Vec<u8>) -> RawPacket {
    let msg;
    match packet {
        Packet::RpcReq(rpc) => {msg = rpc.to_bytes()}
        // fix error handling here
        _other => {msg = Vec::new()}
    };
    RawPacket{packet_type: PacketType::RPCRequest, routing_len: routing_bytes.len() as u8, payload_len: msg.len() as u16, payload: msg, routing: routing_bytes}
}

//Esme: holds the different replies that can come from an rpc response
//Esme: error handling doesn't exist too much on the app side, but these might be used in a tio-rpc equivalent or eventually passed to the app somehow
//Esme: a future thing to think about might be how we want the error to show up in the app.  Maybe a pop up message?
#[derive(Debug)]
pub enum Replies {
    Response(Vec<u8>),
    Error(String)
}

#[derive(Debug)]
pub enum ErrorCode {
    NoErr = 0,
    Undefined = 1,
    NotFound = 2,
    Malformed = 3,
    ArgsSize = 4,
    Invalid = 5,
    ReadOnly = 6,
    WriteOnly = 7,
    Timeout = 8,
    Busy = 9,
    State = 10,
    Load = 11,
    LoadRpc = 12,
    Save = 13,
    SaveWr = 14,
    Internal = 15,
    NoBufs = 16,
    Range = 17,
    User = 18,
}
impl ErrorCode {
    pub fn from_u16(raw: u16) -> Result<ErrorCode, String> {
        use ErrorCode::*;
        match raw {
            0 => Ok(NoErr),
            1 => Ok(Undefined),
            2 => Ok(NotFound),
            3 => Ok(Malformed),
            4 => Ok(ArgsSize),
            5 => Ok(Invalid),
            6 => Ok(ReadOnly),
            7 => Ok(WriteOnly),
            8 => Ok(Timeout),
            9 => Ok(Busy),
            10 => Ok(State),
            11 => Ok(Load),
            12 => Ok(LoadRpc),
            13 => Ok(Save),
            14 => Ok(SaveWr),
            15 => Ok(Internal),
            16 => Ok(NoBufs),
            17 => Ok(Range),
            18 => Ok(User),
            _ => Err("unimplmented Error Code".into()),
        }
    }
    pub fn give_message(error_code: ErrorCode) -> String {
        use ErrorCode::*;
        match error_code {
            NoErr => "No error".to_string(),
            Undefined => "Generic error".to_string(),
            NotFound => "Method not found".to_string(),
            Malformed => "Malformed request".to_string(),
            ArgsSize => "Arguments wrong size".to_string(),
            Invalid => "Invalid arguments".to_string(),
            ReadOnly => "Attempted to assign read-only value".to_string(),
            WriteOnly => "Attempted to read write-only value".to_string(),
            Timeout => "Internal timeout".to_string(),
            Busy => "Unable to fulfill request at the time - try again later".to_string(),
            State => "Device state incompatible with requested action".to_string(),
            Load => "Error when reading configuration from EEPROM".to_string(),
            LoadRpc => "Error applying configuration from EEPRON".to_string(),
            Save => "Error when serializing persistant configuration".to_string(),
            SaveWr => "Error when writing configuration to EEPROM".to_string(),
            Internal => "Internal firmware error".to_string(),
            NoBufs => "Unable to allocate buffers needed to perform operation".to_string(),
            Range => "Range error".to_string(),
            User => "User defined error".to_string(),
        }
    }
}


//Esme: here starts the complicated structure I have to handle metadata.  I am almost positive there is a better way to do this part or at least a better naming system
//Esme: I have mostly just followed tio-python to my best ability

//Esme: the order of events sort of follows this sequence:
    // First, we send an rpc command to send the metadata
    // While this is happening, packets are coming in.  
    // If the metadata has not come yet and we get a new StreamData packet (the packet type with the data points), we just ignore and send an empty packet
    // Everytime we get a new source data or timebase packet, we save it in a dict to SensorData.  the keys are the ids of the packet and the values are the source/timebase packets
    // Once we receive a streamDescription packet (the main metadata packet), we "compile" this packet using our saved timebase/source dicts.  
    // This compiling basically just grabs the useful information (see streamCompilation, there is one of these for each source packet on the stream description).  
    // This useful information right now is just column_name, timebase, and data type for each source in the stream description
    // We save a vector of stream compilations that basically holds the "setup" for all incoming datapoints until a new stream description comes in and it recompiles


#[derive(Debug,PartialEq, Clone)]
pub struct StreamCompilation {
    pub column_name: String,
    pub timebase_period_us: f32,
    pub data_type: TYPES,
}

#[derive(Debug, Clone)]
pub struct SensorData {
    //Esme: stream_compilation holds interesting information from metadata -> column_name, timebase, and data_type
    pub stream_compilation: Vec<StreamCompilation>,
    source_data: HashMap<u16, SourceData>,
    //Esme: stream description holds the metadata packet when it first comes in (indicies to correct source and timebase)
    pub stream_description: StreamDescription,
    timebase_data: HashMap<u16, TimebaseData>,
}
impl Default for SensorData {
    fn default () -> SensorData {
        SensorData{source_data: HashMap::new(), timebase_data: HashMap::new(), stream_compilation: Vec::new(), stream_description: StreamDescription::default()}
    }
}
impl SensorData{

    pub fn compile(&mut self) -> () {
        //Esme: function to compile the metadata into a setup structure.  this setup gets stored as a vec of streamCompilation.
        let mut stream_compilations = Vec::new();
        let mut source;
        let timebase;
        match self.timebase_data.get(&self.stream_description.stream_timebase_id) {
            Some(existing_timebase) => timebase = existing_timebase,
            None => panic!("Timebase id not found, try power cycling."),
        }
        //Esme: calculate period 
        let mut timebase_period_us = 
            if timebase.timebase_period_num_us != 0 && timebase.timebase_period_denom_us !=0 {
                timebase.timebase_period_num_us as f32/timebase.timebase_period_denom_us as f32
            } else {
                f32::NAN
        };
        timebase_period_us = timebase_period_us*self.stream_description.stream_period as f32;
        for stream in &self.stream_description.stream_info {
            match self.source_data.get(&stream.stream_source_id) {
                Some(existing_source) => source = existing_source,
                None => panic!("Source id not found, try power cycling."),
            }
            // calculates the period for each source - for the app, we really only pass on the timestamps for the fastest source, but I do save the timestamps for all in the stream_compilation vector
            timebase_period_us = timebase_period_us*stream.stream_period as f32;
            if source.source_column_names.len() > 1 {
                let column_name = &source.source_name;
                for name in &source.source_column_names {
                    let stream_compilation = StreamCompilation{column_name: column_name.to_string()+"."+name, timebase_period_us: timebase_period_us, data_type: source.source_type};
                    stream_compilations.push(stream_compilation);
                }
            }
            else {
                let column_name = &source.source_name;
                let stream_compilation = StreamCompilation{column_name: column_name.to_string(), timebase_period_us: timebase_period_us, data_type: source.source_type};
                stream_compilations.push(stream_compilation);
            }
        }
        self.stream_compilation = stream_compilations;

    }
}


//Esme: data point is the actual struct that we will use to pass our parsed data and timestamp
#[derive(Debug, Serialize, Clone)]
pub struct DataPoint {
    pub timestamp: f32,
    pub column_names: Vec<String>,
    pub data: Vec<f64>,
}

//Esme: updating information holds things that update over time.  
//Esme: Basically just puts everything in one place so we don't have to pass a bunch of things into the functions that are reading from the sensor
//Esme: I am not sure it makes sense to put the rpc hash here.  Right now I have it here, but they are not used together.  That is, the rpc calls just make a new 
// version of UpdatingInformation and don't use the same one that the data_point one is.  This could likely be combined or changed in the future.
#[derive(Debug, Clone)]
pub struct UpdatingInformation{
    pub rpc_hash: HashMap<u16, Packet>,
    pub sensor_data: SensorData,
    pub data_point: DataPoint,
}
impl Default for UpdatingInformation{
    fn default() -> UpdatingInformation {
        UpdatingInformation{rpc_hash: HashMap::new(), sensor_data: SensorData::default(), data_point: DataPoint{timestamp: 0 as f32, column_names: Vec::new(), data: Vec::new()}}
    }
}
impl UpdatingInformation {
    //Esme: this is the function that will get called everytime a new packet comes in.  
    //Esme: specifically, with rust channels, which is how the packets are being stored, there are several times when i can say a packet is read or similar language so I am just going 
    // to describe the chronological place where this function is called:
        // packet is read in via usb or tcp
        // packet is placed into a channel
        // packet is read out from this channel using .recv()
        //interpret_packet gets called on the packet that is getting read out by this .recv().
    pub fn interpret_packet(&mut self, packet: Packet) -> (){
        use Packet::*;
        match packet.clone() {
            StreamData(sd) => {self.interpret_datapoint(sd);}
            TimebaseData(sd) => {self.sensor_data.timebase_data.insert(sd.timebase_id,sd);}
            SourceData(sd) => {self.sensor_data.source_data.insert(sd.source_id, sd);}
            StreamDescription(sd) => {self.sensor_data.stream_description = sd;
                self.sensor_data.compile();}
            RPCResponseData(sd) => {
                self.rpc_hash.insert(sd.request_id, packet);}
            RPCErrorData(sd) => {self.rpc_hash.insert(sd.request_id, packet);}//Replies::Error(ErrorCode::give_message(ErrorCode::from_u16(sd.error_code).unwrap())));}
            _ => {}
        }
    }
    //Esme: this gets called when a StreamData packet comes in.  It uses our compiled metadata to format the data correctly and parses according the correct type
    //Esme: The commented out parts with Value are for if you wanted to pass on the data and perserve its type.  the current version parses based on type, then casts to f64 for the webapp
    pub fn interpret_datapoint(&mut self, streamdata: StreamData) -> () {
        let mut datum = DataPoint{timestamp: 0.0, column_names: Vec::new(), data: Vec::new()};
        let mut i = 0;
        datum.timestamp = (&self.sensor_data.stream_compilation[0].timebase_period_us*streamdata.sample_num as f32)/1000000 as f32;
        for compilation in &self.sensor_data.stream_compilation{
            match compilation.data_type{
                TYPES::U8 => {
                    //println!("u8");
                    if streamdata.payload.len() >= i+1 {
                        //datum.pointmap.insert(compilation.column_name.clone(), Value::U8(streamdata.payload[i]));
                        datum.column_names.push(compilation.column_name.clone());
                        datum.data.push(streamdata.payload[i] as u8 as f64);
                        i = i+1;
                    } else {
                        break;
                    }
                },
                TYPES::I8 => {
                    //println!("i8 for {:?}", compilation.column_name);
                    if streamdata.payload.len() >= i+1 {
                        //datum.pointmap.insert(compilation.column_name.clone(),Value::I8(streamdata.payload[i].try_into().unwrap()));
                        datum.column_names.push(compilation.column_name.clone());
                        //println!("{:?}", streamdata.payload[i] as i8 as f64);
                        datum.data.push(streamdata.payload[i] as i8 as f64);
                        i = i+1;
                    } else {
                        break;
                    }
                },
                TYPES::U16 => {
                    //println!("u16");
                    if streamdata.payload.len() >= i+2 {
                        //datum.pointmap.insert(compilation.column_name.clone(), Value::U16(u16::from_le_bytes(streamdata.payload[i..i+2].try_into().unwrap())));
                        datum.column_names.push(compilation.column_name.clone());
                        datum.data.push(u16::from_le_bytes(streamdata.payload[i..i+2].try_into().unwrap()) as f64);
                        i = i+2;
                    } else {
                        break;
                    }
                },
                TYPES::I16 => {
                    if streamdata.payload.len() >= i+2 {
                        //datum.pointmap.insert(compilation.column_name.clone(), Value::I16(i16::from_le_bytes(streamdata.payload[i..i+2].try_into().unwrap())));
                        datum.column_names.push(compilation.column_name.clone());
                        datum.data.push(i16::from_le_bytes(streamdata.payload[i..i+2].try_into().unwrap()) as f64);
                        i = i+2;
                    } else {
                        break;
                    }
                },
                //Esme: TODO: no 24 bit type in rust, not sure what to do here, just grab 3 bytes??
                TYPES::U24 => {}
                TYPES:: I24 => {}
                TYPES::U32 => {
                    if streamdata.payload.len() >= i+4 {
                        //datum.pointmap.insert(compilation.column_name.clone(), Value::U32(u32::from_le_bytes(streamdata.payload[i..i+4].try_into().unwrap())));
                        datum.column_names.push(compilation.column_name.clone());
                        datum.data.push(u32::from_le_bytes(streamdata.payload[i..i+4].try_into().unwrap()) as f64);
                        i = i+4;
                    } else {
                        break;
                    }
                },
                TYPES::I32 => {
                    if streamdata.payload.len() >= i+4 {
                        //datum.pointmap.insert(compilation.column_name.clone(), Value::I32(i32::from_le_bytes(streamdata.payload[i..i+4].try_into().unwrap())));
                        datum.column_names.push(compilation.column_name.clone());
                        datum.data.push(i32::from_le_bytes(streamdata.payload[i..i+4].try_into().unwrap()) as f64);
                        i = i+4;
                    } else {
                        break;
                    }
                },
                TYPES::U64 => {
                    if streamdata.payload.len() >= i+8 {
                        //datum.pointmap.insert(compilation.column_name.clone(), Value::U64(u64::from_le_bytes(streamdata.payload[i..i+8].try_into().unwrap())));
                        datum.column_names.push(compilation.column_name.clone());
                        datum.data.push(u64::from_le_bytes(streamdata.payload[i..i+8].try_into().unwrap()) as f64);
                        i = i+8;
                    } else {
                        break;
                    }
                },
                TYPES::I64 => {
                    if streamdata.payload.len() >= i+8 {
                        //datum.pointmap.insert(compilation.column_name.clone(), Value::I64(i64::from_le_bytes(streamdata.payload[i..i+8].try_into().unwrap())));
                        datum.column_names.push(compilation.column_name.clone());
                        datum.data.push(i64::from_le_bytes(streamdata.payload[i..i+8].try_into().unwrap()) as f64);
                        i = i+8;
                    } else{
                        break;
                    }
                },
                TYPES::F32 => {
                    //println!("f32 for {:?}", compilation.column_name);
                    if streamdata.payload.len() >= i+4 {
                        //datum.pointmap.insert(compilation.column_name.clone(), Value::F32(f32::from_le_bytes(streamdata.payload[i..i+4].try_into().unwrap())));
                        datum.column_names.push(compilation.column_name.clone());
                        datum.data.push(f32::from_le_bytes(streamdata.payload[i..i+4].try_into().unwrap()) as f64);
                        i = i+4;
                    } else {
                        break;
                    }
                },
                TYPES::F64 => {
                    //println!("f64 for {:?}", compilation.column_name);
                    if streamdata.payload.len() >= i+8 {
                        //println!("column:{:?}, timestamp {:?}, data {:?}", compilation.column_name, compilation.timebase_period_us*streamdata.sample_num as f32, f64::from_le_bytes(streamdata.payload[i..i+8].try_into().unwrap()));
                        //datum.pointmap.insert(compilation.column_name.clone(), Value::F64(f64::from_le_bytes(streamdata.payload[i..i+8].try_into().unwrap())));
                        datum.column_names.push(compilation.column_name.clone());
                        datum.data.push(f64::from_le_bytes(streamdata.payload[i..i+8].try_into().unwrap()));
                        i = i+8;
                    } else {
                        break;
                    }
                },
                TYPES::StringType => {},
                TYPES::NoneType => {},
            };
            //println!("{:?}: {:?}", compilation, datum.get(compilation).unwrap());
        }
        //this is for the dummy
        if datum.data.is_empty(){
            datum.timestamp = streamdata.sample_num as f32;
            datum.data = streamdata.as_f32().into_iter().map(|v| v as f64).collect();
        }
        self.data_point =  datum;

    }
}


/// Represents metadata about a device that would be returned by StreamDesc and/or other RPC calls
/// at device initialization time.
///
/// TODO: should this live in `tio-packet`?
/// 
// Esme: From my understanding, DeviceInfo holds the information that we can grab at the beginning of connection and will stay the same (name, channels, available viewers, etc)
// Esme: If you wanted to add a new element to this, you would add it here on the device page in the necessary places, and then go to api.ts to add it to the javascript and follow through from there
#[derive(Debug, Serialize, Clone)]
pub struct DeviceInfo {
    pub name: String,
    pub channels: Vec<String>,
    // this initial rate can probably be gotten rid of and then in the app the initial rate can be set by calling the rpc function
    pub initial_rate: f32,
    // holds the information about "viewers" available for the connected device
    pub viewers: Vec<String>,
    pub viewer_rpcs: Vec<Vec<String>>,
    pub viewer_rpcs_isbool: Vec<Vec<bool>>,
    // TODO: channel data types? rate? etc
    // TODO: firmware version?
    // TODO: hw version?
    // TODO: hw serial number?
}

impl DeviceInfo {
    /// This is a hack to generate mock info for a vector magnetometer device.
    ///
    /// TODO: not even sure these channel names/mappings are correct. method name should be
    /// different, and/or probably shouldn't live as a method on the DeviceInfo struct. Could be
    /// part of the dummy device creation code?
    /// 
    // Esme: This is just the old hardcoded function for VMR, we can probably delete this or save it for the dummy 
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
            initial_rate: 20 as f32,
            viewers: Vec::new(),
            viewer_rpcs: Vec::new(),
            viewer_rpcs_isbool: Vec::new(),
        }
    }

    // Esme: here is the method I made for creating a new device, not really sure if this is needed, you can probably just make a new instance of DeviceInfo but maybe this is concise.
    pub fn new_device(name:String, columns: Vec<String>, viewers: Vec<String>, viewer_rpcs: Vec<Vec<String>>, viewer_rpcs_isbool: Vec<Vec<bool>>) -> DeviceInfo {
        let mut channels = Vec::new();
        for column_name in columns {
            channels.push(column_name.into());
        }
        DeviceInfo {
            name,
            channels: channels,
            initial_rate: 20 as f32,
            viewers: viewers,
            viewer_rpcs: viewer_rpcs,
            viewer_rpcs_isbool: viewer_rpcs_isbool,
        }
    }
}

/// Handle containing context about an active connection to a device. The connection type is
/// abstracted away. Actual device communication happens in threads, with communication via
/// channels. When this struct is "dropped" (that is, removed from memory and deconstructed), the
/// channels and thus threads should shut down automatically, but this hasn't been tested.
///
/// The initialization process involves some communication with the device, to put it in binary
/// mode, and potentially to read out the stream descriptions and other device info (eg, firmware
/// version).
///
/// Most of the backends have a common structure: an I/O thread handles reading and writing TIO
/// packets, and communicates back bi-directionally via channels. The crossbeam channel
/// implementation (a dependecy) is used, which is a robust and popular alternative to the standard
/// library "mpsc" channel implmentation, which has some quirks (there has been discussion of
/// adding the crossbeam channel implementation to the rust standard library). The semantics are
/// similar to golang channels, and not too different from Python Queues for concurrency control.
/// Channels have types, can be bounded or unbounded, and reading/writing can be synchronous
/// (blocking) or asynchronous. Generally, the I/O thread does reads from backend file descriptors
/// (sockets or serial port file) with a timeout; blocking writes; and polls the "tx" (write to
/// device) channel asynchronously. For future robustness, bounded channels should be used to
/// prevent messages from piling up (memory leak), and efforts should be made to handle situations
/// like device disconnects (I/O thread should shut down, dropping the "rx" channel, which results
/// in an error when reading for new packets; currently applications would have to handle this
/// themselves).
///
/// One possible change/improvement to this API would be to have two "rx" channels: one for
/// stream/broadcast messages (like stream data or log messages), and one for synchronous messages
/// (like RPC responses and RPC errors). This would make application logic of doing RPCs easier:
/// just write a message, then poll for a result, while other message types spool up in the stream
/// "rx" channel.

// Esme: Everytime a packet is read from the sensor, this function gets called right after we grab a raw packet from the sensor using serial or tcp
// Esme: this function does a couple of things, but it mainly just converts the raw packets to their correct packet type and adds them into the channel
// Esme: this function also does the "waiting" for the metadata.  That is, if no metadata, ignore streamzero packets and send empty packets and trash the earlier data
pub fn grab_packet(metadata_p: &mut bool, raw_packet: RawPacket, rx_send: &crossbeam_channel::Sender<Packet>, rpc_send: &crossbeam_channel::Sender<tio_packet::Packet>) -> (){
    use PacketType::*;
    let packet = match raw_packet.packet_type {
        Log => {
            Packet::Log(LogMessage::from_bytes(&raw_packet.payload))
        }
        StreamZero => {
            // Esme: Here is the part that waits for the metadata to start sending in data.  this is why there is a gap when starting the OMG, not sure if this could be improved upon
            if *metadata_p {
                Packet::StreamData(StreamData::from_bytes(&raw_packet.payload))
            }
            else{
                Packet::Empty
            }
        }
        Timebase => {
            Packet::TimebaseData(TimebaseData::from_bytes(
                &raw_packet.payload))
        }
        Source => {
            Packet::SourceData(SourceData::from_bytes(
                &raw_packet.payload))
        }
        Heartbeat => Packet::Empty,
        // TODO: actually parse/handle these
        Stream => {
            *metadata_p = true;
            Packet::StreamDescription(StreamDescription::from_bytes(
                &raw_packet.payload))
            }
        RPCResponse => {
            Packet::RPCResponseData(RPCResponseData::from_bytes(
                &raw_packet.payload))
            }

        RPCError => {
            let rpcerrorpacket = RPCErrorData::from_bytes(&raw_packet.payload);
            Packet::RPCErrorData(rpcerrorpacket)}
        
        // Esme: I never ended up doing anything with Text or Invalid - I am not sure what those were but that might be something to handle
        Text | Invalid | RPCRequest => {
            println!(
                "ignoring unhandled packet type: {:?}",
                raw_packet.packet_type
            );
            Packet::Empty
        }
    };

    match packet {
        // Esme: There are two separate channels, one for rpc packets and one for all the other packets
        // Esme: Changing the channels/adding more isn't too difficult if that ends up suiting your structure better
        Packet::Log(_) | Packet::StreamData(_) | Packet::TimebaseData(_) | Packet::SourceData(_) | Packet::StreamDescription(_) => {
            rx_send.send(packet).unwrap()
        }
        // Packet::StreamData(_) => {
        //     rx_send.send(metadata.clone().data_point).unwrap();
        // }
        Packet::RPCResponseData(_) | Packet::RPCErrorData(_) => {
            rpc_send.send(packet).unwrap()
        }
        _ => (),
    };
}


#[derive(Debug)]
pub struct Device {
    pub uri: String,
    pub info: DeviceInfo,
    pub rx: channel::Receiver<Packet>,
    pub tx: channel::Sender<Packet>,
    pub rpc: channel::Receiver<Packet>,
}

#[derive(Debug, Serialize, Clone)]
pub struct DeviceDesc {
    pub url: String,
    pub desc: String,
}

impl DeviceDesc {}

impl Device {
    /// Creates a list of possible devices to connect to. Mostly hunting for serial ports, but also
    /// checks for a local TCP proxy (on the default port) and includes a dummy device. In the
    /// future could do mDNS discovery.
    pub fn get_desc(dev: Device) -> String {
        dev.tx.send(Packet::RpcReq(RPCRequest::named_simple("dev.desc".to_string()))).unwrap();
        let p: Packet = dev.rpc.recv().unwrap();
        match p {
            Packet::RPCResponseData(resp) => {
                std::str::from_utf8(&resp.reply_payload).unwrap().to_string()
            }
            _ => {
                "".to_string()
            }
        }
    }

    pub fn enumerate_devices() -> Vec<DeviceDesc> {
        println!("dummy://dummy");
        let mut devices = vec![DeviceDesc{url: "dummy://dummy".to_string(),
                                             desc: "Dummy device".to_string()}];
        // see if proxy is running locally
        let mut proxy_running = false;
        if let Ok(conn) = TcpStream::connect_timeout(
            &SocketAddr::new(IpAddr::V4(Ipv4Addr::new(127, 0, 0, 1)), 7855),
            Duration::from_millis(100),
        ) {
            proxy_running = true;
            conn.shutdown(Shutdown::Both).unwrap();
            let url= "tcp://localhost:7855".to_string();
            println!("{}", url);
            let dev = Device::connect_tcp(url.clone()).unwrap();
            devices.push(DeviceDesc{url: url,desc: Device::get_desc(dev)});
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
                let url = format!("serial://{}", p.port_name);
                devices.push(DeviceDesc{url: url.clone(),
                    desc: {
                        if proxy_running {
                            "No desc with proxy".to_string()
                        } else {
                            let devres = Device::connect_serial(url);
                            match devres {
                                Ok(dev) => {Device::get_desc(dev)}
                                _ => {"Failed to get desc".to_string()}
                            }
                        }
                    }});
            }
        } else {
            // TODO: real error handling (or at least warning)
            println!("Error fetching serial ports");
        }
        devices
    }

    /// Generic method to connect to a device, supporting multiple connection types/schemes.
    ///
    /// Once established, I/O happens in threads, but the initial connection is usually blocking in
    /// the current thread.
    pub fn connect(uri: String) -> Result<Device> {
        if uri.starts_with("serial://") {
            println!("calling connect_serial {}", uri);
            Device::connect_serial(uri)
        } else if uri.starts_with("tcp://") {
            println!("calling connect_tcp {}", uri);
            Device::connect_tcp(uri)
        } else if uri.starts_with("dummy://") {
            println!("calling connect_dummy {}", uri);
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

        // Esme: I changed these channels to hold 10 but this was just arbitrary
        let (tx_sender, tx_receiver): (channel::Sender<Packet>, channel::Receiver<Packet>) =
            channel::bounded(10);
        let (rpc_sender, rpc_receiver): (channel::Sender<Packet>, channel::Receiver<Packet>) = channel::bounded(10);
        let (rx_sender, rx_receiver): (channel::Sender<Packet>, channel::Receiver<Packet>) = channel::bounded(10);

        //Esme: send rpc request for metadata
        let req = Packet::RpcReq(RPCRequest::named_simple("data.send_all".to_string()));
        tx_sender.send(req).unwrap();
        thread::spawn(move || {
            let mut metadata_p = false;
            let mut header_buf = [0; 4];
            let mut packet_buf = [0; 512];
            loop {
                // do a non-blocking recv for any outgoing packets
                match tx_receiver.try_recv() {
                    Ok(packet) => {
                        let raw_packet = packet_to_raw(packet, Vec::new());
                        stream.write(&raw_packet.into_bytes()).unwrap();
                        continue;
                    }
                    Err(channel::TryRecvError::Empty) => (),
                    //Err(e) => return Err(e).with_context(|| "problem with tx_receiver TCP channel"),
                    Err(channel::TryRecvError::Disconnected) => {//println!("Channels disconnected");
                    break;}
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
                        match stream.read_exact(&mut packet_buf[..total_len]) {
                            Ok(()) => {
                                let raw_packet = RawPacket::from_bytes(&packet_buf[..total_len])
                                    .or(Err(anyhow!("parsing raw packet from bytes")))
                                    .unwrap();
                                grab_packet(&mut metadata_p, raw_packet, &rx_sender, &rpc_sender);
                            }
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
        let mut device = Device {
            uri: uri,
            tx: tx_sender,
            rx: rx_receiver,
            rpc: rpc_receiver,
            info: DeviceInfo{name: "".to_string(), channels: Vec::new(), initial_rate: 20 as f32, viewers: Vec::new(), viewer_rpcs: Vec::new(), viewer_rpcs_isbool: Vec::new()}};

        // Esme: Here is me filling up the deviceInfo struct from earlier.  Again, you probably don't need the new_device function/this could be better organized but this just
        // fills in that initial information we need to start the web app
        let columns = device.column_names();
        let name = device.name();
        let (viewers, viewer_rpcs, viewer_rpcs_isbool) = device.status();
        device.info = DeviceInfo::new_device(name, columns, viewers, viewer_rpcs, viewer_rpcs_isbool);
        Ok(device)
    }

    /// Opening the serial port file is blocking in current thread (but expected to be immediate?)
    fn connect_serial(uri: String) -> Result<Device> {
        let path = (&uri)[9..].to_string();
        println!("connecting to: {}", path);
        let mut port = serialport::new(path, 115_200)
            .timeout(Duration::from_millis(50))
            .open()?;

        // Minimal way to switch to binary mode.
        let to_bin: Vec<u8> = vec![0xC0, 0x05, 0x00, 0x00, 0x00, 0x2E, 0x2F, 0x9A, 0x16, 0xC0];
        port.write_all(&to_bin)?;

        // send "send_all"
        //let req = Packet::RpcReq(RPCRequest::named_simple("data.send_all".to_string()));
         //let msg = req.to_bytes().unwrap();
         //port.write_all(&tio_slip_encode(&msg))?;

        // do a read to flush any random input
        let mut serial_buf: Vec<u8> = vec![0; 1000];
        port.read(serial_buf.as_mut_slice())?;

        let (tx_sender, tx_receiver): (channel::Sender<Packet>, channel::Receiver<Packet>) = channel::bounded(10);
        let (rx_sender, rx_receiver): (channel::Sender<Packet>, channel::Receiver<Packet>) = channel::bounded(10);
        let (rpc_sender, rpc_receiver): (channel::Sender<Packet>, channel::Receiver<Packet>) = channel::bounded(10);
        let req = Packet::RpcReq(RPCRequest::named_simple("data.send_all".to_string()));
        tx_sender.send(req).unwrap();
        thread::spawn(move || {
            // first read until END to clear any previous buffer stuff
            //
            // NOTE: this BufReader trick (wrapping the port, which implements Read, with BufRead)
            // works in development, but means the port is no longer writable. There might be away
            // around this, but won't work long-term for this application (when we need to read and
            // write from this thread)
            // I have run in to this situation before, and have a vague suspicion that there is a
            // better/idiomatic way to have a bi-directional (Read+Write) object which can also be
            // wrapped with BufRead, but I can't remember off the top of my head. The main reason
            // here for BufRead is to get the `read_until()` function, but it is also preferable to
            // do BufRead for performance reasons (fewer syscalls), even if the kernel is
            // implementing buffering itself..
            let mut buf_port = BufReader::new(port);
            let mut slip_buf: Vec<u8> = Vec::with_capacity(1024);
            let mut metadata_p = false;
            // do a throw-away read to flush any partial packets
            let _ = buf_port.read_until(0xC0, &mut slip_buf);
            loop {
                // do a non-blocking recv for any outgoing packets
                match tx_receiver.try_recv() {
                    Ok(packet) => {
                        // TODO: send this packet down the pipe as bytes
                        //stream.write(packet.as_bytes());
                        let portw = buf_port.get_mut();
                        portw.write_all(&tio_slip_encode(&packet.to_bytes().unwrap())).unwrap();
                        continue;
                    }
                    Err(channel::TryRecvError::Empty) => (),
                    //Err(e) => return Err(e).with_context(|| "problem with tx_receiver TCP channel"),
                    Err(channel::TryRecvError::Disconnected) => {//println!("Channels disconnected");
                    break;}
                };

                slip_buf.clear();
                match buf_port.read_until(0xC0, &mut slip_buf) {
                    Ok(0) | Ok(1) => (),
                    Ok(n) => {
                        let raw = match tio_slip_decode(&slip_buf[..n]) {
                            Ok(r) => r,
                            Err(e) => {
                                println!("ignoring bad CRC/SLIP: {}", e);
                                continue;
                            }
                        };
                        let raw_packet = RawPacket::from_bytes(&raw)
                            .or(Err(anyhow!("parsing raw packet from bytes")))
                            .unwrap();
                        grab_packet(&mut metadata_p, raw_packet, &rx_sender, &rpc_sender);
                    }
                    Err(ref e) if e.kind() == io::ErrorKind::TimedOut => (),
                    Err(e) => Err(e).unwrap(),
                };
            }
        });
        let mut device = Device {
            uri: uri,
            tx: tx_sender,
            rx: rx_receiver,
            rpc: rpc_receiver,
            info: DeviceInfo{name: "".to_string(), channels: Vec::new(), initial_rate: 20 as f32, viewers: Vec::new(), viewer_rpcs: Vec::new(), viewer_rpcs_isbool: Vec::new()}};

        let columns = device.column_names();
        let name = device.name();
        let (viewers, viewer_rpcs, viewer_rpcs_isbool) = device.status();
        device.info = DeviceInfo::new_device(name, columns, viewers, viewer_rpcs, viewer_rpcs_isbool);
        Ok(device)
    }

    /// Mock endpoint that tries to look like a VMR device.
    ///
    /// TODO: could include extra metadata in the connection string to control which kind of device
    /// is mocked (eg, `dummy://omg` for OMG device), and potentially even have a full mocked
    /// device that responds to RPC requests and can change sample rate, things like that.
    fn connect_dummy() -> Result<Device> {
        // log: "starting dummy data loop"
        let (tx_sender, tx_receiver) = channel::bounded(0);
        let (rx_sender, rx_receiver): (channel::Sender<Packet>, channel::Receiver<Packet>) = channel::bounded(10);
        let (_rpc_sender, rpc_receiver) = channel::bounded(0);
        thread::spawn(move || Device::loop_dummy(rx_sender, tx_receiver));
        Ok(Device {
            uri: "dummy://".into(),
            tx: tx_sender,
            rx: rx_receiver,
            rpc: rpc_receiver,
            info: DeviceInfo::new_vmr("Dummy VMR Device".into()),
        })
    }

    // No particular reason this event loop is in a separate function while the others are not, I
    // just implemented this one a little differently
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

    //Esme: The rpc call infrastructure is split up into multiple functions and it is a bit confusing why and what each one does
    //Esme: send_rpc takes a call, an optional argument, the updating information (essentially the rpc_hash), and a type and just returns either a response or an error packet

    //Esme: TODO: The main issue with all this rpc stuff is right now, everytime an rpc call is sent, I make a new hashmap to hold the incoming responses.  
    // Ideally there would be one global hashmap that gets updated with every rpc call, i just am not sure where to put this (i didn't want to have it in deviceInfo because that gets passed to the app)
    pub fn send_rpc(&self, rpc_call: String, arg: Option<String>, updating_information: &mut UpdatingInformation, rpc_type:TYPES) -> Packet {
        let resp;
        let existing_arg;
        let mut req_struct = RPCRequest::named_simple(rpc_call);
        let request_id = req_struct.req_id;
        use TYPES::*;
        match arg{
            // Esme: format arg to be in correct type
            // Esme: TODO: missing type metadata for particular rpc calls like "rpc.info" - right now default just makes arg a string
            Some(s) => {existing_arg = s;
                match rpc_type {
                    U8 => {//println!("u8"); 
                        req_struct.add_payload(u8::to_le_bytes(existing_arg.parse::<u8>().unwrap()).to_vec());}
                    I8 => {//println!("i8"); 
                        req_struct.add_payload(i8::to_le_bytes(existing_arg.parse::<i8>().unwrap()).to_vec());}
                    U16 => {//println!("u16"); 
                        req_struct.add_payload(u16::to_le_bytes(existing_arg.parse::<u16>().unwrap()).to_vec());}
                    I16 => {//println!("i16"); 
                        req_struct.add_payload(i16::to_le_bytes(existing_arg.parse::<i16>().unwrap()).to_vec());}
                    U32 => {//println!("u32"); 
                        req_struct.add_payload(u32::to_le_bytes(existing_arg.parse::<u32>().unwrap()).to_vec());}
                    I32 => {//println!("i32"); 
                        req_struct.add_payload(i32::to_le_bytes(existing_arg.parse::<i32>().unwrap()).to_vec());}
                    U64 => {//println!("u64"); 
                        req_struct.add_payload(u64::to_le_bytes(existing_arg.parse::<u64>().unwrap()).to_vec());}
                    I64 => {//println!("i64"); 
                        req_struct.add_payload(i64::to_le_bytes(existing_arg.parse::<i64>().unwrap()).to_vec());}
                    F32 => {//println!("f32"); 
                        req_struct.add_payload(f32::to_le_bytes(existing_arg.parse::<f32>().unwrap()).to_vec());}
                    F64 => {//println!("f64"); 
                        req_struct.add_payload(f64::to_le_bytes(existing_arg.parse::<f64>().unwrap()).to_vec());}
                    StringType => {//println!("string"); 
                        req_struct.add_payload(existing_arg.as_bytes().to_vec());}
                    NoneType => {println!("None type, assuming string for argument"); 
                        req_struct.add_payload(existing_arg.as_bytes().to_vec());}
                    _ => {}
                }
            }//req_struct.add_payload(s.as_bytes().to_vec())}
            None => {}
        }
        let req = Packet::RpcReq(req_struct);
        self.tx.send(req).unwrap();
        loop{
            let packet = self.rpc.recv();
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
    
    //Esme: send_and_interpret_rpc uses rpc.info to grab the metadata on rpc_call.  So we use send_rpc with rpc.info as its rpc_call, rpc_call as the arg, and string as the type to get the metadata
    pub fn send_and_interpret_rpc(&self, rpc_call: String, arg: Option<String>, updating_information: &mut UpdatingInformation) ->  (Option<TYPES>, Packet){
        let packet = self.send_rpc("rpc.info".to_string(), Some(rpc_call.clone()), updating_information, TYPES::StringType);
        let rpc_type;
        match packet {
            Packet::RPCErrorData(ref _sd) => {return (None, packet)},
            Packet::RPCResponseData(sd) => {rpc_type = Some(TYPES::from_u8(sd.reply_payload[0]).unwrap());
            }
            _ => {panic!("Error!");}
        }
        //println!("{:?}", rpc_type);
        // Esme: Once we have the metadata, we can send the actual rpc call with the correct type
        let response = self.send_rpc(rpc_call, arg, updating_information, rpc_type.unwrap());
        return (rpc_type, response);
    
    }

    pub fn rpc_data(&self, rpc_call: String, arg: Option<String>) -> (String, Option<bool>){
        //println!("{:?}", rpc_call);
        let mut updating_information = UpdatingInformation::default();
        let (rpc_type, response) = match arg {
            Some(v) => {self.send_and_interpret_rpc(rpc_call, Some(v.to_string()) , &mut updating_information)}
            None => {self.send_and_interpret_rpc(rpc_call, None , &mut updating_information)}
        };
        let reply;
        match response {
            Packet:: RPCResponseData(sd) => {reply = Replies::Response(sd.reply_payload);}
            Packet:: RPCErrorData(sd) => {panic!("RPC ERROR {:?}",sd)}
            _ => {panic!("RPC something else")}
        }
        let mut parsed_response = "".to_string();
        // Esme: isbool just checks if the type is u8. this is for the webapp so that once we send a list of rpcs for each viewer, we can make 
        // checkboxes for boolean rpc calls and entry boxes for the other ones
        // this is not the best check for this, so there might need to be some edits to the metadata that like "data.isbool" or something rather than checking if it is a u8
        let mut isbool = false;
        match rpc_type {
            //Esme: format response to be in correct type
            //Esme: TODO: missing type metadata for particular rpc calls like "rpc.info" - right now default just returns vector of bytes
            Some(resp_type) => { 
                if let Replies::Response(payload) = reply{
                    use TYPES::*;
                    match resp_type {
                        U8 => {parsed_response = str::from_utf8(&payload).unwrap().to_string(); isbool = true;}
                        I8 => {parsed_response = str::from_utf8(&payload).unwrap().to_string(); isbool = true; }
                        U16 => {parsed_response = u16::from_le_bytes(payload.try_into().unwrap()).to_string();}
                        I16 => {parsed_response = i16::from_le_bytes(payload.try_into().unwrap()).to_string();}
                        U32 => {parsed_response = u32::from_le_bytes(payload.try_into().unwrap()).to_string();}
                        I32 => {parsed_response = i32::from_le_bytes(payload.try_into().unwrap()).to_string();}
                        U64 => {parsed_response = u64::from_le_bytes(payload.try_into().unwrap()).to_string();}
                        I64 => {parsed_response = i64::from_le_bytes(payload.try_into().unwrap()).to_string();}
                        F32 => {parsed_response = f32::from_le_bytes(payload.try_into().unwrap()).to_string();}
                        F64 => {parsed_response = f64::from_le_bytes(payload.try_into().unwrap()).to_string();}
                        StringType => {parsed_response = str::from_utf8(&payload).unwrap().to_string();}
                        NoneType => {parsed_response = str::from_utf8(&payload).unwrap().to_string();}
                        _ =>  {parsed_response = str::from_utf8(&payload).unwrap().to_string();}
                    }
                }
            }
            None => {}
        }
        return (parsed_response, Some(isbool));
    }

    pub fn rpc(&self, rpc_call: String, arg: Option<String>) -> String {
        //Esme: general rpc function that gets passed up to the typescript side for rpc calls in the app
        //Esme: this separate function exists just because I didn't want the rpc function in the app to return isbool
        let (parsed_response, _isbool) = self.rpc_data(rpc_call, arg);
        return parsed_response;
    }

    pub fn data_rate(&self, value: Option<f32>) -> f32 {
        //Esme: ideally updating_information would be accessible by entire Device class
        //Esme: this function is likely not necessary now that I have made a more general RPC function, same with the name and column names function
        let mut updating_information = UpdatingInformation::default();
        let (_rpc_type, response) = match value {
            Some(v) => {self.send_and_interpret_rpc("data.rate".to_string(), Some(v.to_string()) , &mut updating_information)}
            None => {self.send_and_interpret_rpc("data.rate".to_string(), None , &mut updating_information)}
        };
        match response {
            Packet:: RPCResponseData(sd) => {f32::from_le_bytes(sd.reply_payload.try_into().unwrap())}
            _ => {panic!("Error")}
        }
        
    }

    pub fn column_names(&self) -> Vec<String> {
        let mut updating_information = UpdatingInformation::default();
        let (_rpc_type, response) = self.send_and_interpret_rpc("data.stream.columns".to_string(), None, &mut updating_information);
        match response {
            Packet:: RPCResponseData(sd) => {str::from_utf8(&sd.reply_payload).unwrap().split(" ").map(|s| s.to_string()).collect()}
            _ => {panic!("Error")}
        }
    }

    pub fn name(&self) -> String {
        let mut updating_information = UpdatingInformation::default();
        let (_rpc_type,response) = self.send_and_interpret_rpc("dev.name".to_string(), None, &mut updating_information);
        match response {
            Packet:: RPCResponseData(sd) => {str::from_utf8(&sd.reply_payload).unwrap().to_string()}
            _ => {panic!("Error")}
        }
    }

    pub fn status(&self) -> (Vec<String>, Vec<Vec<String>>, Vec<Vec<bool>>) {
        //Esme: read status (what viewers are available) from rpc, right now hard coded for testing purposes
        if self.name() == "OMG" {
            let mut viewer_info = Vec::new();
            let mut viewers = Vec::new();
            viewers.push("Scalar".to_string());
            viewers.push("Laser".to_string());
            viewers.push("Heater".to_string());
            let scalar_rpcs = vec!["data.rate".to_string(), "dev.name".to_string()];//,"bar.data.active".to_string(), "therm.data.active".to_string()];
            let laser_rpcs = vec!["dev.name".to_string()];
            viewer_info.push(scalar_rpcs.clone());
            viewer_info.push(laser_rpcs.clone());
            let mut isbool = Vec::new();
            let mut isbool_scalar = Vec::new();
            let mut isbool_laser = Vec::new();
            for rpc in scalar_rpcs {
                match self.rpc_data(rpc, None).1 {
                    Some(isbool) => {isbool_scalar.push(isbool);}
                    _ => {}
                }
            }
            for rpc in laser_rpcs {
                match self.rpc_data(rpc, None).1 {
                    Some(isbool) => {isbool_laser.push(isbool);}
                    _ => {}
                }
            }
            isbool.push(isbool_scalar);
            isbool.push(isbool_laser);
            return (viewers, viewer_info, isbool);
        } else {
            return (Vec::new(), Vec::new(), Vec::new());
        }
    }
}
