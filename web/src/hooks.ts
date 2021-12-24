import { useCallback, useEffect, useRef, useState } from "react";
import { API, DemoAPI, TauriAPI } from "./api";

export const useAPI = (): API => {
  const apiRef = useRef<API>();
  if (!apiRef.current) {
    if (typeof window.__TAURI__ !== "undefined") {
      console.log("using Tauri");
      apiRef.current = TauriAPI;
      (window as any).api = apiRef.current;
    } else {
      console.log("using Demo");
      apiRef.current = DemoAPI;
      (window as any).api = apiRef.current;
    }
  }
  return apiRef.current;
};

export type LogEntry = {
  log_type: string; // TODO
  log_message: string;
};

export const useLogs = (
  capacity: number
): [LogEntry[], (msg: LogEntry) => void, () => void] => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const addLogMessage = useCallback((msg: LogEntry) => {
    // TODO
    setLogs((logs) => {
      if (logs.length >= capacity) {
        return [...logs.slice(1), msg];
      }
      return [...logs, msg];
    });
  }, []);
  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return [logs, addLogMessage, clearLogs];
};

// useRAF means use requestAnimationFrame to guess FPS
export const useFPS = (
  useRAF = false
): {
  reportFrame: () => void;
  setFPSRef: (el: HTMLElement | null) => void;
} => {
  let renders = useRef<number[]>([]);
  let lastLog = useRef<number>(performance.now());
  let elRef = useRef<HTMLElement | null>(null);

  const reportFrame = useCallback(() => {
    const now = performance.now();
    renders.current.push(now);
    renders.current = renders.current.filter((t) => t > now - 1000);

    if (performance.now() > lastLog.current + 1000 && elRef.current) {
      elRef.current.innerHTML = "" + renders.current.length;
    }
  }, []);

  const setFPSRef = useCallback((el: HTMLElement | null) => {
    elRef.current = el;
    if (el) {
      el.innerHTML = "" + renders.current.length + " FPS";
    }
  }, []);

  useEffect(() => {
    if (useRAF) {
      let requestId: ReturnType<typeof requestAnimationFrame>;
      const onRaf = () => {
        reportFrame();
        requestId = requestAnimationFrame(onRaf);
      };
      onRaf();
      return function cleanup() {
        cancelAnimationFrame(requestId);
      };
    }
    return;
  }, [reportFrame]);

  return { reportFrame, setFPSRef };
};

// For debugging, prints which prop changes caused a rerender
export const useWhatChanged = (
  props: Record<string, any>,
  label: string = ""
) => {
  const changed = [];
  const prev = useRef<Record<string, any>>();
  if (!prev.current) {
    prev.current = props;
    return;
  }
  for (const prop of Object.keys(props)) {
    if (props[prop] !== prev.current[prop]) {
      changed.push(prop);
    }
  }
  if (changed.length) {
    console.log("Props for", label, "changed!");
    for (const prop of changed) {
      console.log(prop, "was", prev.current[prop], "and is now", props[prop]);
    }
  }

  prev.current = props;
};
