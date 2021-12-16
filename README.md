
NOTE: This is experimental, not a product

## Setup Development Environment

This is a polyglot project, speaking Rust and Javascript, which means there are
multiple language build systems and dependency management tools.

The large dependencies for development are:

- Rust (rustlang) toolchain (let's say v1.50+ stable)
- Node.js (including npm)

One set of paths to install the first two are `rustup` (for Rust) and `nvm`
(for Node.js ecosystem, including `npm`).


### Tauri CLI Tool

It isn't strictly necessary to have the Tauri CLI tool installed, but it was
used to set the project up and may be handy.

There is a Rust version, and a Javascript version that wraps the Rust version.
If you install the Javascript version, it just downloads a compiled copy of the
Rust binary. But then it ends up in `node_modules/`, and pulls in a ton of
other things.

You can also install it locally to your user, via the Rust toolchain, but this
can take a fairly long time to compile (10+ minutes):

    # NOTE: this command, from the docs, does not work
    # cargo install tauri-cli --version 1.0.0-beta.7

    # This should work
    cargo install tauri-cli --git https://github.com/tauri-apps/tauri

UPDATE: one way forward is to install tauri-cli as a *global* package; that way
it does not add many dependencies to the local project:

    npm install -g @tauri-apps/cli

## Development Basics

Check that tools are installed, and fetch node/npm depdendencies:

    make deps

Run these commands in separate terminal windows to do file edit watching and
auto-reloading/recompile of both the Rust application and Javascript bundle:

    make dev-js

    # this requires the Tauri Rust CLI
    make dev-tauri

From within the app window, in dev/debug mode, if you right click you get
options for "reload" and "Inspect Element"; the later will open browser-style
developer tools inside the application. Every time you reload, the bundle gets
recompiled and the web part of the application is restarted.

Run Rust tests (if any):

    make test

Do a development build of the application:

    make build

Do a release binary build of the application (with size optimizations):

    make build-release

Make installable bundles for the current platform:

    make bundle
