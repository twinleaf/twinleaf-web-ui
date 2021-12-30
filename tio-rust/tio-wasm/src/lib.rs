
use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};

/// Functions from Javascript we want to access from Rust (as proof of concept)
#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

/// Tiny demo of a Rust function calling Javascript (as opposed to Javascript calling Rust
/// functions)
#[wasm_bindgen]
pub fn say_hello() {
    alert("Hello, Twinleaf, from Rust/WASM!");
}


// TODO:
// - parse bytes (array) to packet, returning... packet? raw packet? special struct?
// - parse packet as floats (?)
// - create simple RPC request (returns bytes?)
// - create heartbeat request (returns bytes?)

#[derive(Deserialize, Serialize)]
struct Efficient<'a> {
    #[serde(with = "serde_bytes")]
    bytes: &'a [u8],

    #[serde(with = "serde_bytes")]
    byte_buf: Vec<u8>,
}


#[wasm_bindgen]
pub fn pass_value_to_js() -> Result<(), JsValue> {
 let some_supported_rust_value = ("Hello, world!", 42);
 let js_value = serde_wasm_bindgen::to_value(&some_supported_rust_value)?;
 // ...
 Ok(())
}
