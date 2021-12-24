// The Twinleaf API for talking to devices via
// - the WebSerial API 
// - the rust proxy in the Tauri app

import { invoke } from "@tauri-apps/api";
import { Event as TauriEvent, listen } from '@tauri-apps/api/event'

export type LogDevicePacket = {
  packet_type: "log";
  log_type: string; // TODO
  log_message: string
}

export type DataDevicePacket = {
  packet_type: "data";
  sample_number: number // uint32
  data_floats: number[] // TODO what is this?
}


export type DevicePacket = LogDevicePacket | DataDevicePacket;
export type DeviceId = string;
export type DeviceInfo = any; // TODO

export type APIType = "Tauri"|"WebSerial"|"Demo";

export interface API {
  type: APIType;
  listenToPackets: (cb: (packet: DevicePacket) => void) => Promise<() => void>;
  enumerateDevices: () => Promise<DeviceId[]>;
  connectDevice: (spec: {uri: string}) => Promise<DeviceInfo>;
  disconnect: () => Promise<void>;
}

export const TauriAPI: API = {
  type: "Tauri",
  listenToPackets: (cb: (packet: DevicePacket) => void) => {
    return listen('device-packet', (event: TauriEvent<DevicePacket>) => {
      if (event.payload.packet_type == 'log') {
        console.log("DEVICE (" + event.payload.log_type + "): " + event.payload.log_message);
      }
      return cb(event.payload);
    })
  },
  enumerateDevices: async () => {
    const resp = await invoke('enumerate_devices')
    console.log(resp);
    return resp as any[]; // just hoping
  },
  connectDevice: async () => {
    const resp = await invoke('connect_device', { uri: "dummy" });
    console.log(resp);
    return resp;
  },
  disconnect: async () => {
    const resp = await invoke('disconnect')
    console.log(resp);
  }
};


export const DemoAPI: API = {
  type: "Demo",
  listenToPackets: (cb: (packet: DevicePacket) => void) => {
    let sampleNumber = 0;
    let listening = true;

    const sendDataPacket = () => cb({
      packet_type: "data",
      sample_number: sampleNumber++,
      data_floats: [Math.random(), Math.random()]
    });
    const sendLogPacket = () => cb({
      packet_type: "log",
      log_type: "dunno what valid log levels are",
      log_message: "This is a log message",
    });
    const stopListening = () => {
      listening = false;
    }
    const sendForever = async () => {
      while (listening) {
        sendLogPacket();
        sendDataPacket();
        await new Promise(r => setTimeout(r, 100));
      }
    }

    sendForever();
    return Promise.resolve(stopListening);
  },

  enumerateDevices: async (): Promise<DeviceId[]> => {
    await new Promise(r => setTimeout(r, 100));
    return Promise.resolve(['dummy']);
  },
  connectDevice: async (): Promise<DeviceInfo> => {
    await new Promise(r => setTimeout(r, 100));
    return Promise.resolve({
      whateverDeviceInfoLooksLike: 'asdf'
    });
  },
  disconnect: () => Promise.resolve()
}


export class WebSerialAPI implements API {
  // class because I'm guessing we'll need some state
  type = "WebSerial" as const;
  async listenToPackets(cb: (packet: DevicePacket) => void) {
    // WebSerial stuff
    throw new Error('not implemented');
    return Promise.resolve(function cleanup(){});
  }
  enumerateDevices() {
    throw new Error('not implemented');
    return Promise.resolve([])
  }
  connectDevice(spec: {uri: string}) {
    throw new Error('not implemented');
    return Promise.resolve([])

  }
  async disconnect() {
    throw new Error('not implemented');
  }
}
