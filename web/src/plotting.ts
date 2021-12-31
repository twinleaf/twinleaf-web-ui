import FFT from "fft.js";
import uPlot from "uplot";
import { DataDevicePacket, DeviceInfo } from "./api";

/*
 * DataBuffer maintains a "circular buffer" (maybe, naively it's O(n) to add
 * elements but JavaScript runtimes optimize this) of each channel of input.
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
  scheduledPlotUpdate: number;

  constructor(info: DeviceInfo, size = 1000) {
    this.deviceName = info.name;
    this.data = [];
    this.channelNames = info.channels;
    this.channelNames.forEach(() => {
      this.data.push([]);
    });
    this.size = size;
    this.positions = [];
  }
  // For interactively setting the window size.
  // Not necessary if we decide on a correct window size
  // when the DataBuffer is constructed.
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
  // Has the side effect of marking the reader as alreadySeen,
  // where it will stay until new data is received.
  // ready must be an Object (typeof reader === 'object')
  alreadySeenBy(reader: any): boolean {
    const seen = this.alreadySeen.has(reader);
    this.alreadySeen.add(reader);
    return seen;
  }
  // Should be called for every data packet delivered
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
   * This a hack for data souces which don't send timestamps
   * and send data more frequently that the refresh rate.
   * If all data source send timestamps we don't need this,
   * we can plot more honestly and stil not drop frames.
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
   * Returns x values (in units of sample number) for plotting.
   * Return value may be a reference to the data member of this class,
   * so don't modify the data in it.
   * If timeShift is true, interpolate requests for data by shifting
   * Xs to later based on the observed data ingestion rate
   * and the time delta since the last data update.
   */
  getXs = (timeShift = true): number[] => {
    if (!timeShift) return this.positions;
    const now = performance.now();
    const observedHz = this.observedHz();
    const lastDataUpdate = this.sampleReceivedTimes[this.sampleReceivedTimes.length - 1];
    if (
      timeShift &&
      lastDataUpdate &&
      observedHz &&
      this.sampleReceivedTimes.length > 30 //
    ) {
      // if the plot has seen this data already and we can
      // do an interpolated update (aka animation)
      const delta = (now - lastDataUpdate) / 1000;
      const expectedDataPoints = observedHz * delta;
      return this.positions.map((x) => x - expectedDataPoints);
    }
    return this.positions;
  };

  /*
   * Real signal processing will probably happen on the device,
   * but to get us started here's a power spectrum.
   */
  spectrum = (channel: number, n = 4096): { amplitudes: number[]; freqs: number[] } => {
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
    // very naive way to make DC go away
    amplitudes[0] = 0;

    return { freqs, amplitudes };
  };
}

export function fpsFormat(num: number) {
  return ("0000" + (Math.round(num * 10) / 10).toFixed(1)).slice(-6);
}

export type PlotUpdateMethod =
  | { method: "animationFrame" }
  | { method: "interval"; interval: number };

export class UpdatingUPlot {
  readonly el: HTMLElement;
  readonly dataBuffer: DataBuffer;
  readonly updateMethod: PlotUpdateMethod;
  readonly onUpdate: (plot: uPlot, dataBuffer: DataBuffer, el: HTMLElement) => void;

  // internal state
  plot: uPlot;
  scheduledPlotUpdate: number | undefined;
  destroyed = false;
  scheduledResizeP: Promise<void> | undefined;

  constructor(
    el: HTMLElement,
    dataBuffer: DataBuffer,
    updateMethod: PlotUpdateMethod,
    opts: uPlot.Options,
    onUpdate: (u: uPlot, db: DataBuffer, el: HTMLElement) => void
  ) {
    this.el = el;
    this.dataBuffer = dataBuffer;
    this.plot = new uPlot(opts, [[], []], el);
    this.updateMethod = updateMethod;
    this.onUpdate = onUpdate;
    this.onUpdate(this.plot, dataBuffer, el);
  }

  start = () => {
    if (this.scheduledPlotUpdate) {
      console.error("Called start on already running plot!");
      return;
    }

    if (this.updateMethod.method === "animationFrame") {
      const onAnimationFrame = () => {
        this.onUpdate(this.plot, this.dataBuffer, this.el);
        this.scheduledPlotUpdate = requestAnimationFrame(onAnimationFrame);
      };
      onAnimationFrame();
    } else if (this.updateMethod.method === "interval") {
      // casting the return value of setInterval to a number is fine,
      // in every major browser it returns a non-zero integer.
      this.scheduledPlotUpdate = setInterval(
        () => this.onUpdate(this.plot, this.dataBuffer, this.el),
        this.updateMethod.interval
      ) as unknown as number;
    }
  };
  stop = () => {
    if (!this.scheduledPlotUpdate) {
      console.error("called stop on already stopped plot!");
      return;
    }
    if (this.updateMethod.method === "animationFrame") {
      cancelAnimationFrame(this.scheduledPlotUpdate);
    } else if (this.updateMethod.method === "interval") {
      clearInterval(this.scheduledPlotUpdate);
    }
    this.scheduledPlotUpdate = undefined;
  };

  destroy = () => {
    this.stop();
    this.plot.destroy();
  };
}
