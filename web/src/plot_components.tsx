import React, { useEffect, useRef, useState } from "react";
import uPlot from "uplot";
import {
  DataBuffer,
  fpsFormat,
  PlotUpdateMethod,
  UpdatingUPlot,
} from "./plotting";

type UPlotComponentProps = {
  dataBuffer: DataBuffer;
  options: uPlot.Options;
  paused?: boolean;
  updateMethod: PlotUpdateMethod;
  updatePlot: (u: uPlot, db: DataBuffer, el: HTMLElement) => void;
};

// All options besides paused and dataBuffer are only checked on
// component mount, changing them later has no effect.
export const UPlotComponent = (props: UPlotComponentProps) => {
  const { options, updatePlot, paused, updateMethod, dataBuffer } = props;

  const updatingPlot = useRef<UpdatingUPlot>();
  const [el, setPlotEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!el) return;
    updatingPlot.current = new UpdatingUPlot(
      el,
      dataBuffer,
      updateMethod,
      options,
      updatePlot
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
export const SpectrumPlot = ({
  dataBuffer,
  channelIndex,
  paused,
}: SpectrumPlotProps) => (
  <UPlotComponent
    dataBuffer={dataBuffer}
    updateMethod={{ method: "interval", interval: 200 }}
    paused={paused}
    options={{
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
    }}
    updatePlot={(u, dataBuffer) => {
      const { amplitudes, freqs } = dataBuffer.spectrum(channelIndex);
      u.setData([freqs, amplitudes], false);
      u.setScale("x", {
        min: 0,
        max: freqs[freqs.length - 1],
      });
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
  <UPlotComponent
    dataBuffer={dataBuffer}
    updateMethod={{ method: "animationFrame" }}
    paused={paused}
    options={{
      title: showTitle ? dataBuffer.deviceName : undefined,
      width: window.innerWidth - 40,
      height: 160,
      pxAlign: 0,
      ms: 1 as const,
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
    }}
    updatePlot={(u, dataBuffer, el) => {
      const xs = dataBuffer.getXs();
      u.setData([xs, dataBuffer.data[channelIndex]], false);
      u.setScale("x", { min: -dataBuffer.size + 1, max: 0 });
      if (showTitle) {
        (el.querySelector(".u-title")! as HTMLDivElement).innerText =
          dataBuffer.deviceName +
          " - receiving at " +
          fpsFormat(dataBuffer.observedHz()) +
          " Hz";
      }
    }}
  />
);

export type CombinedSpectrumPlotProps = {
  dataBuffer: DataBuffer;
  paused?: boolean;
};
export const CombinedSpectrumPlot = ({
  dataBuffer,
  paused,
}: CombinedSpectrumPlotProps) => {
  const colors = ["red", "green", "blue"];
  return (
    <UPlotComponent
      dataBuffer={dataBuffer}
      updateMethod={{ method: "interval", interval: 200 }}
      paused={paused}
      options={{
        width: window.innerWidth - 40,
        height: 160,
        pxAlign: 0,
        axes: [{ show: true }],
        ms: 1 as const,
        scales: { x: { time: false } },
        legend: { show: false },
        series: [
          {
            value: (self, rawValue) => rawValue.toFixed(2) + "Hz",
          },
          ...dataBuffer.channelNames.map((name, i) => ({
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
        dataBuffer.channelNames.forEach((name, i) => {
          const { amplitudes, freqs } = dataBuffer.spectrum(i);
          f = freqs; // overwrites, we'll end up with the last one
          allAmplitudes.push(amplitudes);
        });

        u.setData([f, ...allAmplitudes], false);
        u.setScale("x", {
          min: 0,
          max: f[f.length - 1],
        });
      }}
    />
  );
};
