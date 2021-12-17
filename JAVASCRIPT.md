If you're a front-end developer, you may still want to read this
in order to understand some unusual choices make in the app
to try to make it more accessible to programmers less familiar
with modern front-end development practices.

## Tools
This Twinleaf app uses
* React
* TypeScript
* Semantic UI
* uPlot
* esbuild
* JSX

## Motivation
In order to support dynamic configuration of the application, static HTML
plus some CSS to make it look nice isn't enough. JavaScript can dynamically
create HTML with code like

```
document.getElementById('foo').innerHTML = '<h1>I'm dynamic</hi>';
```

A UI library called React is used to "render" JavaScript datastructures
representing DOM elements (what we call H1, div, etc.) onto the web page.

Once you start dymamically creating DOM elements the code starts to get messy.
React is also used to write the event callbacks (onclick etc.) which now need
to be added to these DOM elements and wired up to talk to other DOM elements.

Dynamic languages are hard, so most frontend developers today use TypeScript.
Typescripts is a tool for you, the programmer. When the code is compiled
into a single file (this is usually called "bundling," not compiling) by esbuild,
the types are ignored. The whole point of the types is to use an editor / IDE
that understands and checks them. Similar to runnning unit tests, it's common
run a type checker (tsc is the name of the TypeScript compiler, AKA our type
checker) in CI on GitHub. tsc can output compiled JavaScript, but we don't use
tsc for that in this project.

When describing heirarchies of DOM elements it's convenient to use a syntax
that looks more like HTML. Since most JavaScript is compiled anyway, using a
new language isn't such a reach.

## Avoiding writing TypeScript or JSX

You can intermix .js and .ts files, but most of the React components do use
JSX. To customize the app without touching JSX or TypeScript, you can 

## JavaScript Performance notes

By doing all graphing in a separate requestAnimationFrame loop, the React
code shouldn't need to be optimized. Avoiding useMemo, useCallback etc. hooks
hopefully makes the code more accessible.
