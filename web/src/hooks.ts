import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import uPlot from "uplot";
import {
  API,
  APIType,
  DataDevicePacket,
  DemoAPI,
  DeviceId,
  DeviceInfo,
  DevicePacket,
  TauriAPI,
  WebSerialAPI,
  WebSocketAPI,
} from "./api";

const buildApi = (apiType: APIType): API => {
  if (apiType === "Demo") return DemoAPI; // stateless
  if (apiType === "Tauri") return TauriAPI; // stateless
  if (apiType === "WebSerial") return WebSerialAPI.getInstance();
  if (apiType === "WebSocket") return WebSocketAPI.getInstance(); // TODO this may need connection details?
  throw new Error("Unknown API Type " + apiType);
};

export const useAPI = (
  initial?: APIType
): { api: API; changeAPIType: (apiType: APIType) => void } => {
  const [apiType, setApiType] = useState<APIType>(() => {
    if (initial) return initial;
    if (typeof window.__TAURI__ !== "undefined") return "Tauri";
    return "Demo";
  });
  const api = useMemo(() => buildApi(apiType), [apiType]);

  return { api, changeAPIType: setApiType };
};

export type LogEntry = {
  log_type: string; // TODO
  log_message: string;
};

export const useLogs = (
  capacity: number
): [LogEntry[], (msg: LogEntry) => void, () => void] => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const addLogMessage = useCallback((msg: LogEntry) => {
    // TODO
    setLogs((logs) => {
      if (logs.length >= capacity) {
        return [...logs.slice(1), msg];
      }
      return [...logs, msg];
    });
  }, []);
  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return [logs, addLogMessage, clearLogs];
};

// always make a new buffer when switching devices
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
    this.positions = [...Array(size).keys()].map((x) => x - size);
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
      this.positions.unshift(this.positions[0] - 1);
    }
  };
  observedHz = (n = 1000) => {
    if (!this.sampleReceivedTimes.length) return 0;
    const lastN = this.sampleReceivedTimes.slice(-(n + 1));
    const dt = lastN[lastN.length - 1] - lastN[0];
    const fps = ((lastN.length - 1) / dt) * 1000;
    return fps;
  };
}

export const useDevices = (
  api: API,
  addLogMessage: (e: LogEntry) => void
): {
  connect: (id: DeviceId) => Promise<void>;
  connectedDevice: string | undefined;
  dataBuffer: DataBuffer | undefined;
  devices: Record<DeviceId, DeviceInfo | undefined>;
  disconnect: () => Promise<void>;
  updateDevices: () => void;
} => {
  const [devices, setDevices] = useState<
    Record<DeviceId, DeviceInfo | undefined>
  >({});
  const [connectedDevice, setConnectedDevice] = useState<
    DeviceId | undefined
  >();
  const stopListening = useRef<() => void>();
  const dataBuffer = useRef<DataBuffer>();
  const disconnect = async () => {
    stopListening.current && stopListening.current();
    await api.disconnect();
    setConnectedDevice(undefined);
  };
  const connect = async (deviceId: DeviceId) => {
    // TODO this isn't reentrant, we need another state bit for "busy" to hide the buttons and/or return early
    if (connectedDevice) {
      stopListening.current && stopListening.current();
      await api.disconnect();
      setConnectedDevice(undefined);
    }
    const info = await api.connectDevice(deviceId);
    setConnectedDevice(deviceId);
    setDevices((devices) => ({ ...devices, [deviceId]: info }));

    dataBuffer.current = new DataBuffer(info, 1000);

    const onPacket = (packet: DevicePacket) => {
      if (packet.packet_type === "data") {
        dataBuffer.current!.addFrame(packet);
      } else if (packet.packet_type === "log") {
        addLogMessage({
          log_type: packet.log_type,
          log_message: packet.log_message,
        });
      } else {
        throw new Error("received unknown packet type");
      }
    };

    stopListening.current = await api.listenToPackets(onPacket);
    return;
  };

  // warning: not reentrant!
  const updateDevices = async () => {
    await disconnect();
    setDevices({});
    const deviceIds = await api.enumerateDevices();
    const devices = Object.fromEntries(deviceIds.map((id) => [id, undefined]));
    setDevices(devices);
    // we could connect+disconnect each devices here to update deviceInfo, but only if
    // it's safe to connect to arbitrary devices, which may not be Twinleaf devices.
  };

  // Update the reference in the useEffect closure;
  const updateDevicesRef = useRef(updateDevices);
  updateDevicesRef.current = updateDevices;
  useEffect(() => {
    updateDevicesRef.current();
    // every time api changes, call updateDevices
  }, [api]);

  return {
    connect,
    devices,
    disconnect,
    connectedDevice,
    dataBuffer: dataBuffer.current,
    updateDevices,
  };
};

// useRAF means use requestAnimationFrame to guess FPS
export const useFPS = (
  useRAF = false
): {
  reportFrame: () => void;
  setFPSRef: (el: HTMLElement | null) => void;
} => {
  let renders = useRef<number[]>([]);
  let lastLog = useRef<number>(performance.now());
  let elRef = useRef<HTMLElement | null>(null);

  const reportFrame = useCallback(() => {
    const now = performance.now();
    renders.current.push(now);
    renders.current = renders.current.filter((t) => t > now - 1000);

    if (performance.now() > lastLog.current + 1000 && elRef.current) {
      elRef.current.innerHTML = "" + renders.current.length;
    }
  }, []);

  const setFPSRef = useCallback((el: HTMLElement | null) => {
    elRef.current = el;
    if (el) {
      el.innerHTML = "" + renders.current.length + " FPS";
    }
  }, []);

  useEffect(() => {
    if (useRAF) {
      let requestId: ReturnType<typeof requestAnimationFrame>;
      const onRaf = () => {
        reportFrame();
        requestId = requestAnimationFrame(onRaf);
      };
      onRaf();
      return function cleanup() {
        cancelAnimationFrame(requestId);
      };
    }
    return;
  }, [reportFrame]);

  return { reportFrame, setFPSRef };
};

// For debugging, prints which prop changes caused a rerender
export const useWhatChanged = (
  props: Record<string, any>,
  label: string = ""
) => {
  const changed = [];
  const prev = useRef<Record<string, any>>();
  if (!prev.current) {
    prev.current = props;
    return;
  }
  for (const prop of Object.keys(props)) {
    if (props[prop] !== prev.current[prop]) {
      changed.push(prop);
    }
  }
  if (changed.length) {
    console.log("Props for", label, "changed!");
    for (const prop of changed) {
      console.log(prop, "was", prev.current[prop], "and is now", props[prop]);
    }
  }

  prev.current = props;
};

export const useUplot = (dataBuffer: DataBuffer) => {
  const plot = useRef<ReturnType<typeof makePlot>>();
  const [plotting, setPlotting] = useState(false);
  const [el, setPlotEl] = useState<HTMLDivElement | null>(null);

  const start = () => {
    if (!plot.current?.start) return;
    plot.current.start();
    setPlotting(true);
  };
  const stop = () => {
    setPlotting(false);
    plot.current?.stop && plot.current.stop();
  };

  useWhatChanged({ dataBuffer, el }, "running create plot useEffect");
  useEffect(() => {
    if (el) {
      plot.current = makePlot(el, dataBuffer);
      start();
      return function cleanup() {
        plot.current?.destroy();
        plot.current = undefined;
        el.innerHTML = "";
      };
    }
    return;
  }, [dataBuffer, el]);
  return { setPlotEl, start, stop, plotting };
};

/*
 * The plot does not participate in React redraws.
 * Be sure to call destroy when the DOM element disappears.
 */
export function makePlot(
  el: HTMLElement,
  dataBuffer: DataBuffer
): { plot: uPlot; start: () => void; stop: () => void; destroy: () => void } {
  function getSize() {
    // TODO use el.clientWidth in the future + a resizeObserver
    return {
      width: window.innerWidth - 100,
      height: Math.floor((window.innerWidth - 100) / 3),
    };
  }

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

  let u = new uPlot(opts, [dataBuffer.positions, ...dataBuffer.data], el);

  function fpsFormat(num: number) {
    return ("0000" + (Math.round(num * 10) / 10).toFixed(1)).slice(-6);
  }

  let scheduledPlotUpdate: ReturnType<typeof requestAnimationFrame>;
  function update() {
    if (dataBuffer.alreadySeenBy(u)) {
      scheduledPlotUpdate = requestAnimationFrame(update);
      return;
    }

    const scale = {
      min: Math.min(dataBuffer.positions[0], -dataBuffer.size + 1),
      max: 0,
    };

    u.setData([dataBuffer.positions, ...dataBuffer.data], false);
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
}
