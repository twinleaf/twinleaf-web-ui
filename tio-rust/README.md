
This directory contains experimental Rust (rustlang) support for the TIO protocol.

Crates (sub-components):

- `tio-packet`: create and parse TIO binary protocol messages. `nostd`, WASM-compatible
- `tio`: higher-level library. Can open serial ports, etc, using system libraries. Can be re-used as a library, also includes a CLI tool (`tio-cli`)
- `tio-wasm`: thin wrapper around `tio-packet` for in-browser (or in-webview) Javascript use of `tio-packet` (via WebAssembly, aka "WASM")

The idea is that this directory could be spun out in to a separate git repo.

There are comments in the Rust source code, including descriptions of the libraries used.


## Rust-to-WASM Toolchain

The WASM build process has not been automated (yet), instead the compiled
`.wasm` and `.js` files are commited in git.

To do development and re-compile the WASM code, first install additional rust toolchain dependencies:

    rustup target add wasm32-unknown-unknown

    # there may be alternative installation options for wasm-pack
    cargo install wasm-pack

Then, to do a build, enter the `tio-wasm/` directory and:

    # optional initial build using WASM target
    cargo build --target wasm32-unknown-unknown

    # build .wasm and .js files under pkg/ directory
    wasm-pack build --release --target web

The `web` target results in the javascript being bundled as an ES module. There
also exist targets for direct non-module Javascript use, or for use with a
"bundler" like `esbuild`.

To experiment with the generated WASM code, we need to run a local development
HTTP server; it seems that `.wasm` files can not be loaded via `file://` (a
least Chrome requires the content type to be set). This worked for bnewbold:

    # start a local web server, from the `tio-wasm/` directory
    python3 -m http.server

    # then open: http://localhost:8000/www/

Links and resources:

- <https://stackoverflow.com/a/64342488/4682349>
- <https://rustwasm.github.io/docs/wasm-bindgen/reference/deployment.html>
- <https://rustwasm.github.io/docs/wasm-bindgen/examples/without-a-bundler.html>
