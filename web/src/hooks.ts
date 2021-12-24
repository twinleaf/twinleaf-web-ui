import {useRef} from "react";
import {API, DemoAPI, TauriAPI} from "./api";



export const useAPI = (): API => {
  const apiRef = useRef<API>();
  if (!apiRef.current) {
    if (typeof window.__TAURI__ !== 'undefined') {
      apiRef.current = TauriAPI;
      (window as any).api = apiRef.current;
    } else {
      apiRef.current = DemoAPI;
      (window as any).api = apiRef.current;
    }
  }
  return apiRef.current;
}
