// TODO: needed? #![no_std]

// Reminder: everything in TIO is little endian

use std::convert::TryInto;

/// Possible packet types (only partial support; eg does not handle arbitrary stream channels)
#[derive(Debug, PartialEq)]
#[repr(u8)]
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

/// Almost-binary representation of packet. Could be used as an intermediary when parsing
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
            payload: raw[4..4 + header.payload_len as usize].to_vec(),
            routing: raw[4 + header.payload_len as usize..].to_vec(),
        })
    }
}

#[derive(Debug, PartialEq)]
#[repr(u8)]
pub enum LogType {
    Critical = 0,
    Error = 1,
    Warning = 2,
    Info = 3,
    Debug = 4,
}

#[derive(Debug, PartialEq)]
pub struct LogMessage {
    pub log_data: u32,
    pub log_type: LogType,
    pub message: String,
}

impl LogMessage {
    pub fn warn(message: String) -> LogMessage {
        // TODO: better sanity check here
        assert!(message.len() < 256);
        LogMessage {
            log_data: 0,
            log_type: LogType::Warning,
            message,
        }
    }
}

#[derive(Debug, PartialEq)]
pub struct RPCRequest {
    pub req_id: u16,
    pub method_or_len: u16,
    pub name: String,
    pub payload: Vec<u8>,
}

impl RPCRequest {
    /// Simple RPC: named by string, no payload
    pub fn new_named_simple(name: String) -> RPCRequest {
        // TODO: more accurate name restriction
        assert!(name.len() < 256);
        RPCRequest {
            req_id: rand::random(),
            method_or_len: (name.len() as u16) << 1,
            name,
            payload: vec![],
        }
    }
}

#[derive(Debug, PartialEq)]
pub struct RPCResponse {
    pub req_id: u16,
    pub payload: Vec<u8>,
}

/// For stream descriptions, the libtio docs and tio-python implementation diverge, not sure which to follow
/*
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
            data[i] = f32::from_le_bytes((&self.payload)[i * 4..i * 4 + 4].try_into().unwrap());
        }
        data
    }

    pub fn from_f32(sample_num: u32, values: &[f32]) -> StreamData {
        assert!(values.len() < 128);
        let mut payload = Vec::with_capacity(values.len() * 4);
        for (i, v) in values.iter().enumerate() {
            payload[4*i..4*i+4].copy_from_slice(&f32::to_le_bytes(*v));
        }
        StreamData {
            sample_num,
            payload
        }
    }
}

#[derive(Debug, PartialEq)]
pub enum Packet {
    Empty,
    Log(LogMessage),
    RpcReq(RPCRequest),
    RpcRes(RPCResponse),
    //StreamDesc(StreamDescription),
    StreamData(StreamData),
}

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
}
