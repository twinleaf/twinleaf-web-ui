#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{
    CustomMenuItem, Menu, MenuItem, Submenu, SystemTray, SystemTrayMenu, SystemTrayMenuItem,
};

#[tauri::command]
fn print_ports_stdout() {
    println!("=== Serial ports ===");
    if let Ok(ports) = serialport::available_ports() {
        for p in ports {
            println!("{}", p.port_name);
        }
        println!("(done)");
    } else {
        // TODO: real error handling
        println!("Something went wrong!");
    }
}

#[tauri::command]
fn get_ports() -> Vec<String> {
    if let Ok(ports) = serialport::available_ports() {
        ports.into_iter().map(|p| p.port_name).collect()
    } else {
        // TODO: real error handling
        println!("Error fetching ports, returning none");
        vec![]
    }
}

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Does nothing");
    let hide = CustomMenuItem::new("hide".to_string(), "Also does nothing");
    let tray_menu = SystemTrayMenu::new()
        .add_item(quit)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(hide);
    let system_tray = SystemTray::new().with_menu(tray_menu);

    let file_submenu = Submenu::new(
        "File",
        Menu::new()
            .add_native_item(MenuItem::Hide)
            .add_native_item(MenuItem::Services)
            .add_native_item(MenuItem::Separator)
            .add_native_item(MenuItem::Quit),
    );
    let window_menu = Menu::new().add_submenu(file_submenu);

    tauri::Builder::default()
        .menu(window_menu)
        .system_tray(system_tray)
        .invoke_handler(tauri::generate_handler![print_ports_stdout, get_ports])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
