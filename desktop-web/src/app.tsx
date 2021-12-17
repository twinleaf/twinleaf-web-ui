import React, { Component } from 'react';

export class App extends Component {

    render() {
        const a: number = foo(123);
        return <h1> This is the app </h1>;
    }
}

function foo(x: number): number {
    return 'asdf';  // this is a type error! and that shows TypeScript is working.
    // However, esbuild is not a type checker! It bundles code with type errors no problem.
}



