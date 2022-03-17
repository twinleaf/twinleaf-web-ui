#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

/// Desktop app Rust code, using Tauri APIs
///
/// Like the `tio` rust crate (which the app pulls in, via local reference, see Cargo.toml), this
/// uses crossbeam channels for concurrency.
///
/// This file has basically three parts:
///
/// - DeviceJuggler, which is a context/state type to handle the TIO connection part of the Tauri
///   app, wrapping the `tio` crate. This includes an event loop that receives packets from a device
///   and pushes them to the Tauri web context via "events"
/// - a couple hooks/wrappers to make device connection state controllable from the Tauri web
///   context by implementing "commands"
/// - instantiation of the actual Tauri application
///
/// Note that we use a few of the Tauri APIs here, for things like a taskbar/tray, and Javascript
/// command and event ("emit") APIs, but there are more parts of the Tauri API that haven't been
/// touched yet. Some things are configured/controlled by the `tauri.conf.json` config file. There
/// are also APIs/options to do things like have the main executable be a CLI application with
/// multiple options (only one of which would open a GUI application). And of course this file
/// compiles as just any old Rust program (in the main() function at the bottom), so we could spawn
/// threads, run a network server, whatever from here.
///
/// TODO: refactor out parts of this to a separate file? Eg, implementation of tauri "commands" and
/// "events"
use crossbeam_channel as channel;
use serde::Serialize;
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;
use tauri::{AppHandle, CustomMenuItem, Manager, Menu, Submenu};
use tio::{Device, DeviceInfo, UpdatingInformation, DeviceDesc};
use tio_packet::Packet;

/// This is a context/state object which we pass to the tauri runtime at startup. It is potentially
/// accessed across threads, so it gets wrapped in an Arc (reference counted, so there can be
/// multiple pointers to it) and Mutex (concurrency control so it can be mutated safely).
///
/// The main motivation was to have a single place to store the "current" connected device. As
/// almost a hack, Option types are used so the devices can be "dropped" (disconnected) and
/// assigned at random. I guess in theory this could be a global object or something, but that
/// doesn't seem like best practice.
///
/// TODO: I'm not sure `packet_tx` is needed any more? Originally I had most of the `tio` device
/// logic in this file, then refactored it out, but didn't remove that bit. But device.tx (or
/// device.rx?) could probably just be copied (cloned) and used in the loop_packets() event loop.
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
    ///
    /// Just a pass-through of the tio implementation
    pub fn enumerate_devices() -> Vec<DeviceDesc> {
        Device::enumerate_devices()
    }

    pub fn data_rate(&self, value: Option<f32>) -> f32 {
        Device::data_rate(&self.device.as_ref().unwrap(), value)
    }

    /// Just clears the Options, which should result in the Device getting "dropped", which should
    /// result in the I/O threads shutting down quickly. But this has not been confirmed/tested.
    pub fn disconnect(&mut self) -> Result<String, String> {
        println!("Disconnecting");
        self.device = None;
        self.packet_tx = None;
        Ok("disconnected".to_string())
    }

    /// Thin wrapper around Device::connect(), saving the result.
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

    /// This event loop (thread) does need to exist, but could probably be simplified even further.
    pub fn loop_packets(
        app: AppHandle,
        device_rx: channel::Receiver<Packet>,
        done_rx: channel::Receiver<()>,
    ) {
        let mut updating_information = UpdatingInformation::default();
        loop {
            let resp = done_rx.recv_timeout(Duration::from_millis(1));
            if let Err(channel::RecvTimeoutError::Disconnected) = resp {
                // shutdown
                return;
            }

            match device_rx.recv_timeout(Duration::from_millis(40)) {
                Ok(packet) => {
                    updating_information.interpret_packet(packet.clone());

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
                            //println!("{:?}", updating_information.data_point.timestamp);
                            app.emit_all(
                                "device-packet",
                                DeviceMessage::new_data(
                                    updating_information.data_point.timestamp,
                                    sd.sample_num,
                                    updating_information.data_point.data.clone()
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

/// This probably shouldn't exist? Or at least not definied here. The idea was to have a
/// Javascript/JSON-friendly representation of a TIO Packet, with things like stream data already
/// decoded into an appropriate value type. Eg, `tio-packet` types have things like repr(u8), which
/// I think would get serialized as just an int (byte), which is not super Javascript-friendly
/// (better to have a short string name).
///
/// Basically, in Javascript, we want to write things like:
///
/// if thing.packet_type == "data" {
///   plot.push_values(thing.data_floats);
/// } else if thing.packet_type == "log" {
///   console.log(thing.log_message);
/// }
///
/// or whatever, without lots of additional decoding/serialization.
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
    timestamp: Option<f32>,
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
            timestamp: None,
        }
    }
    fn new_data(timestamp: f32, sample_number: u32, data: Vec<f64>) -> DeviceMessage {
        DeviceMessage {
            packet_type: "data".to_string(),
            log_type: None,
            log_message: None,
            rpc_request_id: None,
            rpc_message: None,
            rpc_error: None,
            sample_number: Some(sample_number),
            data_floats: Some(data),
            timestamp: Some(timestamp),
        }
    }
}

/// This, and the following two, are registered as "commands" via the Tauri API, which means they
/// can be called from javascript.
///
/// This command (enumerate_devices) is simple because it is stateless and has no concurrency
/// concerns.
#[tauri::command]
fn enumerate_devices() -> Vec<DeviceDesc> {
    DeviceJuggler::enumerate_devices()
}

/// This command ("connect") can mutate the DeviceJuggler state, and needs to pass a reference to
/// the web context ("AppHandle"), so it takes those as arguments. The tauri::command macro (part
/// of the Tauri rust API) automagically detects these parameters via type signature and fills in
/// the appropriate values.
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

#[tauri::command]
fn data_rate(
    state: tauri::State<Arc<Mutex<DeviceJuggler>>>,
    value: Option<f32>,
) -> f32 {
    let juggler = state.lock().unwrap();
    return juggler.data_rate(value);
}

fn main() {
    //let hide_menuitem = CustomMenuItem::new("hide".to_string(), "Hide Window");
    //let show_menuitem = CustomMenuItem::new("show".to_string(), "Show Window");
    let quit_menuitem = CustomMenuItem::new("quit".to_string(), "Quit");
    let submenu = Submenu::new("File", Menu::new().add_item(quit_menuitem));//).add_item(hide_menuitem).add_item(show_menuitem));
    let menu = Menu::new()
        .add_submenu(submenu);

    println!("Running newest version");

    // Here is the global state, wrapped for concurrent access
    let juggler_mutex = Arc::new(Mutex::new(DeviceJuggler::new()));
    tauri::Builder::default()
        .manage(juggler_mutex)
        .menu(menu)
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            //let window_ = window.clone();
            window.on_menu_event(move |event| {
              match event.menu_item_id() {
                "quit" => {
                    std::process::exit(0);
                }
                //"hide" => {
                //    println!("about to hide");
                //    //let window_ = app.get_window("main").unwrap();
                //    window_.hide().unwrap();
                //    println!("hidden");
                //}
                //"show" => {
                //    println!("about to show");
                //    window_.show().unwrap();
                //    println!("shown");
                //}
                _ => {}
              }
            });
            Ok(())
          })
        // here we ensure the commands we defined above get hooked in so they are accessible from
        // the web context (aka, Javascript)
        .invoke_handler(tauri::generate_handler![
            enumerate_devices,
            connect_device,
            disconnect,
            data_rate,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
    // Configure the menu items (eg, that lurk in the taskbar/systemtray, depending on platform)
//     let hide_menuitem = CustomMenuItem::new("hide".to_string(), "Hide Window");
//     let show_menuitem = CustomMenuItem::new("show".to_string(), "Show Window");
//     let quit_menuitem = CustomMenuItem::new("quit".to_string(), "Quit");
//     let tray_menu = SystemTrayMenu::new()
//         .add_item(hide_menuitem)
//         .add_item(show_menuitem)
//         .add_item(quit_menuitem);
//     let system_tray = SystemTray::new().with_menu(tray_menu);

//     // Here is the global state, wrapped for concurrent access
//     let juggler_mutex = Arc::new(Mutex::new(DeviceJuggler::new()));

//     tauri::Builder::default()
//         .manage(juggler_mutex)
//         .system_tray(system_tray)
//         // TODO: I bet there is some other "on event" thing we are supposed to register here to
//         // handle "close window" commands and similar)
//         .on_system_tray_event(|app, event| match event {
//             SystemTrayEvent::DoubleClick {
//                 position: _,
//                 size: _,
//                 ..
//             } => {
//                 println!("system tray received a double click");
//                 let window = app.get_window("main").unwrap();
//                 window.show().unwrap();
//             }
//             SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
//                 "hide" => {
//                     let window = app.get_window("main").unwrap();
//                     window.hide().unwrap();
//                 }
//                 "show" => {
//                     let window = app.get_window("main").unwrap();
//                     window.show().unwrap();
//                 }
//                 "quit" => {
//                     std::process::exit(0);
//                 }
//                 _ => {}
//             },
//             _ => {}
//         })
//         // here we ensure the commands we defined above get hooked in so they are accessible from
//         // the web context (aka, Javascript)
//         .invoke_handler(tauri::generate_handler![
//             enumerate_devices,
//             connect_device,
//             disconnect
//         ])
//         .run(tauri::generate_context!())
//         .expect("error while running tauri application");
// }
