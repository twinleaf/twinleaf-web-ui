#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use crossbeam_channel as channel;
use std::net::{IpAddr, Ipv4Addr, SocketAddr, Shutdown, TcpStream};
use serde::Serialize;
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;
use tauri::{AppHandle, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu};

struct DeviceJuggler {
    uri: Option<String>,
    packet_tx: Option<channel::Sender<()>>,
}

impl DeviceJuggler {
    pub fn new() -> DeviceJuggler {
        DeviceJuggler {
            uri: None,
            packet_tx: None,
        }
    }

    /// Creates a list of possible devices to connect to. Mostly hunting for serial ports, but also
    /// checks for a local TCP proxy (on the default port) and includes a dummy device. In the
    /// future could do mDNS discovery.
    pub fn enumerate_devices() -> Vec<String> {
        let mut devices = vec!["dummy".to_string()];
        // see if proxy is running locally
        if let Ok(conn) = TcpStream::connect_timeout(&SocketAddr::new(IpAddr::V4(Ipv4Addr::new(127, 0, 0, 1)), 7855), Duration::from_millis(100)) {
            conn.shutdown(Shutdown::Both).unwrap();
            devices.push("tcp://localhost:7855".to_string());
        }
        if let Ok(ports) = serialport::available_ports() {
            println!("### Enumerating serial devices...");
            for p in ports.iter() {
                println!("{}", p.port_name);
                devices.push(format!("serial://{}", p.port_name));
            }
        } else {
            // TODO: real error handling (or at least warning)
            println!("Error fetching serial ports");
        }
        devices
    }

    pub fn disconnect(&mut self) -> Result<String, String> {
        self.uri = None;
        self.packet_tx = None;
        Ok("disconnected".to_string())
    }

    pub fn connect_uri(&mut self, uri: String, app: AppHandle) -> Result<String, String> {
        if let Some(ref existing) = self.uri {
            return Err(format!("Already connected to a device: {}", existing));
        }
        if uri.starts_with("dummy") {
            println!("Starting dummy data loop!");
            let (tx_sender, tx_receiver) = channel::bounded(0);
            thread::spawn(move || DeviceJuggler::loop_dummy(app, tx_receiver));
            self.packet_tx = Some(tx_sender);
        } else if uri.starts_with("tcp://") {
            return Err(format!("TCP connection not implemented yet: {}", uri));
        } else if uri.starts_with("serial://") {
            return Err(format!("websocket not implemented yet: {}", uri));
        } else if uri.starts_with("ws://") {
            return Err(format!("serial connections not implemented: {}", uri));
        }
        self.uri = Some(uri);
        Ok("connected".to_string())
    }

    /// This "dummy data" event loop runs at 25 Hz and pushes  random data to the app
    pub fn loop_dummy(app: AppHandle, done_rx: channel::Receiver<()>) {
        let mut time_sec = 0f64;
        let mut count = 0u32;
        loop {
            let resp = done_rx.recv_timeout(Duration::from_millis(40));
            if let Err(channel::RecvTimeoutError::Disconnected) = resp {
                return;
            }
            time_sec += 0.040;
            count += 1;
            if count % 25 == 0 {
                app.emit_all(
                    "device-packet",
                    DeviceMessage::new_log("warn", "this is a dummy log message"),
                )
                .unwrap();
            }
            app.emit_all(
                "device-packet",
                DeviceMessage::new_data(count, vec![time_sec.sin(), time_sec.cos(), time_sec]),
            )
            .unwrap();
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
) -> Result<String, String> {
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
