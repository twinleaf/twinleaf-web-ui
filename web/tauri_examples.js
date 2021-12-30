
import { invoke } from "@tauri-apps/api";
// or: const invoke = window.__TAURI__.invoke
import { listen } from '@tauri-apps/api/event'
// or: const listen = window.__TAURI__.event.listen

// register a listener for data packets. current message types like:
//
// packet_type: "log"
// log_type: str (aka, log-level)
// log_message: str
//
// packet_type: "data"
// sample_number: number (uint32)
// data_floats: [number] (float64)
//
// The "data" type will presumably change to be a "frame" with named channels
listen('device-packet', event => {
  if (event.payload.packet_type == 'log') {
    console.log("DEVICE (" + event.payload.log_type + "): " + event.payload.log_message);
  }  
  //console.log(event.payload);
})

invoke('enumerate_devices').then((devices) => console.log(devices))

// "dummy" is a special device that will send bogus data
// Currently this doesn't really return anything, but the intention is to have
// it return an object which has metadata about the device
invoke('connect_device', { uri: "dummy://" }).then((resp) => console.log(resp))

//invoke('disconnect').then((resp) => console.log(resp))
