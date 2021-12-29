// The Twinleaf API for talking to devices via
// - the rust proxy in the Tauri app
// - demo devices in-browser, no external communication
// - the WebSerial API
// - a WebSocket

import { invoke } from "@tauri-apps/api";
import {
  Event as TauriEvent,
  listen as TauriListen,
} from "@tauri-apps/api/event";

export type LogDevicePacket = {
  packet_type: "log";
  log_type: string; // TODO at least "warn" is allowed
  log_message: string;
};

export type DataDevicePacket = {
  packet_type: "data";
  sample_number: number;
  data_floats: number[];
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
        const { log_type, log_message } = event.payload;
        console.log("DEVICE (" + log_type + "): " + log_message);
      }
      return cb(event.payload);
    });
  },
  enumerateDevices: async () => {
    const resp: string[] = await invoke("enumerate_devices");
    console.log(resp);
    return resp;
  },
  connectDevice: async (uri: string) => {
    const loc = { uri };
    const resp: DeviceInfo = await invoke("connect_device", loc);
    return resp;
  },
  disconnect: async () => {
    await invoke("disconnect");
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
  if (
    demoOrientationCb &&
    e.alpha !== null &&
    e.beta !== null &&
    e.gamma !== null
  ) {
    demoOrientationCb({
      packet_type: "data",
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
        sample_number: demoSampleNumber++,
        data_floats: [
          2 * randn_bm() - 1,
          1 * randn_bm() -
            0.5 +
            Math.sin(demoSampleNumber / (2 * Math.PI)) * 0.5,
          Math.sin(demoSampleNumber / (2 * Math.PI) / 3) * 0.3,
        ],
      });
    const sendLogPacket = () =>
      cb({
        packet_type: "log",
        log_type: "warn",
        log_message: "This is a log message",
      });
    let timer: ReturnType<typeof setTimeout>;
    const sendAndSchedule = () => {
      sendLogPacket();
      const now = performance.now();
      if (demoT0 === 0) demoT0 = now;
      const delta = now - demoT0;
      let toSend =
        Math.round((delta * demoPacketsPerInterval) / demoInterval) - demoSent;
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

    timer = setInterval(sendAndSchedule, demoInterval);
    return Promise.resolve(stopListening);
  },

  enumerateDevices: async (): Promise<DeviceId[]> => {
    await new Promise((r) => setTimeout(r, 100));
    return Promise.resolve([
      "dummy 10Hz",
      "dummy 100Hz",
      "dummy 1000Hz",
      ...("ontouchstart" in window || window.location.hostname === "localhost"
        ? ["device orientation (requires mobile device)"]
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
      if (
        typeof (DeviceOrientationEvent as any).requestPermission === "function"
      ) {
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
    });
  },
  disconnect: () => {
    window.removeEventListener("deviceorientation", handleOrientation);
    return Promise.resolve();
  },
};

/////////////////////////////////////////////////////////////////
// WebSerialAPI - doesn't work yet, this is just a place to start
const encoder = new TextEncoder();
const decoder = new TextDecoder();

// TODO UNTESTED CODE
async function sendHeartbeat(writer: WritableStreamDefaultWriter) {
  // Hack: hardcoded heartbeat to switch to binary mode.
  // For this we don't really even need to send it periodically.
  const data = Uint8Array.from([
    0xc0, 0x05, 0x00, 0x00, 0x00, 0x2e, 0x2f, 0x9a, 0x16, 0xc0,
  ]);
  await writer.write(data);
}

// UNTESTED CODE
function processPacket(pkt: Uint8Array): DevicePacket | undefined {
  // filter out short messages
  if (pkt.byteLength < 8) return;
  // only care about log messages
  if (pkt[0] != 0x1) return;
  // TODO: verify fields and crc32 for real
  const payloadSize = pkt[2] + 256 * pkt[3];
  if (payloadSize + 8 < pkt.byteLength || payloadSize <= 5) return;
  console.log("LOG:", decoder.decode(pkt.subarray(9, payloadSize + 4)));
  const log_message = decoder.decode(pkt.subarray(9, payloadSize + 4));

  return {
    packet_type: "log",
    log_type: "warn", // TODO extract this data
    log_message,
  };
}

// Incomplete + untested, I just grabbed the code from the demo branch
export class WebSerialAPI implements API {
  port: SerialPort;
  ports: Record<"string", SerialPort>;
  receiveLoop: Promise<void>;
  type = "WebSerial" as const;
  breakout = false;
  static instance: WebSerialAPI;
  static getInstance() {
    if (!this.instance) {
      this.instance = new WebSerialAPI();
    }
    return this.instance;
  }
  async listenToPackets(_cb: (packet: DevicePacket) => void) {
    // WebSerial stuff
    throw new Error("not implemented");
    return Promise.resolve(function cleanup() {});
  }
  // WebSerial connects only to a single device, and keeps the connection open
  // to avoid prompting the user again.
  async enumerateDevices() {
    // getPorts returns all ports the page has permission to access,
    // but without labels! So just use this requestPort for now.
    //const ports = await navigator.serial.getPorts(); // should return all;

    let port: SerialPort;
    try {
      port = await navigator.serial.requestPort();
    } catch (e) {
      // hopefully this is " DOMException: No port selected by the user."
      return Object.keys(this.ports);
    }
    let alreadyAdded = false;
    for (const port of Object.values(this.ports)) {
      if (this.port === port) alreadyAdded = true;
    }
    if (alreadyAdded) {
      return Object.keys(this.ports);
    }
    this.ports["serial-device-" + Object.keys(this.ports).length] = this.port;
    // TODO what's proper error handling look like here?
    return Object.keys(this.ports);
  }

  // UNTESTED CODE - need a device to wire this up.
  // This is supposed to
  async connectDevice(uri: string) {
    if (Object.keys(this.ports).includes(uri)) {
      throw new Error("No such serial port as " + uri);
    }
    const port: SerialPort = this.ports[uri];
    this.port = port;
    await port.open({ baudRate: 115200, bufferSize: 4096 });
    if (!port.writable) {
      throw new Error("the port is supposed to be writeable");
    }
    await sendHeartbeat(port.writable.getWriter());
    this.receiveLoop = this.receive(port);
    // TODO receive enough messages to get the name and channels for the device
    return Promise.resolve({
      name: "serial port name TODO",
      channels: ["TODOa"],
    });
  }

  // TODO untested
  async receive(port: SerialPort): Promise<void> {
    var curPacket: number[] = [];

    // outer loop to get a new reader in case of reader exceptions
    // see https://web.dev/serial/#read-port for more
    while (port.readable && !this.breakout) {
      let reader = port.readable.getReader();
      try {
        while (!this.breakout) {
          let escape = false;
          const { value, done } = await reader.read();
          if (done || this.breakout || value === undefined) break;

          value.forEach((byte) => {
            if (byte === 0xc0) {
              // end of packet
              processPacket(Uint8Array.from(curPacket));
              curPacket = [];
              escape = false;
            } else {
              if (escape) {
                escape = false;
                if (byte === 0xdc) curPacket.push(0xc0);
                if (byte === 0xdd) curPacket.push(0xdb);
              } else {
                if (byte === 0xdb) escape = true;
                else curPacket.push(byte);
              }
            }
          });
        }
      } catch (error) {
        console.log("ERROR:", error);
      } finally {
        reader.releaseLock();
      }
    }
  }
  async disconnect() {
    throw new Error("not implemented");
  }
}

/////////////////////////////////////////////////////////////////
// There was discussion of a ws API, websockets were implemented
// on some hardware.
export class WebSocketAPI implements API {
  // class because I'm guessing we'll need some state
  type = "WebSocket" as const;
  static instance: WebSocketAPI;
  static getInstance() {
    if (!this.instance) {
      this.instance = new WebSocketAPI();
    }
    return this.instance;
  }
  async listenToPackets(_cb: (packet: DevicePacket) => void) {
    // WebSocket stuff
    throw new Error("not implemented");
    return Promise.resolve(function cleanup() {});
  }
  enumerateDevices() {
    throw new Error("not implemented");
    return Promise.resolve([]);
  }
  connectDevice(_uri: string) {
    throw new Error("not implemented");
    return Promise.resolve({ name: "TODO", channels: ["TODOa"] });
  }
  async disconnect() {
    throw new Error("not implemented");
  }
}
