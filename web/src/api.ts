// The Twinleaf API for talking to devices via
// - the rust proxy in the Tauri app
// - demo devices in-browser, no external communication
// - the WebSerial API
// - a WebSocket

import { invoke } from "@tauri-apps/api";
import { Event as TauriEvent, listen as TauriListen } from "@tauri-apps/api/event";

export type LogDevicePacket = {
  packet_type: "log";
  log_type: string; // TODO at least "warn" is allowed
  log_message: string;
};

export type DataDevicePacket = {
  packet_type: "data";
  timestamp: number;
  sample_number: number;
  data_floats: number[];
};

export type DevicePacket = LogDevicePacket | DataDevicePacket;
export type DeviceId = string;
export type DeviceDesc = {
  url: string;
  desc: string;
};
export type DeviceInfo = {
  channels: string[];
  name: string;
  initialRate: number;
};

export type APIType = "Tauri" | "Demo";

export interface API {
  type: APIType;
  // the unlisten function returned by listenToPackets is synchronous
  listenToPackets: (cb: (packet: DevicePacket) => void) => Promise<() => void>;
  enumerateDevices: () => Promise<DeviceDesc[]>;
  connectDevice: (uri: string) => Promise<DeviceInfo>;
  disconnect: () => Promise<void>;
  data_rate: (value: number) => Promise<number>
}

export const TauriAPI: API = {
  type: "Tauri",
  listenToPackets: (cb: (packet: DevicePacket) => void) => {
    return TauriListen("device-packet", (event: TauriEvent<DevicePacket>) => {
      if (event.payload.packet_type == "log") {
        const { log_type, log_message } = event.payload;
        console.log("DEVICE (" + log_type + "): " + log_message);
      }
      return cb(event.payload);
    });
  },
  enumerateDevices: async () => {
    const resp: DeviceDesc[] = await invoke("enumerate_devices");
    console.log(resp);
    return resp;
  },
  connectDevice: async (uri: string) => {
    const loc = { uri };
    const resp: DeviceInfo = await invoke("connect_device", loc);
    console.log(resp);
    return resp;
  },
  disconnect: async () => {
    await invoke("disconnect");
  },
  data_rate: async (value: number | null) => {
    const rate: number = await invoke("data_rate", {value: value});
    return rate;
  },
};

// Demo API - just for testing and demonstration
function randn_bm(): number {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  num = num / 10.0 + 0.5;
  if (num > 1 || num < 0) return randn_bm();
  return num;
}

let demoInterval = 100;
let demoPacketsPerInterval = 10;
let demoT0 = 0;
let demoSent = 0;
let demoOrientationConnected = false;
let demoOrientationCb: undefined | ((packet: DevicePacket) => void);
let demoSampleNumber = 0;
function handleOrientation(e: DeviceOrientationEvent) {
  if (demoOrientationCb && e.alpha !== null && e.beta !== null && e.gamma !== null) {
    demoOrientationCb({
      packet_type: "data",
      timestamp: demoSampleNumber++,
      sample_number: demoSampleNumber++,
      data_floats: [e.alpha / 360, e.beta / 180, e.gamma / 180],
    });
  }
}
export const DemoAPI: API = {
  type: "Demo",
  listenToPackets: (cb: (packet: DevicePacket) => void) => {
    demoSampleNumber = 0;

    if (demoOrientationConnected) {
      demoOrientationCb = cb;
      return Promise.resolve(function stopListening() {
        demoOrientationCb = undefined;
      });
    }

    const sendDataPacket = () =>
      cb({
        packet_type: "data",
        timestamp: demoSampleNumber++,
        sample_number: demoSampleNumber++,
        data_floats: [
          2 * randn_bm() - 1,
          1 * randn_bm() - 0.5 + Math.sin(demoSampleNumber / (2 * Math.PI)) * 0.5,
          Math.sin(demoSampleNumber / (2 * Math.PI) / 3) * 0.3 + 0.2,
        ],
      });
    const sendLogPacket = () =>
      cb({
        packet_type: "log",
        log_type: "warn",
        log_message: "This is a log message",
      });

    const send = () => {
      sendLogPacket();
      const now = performance.now();
      if (demoT0 === 0) demoT0 = now;
      const delta = now - demoT0;
      let toSend = Math.round((delta * demoPacketsPerInterval) / demoInterval) - demoSent;
      demoSent += toSend;
      if (toSend > 100000) {
        console.log("Demo data generation too far behind, giving up");
        demoT0 = performance.now();
        demoSent = 0;
        toSend = 0;
      }
      for (let i = 0; i < toSend; i++) {
        sendDataPacket();
      }
    };
    const stopListening = () => {
      console.log("clearing timeout for fake demo data generation");
      clearInterval(timer);
    };

    const timer = setInterval(send, demoInterval);
    return Promise.resolve(stopListening);
  },

  enumerateDevices: async (): Promise<DeviceDesc[]> => {
    await new Promise((r) => setTimeout(r, 100));
    return Promise.resolve([
      {url:"dummy 10Hz", desc: ""},
      {url:"dummy 100Hz", desc: ""},
      {url:"dummy 1000Hz", desc: ""},
      ...("ontouchstart" in window || window.location.hostname === "localhost"
        ? [{url:"device orientation (requires mobile device)",desc: ""}]
        : []),
    ]);
  },
  connectDevice: async (uri: string): Promise<DeviceInfo> => {
    let channels = ["dummy.x", "dummy.y", "dummy.z"];
    if (uri.includes("10Hz")) {
      demoInterval = 500;
      demoPacketsPerInterval = 5;
    } else if (uri.includes("100Hz")) {
      demoInterval = 100;
      demoPacketsPerInterval = 10;
    } else if (uri.includes("1000Hz")) {
      demoInterval = 20;
      demoPacketsPerInterval = 20;
    } else if (uri.includes("orientation")) {
      if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
        await (DeviceOrientationEvent as any).requestPermission();
      }
      window.addEventListener("deviceorientation", handleOrientation, true);
      demoOrientationConnected = true;
      channels = ["alpha", "beta", "gamma"];
    } else {
      throw new Error("Demo API can only connect to dummy data source");
    }

    demoSent = 0;
    demoT0 = 0;
    await new Promise((r) => setTimeout(r, 100));

    return Promise.resolve({
      name: "demo '" + uri + "'",
      channels,
      initialRate: 20,
    });
  },
  disconnect: () => {
    window.removeEventListener("deviceorientation", handleOrientation);
    demoOrientationConnected = false;
    return Promise.resolve();
  },
  data_rate: async (value: number) => {return value;},
};

/////////////////////////////////////////////////////////////////
// There was discussion of a WebSerial API
// export class WebSerialAPI implements API {
//   // class because I'm guessing we'll need some state
//   type = "WebSocket" as const;
//   static instance: WebSerialAPI;
//   static getInstance() {
//     if (!this.instance) {
//       this.instance = new WebSerialAPI();
//     }
//     return this.instance;
//   }
//   async listenToPackets(_cb: (packet: DevicePacket) => void) {
//     // WebSerial stuff
//     throw new Error("not implemented");
//     return Promise.resolve(function cleanup() {});
//   }
//   enumerateDevices() {
//     throw new Error("not implemented");
//     return Promise.resolve([]);
//   }
//   connectDevice(_uri: string) {
//     throw new Error("not implemented");
//     return Promise.resolve({ name: "TODO", channels: ["TODOa"] });
//   }
//   async disconnect() {
//     throw new Error("not implemented");
//   }
//   async data_rate() {
//     throw new Error("not implemented");
//   }
// }

/////////////////////////////////////////////////////////////////
// There was discussion of a ws API, websockets were implemented
// // on some hardware.
// export class WebSocketAPI implements API {
//   // class because I'm guessing we'll need some state
//   type = "WebSocket" as const;
//   static instance: WebSocketAPI;
//   static getInstance() {
//     if (!this.instance) {
//       this.instance = new WebSocketAPI();
//     }
//     return this.instance;
//   }
//   async listenToPackets(_cb: (packet: DevicePacket) => void) {
//     // WebSocket stuff
//     throw new Error("not implemented");
//     return Promise.resolve(function cleanup() {});
//   }
//   enumerateDevices() {
//     throw new Error("not implemented");
//     return Promise.resolve([]);
//   }
//   connectDevice(_uri: string) {
//     throw new Error("not implemented");
//     return Promise.resolve({ name: "TODO", channels: ["TODOa"] });
//   }
//   async disconnect() {
//     throw new Error("not implemented");
//   }
//   async data_rate() {
//     throw new Error("not implemented");
//   }
// }
