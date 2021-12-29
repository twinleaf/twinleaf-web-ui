import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import uPlot from "uplot";
import {
  API,
  APIType,
  DemoAPI,
  DeviceId,
  DeviceInfo,
  DevicePacket,
  TauriAPI,
  WebSerialAPI,
  WebSocketAPI,
} from "./api";
import { DataBuffer, MakePlot } from "./plotting";

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

    if (now > lastLog.current + 1000 && elRef.current) {
      lastLog.current = now;
      elRef.current.innerHTML = "" + renders.current.length + " FPS";
    }
  }, []);

  const setFPSRef = useCallback((el: HTMLElement | null) => {
    elRef.current = el;
    if (el) {
      el.innerHTML = renders.current.length + " FPS";
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

export const useUplot = (dataBuffer: DataBuffer, makePlot: MakePlot) => {
  const plot = useRef<ReturnType<MakePlot>>();
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

  //useWhatChanged({ dataBuffer, el }, "running create plot useEffect");
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
