import { app } from "@tauri-apps/api";
import React from "react";
import ReactDOM from "react-dom";


// This is the normal way to include react semantic ui css, but
// loading from html avoids needing esbuild binary loaders.
// import "semantic-ui-css/semantic.css";

import { App } from "./src/app";

// In a browser, globalThis points to the window object.
globalThis.App = App;
globalThis.React = React;
globalThis.ReactDOM = ReactDOM;

