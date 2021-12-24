import React, {
  useState,
  MouseEvent,
  useRef,
  useCallback,
  useEffect,
} from "react";
import uPlot from "uplot";
import {
  Button,
  Container,
  Header,
  Image,
  Menu,
  MenuItemProps,
} from "semantic-ui-react";
import {useAPI} from "./hooks";
import {APIType, DeviceId, DeviceInfo} from "./api";

type ContentPane = "configure" | "plot" | "about";


export const App = () => {
  const api = useAPI();
  const [devices, setDevices] = useState<[DeviceId, DeviceInfo][]>([]);
  const [connectedDevice, setConnectedDevice] = useState<DeviceId|undefined>();
  const connect = async (deviceId: DeviceId) => {
    // TODO this isn't reentrant, we need another state bit for "busy" to hide the buttons and/or return early
    if (connectedDevice) {
      await api.disconnect();
      setConnectedDevice(undefined)
    }
    await api.connectDevice({uri: deviceId});
    setConnectedDevice(deviceId);
  }
  const disconnect = async () => {
    await api.disconnect();
    setConnectedDevice(undefined)
  }

  const updateDevices = async () => {
    await disconnect();
    setDevices([]);
    const deviceIds = await api.enumerateDevices();
    const devicesAndInfo: [DeviceId, DeviceInfo][] = [];
    for (const deviceId of deviceIds) {
      // TODO what does a failed call here look like?
      const deviceInfo = await api.connectDevice({uri: deviceId});
      devicesAndInfo.push([deviceId, deviceInfo]);
      await api.disconnect();
    }
    setDevices(devicesAndInfo);
  }
  useEffect(() => {
    updateDevices();
  }, []);

  const [activePane, setActivePane] = useState<ContentPane>("plot");
  const [plotNames, setPlotNames] = useState<string[]>(["sensor 123"]);
  const oneMorePlot = () =>
    setPlotNames((x) => [...x, "sensor " + ("" + Math.random()).slice(3, 6)]);

  return (
    <Container fluid={true}>
      <TopBar activePane={activePane} setActivePane={setActivePane} />
      <Header as="h1">this is the {activePane} pane</Header>
      {plotNames.map((name) => (
        <ExampleGraph name={name} key={name} hidden={activePane !== "plot"} />
      ))}
      {activePane === "configure" ? (
        <ConfigurePane oneMorePlot={oneMorePlot} devices={devices} apiType={api.type} connectedDevice={connectedDevice} updateDevices={updateDevices} connect={connect} disconnect={disconnect}/>
      ) : activePane === "about" ? (
        "this is an about page, do we need this?"
      ) : null}
    </Container>
  );
};

type ConfigurePaneProps = {
  oneMorePlot: () => void;
  devices: [DeviceId, DeviceInfo][];
  updateDevices: () => void;
  apiType: APIType;
  connectedDevice: DeviceId | undefined;
  connect: (id: DeviceId) => Promise<void>;
  disconnect: () => Promise<void>;
};
const ConfigurePane = ({ oneMorePlot, devices, updateDevices, apiType, connectedDevice, connect, disconnect }: ConfigurePaneProps) => {

  return (
    <div>
      Currently using the {apiType} interface. <br/>
      <Button onClick={updateDevices}>Scan for devices</Button> <br/>
      Devices: {devices.map(([id, info]) => 
      <div>
        {id} - {JSON.stringify(info, null, 2)}
        {connectedDevice === id
          ? <>
            "Connected"
            <Button onClick={disconnect}>Disconnect</Button>
            </>
          : <Button onClick={() => connect(id)}>Connect</Button>
        }
        <br/>
      </div>)}
      <Button onClick={oneMorePlot}>Add Plot</Button>
    </div>
  );
};

const TopBar = ({
  activePane,
  setActivePane,
}: {
  activePane: ContentPane;
  setActivePane: (pane: ContentPane) => void;
}) => {
  const handleItemClick = (e: MouseEvent, { name }: MenuItemProps) => {
    setActivePane(name as ContentPane);
  };
  return (
    <Menu inverted style={{ backgroundColor: "#1b1c1d" }}>
      <Image
        src="/img/Twinleaf-Logo-White.png"
        size="small"
        style={{ margin: "10px" }}
      />
      <Menu.Item
        name="configure"
        active={activePane === "configure"}
        onClick={handleItemClick}
      >
        Configure
      </Menu.Item>
      <Menu.Item
        name="plot"
        active={activePane === "plot"}
        onClick={handleItemClick}
      >
        Plot
      </Menu.Item>
      <Menu.Item
        name="about"
        active={activePane === "about"}
        onClick={handleItemClick}
      >
        About
      </Menu.Item>
      <Menu.Item>
        <FPSCounter />
      </Menu.Item>
    </Menu>
  );
};

type ExampleGraphProps = {
  hidden: boolean;
  name: string;
};

const ExampleGraph = (props: ExampleGraphProps) => {
  const [plotting, setPlotting] = useState(false);

  const plotBuffer = useRef<FakePlotBuffer>(
    new FakePlotBuffer({
      interval: 5,
      loop: 2000,
      hz: 100,
    })
  );
  plotBuffer.current.start();
  (window as any).plotBuffer = plotBuffer.current; // a way to debug an object interactively

  const elRef = useRef<HTMLDivElement>();
  const plot = useRef<ReturnType<typeof makePlot>>();
  const setEl = useCallback((el) => {
    elRef.current = el;
    // kick something off synchronously here
    plot.current = makePlot(el, plotBuffer.current.data, props.name);
  }, []);

  const startPlotting = () => {
    setPlotting(true);
    plot.current?.start && plot.current.start();
  };
  const stopPlotting = () => {
    setPlotting(false);
    plot.current?.stop && plot.current.stop();
  };

  return (
    <div hidden={props.hidden}>
      <Button onClick={startPlotting} disabled={plotting}>
        Start plotting
      </Button>
      <Button onClick={stopPlotting} disabled={!plotting}>
        Pause plottling
      </Button>
      <div ref={setEl} />
    </div>
  );
};

class FakePlotBuffer {
  interval: number;
  hz: number;
  loop: number;
  added: number;
  data: [number[], number[], number[], number[]] = [[], [], [], []];
  intervalTimer: ReturnType<typeof setInterval>;
  running = false;
  t0: number;

  constructor({
    interval,
    loop,
    hz,
  }: {
    interval: number;
    loop: number;
    hz: number;
  }) {
    this.loop = loop;
    this.interval = interval;
    this.added = 0;
    this.hz = hz;
  }

  addData = () => {
    const now = Date.now();
    const delta = now - this.t0; // in milliseconds
    const toAdd = Math.floor((this.hz * delta) / 1000 - this.added);

    for (let i = 0; i < toAdd; i++) {
      this.added += 1;
      this.data[0].push(this.t0 + this.added / (this.hz / 1000));
      this.data[1].push(0 - Math.random());
      this.data[2].push(-1 - Math.random());
      this.data[3].push(-2 - Math.random());
    }

    while (this.data[0].length > this.loop) {
      this.data[0].shift();
      this.data[1].shift();
      this.data[2].shift();
      this.data[3].shift();
    }
  };

  start() {
    if (this.running) return;
    this.running = true;
    this.t0 = Date.now();
    this.intervalTimer = setInterval(this.addData, this.interval);
  }

  stop() {
    clearTimeout(this.intervalTimer);
    this.running = false;
  }
}

function makePlot(
  el: HTMLElement,
  data: [number[], number[], number[], number[]],
  title: string
): { plot: uPlot; start: () => void; stop: () => void } {
  const windowSize = 10000;
  function getSize() {
    // TODO use el.clientWidth in the future + a resizeObserver
    return {
      width: window.innerWidth - 100,
      height: Math.floor((window.innerWidth - 100) / 3),
    };
  }

  const scales = {
    x: {},
    y: {
      auto: false,
      range: [-3.5, 0.5] as [number, number],
    },
  };

  const opts = {
    title,
    ...getSize(),
    pxAlign: 0,
    ms: 1 as const,
    scales,
    pxSnap: false,
    series: [
      {},
      {
        stroke: "red",
        paths: uPlot.paths.linear!(),
        spanGaps: true,
        pxAlign: 0,
        points: { show: true },
      },
      {
        stroke: "blue",
        paths: uPlot.paths.spline!(),
        spanGaps: true,
        pxAlign: 0,
        points: { show: true },
      },
      {
        stroke: "purple",
        paths: uPlot.paths.stepped!({ align: 1 }),
        spanGaps: true,
        pxAlign: 0,
        points: { show: true },
      },
    ],
  };

  let u = new uPlot(opts, data, el);

  // TODO move this into a hook or stateful object
  // TODO debounce this, window resize behavior feels bad
  let scheduledPlotUpdate: ReturnType<typeof requestAnimationFrame>;
  function stopRescheduling() {
    cancelAnimationFrame(scheduledPlotUpdate);
  }
  function update() {
    const now = Date.now();
    const scale = { min: now - windowSize, max: now };

    u.setData(data, false);
    u.setScale("x", scale);

    scheduledPlotUpdate = requestAnimationFrame(update);
  }

  // TODO move this into a hook
  let lastResize = 0;
  window.addEventListener("resize", (e) => {
    // debounce to prevent Tauri crash
    // a real debounce would set a timer too
    if (Date.now() < lastResize + 1000) {
      return;
    }
    u.setSize(getSize());
    lastResize = Date.now();
  });

  return { plot: u, start: update, stop: stopRescheduling };
}

const FPSCounter = () => {
  const elRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let renders: number[] = [];

    const recordFrame = () => {
      const now = performance.now();
      renders.push(now);
      renders = renders.filter((t) => t > now - 1000);
      if (elRef.current) {
        elRef.current.innerHTML = "" + renders.length + " FPS";
      }
      requestAnimationFrame(recordFrame);
    };

    const handle = requestAnimationFrame(recordFrame);

    return function cleanup() {
      cancelAnimationFrame(handle);
    };
  });

  return <span ref={elRef}></span>;
};
