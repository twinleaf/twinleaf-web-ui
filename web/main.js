import { app } from "@tauri-apps/api";
import React from "react";
import ReactDOM from "react-dom";

import { App } from "./src/app";

const TwinleafApp = React.createElement(App, {}, null);
ReactDOM.render(TwinleafApp, document.querySelector('#root'));

// In a browser, globalThis points to the window object.
globalThis.App = App;
globalThis.React = React;
globalThis.ReactDOM = ReactDOM;
