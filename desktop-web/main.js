
import uPlot from 'uplot';
import '@tauri-apps/api';

// TODO: not sure these jQuery things are all needed
import $ from "jquery";
import jQuery from 'jquery'
window.jQuery = jQuery

import "semantic-ui-tab";
$.fn.tab = require('semantic-ui-tab')
import "semantic-ui-dimmer";
$.fn.dimmer = require('semantic-ui-dimmer')
import "semantic-ui-transition";
$.fn.transition = require('semantic-ui-transition')
import "semantic-ui-modal";
$.fn.modal = require('semantic-ui-modal')

console.log("Starting up Twinleaf Web UI Experiment...")

//window.__TAURI__.app.getName().then((res) => console.log("Tauri App Name: " + res));

/***** semantic-ui *****/
$('#page-menu .item').tab();

$('#device-button').click(function() {
  //console.log("click...");
  $("#device-modal").modal('show');
});

/***** uPlot *****/
const windowSize = 120000;
const interval = 50;
const loop = 1000;

const data = [
    [],
    [],
    [],
    [],
    [],
];

function addData() {
    if (data[0].length == loop) {
        data[0].shift();
        data[1].shift();
        data[2].shift();
        data[3].shift();
    }

    data[0].push(Date.now());
    data[1].push(0 - Math.random());
    data[2].push(-1 - Math.random());
    data[3].push(-2 - Math.random());
}

setInterval(addData, interval);

function getSize() {
    return {
        //width: window.innerWidth - 100,
        //height: window.innerHeight / 3,
        width: 800,
        height: 400,
    }
}

const scales = {
    x: {},
    y: {
        auto: false,
        range: [-3.5, 1.5]
    }
};

const opts = {
    title: "Scrolling Data Example",
    ...getSize(),
    pxAlign: 0,
    ms: 1,
    scales,
    pxSnap: false,
    series:
    [
        {},
        {
            stroke: "red",
            paths: uPlot.paths.linear(),
            spanGaps: true,
            pxAlign: 0,
            points: { show: true }
        },
        {
            stroke: "blue",
            paths: uPlot.paths.spline(),
            spanGaps: true,
            pxAlign: 0,
            points: { show: true }
        },
        {
            stroke: "purple",
            paths: uPlot.paths.stepped({align: 1, pxSnap: false}),
            spanGaps: true,
            pxAlign: 0,
            points: { show: true }
        },
    ],
};

let u = new uPlot(opts, data, document.getElementById('uplot-chart'));

function update() {
    const now     = Date.now();
    const scale = {min: now - windowSize, max: now};

    u.setData(data, false);
    u.setScale('x', scale);

    requestAnimationFrame(update);
}

window.addEventListener("resize", e => {
    u.setSize(getSize());
});

$('#start-plotting').click(function() {
    requestAnimationFrame(update);
});

