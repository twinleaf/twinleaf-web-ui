import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  if (apiType === "WebSerial") return new WebSerialAPI();
  if (apiType === "WebSocket") return new WebSocketAPI(); // TODO this may need connection details?
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
  deviceName: string;
  channelNames: string[];
  sampleReceivedTimes: number[] = [];
  constructor(info: DeviceInfo, size = 1000) {
    this.deviceName = info.name;
    this.data = [];
    this.channelNames = info.channels;
    for (const _ of this.channelNames) {
      this.data.push([]);
    }
    this.size = size;
  }
  addFrame = (frame: DataDevicePacket) => {
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
  };
  observedHz = (n = 200) => {
    if (!this.sampleReceivedTimes.length) return 0;
    const lastN = this.sampleReceivedTimes.slice(-(n + 1));
    const dt = lastN[lastN.length - 1] - lastN[0];
    const fps = ((lastN.length - 1) / dt) * 1000;
    return fps;
  };
}

export const useConnectedDevice = (
  api: API,
  addLogMessage: (e: LogEntry) => void
): {
  connect: (id: DeviceId) => Promise<void>;
  disconnect: () => Promise<void>;
  connectedDevice: string | undefined;
  dataBuffer: DataBuffer | undefined;
} => {
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

    dataBuffer.current = new DataBuffer(info, 1000);

    const onPacket = (packet: DevicePacket) => {
      if (packet.packet_type === "data") {
        dataBuffer.current!.addFrame(packet);
      } else if (packet.packet_type === "log") {
        console.log("log packet:", packet.log_type, packet.log_message);
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
  return {
    connect,
    disconnect,
    connectedDevice,
    dataBuffer: dataBuffer.current,
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
