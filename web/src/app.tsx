import React, { useState, MouseEvent, useRef, useEffect } from "react";
import uPlot from "uplot";
import {
  Button,
  Container,
  Header,
  Image,
  Menu,
  MenuItemProps,
} from "semantic-ui-react";
import { useAPI, useFPS, useLogs, useWhatChanged } from "./hooks";
import {
  APIType,
  DataDevicePacket,
  DeviceId,
  DeviceInfo,
  DevicePacket,
} from "./api";
import { PollingWatchKind } from "typescript";

type ContentPane = "configure" | "plot" | "about";

export const App = () => {
  const api = useAPI();
  const [devices, setDevices] = useState<[DeviceId, DeviceInfo][]>([]);
  const [connectedDevice, setConnectedDevice] = useState<
    DeviceId | undefined
  >();
  const [logs, addLogMessage, clearLogs] = useLogs(100);

  const dataBuffer = useRef<DataBuffer>();
  const { setFPSRef } = useFPS(true);

  const [activePane, setActivePane] = useState<ContentPane>("configure");
  const [plotNames, setPlotNames] = useState<string[]>(["sensor 123"]);
  const oneMorePlot = () =>
    setPlotNames((x) => [...x, "sensor " + ("" + Math.random()).slice(3, 6)]);

  // stop listening to Tauri events
  const stopListening = useRef<() => void>();
  const disconnect = async () => {
    console.log("stop listening to", stopListening.current);
    stopListening.current && stopListening.current();
    await api.disconnect();
    setConnectedDevice(undefined);
  };
  const connect = async (deviceId: DeviceId) => {
    // TODO this isn't reentrant, we need another state bit for "busy" to hide the buttons and/or return early
    if (connectedDevice) {
      console.log("stop listening to", stopListening.current);
      stopListening.current && stopListening.current();
      await api.disconnect();
      setConnectedDevice(undefined);
    }
    const info = await api.connectDevice(deviceId);
    setConnectedDevice(deviceId);

    dataBuffer.current = new DataBuffer(info, 1000);

    const onPacket = (packet: DevicePacket) => {
      if (packet.packet_type === "data") {
        dataBuffer.current!.addFrame(packet);
      } else if (packet.packet_type === "log") {
        console.log("log packet:", packet.log_type, packet.log_message);
        addLogMessage({
          log_type: packet.log_type,
          log_message: packet.log_message,
        });
      } else {
        throw new Error("received unknown packet type");
      }
    };

    stopListening.current = await api.listenToPackets(onPacket);
    setActivePane("plot");
    return;
  };

  const updateDevices = async () => {
    await disconnect();
    setDevices([]);
    const deviceIds = await api.enumerateDevices();
    const devicesAndInfo: [DeviceId, DeviceInfo][] = [];
    for (const deviceId of deviceIds) {
      // TODO what does a failed call here look like?
      const deviceInfo = await api.connectDevice(deviceId);
      devicesAndInfo.push([deviceId, deviceInfo]);
      await api.disconnect();
    }
    setDevices(devicesAndInfo);
  };
  useEffect(() => {
    updateDevices();
  }, []);

  return (
    <Container fluid={true}>
      <TopBar
        activePane={activePane}
        setActivePane={setActivePane}
        setFPSRef={setFPSRef}
      />
      {plotNames.map(
        (name) =>
          dataBuffer.current && (
            <MultiChannelGraph
              key={name}
              dataBuffer={dataBuffer.current}
              hidden={activePane !== "plot"}
            />
          )
      )}
      {activePane === "configure" ? (
        <ConfigurePane
          oneMorePlot={oneMorePlot}
          devices={devices}
          apiType={api.type}
          connectedDevice={connectedDevice}
          updateDevices={updateDevices}
          connect={connect}
          disconnect={disconnect}
        />
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
const ConfigurePane = ({
  oneMorePlot,
  devices,
  updateDevices,
  apiType,
  connectedDevice,
  connect,
  disconnect,
}: ConfigurePaneProps) => {
  const connectedDeviceInfo =
    connectedDevice && devices.find(([id, info]) => id === connectedDevice);

  return (
    <>
      <Header as="h1">
        {connectedDeviceInfo
          ? "Connected to " + connectedDeviceInfo[1].name
          : "Connect to a device"}
      </Header>
      <div>
        Currently using the {apiType} interface. <br />
        Devices:{" "}
        {devices.map(([id, info]) => (
          <div key={id}>
            {id} - {JSON.stringify(info, null, 2)}
            {connectedDevice === id ? (
              <Button onClick={disconnect}>Disconnect</Button>
            ) : (
              <Button onClick={() => connect(id)}>Connect</Button>
            )}
            <br />
          </div>
        ))}
        <Button onClick={updateDevices}>Scan again for devices</Button>
        <br />
        <button onClick={oneMorePlot}>debug: Add Plot</button>
      </div>
    </>
  );
};

const TopBar = ({
  activePane,
  setActivePane,
  setFPSRef,
}: {
  activePane: ContentPane;
  setActivePane: (pane: ContentPane) => void;
  setFPSRef: (el: HTMLElement | null) => void;
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
        <span ref={setFPSRef} />
      </Menu.Item>
    </Menu>
  );
};

type MultiChannelGraphProps = {
  dataBuffer: DataBuffer;
  hidden: boolean;
};
const MultiChannelGraph = (props: MultiChannelGraphProps) => {
  const { dataBuffer, hidden } = props;
  const [plotting, setPlotting] = useState(false);
  const [el, setEl] = useState<HTMLDivElement | null>(null);

  (window as any).plotBuffer = dataBuffer; // a way to debug an object interactively

  const plot = useRef<ReturnType<typeof makePlot>>();

  const startPlotting = () => {
    if (!plot.current?.start) return;
    plot.current.start();
    setPlotting(true);
  };
  const stopPlotting = () => {
    console.log("stopping updating plot", plot.current);
    setPlotting(false);
    plot.current?.stop && plot.current.stop();
  };

  useWhatChanged({ dataBuffer, el }, "running create plot useEffect");
  useEffect(() => {
    if (el) {
      el.innerHTML = "";
      plot.current = makePlot(el, dataBuffer);
      console.log("creating plot...", dataBuffer, el);
      startPlotting();
      return function cleanup() {
        stopPlotting();
      };
    }
    return;
  }, [dataBuffer, el]);

  return (
    <div hidden={hidden}>
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

// always make a new buffer when switching devices
class DataBuffer {
  size: number;
  data: number[][];
  sampleNums: number[] = [];
  deviceName: string;
  channelNames: string[];
  sampleReceivedTimes: number[] = [];
  constructor(info: DeviceInfo, size = 1000) {
    this.deviceName = info.name;
    this.data = [];
    this.channelNames = info.channels;
    for (const _ of this.channelNames) {
      this.data.push([]);
    }
    this.size = size;
  }
  addFrame = (frame: DataDevicePacket) => {
    for (let i = 0; i < this.channelNames.length; i++) {
      this.data[i].push(frame.data_floats[i]);
      if (this.data[i].length > this.size) this.data[i].shift();
    }
    this.sampleReceivedTimes.push(performance.now());
    this.sampleNums.push(frame.sample_number);
    if (this.sampleNums.length > this.size) {
      this.sampleNums.shift();
      this.sampleReceivedTimes.shift();
    }
  };
  observedHz = () => {
    if (!this.sampleReceivedTimes.length) return 0;
    const lastN = this.sampleReceivedTimes.slice(-11);
    const dt = lastN[lastN.length - 1] - lastN[0];
    const fps = ((lastN.length - 1) / dt) * 1000;
    return Math.round(fps * 100) / 100;
  };
}

function makePlot(
  el: HTMLElement,
  dataBuffer: DataBuffer
): { plot: uPlot; start: () => void; stop: () => void } {
  const { deviceName, data, channelNames, size, sampleNums, observedHz } =
    dataBuffer;

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
      range: [0, 1] as [number, number],
    },
  };

  const colors = ["red", "green", "blue", "yellow", "orange", "purple"];

  const opts = {
    title: dataBuffer.deviceName,
    ...getSize(),
    pxAlign: 0,
    ms: 1 as const,
    scales,
    pxSnap: false,
    series: dataBuffer.channelNames.map((name, i) => ({
      stroke: colors[i % colors.length],
      paths: uPlot.paths.linear!(),
      spanGaps: true,
      pxAlign: 0,
      points: { show: true },
    })),
  };

  let u = new uPlot(opts, [sampleNums, ...data], el);

  // TODO move this into a hook or stateful object
  // TODO debounce this, window resize behavior feels bad
  let scheduledPlotUpdate: ReturnType<typeof requestAnimationFrame>;
  function stopRescheduling() {
    cancelAnimationFrame(scheduledPlotUpdate);
  }
  function update() {
    const scale = {
      min: sampleNums[0],
      max: sampleNums[sampleNums.length - 1],
    };

    u.setData([sampleNums, ...data], false);
    u.setScale("x", scale);
    (el.querySelector(".u-title")! as HTMLDivElement).innerText =
      dataBuffer.deviceName + " - " + observedHz() + " Hz";

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
