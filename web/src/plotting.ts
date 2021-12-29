import FFT from "fft.js";
import uPlot from "uplot";
import { DataDevicePacket, DeviceInfo } from "./api";

/*
 * DataBuffer maintains a "circular buffer" (maybe, naively it's O(n) to add elements
 * but JavaScript runtimes optimize this) of each channel of input.
 * It also
 * - keeps track of whether it is dirty wrt a given reader
 * - records when frames of data were received to estimate data rate in Hz
 * - calculates power spectra for individual channels
 *
 * The mostly change required here: if data packets include timestamps,
 * those should be recorded here, replacing the .positions array and
 * making the observedHz calculation obsolete.
 */
export class DataBuffer {
  size: number;
  data: number[][];
  sampleNums: number[] = [];
  positions: number[] = [];
  deviceName: string;
  channelNames: string[];
  sampleReceivedTimes: number[] = [];
  alreadySeen: WeakSet<any> = new WeakSet();
  constructor(info: DeviceInfo, size = 1000) {
    this.deviceName = info.name;
    this.data = [];
    this.channelNames = info.channels;
    for (const _ of this.channelNames) {
      this.data.push([]);
    }
    this.size = size;
    this.positions = [];
  }
  setWindowSize(size: number) {
    this.size = size;
    for (let i = 0; i < this.channelNames.length; i++) {
      this.data[i] = this.data[i].slice(-size);
    }
    this.sampleReceivedTimes = this.sampleReceivedTimes.slice(-size);
    this.sampleNums = this.sampleNums.slice(-size);
    this.positions = [...Array(this.sampleNums.length).keys()].map(
      (x) => x - this.sampleNums.length
    );
    this.alreadySeen = new WeakSet();
  }
  alreadySeenBy(reader: Object): boolean {
    const seen = this.alreadySeen.has(reader);
    this.alreadySeen.add(reader);
    return seen;
  }
  addFrame = (frame: DataDevicePacket) => {
    this.alreadySeen = new WeakSet();
    for (let i = 0; i < this.channelNames.length; i++) {
      this.data[i].push(frame.data_floats[i]);
      if (this.data[i].length > this.size) this.data[i].shift();
    }
    this.sampleReceivedTimes.push(performance.now());
    this.sampleNums.push(frame.sample_number);
    if (this.sampleNums.length > this.size) {
      this.sampleNums.shift();
      this.sampleReceivedTimes.shift();
    }
    while (this.positions.length < this.sampleNums.length) {
      this.positions.unshift((this.positions[0] || 0) - 1);
    }
  };

  /*
   * This is a hack for data souces which don't send timestamps
   * and send data more frequently that the refresh rate.
   * If all data source send timestamps we can plot more honestly
   * and stil not drop frames;
   */
  observedHz = (n = 1000) => {
    if (!this.sampleReceivedTimes.length) return 0;
    const lastN = this.sampleReceivedTimes.slice(-(n + 1));
    const dt = lastN[lastN.length - 1] - lastN[0];
    // this math is broken for bunched/bundled delivery of packets
    const fps = ((lastN.length - 1) / dt) * 1000;
    if (isFinite(fps)) return fps;
    return 0;
  };

  /*
   * Real signal processing will probably happen on the device,
   * but to get us started here's a power spectrum.
   */
  fft = (
    channel: number,
    n = 4096
  ): { amplitudes: number[]; freqs: number[] } => {
    const d = this.data[channel];
    const size = 2 ** Math.floor(Math.log2(Math.min(d.length, n)));
    const hz = this.observedHz();
    if (size < 1 || !hz) return { amplitudes: [], freqs: [] };
    const fft = new FFT(size);

    // Hann window for spectral leakage
    const input = d.slice(-size);
    for (let i = 0; i < size; i++) {
      const m = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (size - 1)));
      input[i] = m * input[i];
    }
    const out = fft.createComplexArray();
    fft.realTransform(out, input);

    const freqs = [];
    const amplitudes = [];
    for (let i = 0; i < size / 2; i++) {
      const re = out[2 * i];
      const im = out[2 * i + 1];
      amplitudes.push(Math.sqrt(re * re + im * im));
      freqs.push((i * hz) / size);
    }
    return { freqs, amplitudes };
  };
}

function getSize() {
  // TODO - use size of the container instead of window
  // Currently size is hardcoded to match the window, which won't
  // work for layouts that don't display plots at full width.
  // Instead, this should grow to fill the space of its container
  // using el.clientWidth + a ResizeObserver.
  return {
    width: window.innerWidth - 40,
    height: Math.floor((window.innerWidth - 40) / 3),
  };
}

function fpsFormat(num: number) {
  return ("0000" + (Math.round(num * 10) / 10).toFixed(1)).slice(-6);
}

// Given a DOM element, stick a stateful uPlot in it and return controls for it
export type MakePlot = (
  el: HTMLElement,
  db: DataBuffer
) => {
  plot: uPlot;
  start: () => void;
  stop: () => void;
  destroy: () => void;
};
export const makePlot: MakePlot = (el: HTMLElement, dataBuffer: DataBuffer) => {
  const scales = {
    x: {
      //range: [0, dataBuffer.size] as [number, number],
      time: false,
    },
    y: {
      auto: false,
      range: [-1, 1] as [number, number],
    },
  };

  const colors = ["red", "green", "blue", "yellow", "orange", "purple"];

  const opts: uPlot.Options = {
    title: dataBuffer.deviceName,
    ...getSize(),
    pxAlign: 0,
    ms: 1 as const,
    scales,
    series: [
      {},
      ...dataBuffer.channelNames.map((name, i) => ({
        stroke: colors[i % colors.length],
        //        paths: uPlot.paths.points!(),
        spanGaps: true,
        pxAlign: 0,
        points: { show: false },
        label: name,
      })),
    ],
  };

  const u = new uPlot(opts, [dataBuffer.positions, ...dataBuffer.data], el);

  let scheduledPlotUpdate: ReturnType<typeof requestAnimationFrame>;
  let lastDataUpdate = 0;
  function update(t = performance.now()) {
    const observedHz = dataBuffer.observedHz();
    let xs = dataBuffer.positions;
    if (
      observedHz &&
      dataBuffer.sampleReceivedTimes.length > 30 &&
      dataBuffer.alreadySeenBy(u)
    ) {
      // if the plot has seen this data already and we can,
      // do an interpolated update (aka animation)
      const delta = (t - lastDataUpdate) / 1000;
      const expectedDataPoints = observedHz * delta;
      xs = dataBuffer.positions.map((x) => x - expectedDataPoints);
    } else {
      lastDataUpdate = t;
    }

    const scale = {
      min: -dataBuffer.size + 1,
      max: 0,
    };

    u.setData([xs, ...dataBuffer.data], false);
    u.setScale("x", scale);
    (el.querySelector(".u-title")! as HTMLDivElement).innerText =
      dataBuffer.deviceName +
      " - receiving at " +
      fpsFormat(dataBuffer.observedHz()) +
      " Hz";

    scheduledPlotUpdate = requestAnimationFrame(update);
  }

  let plotStillExists = true;
  let scheduledResizeP: Promise<void> | undefined;
  function onWindowResize() {
    if (scheduledResizeP) return;
    scheduledResizeP = new Promise(async (r) => {
      await new Promise((r) => setTimeout(r, 100));
      scheduledResizeP = undefined;
      if (!plotStillExists) return;
      u.setSize(getSize());
    });
  }

  window.addEventListener("resize", onWindowResize);

  function stopUpdating() {
    cancelAnimationFrame(scheduledPlotUpdate);
  }

  function destroy() {
    stopUpdating();
    window.removeEventListener("resize", onWindowResize);
    u.destroy();
  }

  return { plot: u, start: update, stop: stopUpdating, destroy };
};

// This is a function that returns a function
export const makeFFTPlot =
  (channelIndex: number): MakePlot =>
  (el: HTMLElement, dataBuffer: DataBuffer) => {
    const u = new uPlot(
      {
        width: window.innerWidth - 40,
        height: 160,
        pxAlign: 0,
        axes: [{ show: true }],
        ms: 1 as const,
        scales: { x: { time: false } },
        legend: { show: false },
        series: [
          {},
          {
            stroke: "black",
            spanGaps: true,
            pxAlign: 0,
            points: { show: false },
          },
        ],
      },
      [dataBuffer.positions, ...dataBuffer.data],
      el
    );

    let scheduledPlotUpdate: ReturnType<typeof requestAnimationFrame>;
    function update() {
      const observedHz = dataBuffer.observedHz();
      if (dataBuffer.alreadySeenBy(u) || !observedHz) {
        scheduledPlotUpdate = requestAnimationFrame(update);
        return;
      }

      const { amplitudes, freqs } = dataBuffer.fft(channelIndex);
      u.setData([freqs, amplitudes], false);
      u.setScale("x", {
        min: 0,
        max: freqs[freqs.length - 1],
      });

      scheduledPlotUpdate = requestAnimationFrame(update);
    }
    let plotStillExists = true;
    let scheduledResizeP: Promise<void> | undefined;
    function onWindowResize() {
      if (scheduledResizeP) return;
      scheduledResizeP = new Promise(async (r) => {
        await new Promise((r) => setTimeout(r, 100));
        scheduledResizeP = undefined;
        if (!plotStillExists) return;
        u.setSize({ width: window.innerWidth - 40, height: 160 });
      });
    }
    window.addEventListener("resize", onWindowResize);

    function stopUpdating() {
      cancelAnimationFrame(scheduledPlotUpdate);
    }

    function destroy() {
      stopUpdating();
      window.removeEventListener("resize", onWindowResize);
      u.destroy();
    }

    return { plot: u, start: update, stop: stopUpdating, destroy };
  };
