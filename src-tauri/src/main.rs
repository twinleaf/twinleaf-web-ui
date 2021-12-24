#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use crossbeam_channel as channel;
use serde::Serialize;
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;
use tauri::{AppHandle, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu};
use tio::{Device, DeviceInfo};
use tio_packet::Packet;

struct DeviceJuggler {
    device: Option<Device>,
    packet_tx: Option<channel::Sender<()>>,
}

impl DeviceJuggler {
    pub fn new() -> DeviceJuggler {
        DeviceJuggler {
            device: None,
            packet_tx: None,
        }
    }

    /// Creates a list of possible devices to connect to. Mostly hunting for serial ports, but also
    /// checks for a local TCP proxy (on the default port) and includes a dummy device. In the
    /// future could do mDNS discovery.
    pub fn enumerate_devices() -> Vec<String> {
        Device::enumerate_devices()
    }

    pub fn disconnect(&mut self) -> Result<String, String> {
        println!("Disconnecting");
        self.uri = None;
        self.packet_tx = None;
        Ok("disconnected".to_string())
    }

    pub fn connect_uri(&mut self, uri: String, app: AppHandle) -> Result<DeviceInfo, String> {
        if let Some(ref existing) = self.device {
            return Err(format!("Already connected to a device: {}", existing.uri));
        }
        self.device = Some(Device::connect(uri).unwrap());

        println!("Starting app handler loop!");
        let (tx_sender, tx_receiver) = channel::bounded(0);
        self.packet_tx = Some(tx_sender);
        let device_tx = self.device.as_ref().unwrap().rx.clone();
        thread::spawn(move || DeviceJuggler::loop_packets(app, device_tx, tx_receiver));

        Ok(self.device.as_ref().unwrap().info.clone())
    }

    pub fn loop_packets(
        app: AppHandle,
        device_rx: channel::Receiver<Packet>,
        done_rx: channel::Receiver<()>,
    ) {
        loop {
            let resp = done_rx.recv_timeout(Duration::from_millis(1));
            if let Err(channel::RecvTimeoutError::Disconnected) = resp {
                // shutdown
                return;
            }

            match device_rx.recv_timeout(Duration::from_millis(40)) {
                Ok(packet) => {
                    use Packet::*;
                    match packet {
                        Log(msg) => {
                            app.emit_all(
                                "device-packet",
                                DeviceMessage::new_log("warn", &msg.message),
                            )
                            .unwrap();
                        }
                        StreamData(sd) => {
                            app.emit_all(
                                "device-packet",
                                DeviceMessage::new_data(
                                    sd.sample_num,
                                    sd.as_f32().into_iter().map(|v| v as f64).collect(),
                                ),
                            )
                            .unwrap();
                        }
                        _ => (),
                    }
                }
                Err(channel::RecvTimeoutError::Timeout) => {}
                Err(channel::RecvTimeoutError::Disconnected) => return,
            }
        }
    }
}

/// Greatly simplified version of TIO packets. This represents, at most, a single frame.
#[derive(Clone, Serialize)]
struct DeviceMessage {
    packet_type: String,
    log_type: Option<String>,
    log_message: Option<String>,
    rpc_request_id: Option<u32>,
    rpc_message: Option<String>,
    rpc_error: Option<String>,
    sample_number: Option<u32>,
    data_floats: Option<Vec<f64>>,
}

impl DeviceMessage {
    fn new_log(log_type: &str, msg: &str) -> DeviceMessage {
        DeviceMessage {
            packet_type: "log".to_string(),
            log_type: Some(log_type.to_string()),
            log_message: Some(msg.to_string()),
            rpc_request_id: None,
            rpc_message: None,
            rpc_error: None,
            sample_number: None,
            data_floats: None,
        }
    }
    fn new_data(sample_number: u32, data: Vec<f64>) -> DeviceMessage {
        DeviceMessage {
            packet_type: "data".to_string(),
            log_type: None,
            log_message: None,
            rpc_request_id: None,
            rpc_message: None,
            rpc_error: None,
            sample_number: Some(sample_number),
            data_floats: Some(data),
        }
    }
}

/// Returns a list of URIs that could be connected to
#[tauri::command]
fn enumerate_devices() -> Vec<String> {
    DeviceJuggler::enumerate_devices()
}

#[tauri::command]
fn connect_device(
    uri: String,
    state: tauri::State<Arc<Mutex<DeviceJuggler>>>,
    app_handle: tauri::AppHandle,
) -> Result<DeviceInfo, String> {
    let mut juggler = state.lock().unwrap();
    juggler.connect_uri(uri, app_handle)
}

#[tauri::command]
fn disconnect(state: tauri::State<Arc<Mutex<DeviceJuggler>>>) -> Result<String, String> {
    let mut juggler = state.lock().unwrap();
    juggler.disconnect()
}

fn main() {
    let hide_menuitem = CustomMenuItem::new("hide".to_string(), "Hide Window");
    let show_menuitem = CustomMenuItem::new("show".to_string(), "Show Window");
    let quit_menuitem = CustomMenuItem::new("quit".to_string(), "Quit");
    let tray_menu = SystemTrayMenu::new()
        .add_item(hide_menuitem)
        .add_item(show_menuitem)
        .add_item(quit_menuitem);
    let system_tray = SystemTray::new().with_menu(tray_menu);

    let juggler_mutex = Arc::new(Mutex::new(DeviceJuggler::new()));

    tauri::Builder::default()
        .manage(juggler_mutex)
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::DoubleClick {
                position: _,
                size: _,
                ..
            } => {
                println!("system tray received a double click");
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
            }
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "hide" => {
                    let window = app.get_window("main").unwrap();
                    window.hide().unwrap();
                }
                "show" => {
                    let window = app.get_window("main").unwrap();
                    window.show().unwrap();
                }
                "quit" => {
                    std::process::exit(0);
                }
                _ => {}
            },
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![
            enumerate_devices,
            connect_device,
            disconnect
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
