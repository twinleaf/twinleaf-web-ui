// The Twinleaf API for talking to devices via
// - the WebSerial API
// - the rust proxy in the Tauri app

import { invoke } from "@tauri-apps/api";
import {
  Event as TauriEvent,
  listen as TauriListen,
} from "@tauri-apps/api/event";

export type LogDevicePacket = {
  packet_type: "log";
  log_type: string; // TODO
  log_message: string;
};

export type DataDevicePacket = {
  packet_type: "data";
  sample_number: number; // uint32
  data_floats: number[]; // TODO what is this?
};

export type DevicePacket = LogDevicePacket | DataDevicePacket;
export type DeviceId = string;
export type DeviceInfo = {
  channels: string[];
  name: string;
};

export type APIType = "Tauri" | "WebSerial" | "WebSocket" | "Demo";

export interface API {
  type: APIType;
  // the unlisten function returned by listenToPackets is synchronous
  listenToPackets: (cb: (packet: DevicePacket) => void) => Promise<() => void>;
  enumerateDevices: () => Promise<DeviceId[]>;
  connectDevice: (uri: string) => Promise<DeviceInfo>;
  disconnect: () => Promise<void>;
}

export const TauriAPI: API = {
  type: "Tauri",
  listenToPackets: (cb: (packet: DevicePacket) => void) => {
    return TauriListen("device-packet", (event: TauriEvent<DevicePacket>) => {
      if (event.payload.packet_type == "log") {
        console.log(
          "DEVICE (" +
            event.payload.log_type +
            "): " +
            event.payload.log_message
        );
      }
      return cb(event.payload);
    });
  },
  enumerateDevices: async () => {
    const resp = await invoke("enumerate_devices");
    console.log(resp);
    return resp as any[]; // just hoping
  },
  connectDevice: async (uri: string) => {
    const resp: DeviceInfo = await invoke("connect_device", {
      uri: "dummy://",
    });
    console.log(resp);
    return resp;
  },
  disconnect: async () => {
    const resp = await invoke("disconnect");
    console.log(resp);
  },
};

export const DemoAPI: API = {
  type: "Demo",
  listenToPackets: (cb: (packet: DevicePacket) => void) => {
    let sampleNumber = 0;

    const sendDataPacket = () =>
      cb({
        packet_type: "data",
        sample_number: sampleNumber++,
        data_floats: [Math.random(), Math.random(), Math.random()],
      });
    const sendLogPacket = () =>
      cb({
        packet_type: "log",
        log_type: "dunno what valid log levels are",
        log_message: "This is a log message",
      });
    let timer: ReturnType<typeof setTimeout>;
    const sendAndSchedule = () => {
      sendLogPacket();
      sendDataPacket();
      timer = setTimeout(sendAndSchedule, 100);
    };
    const stopListening = () => {
      console.log("clearing timeout for fake demo data generation");
      clearTimeout(timer);
    };

    sendAndSchedule();
    return Promise.resolve(stopListening);
  },

  enumerateDevices: async (): Promise<DeviceId[]> => {
    await new Promise((r) => setTimeout(r, 100));
    return Promise.resolve(["dummy1", "dummy2"]);
  },
  connectDevice: async (uri: string): Promise<DeviceInfo> => {
    if (uri.slice(0, 5) !== "dummy") {
      throw new Error("Demo API can only connect to dummy data source");
    }
    await new Promise((r) => setTimeout(r, 100));
    return Promise.resolve({
      name: "Fake device '" + uri + "'",
      channels: ["x", "y", "z"],
    });
  },
  disconnect: () => Promise.resolve(),
};

// This implementation would need to have slip decoding
// which could be compiled from Rust or C or reimplemented
// in JavaScript.
export class WebSerialAPI implements API {
  // class because I'm guessing we'll need some state
  type = "WebSerial" as const;
  async listenToPackets(cb: (packet: DevicePacket) => void) {
    // WebSerial stuff
    throw new Error("not implemented");
    return Promise.resolve(function cleanup() {});
  }
  enumerateDevices() {
    throw new Error("not implemented");
    return Promise.resolve([]);
  }
  connectDevice(uri: string) {
    throw new Error("not implemented");
    return Promise.resolve({ name: "TODO", channels: ["TODOa"] });
  }
  async disconnect() {
    throw new Error("not implemented");
  }
}

// There was discussion of a ws API, websockets were implemented
// on some hardware.
export class WebSocketAPI implements API {
  // class because I'm guessing we'll need some state
  type = "WebSocket" as const;
  async listenToPackets(cb: (packet: DevicePacket) => void) {
    // WebSocket stuff
    throw new Error("not implemented");
    return Promise.resolve(function cleanup() {});
  }
  enumerateDevices() {
    throw new Error("not implemented");
    return Promise.resolve([]);
  }
  connectDevice(uri: string) {
    throw new Error("not implemented");
    return Promise.resolve({ name: "TODO", channels: ["TODOa"] });
  }
  async disconnect() {
    throw new Error("not implemented");
  }
}
