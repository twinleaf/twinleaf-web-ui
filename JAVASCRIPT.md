## Tools

This Twinleaf app uses

- React
- TypeScript
- Semantic UI
- uPlot
- esbuild
- JSX

## Motivation

In order to support dynamic configuration of the application, static HTML
plus some CSS to make it look nice isn't enough. HTML is just an initial
state for the DOM, the dynamic version of HTML where every tag becomes a
manipulable object. Entirely new DOM elements can be created in JavaScript
with code like:

```
document.getElementById('foo').innerHTML = '<h1>I'm dynamic</hi>';
```

Dynamic web applications generally have very little HTML but lots of JS.
A UI library called React is used to "render" JavaScript data structures
representing DOM elements onto a web page.

Once you start dymamically creating DOM elements the code starts to get messy.
React is also used to write the event callbacks (onclick etc.) which now need
to be added to these DOM elements and wired up to talk to other DOM elements.
React provides tansactional transitions between UI states which dramatically
reduces the number of states in a web app's state machine.

Dynamic languages are hard, so most frontend developers today use TypeScript.
Typescripts is a tool for you, the programmer. When the code is compiled
into a single file (this is usually called "bundling," not compiling) by esbuild,
the types are ignored. The whole point of the types is to use an editor / IDE
that understands and checks them. Similar to runnning unit tests, it's common
run a type checker (tsc is the name of the TypeScript compiler, AKA our type
checker) in CI on GitHub, but it's really more useful as an editor integration.
tsc can output compiled JavaScript, but we don't use tsc for that in this project.
If you don't have an editor / IDE set up for TypeScript, I recommend VSCode.

When describing heirarchies of DOM elements it's convenient to use a syntax
that looks more like HTML. Since most JavaScript is compiled anyway, using a
new language isn't such a reach.

## Linting

I used a code formatter called Prettier while writing this, you're welcome to
use it too. I use a linter called ESLint. You can install these as extensions
in VSCode for in-editor formatting and linting.

## JavaScript Performance notes

Browsers are reactors, there aren't really mainloops in JavaScript code.
There are two mainloop-ish things going on though, two ways that things update.

1. React - when users click or other events that let React know something may have changd, React "renders" (runs the code in the React component tree) to find out what the next UI state should look like and then "commits" it (does a transactional render) to make the screen look that way. The entire page EXCEPT for the plots and the FPS counter is run by React.
2. Immediate mode code: some code runs every animation frame, usually 30-120 times per second. The plots are rendered this way.

React doesn't notice DOM changes that it didn't cause, so care has to be taken to prevent React from stomping over our plots.

There's just one thread, so these don't interrupt each other. If a React render + commit (
There are two "mainloops" running simultaneously in this app

By doing all graphing in a separate requestAnimationFrame loop, the React
code shouldn't need to be optimized. Avoiding useMemo, useCallback etc. hooks
(tricks to make React renders more efficient) hopefully makes the code more accessible.

## Tauri API

```
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
```
