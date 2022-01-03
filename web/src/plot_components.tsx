import React, { useEffect, useRef, useState } from "react";
import uPlot from "uplot";
import { useWidth } from "./hooks";
import { DataBuffer, fpsFormat, PlotUpdateMethod, UpdatingUPlot } from "./plotting";

/* The Plot component (capital P) can be used to add uPlots to React.
 * <Plot /> takes an object of 5 arguments (called "props" in React):
 *
 * - dataBuffer - the data buffer to use (there is currently just one at a time in the whole app)
 *
 * - options - the uPlot options for the plot - see https://github.com/leeoniya/uPlot/tree/master/docs#basics
 *   and the examples in that repository for more.
 *   Don't include width: the plot will grow horizontally to fix its containing div.
 *   Use CSS or otherwise limit the width of an element.
 *
 * - paused - a boolean for whether plotting is paused. This is the only value that can be
 *   updated live, updates to all other props will be ignored
 *
 * - updateMethod - how to update the plot: either the object { method: "animationFrame"} or
 *   the object { method: "interval", interval: 200 } where interval is in milliseconds
 *
 * - updatePLot - an update function that will be called every frame or on some interval, based on
 *   the updateMethod above. This function receives the uPlot object (which you can call setters on
 *   like plot.setData() to update the data), the DataBuffer attached to this plot, and the DOM
 *   element that is the parent of the uPlot.
 *
 * This component can be used directly, or you can make components that wrap it like
 * SpectrumPlot, TracePlot, and CombinedSpectrumPlot below.
 */

type uPlotOptionsWithoutWidth = Omit<uPlot.Options, "width">;

type PlotProps = {
  dataBuffer: DataBuffer;
  options: uPlotOptionsWithoutWidth;
  paused?: boolean;
  updateMethod: PlotUpdateMethod;
  updatePlot: (u: uPlot, db: DataBuffer, el: HTMLElement) => void;
};

// All options besides paused and dataBuffer are only checked on
// component mount, changing them later has no effect.
export const Plot = (props: PlotProps) => {
  const { options, updatePlot, paused, updateMethod, dataBuffer } = props;

  const updatingPlot = useRef<UpdatingUPlot>();
  const [el, setPlotEl] = useState<HTMLDivElement | null>(null);

  const width = useWidth(el);
  const widthRef = useRef(width);
  widthRef.current = width;

  // only the initial values of these are used
  const cantChange = useRef({ options, updateMethod, updatePlot });

  useEffect(() => {
    if (!el) return;
    const { options, updateMethod, updatePlot } = cantChange.current;
    const optionsWithWidth = { ...options, width: widthRef.current };
    const updatePlotWithWidth = (u: uPlot, db: DataBuffer, el: HTMLElement): void => {
      updatePlot(u, db, el);
      if (widthRef.current != u.width) {
        u.setSize({ width: widthRef.current, height: u.height });
      }
    };
    updatingPlot.current = new UpdatingUPlot(
      el,
      dataBuffer,
      updateMethod,
      optionsWithWidth,
      updatePlotWithWidth
    );
    return function cleanup() {
      updatingPlot.current?.destroy();
      updatingPlot.current = undefined;
      el.innerHTML = "";
    };
  }, [dataBuffer, el]);

  // when el changes, the updating plot will change
  useEffect(() => {
    if (paused) {
      updatingPlot.current?.stop();
    } else {
      updatingPlot.current?.start();
    }
  }, [paused, el, dataBuffer]);

  return <div ref={setPlotEl} style={{ width: "100%" }}></div>;
};

export type SpectrumPlotProps = {
  dataBuffer: DataBuffer;
  channelIndex: number;
  paused?: boolean;
};
export const SpectrumPlot = ({ dataBuffer, channelIndex, paused }: SpectrumPlotProps) => (
  <Plot
    dataBuffer={dataBuffer}
    updateMethod={{ method: "interval", interval: 100 }}
    paused={paused}
    options={{
      height: 160,
      pxAlign: 0,
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
    }}
    updatePlot={(u, dataBuffer) => {
      const { amplitudes, freqs } = dataBuffer.spectrum(channelIndex);
      u.setData([freqs, amplitudes], false);
    }}
  />
);

export type TracePlotProps = {
  dataBuffer: DataBuffer;
  channelIndex: number;
  color: string;
  showTitle: boolean;
  paused?: boolean;
};
export const TracePlot = ({
  dataBuffer,
  channelIndex,
  color,
  showTitle,
  paused,
}: TracePlotProps) => (
  <Plot
    dataBuffer={dataBuffer}
    updateMethod={{ method: "animationFrame" }}
    paused={paused}
    options={{
      title: showTitle ? dataBuffer.deviceName : undefined,
      height: 160,
      pxAlign: 0,
      scales: {
        x: { time: false },
        y: { auto: true },
      },
      legend: { show: false },
      series: [
        {},
        {
          stroke: color,
          spanGaps: true,
          pxAlign: 0,
          points: { show: false },
        },
      ],
      axes: [
        {
          label: "Time (s)",
        },
        {
          label: dataBuffer.channelNames[channelIndex],
        },
      ],
    }}
    updatePlot={(u, dataBuffer, el) => {
      const xs = dataBuffer.getXs();
      u.setData([xs, dataBuffer.data[channelIndex]], false);
      u.setScale("x", { min: -dataBuffer.size + 1, max: 0 });
      if (showTitle) {
        (el.querySelector(".u-title")! as HTMLDivElement).innerText =
          dataBuffer.deviceName + " - receiving at " + fpsFormat(dataBuffer.observedHz()) + " Hz";
      }
    }}
  />
);

export type CombinedSpectrumPlotProps = {
  dataBuffer: DataBuffer;
  paused?: boolean;
};
export const CombinedSpectrumPlot = ({ dataBuffer, paused }: CombinedSpectrumPlotProps) => {
  const colors = ["red", "green", "blue"];
  return (
    <Plot
      dataBuffer={dataBuffer}
      updateMethod={{ method: "interval", interval: 200 }}
      paused={paused}
      options={{
        height: 160,
        pxAlign: 0,
        axes: [{ show: true }],
        scales: {
          x: {
            time: false,
            distr: 3,
            auto: false,
            range: (_self: uPlot, initMin: number, initMax: number, _scaleKey: string) => {
              // a passthrough function here replaces the default of rounding up to the next n^2 or [1-9]*n^10
              return [initMin, initMax];
            },
          },
        },
        legend: { show: true },
        series: [
          {
            value: (_self, rawValue) => rawValue.toFixed(2) + "Hz",
          },
          ...dataBuffer.channelNames.slice(0,3).map((name, i) => ({
            stroke: colors[i % colors.length],
            label: name,
            spanGaps: true,
            pxAlign: 0,
            points: { show: false },
          })),
        ],
      }}
      updatePlot={(u, dataBuffer) => {
        const allAmplitudes: number[][] = [];
        let f: number[] = [];
        dataBuffer.channelNames.forEach((_name, i) => {
          let { amplitudes, freqs } = dataBuffer.spectrum(i);
          freqs = freqs.slice(1);
          amplitudes = amplitudes.slice(1).map((x) => (x < 0.01 ? 0.01 : x));
          f = freqs; // overwrites, we'll end up with the last one
          allAmplitudes.push(amplitudes);
        });

        u.setData([f, ...allAmplitudes], false);

        u.setScale("x", {
          min: f[0],
          max: f[f.length - 1],
        });
      }}
    />
  );
};
