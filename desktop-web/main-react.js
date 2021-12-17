import { app } from "@tauri-apps/api";
import React, { Component } from "react";
import ReactDOM from "react-dom";

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
