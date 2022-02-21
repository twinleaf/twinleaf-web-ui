/// This crate provides basic helper types (structs and enums) and parsing routines to work with
/// Twinleaf binary "TIO" packets. This crate tries to use as few dependencies and standard library
/// features as possible, which would make it possible to use this code in multiple contexts,
/// including in-browser (WASM) and possibly even directly on microcontrollers.
///
/// Code for connecting to serial devices, TCP endpoints, etc, are included in the `tio` crate.
///
/// TODO: All the routines in this file currently resurn Result<_, String>, that is, String is used
/// as the error type. This is a lazy way to get started, but is not idiomatic Rust, where the
/// error type should implement the standard Error trait (if I remember correctly). This crate
/// could instead define it's own error type; or try to use generic Error (can't remember if this
/// is feasible); or possibly use an external library like "anyhow" or "error-chain" to help with
/// error handling.
///
/// TODO: optionally refactor this crate to have most of the code in a separate file, instead of
/// all in `lib.rs`
///
/// TODO: should probably derive serde "Serializable" for all the public structs in this crate.
// Reminder: everything in TIO binary is little endian
use std::convert::TryInto;
use std::str::from_utf8;

/// Possible packet types, encoded as a single byte (`u8`).
///
/// TODO: this is an incomplete mapping, and does not handle the case of multiple numbered streams
/// (aka, all values above 128). There may be a clever way to handle the above-128 cases with a
/// Rust enum while retaining the `repr(u8)`..
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum TYPES {
    U8 = 16,
    I8 = 17,
    U16 = 32,
    I16 = 33,
    U24 = 48,
    I24 = 49,
    U32 = 64,
    I32 = 65,
    U64 = 128,
    I64 = 129,
    F32 = 66,
    F64 = 130,
    StringType = 3,
    NoneType = 0,
}
impl TYPES {
    pub fn from_u8(raw: u8) -> Result<TYPES, String> {
        use TYPES::*;
        match raw {
            // TODO: partial enumeration
            16 => Ok(U8),
            17 => Ok(I8),
            32 => Ok(U16),
            33 => Ok(I16),
            48 => Ok(U24),
            49 => Ok(I24),
            64 => Ok(U32),
            65 => Ok(I32),
            128 => Ok(U64),
            129 => Ok(I64),
            66 => Ok(F32),
            130 => Ok(F64),
            3 => Ok(StringType),
            0 => Ok(NoneType),
            _ => Err("unimplmented TYPE".into()),
        }
    }
}


#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum PacketType {
    Invalid = 0,
    Log = 1,
    RPCRequest = 2,
    RPCResponse = 3,
    RPCError = 4,
    Heartbeat = 5,
    Timebase = 6,
    Source = 7,
    Stream = 8,
    Text = 63,
    StreamZero = 128,
}

impl PacketType {
    /// This method is required for type safety, to ensure the byte contains a valid packet type.
    pub fn from_u8(raw: u8) -> Result<PacketType, String> {
        use PacketType::*;
        match raw {
            // TODO: partial enumeration
            1 => Ok(Log),
            2 => Ok(RPCRequest),
            3 => Ok(RPCResponse),
            4 => Ok(RPCError),
            5 => Ok(Heartbeat),
            6 => Ok(Timebase),
            7 => Ok(Source),
            8 => Ok(Stream),
            63 => Ok(Text),
            128 => Ok(StreamZero),
            _ => Err("unimplmented PacketType".into()),
        }
    }
}

/// Simple representation of just the header of a packet (4-bytes). Split out because sometimes we
/// might want to read just the header before the whole packet (eg, when doing TCP stream framing)
#[derive(Debug, PartialEq)]
pub struct RawPacketHeader {
    pub packet_type: PacketType,
    pub routing_len: u8,
    pub payload_len: u16,
}

impl RawPacketHeader {
    pub fn from_bytes(raw: &[u8; 4]) -> Result<RawPacketHeader, String> {
        Ok(RawPacketHeader {
            packet_type: PacketType::from_u8(raw[0])?,
            routing_len: raw[1],
            payload_len: u16::from_le_bytes(raw[2..4].try_into().unwrap()),
        })
    }
}

/// Almost-binary representation of packet, to be used as an intermediate value when parsing
/// packets. Note that the payload is represented as `Vec<u8>`, which means this struct contains a
/// full copy and requires memory allocation.
///
/// A better and more Rust-idiomatic API would avoid creating Vec, and instead either keep a
/// pointer to a u8 slice, or just not have this intermediate struct exist at all, resulting in a
/// "zero copy" parse/encode. This may require lifetime annotations and thinking more about
/// lifetimes/ownerships, which introduces some complexity; the current implementation is easier to
/// reason about.
#[derive(Debug, PartialEq)]
pub struct RawPacket {
    pub packet_type: PacketType,
    pub routing_len: u8,
    pub payload_len: u16,
    pub payload: Vec<u8>,
    pub routing: Vec<u8>,
}

impl RawPacket {
    pub fn from_bytes(raw: &[u8]) -> Result<RawPacket, String> {
        // first parse header
        if raw.len() < 4 {
            return Err("packet is too small to be valid".into());
        }
        let header = RawPacketHeader::from_bytes(raw[0..4].try_into().unwrap())?;
        if raw.len() != (header.routing_len as usize + header.payload_len as usize + 4) {
            return Err("packet doesn't declared size".into());
        }
        Ok(RawPacket {
            packet_type: header.packet_type,
            routing_len: header.routing_len,
            payload_len: header.payload_len,
            payload: raw[4..(4 + header.payload_len as usize)].to_vec(),
            routing: raw[(4 + header.payload_len as usize)..].to_vec(),
        })
    }

    // The append() method mutates the "from" argument, so this needs to consume/destroy the entire
    // struct (thus, `mut self` instead of `&self` in the function signature).
    // TODO: there is probably a more idiomatic way to do this with less copying. It might also be
    // more idiomatic to pass in the Vec as a buffer (which can be reused)
    pub fn into_bytes(mut self) -> Vec<u8> {
        let mut data: Vec<u8> =
            Vec::with_capacity(4 + self.routing_len as usize + self.payload_len as usize);
        data.push(self.packet_type as u8);
        data.push(self.routing_len);
        data.append(&mut self.payload_len.to_le_bytes().to_vec());
        data.append(&mut self.payload);
        data.append(&mut self.routing);
        data
    }
}

#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum LogType {
    Critical = 0,
    Error = 1,
    Warning = 2,
    Info = 3,
    Debug = 4,
}

impl LogType {
    pub fn from_u8(raw: u8) -> Result<LogType, String> {
        use LogType::*;
        match raw {
            0 => Ok(Critical),
            1 => Ok(Error),
            2 => Ok(Warning),
            3 => Ok(Info),
            4 => Ok(Debug),
            _ => Err("unhandled logtype".into()),
        }
    }
}

/// For embedded use, might be better to take a `&str` (references) and work through the lifetime issues.
/// Also, not sure if using UTF-8 strings pulls in too much unicode handling code for embedded use;
/// might want to use ASCII and bytestrings instead?
#[derive(Debug, PartialEq)]
pub struct LogMessage {
    pub log_data: u32,
    pub log_type: LogType,
    pub message: String,
}

impl LogMessage {
    /// Helper to quickly create a warning-level LogMessage from a String. The entire String is
    /// passed in (moved), instead of by-reference, because it is subsumed in to the struct.
    pub fn warn(message: String) -> LogMessage {
        // TODO: better sanity check here
        assert!(message.len() < 256);
        LogMessage {
            log_data: 0,
            log_type: LogType::Warning,
            message,
        }
    }

    pub fn from_bytes(payload: &[u8]) -> LogMessage {
        LogMessage {
            log_data: u32::from_le_bytes(payload[0..4].try_into().unwrap()),
            log_type: LogType::from_u8(payload[4]).unwrap(),
            message: String::from_utf8(payload[5..].to_vec()).unwrap(),
        }
    }

    pub fn to_bytes(&self) -> Vec<u8> {
        // TODO: message.len() is code points, not bytes, but probably almost always bytes, and Vec
        // can just expand with a realloc so not a big deal
        let mut data: Vec<u8> = Vec::with_capacity(4 + 1 + self.message.len());
        data.append(&mut self.log_data.to_le_bytes().to_vec());
        data.push(self.log_type.clone() as u8);
        data.append(&mut self.message.as_bytes().to_vec());
        data
    }
}

// TODO: could refactor the RPC types as:
//
//   RPCRequest -> Request
//   RPCResponse -> Response
//   RPCError -> ErrorResponse
/// Fairly low-level representation of an RPC request. Might be better to use Rust enum of either
/// String or u16 to represent the two options of "method as string" vs. "method as number).
#[derive(Debug, PartialEq)]
pub struct RPCRequest {
    pub req_id: u16,
    pub method_or_len: u16,
    pub name: String,
    pub payload: Vec<u8>,
}

impl RPCRequest {
    /// Hlper to generate a simple string-style RPC request with no payload
    pub fn named_simple(name: String) -> RPCRequest {
        // TODO: more accurate name restriction
        assert!(name.len() < 256);
        RPCRequest {
            req_id: rand::random(),
            method_or_len: (name.len() as u16) << 1,
            name,
            payload: vec![],
        }
    }

    // TODO: this is a partial implementation
    pub fn to_bytes(&self) -> Vec<u8> {
        let mut data: Vec<u8> = Vec::with_capacity(2 + 2 + self.name.len() + self.payload.len());
        data.append(&mut self.req_id.to_le_bytes().to_vec());
        data.append(&mut self.method_or_len.to_le_bytes().to_vec());
        data.append(&mut self.name.as_bytes().to_vec());
        data.append(&mut self.payload.clone());
        data
    }
}

#[derive(Debug, PartialEq)]
pub struct RPCResponse {
    pub req_id: u16,
    pub payload: Vec<u8>,
}

/*
// NOT IMPLEMENTED: The libtio docs and tio-python implementation diverge, not sure which to follow.
#[derive(Debug,PartialEq)]
pub struct StreamDescription{
    // 21 bytes minimum
    pub stream_id: u8,
    pub timestamp_type: u8,

    pub stream_type: u8, // StreamDataType
    pub channel_count: u8,
    pub restart_id: u8,
    pub start_ts: u64,
    pub sample_counter: u64,
    pub period_numerator: u32,
    pub period_denominator: u32,
    pub flags: u8,
}

impl StreamDescription {

    pub fn from_bytes(raw: &[u8; 30]) -> StreamDescription {
        StreamDescription {
            stream_id: raw[0],
            stream_type: raw[1],
            channel_count: raw[2],
            restart_id: raw[3],
            start_ts: u64::from_le_bytes(raw[4:12]),
            sample_counter: u64::from_le_bytes(raw[12:20]),
            period_numerator: u32::from_le_bytes(raw[20:24]),
            period_denominator: u32::from_le_bytes(raw[24:28]),
            flags: raw[28],
            timestamp_type: raw[29],
        }
    }
}
*/

/// Pretty simple low-level representation of StreamData. The API for dealing with streams/channels
/// may need rethinking. Eg, arguably the context from a StreamDesc is required to decode a stream
/// message.
///
/// TODO: I guess the "as_f32" etc function could be implemented as generics over the type, but in
/// practice we don't actually seem to use all the possible types, so having different
/// implementations per type might be fine?
///
/// Eg, maybe this crate `tio-packet` should be expanded to have the abstract concept of a
/// "device", and context about types of channels, and contain helpers for resolving timestamps and
/// detecting missed packets, things like that. Or that could live in `tio`, but then don't have
/// access to it in WASM context.
#[derive(Debug, PartialEq)]
pub struct StreamData {
    pub sample_num: u32,
    pub payload: Vec<u8>,
}

impl StreamData {
    /// Helper to interpret a data packet as a set of f32 float values
    pub fn as_f32(&self) -> Vec<f32> {
        // TODO: should return a Result instead of asserting here
        assert!(self.payload.len() % 4 == 0);
        let mut data = Vec::with_capacity(self.payload.len() / 4);
        for i in 0..(self.payload.len() / 4) {
            // try_into() is a hack to convert arbitrary slice into a fixed-size slice
            // https://newbedev.com/how-can-i-convert-a-buffer-of-a-slice-of-bytes-u8-to-an-integer
            data.push(f32::from_le_bytes(
                (&self.payload)[i * 4..i * 4 + 4].try_into().unwrap(),
            ));
        }
        data
    }

    pub fn from_f32(sample_num: u32, values: &[f32]) -> StreamData {
        assert!(values.len() < 128);
        let mut payload = Vec::with_capacity(values.len() * 4);
        for (_i, v) in values.iter().enumerate() {
            // TODO: cleaner way of doing this slice assignment
            payload.append(&mut f32::to_le_bytes(*v).to_vec());
        }
        StreamData {
            sample_num,
            payload,
        }
    }

    pub fn from_bytes(payload: &[u8]) -> StreamData {
        StreamData {
            sample_num: u32::from_le_bytes(payload[0..4].try_into().unwrap()),
            payload: payload[4..].to_vec(),
        }
    }
}

#[derive(Debug,PartialEq, Clone)]
pub struct StreamInfo {
    pub stream_source_id: u16,
    stream_flags: u16,
    pub stream_period: u32,
    stream_offset: u32,
}
impl StreamInfo{
    pub fn load_stream_info(raw: &[u8], stream_component: usize) -> StreamInfo{
        StreamInfo{
            stream_source_id: u16::from_le_bytes(raw[24+stream_component*12..26+stream_component*12].try_into().unwrap()),
            stream_flags: u16::from_le_bytes(raw[26+stream_component*12..28+stream_component*12].try_into().unwrap()),
            stream_period: u32::from_le_bytes(raw[28+stream_component*12..32+stream_component*12].try_into().unwrap()),
            stream_offset: u32::from_le_bytes(raw[32+stream_component*12..36+stream_component*12].try_into().unwrap()),
        }
    }
}


#[derive(Debug,PartialEq)]
pub struct RPCResponseData {
    pub request_id: u16,
    pub reply_payload: Vec<u8>,
}
impl RPCResponseData {
    pub fn from_bytes(raw: &[u8]) -> RPCResponseData {

        RPCResponseData {
            request_id: u16::from_le_bytes(raw[0..2].try_into().unwrap()),
            reply_payload: raw[2..].to_vec(), 
        }
    }
}

#[derive(Debug,PartialEq)]
pub struct RPCErrorData {
    pub request_id: u16,
    pub error_code: u16,
    pub error_payload: Vec<u8>
}
impl RPCErrorData {
    pub fn from_bytes(raw: &[u8]) -> RPCErrorData {

        RPCErrorData {
            request_id: u16::from_le_bytes(raw[0..2].try_into().unwrap()),
            error_code: u16::from_le_bytes(raw[2..4].try_into().unwrap()),
            error_payload: raw[4..].to_vec(), 
        }
    }
}

#[derive(Debug,PartialEq, Clone)]
pub struct StreamDescription {
    pub stream_id: u16,
    pub stream_timebase_id:u16,
    pub stream_period:u32,
    stream_offset:u32,
    stream_sample_number: u64,
    stream_total_components:u16,
    stream_flags:u16,
    pub stream_info: Vec<StreamInfo>,
}
impl Default for StreamDescription {
    fn default () -> StreamDescription {
        StreamDescription{stream_id: 0, stream_timebase_id: 0, stream_period: 0, stream_offset: 0, stream_sample_number: 0, stream_total_components:0, stream_flags: 0, stream_info: Vec::new(),}
    }
}
impl StreamDescription {
    pub fn from_bytes(raw: &[u8]) -> StreamDescription {
        let stream_total_components = u16::from_le_bytes(raw[20 .. 22].try_into().unwrap());
        let stream_id = u16::from_le_bytes(raw[0 .. 2].try_into().unwrap());
        let mut streams = Vec::new();
        if stream_id == 0{
            if raw.len() > 24{
                for stream_component in 0..stream_total_components {
                    let new_stream = StreamInfo::load_stream_info(raw, stream_component as usize);
                    streams.push(new_stream);
                }
            }
        }

        StreamDescription {
            stream_id: stream_id,
            stream_timebase_id: u16::from_le_bytes(raw[2 .. 4].try_into().unwrap()),
            stream_period: u32::from_le_bytes(raw[4 .. 8].try_into().unwrap()),
            stream_offset: u32::from_le_bytes(raw[8 .. 12].try_into().unwrap()),
            stream_sample_number: u64::from_le_bytes(raw[12 .. 20].try_into().unwrap()),
            stream_total_components: stream_total_components,
            stream_flags: u16::from_le_bytes(raw[22 .. 24].try_into().unwrap()),   
            stream_info: streams,
        }
    }
}

#[derive(Debug,PartialEq, Clone)]
pub struct TimebaseData {
    pub timebase_id: u16,
    pub timebase_source: u8,
    pub timebase_epoch: u8,
    pub timebase_start_time: u64,
    pub timebase_period_num_us: u32,
    pub timebase_period_denom_us: u32,
    pub timebase_flags: u32,
    pub timebase_stability_ppb: f32,
    pub timebase_src_params: Vec<u8>,
}

impl TimebaseData {
    pub fn from_bytes(raw: &[u8]) -> TimebaseData {
        
        TimebaseData {
            timebase_id: u16::from_le_bytes(raw[0 .. 2].try_into().unwrap()),
            timebase_source: raw[2],
            timebase_epoch: raw[3],
            timebase_start_time: u64::from_le_bytes(raw[4..12].try_into().unwrap())/1000000000,
            timebase_period_num_us: u32::from_le_bytes(raw[12..16].try_into().unwrap()),
            timebase_period_denom_us : u32::from_le_bytes(raw[16..20].try_into().unwrap()),
            timebase_flags: u32::from_le_bytes(raw[20..24].try_into().unwrap()),
            timebase_stability_ppb: f32::from_le_bytes(raw[24..28].try_into().unwrap())*1000000000.,
            timebase_src_params: raw[28..].to_vec(),
            
        }
    }
}

#[derive(Debug,PartialEq, Clone)]
pub struct SourceData {
    pub source_id: u16,
    pub source_timebase_id: u16,
    pub source_period: u32,
    pub source_offset: u32,
    pub source_fmt: u32,
    pub source_flags: u16,
    pub source_channels: u16,
    pub source_type: TYPES,
    pub source_name: String,
    pub source_column_names: Vec<String>,
    pub source_title: String,
    pub source_units: String,
    pub source_other_desc: String,
}
impl SourceData {
    pub fn from_bytes(raw: &[u8]) -> SourceData {
        let description = from_utf8(raw[21..].try_into().unwrap()).unwrap().split("\t");
        let description_vec = description.collect::<Vec<&str>>();
        let source_column_names =
            if description_vec.len() >= 2 {
                description_vec[1].split(",").map(|s| s.to_string()).collect()//collect::<Vec<&str>>();
            } else {
                let mut vec = Vec::new();
                vec.push("".to_string());
                vec
            };
        let source_title = 
            if description_vec.len() >= 3 {
                description_vec[2].to_string()
            } else {
                "".to_string()
            };

        let source_units = 
            if description_vec.len() >= 4{
                description_vec[3].to_string()
            } else {
                "".to_string()
            };

        let source_other_desc = 
            if description_vec.len() >= 5{
                description_vec[4..].to_vec().join("")
            } else {
                "".to_string()
            };

        SourceData {
            source_id: u16::from_le_bytes(raw[0 .. 2].try_into().unwrap()),
            source_timebase_id: u16::from_le_bytes(raw[2 .. 4].try_into().unwrap()),
            source_period: u32::from_le_bytes(raw[4..8].try_into().unwrap()),
            source_offset: u32::from_le_bytes(raw[8..12].try_into().unwrap()),
            source_fmt: u32::from_le_bytes(raw[12..16].try_into().unwrap()),
            source_flags: u16::from_le_bytes(raw[16..18].try_into().unwrap()),
            source_channels: u16::from_le_bytes(raw[18..20].try_into().unwrap()),
            source_type: TYPES::from_u8(raw[20]).unwrap(),
            source_name: description_vec[0].to_string(),
            source_column_names: source_column_names,
            source_title: source_title,
            source_units: source_units,
            source_other_desc: source_other_desc,
            
        }
    }
}

/// High(er) level representation of any packet. The idea is that most application code would use
/// this abstraction level.
///
/// TODO: the simple helper methods of individual types (like "warn()" for a log packet, or "simple
/// RPC") could be moved to this type; would make constructing high-level structs easier in calling
/// code.
#[derive(Debug, PartialEq)]
pub enum Packet {
    Empty,
    Log(LogMessage),
    RpcReq(RPCRequest),
    //RpcRes(RPCResponse),
    //StreamDesc(StreamDescription),
    StreamData(StreamData),
    TimebaseData(TimebaseData),
    SourceData(SourceData),
    StreamDescription(StreamDescription),
    RPCResponseData(RPCResponseData),
    RPCErrorData(RPCErrorData)

}
impl Packet {
    pub fn packet_type(&self) -> PacketType {
        match self {
            Packet::Empty => PacketType::Heartbeat,
            Packet::Log(_) => PacketType::Log,
            Packet::RpcReq(_) => PacketType::RPCRequest,
            //Packet::RpcRes(_) => PacketType::RPCResponse,
            Packet::StreamData(_) => PacketType::StreamZero,
            Packet::TimebaseData(_) => PacketType::Timebase,
            Packet::SourceData(_) => PacketType::Source,
            Packet::StreamDescription(_) => PacketType::Stream,
            Packet::RPCResponseData(_) => PacketType::RPCResponse,
            Packet::RPCErrorData(_) => PacketType::RPCError,
        }
    }

    pub fn to_bytes(&self) -> Result<Vec<u8>, String> {
        use Packet::*;
        let payload_bytes = match self {
            Empty => vec![],
            Log(msg) => msg.to_bytes(),
            RpcReq(req) => req.to_bytes(),
            StreamData(_) | TimebaseData(_) | SourceData(_) | StreamDescription(_) | RPCResponseData(_) | RPCErrorData(_) => unimplemented!(),
        };
        let raw_packet = RawPacket {
            packet_type: self.packet_type(),
            routing_len: 0,
            payload_len: payload_bytes.len() as u16,
            payload: payload_bytes,
            routing: vec![],
        };
        Ok(raw_packet.into_bytes())
    }

    // TODO: high-level "from_bytes()"
}

// TODO: more low-level (unittest) coverage. Any way to make basic protocol/schema test coverage
// more tranferable between language implementations is good. Eg, a set of test vectors that can be
// reused between Rust, C, and Python implementations.
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_raw_packet_header() -> () {
        let raw = [0x05, 0x00, 0x00, 0x00];
        let hdr = RawPacketHeader::from_bytes(&raw).unwrap();
        assert_eq!(hdr.packet_type, PacketType::Heartbeat);
        assert_eq!(hdr.routing_len, 0);
        assert_eq!(hdr.payload_len, 0);

        let raw = [0x01, 0x00, 0x20, 0x00];
        let hdr = RawPacketHeader::from_bytes(&raw).unwrap();
        assert_eq!(hdr.packet_type, PacketType::Log);
        assert_eq!(hdr.routing_len, 0);
        assert_eq!(hdr.payload_len, 32);
    }

    #[test]
    fn test_stream_data() -> () {
        let vals: [f32; 3] = [500.0, -800.0, 3.2];
        let sd = StreamData::from_f32(87654321, &vals);
        assert_eq!(vals.to_vec(), sd.as_f32());
    }
}
