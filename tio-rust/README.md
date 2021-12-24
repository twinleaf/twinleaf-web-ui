
This directory contains some experimental Rust (rustlang) support for the TIO
protocol.

Crates (sub-components):

- `tio-packet`: create and parse TIO binary protocol messages. `nostd`, WASM-compatible
- `tio`: higher-level library. Can open serial ports, etc, using system libraries. Can be re-used as a library, also includes a CLI tool (`tio-cli`)

Unstructured notes:

    rustup target add wasm32-unknown-unknown
