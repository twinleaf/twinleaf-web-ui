use tio_packet::{Packet, PacketType, RPCRequest, RawPacket, StreamData};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
/// Takes a pointer to some bytes, returns a RawPacket
///
/// Could probably take a pointer to an array of bytes or something like that instead.
pub fn raw_packet_from_bytes(bytes: &[u8]) -> Result<JsValue, JsValue> {
    match RawPacket::from_bytes(bytes) {
        Ok(raw_packet) => Ok(serde_wasm_bindgen::to_value(&raw_packet)?),
        Err(e) => Err(serde_wasm_bindgen::to_value(&e)?),
    }
}

#[wasm_bindgen]
pub fn floats_from_raw_stream_packet(val: JsValue) -> Result<JsValue, JsValue> {
    let raw_packet: RawPacket = serde_wasm_bindgen::from_value(val)?;
    let stream_data = match raw_packet.packet_type {
        PacketType::StreamZero => StreamData::from_bytes(&raw_packet.payload),
        _ => {
            return Err(serde_wasm_bindgen::to_value(
                &"not a stream0 packet!".to_string(),
            )?)
        }
    };
    Ok(serde_wasm_bindgen::to_value(&stream_data.as_f32())?)
}

#[wasm_bindgen]
pub fn simple_rpc_request_as_bytes(name: String) -> Result<JsValue, JsValue> {
    let packet = Packet::RpcReq(RPCRequest::named_simple(name));
    Ok(serde_wasm_bindgen::to_value(&packet.to_bytes().unwrap())?)
}

#[wasm_bindgen]
/// This is mostly included as a demo of what a Packet (vs. RawPacket) would look like in
/// Javascript (aka, as a JsValue)
pub fn simple_rpc_request(name: String) -> Result<JsValue, JsValue> {
    Ok(serde_wasm_bindgen::to_value(&Packet::RpcReq(
        RPCRequest::named_simple(name),
    ))?)
}
