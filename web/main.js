import { app } from "@tauri-apps/api";
import React from "react";
import ReactDOM from "react-dom";


// This is the normal way to include react semantic ui css, but
// loading from html avoids needing esbuild binary loaders.
// import "semantic-ui-css/semantic.css";

import { App } from "./src/app";

export class Hello extends React.Component {
  render() {
    return React.createElement("div", null, `Hello ${this.props.toWhat}`);
  }
}

/* Exposes an API for building an to scripts in HTML
 * This is unusual for a React app, usually you'd just put that code in this file
 * but it seems useful to Twinleaf to be able to write code in a script tag directly.
 */

// In a browser, globalThis points to the window object.
globalThis.Hello = Hello;
globalThis.App = App;
globalThis.React = React;
globalThis.ReactDOM = ReactDOM;

/*
import { invoke } from "@tauri-apps/api";
// or: const invoke = window.__TAURI__.invoke
import { listen } from '@tauri-apps/api/event'
// or: const listen = window.__TAURI__.event.listen


// register a listener for data packets. current message types like:
//
// packet_type: "log"
// log_type: str (aka, log-level)
// log_message: str
//
// packet_type: "data"
// sample_number: number (uint32)
// data_floats: [number] (float64)
//
// The "data" type will presumably change to be a "frame" with named channels
listen('device-packet', event => {
  if (event.payload.packet_type == 'log') {
    console.log("DEVICE (" + event.payload.log_type + "): " + event.payload.log_message);
  } else if (event.payload.packet_type == 'data') {
    console.log("DATA RECEIVED: " + event.payload.data_floats);
  }
})

globalThis.demo_enumerate = demo_enumerate = function() {
    invoke('enumerate_devices').then((devices) => console.log(devices));
}

// "dummy" is a special device that will send bogus data
// Currently this doesn't really return anything, but the intention is to have
// it return an object which has metadata about the device
//invoke('connect_device', { uri: "dummy://" }).then((resp) => console.log(resp))
//invoke('connect_device', { uri: "" }).then((resp) => console.log(resp))

globalThis.demo_connect = function(uri) {
    invoke('connect_device', { uri: uri }).then((resp) => console.log(resp))
}
*/

