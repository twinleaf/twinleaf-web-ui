/* tslint:disable */
/* eslint-disable */
/**
* Takes a pointer to some bytes, returns a RawPacket
*
* Could probably take a pointer to an array of bytes or something like that instead.
* @param {Uint8Array} bytes
* @returns {any}
*/
export function raw_packet_from_bytes(bytes: Uint8Array): any;
/**
* @param {any} val
* @returns {any}
*/
export function floats_from_raw_stream_packet(val: any): any;
/**
* @param {string} name
* @returns {any}
*/
export function simple_rpc_request_as_bytes(name: string): any;
/**
* This is mostly included as a demo of what a Packet (vs. RawPacket) would look like in
* Javascript (aka, as a JsValue)
* @param {string} name
* @returns {any}
*/
export function simple_rpc_request(name: string): any;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly raw_packet_from_bytes: (a: number, b: number) => number;
  readonly floats_from_raw_stream_packet: (a: number) => number;
  readonly simple_rpc_request_as_bytes: (a: number, b: number) => number;
  readonly simple_rpc_request: (a: number, b: number) => number;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
