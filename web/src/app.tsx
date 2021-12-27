import React, { useState, MouseEvent, useRef, useEffect } from "react";
import uPlot from "uplot";
import {
  Button,
  Container,
  Grid,
  Header,
  Icon,
  Image,
  Label,
  Menu,
  MenuItemProps,
  Popup,
  Table,
} from "semantic-ui-react";
import {
  DataBuffer,
  LogEntry,
  useAPI,
  useDevices,
  useFPS,
  useLogs,
  useWhatChanged,
} from "./hooks";
import { APIType, DeviceId, DeviceInfo } from "./api";

type ContentPane = "configure" | "plot" | "about";

export const App = () => {
  const { api, changeAPIType } = useAPI();
  const [logs, addLogMessage] = useLogs(100);
  const { setFPSRef } = useFPS(true);

  const [activePane, setActivePane] = useState<ContentPane>("configure");
  const [plotNames, setPlotNames] = useState<string[]>(["sensor 123"]);
  const oneMorePlot = () =>
    setPlotNames((x) => [...x, "sensor " + ("" + Math.random()).slice(3, 6)]);

  const {
    connect,
    connectedDevice,
    dataBuffer,
    devices,
    disconnect,
    updateDevices,
  } = useDevices(api, addLogMessage);

  const connectAndViewPlot = async (id: string) => {
    await connect(id);
    setActivePane("plot");
  };

  return (
    <>
      <TopBar
        activePane={activePane}
        setActivePane={setActivePane}
        setFPSRef={setFPSRef}
      />
      <Container>
        {plotNames.map(
          (name) =>
            dataBuffer && (
              <MultiChannelGraph
                key={name}
                dataBuffer={dataBuffer}
                hidden={activePane !== "plot"}
              />
            )
        )}
        {activePane === "configure" ? (
          <ConfigurePane
            apiType={api.type}
            changeAPIType={changeAPIType}
            connect={connectAndViewPlot}
            connectedDevice={connectedDevice}
            devices={devices}
            disconnect={disconnect}
            logs={logs}
            oneMorePlot={oneMorePlot}
            updateDevices={updateDevices}
          />
        ) : activePane === "about" ? (
          <h4>
            <a href="https://twinleaf.com/" target="_blank">
              Twinleaf website
            </a>
          </h4>
        ) : null}
      </Container>
    </>
  );
};

type ConfigurePaneProps = {
  apiType: APIType;
  changeAPIType: (apiType: APIType) => void;
  connect: (id: DeviceId) => Promise<void>;
  connectedDevice: DeviceId | undefined;
  devices: Record<DeviceId, DeviceInfo | undefined>;
  disconnect: () => Promise<void>;
  logs: LogEntry[];
  oneMorePlot: () => void;
  updateDevices: () => void;
};
const ConfigurePane = ({
  apiType,
  changeAPIType,
  connect,
  connectedDevice,
  devices,
  disconnect,
  logs,
  oneMorePlot,
  updateDevices,
}: ConfigurePaneProps) => {
  const connectedDeviceInfo =
    connectedDevice === undefined ? undefined : devices[connectedDevice];
  const connectedName = connectedDeviceInfo?.name || connectedDevice;

  return (
    <>
      <Header as="h1">
        {connectedDevice
          ? "Connected to " + connectedName
          : "Not connected to a device"}
      </Header>
      <Devices
        changeAPIType={changeAPIType}
        connect={connect}
        connectedDevice={connectedDevice}
        devices={devices}
        apiType={apiType}
        disconnect={disconnect}
        updateDevices={updateDevices}
      />
      <div style={{ height: 300, overflowY: "auto" }}>
        <code>
          <pre>
            {logs.map((x) => `${x.log_type}: ${x.log_message}`).join("\n")}
          </pre>
        </code>
      </div>
      <button onClick={oneMorePlot}>Debug: add plot</button>
    </>
  );
};

type DevicesProps = {
  changeAPIType: (apiType: APIType) => void;
  connect: (id: DeviceId) => Promise<void>;
  connectedDevice: DeviceId | undefined;
  devices: Record<DeviceId, DeviceInfo | undefined>;
  disconnect: () => Promise<void>;
  apiType: APIType;
  updateDevices: () => void;
};
const Devices = (props: DevicesProps) => {
  const {
    changeAPIType,
    connect,
    connectedDevice,
    devices,
    disconnect,
    updateDevices,
    apiType,
  } = props;
  const connectedDeviceInfo =
    connectedDevice === undefined ? undefined : devices[connectedDevice];
  const connectedName = connectedDeviceInfo?.name || connectedDevice;

  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell width={6}>Device</Table.HeaderCell>
          <Table.HeaderCell width={4}>Device Info</Table.HeaderCell>
          <Table.HeaderCell width={6}></Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {Object.keys(devices).map((id) => (
          <Table.Row key={id}>
            <Table.Cell>
              {connectedDevice === id && <Label ribbon>Connected</Label>}
              {id}
            </Table.Cell>
            <Table.Cell>
              <code>
                <pre>
                  {devices[id] ? JSON.stringify(devices[id], null, 2) : ""}
                </pre>
              </code>
            </Table.Cell>
            <Table.Cell>
              {connectedDevice === id ? (
                <>
                  <Button onClick={disconnect}>Disconnect</Button>
                </>
              ) : (
                <Button onClick={() => connect(id)}>Connect</Button>
              )}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>

      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan="3">
            <Menu>
              <Menu.Item>
                <Button onClick={updateDevices}>Scan again for devices</Button>
              </Menu.Item>
              <Menu.Item>
                using {apiType === "Tauri" ? "Rust Proxy" : apiType} to find
                devices
                <Popup
                  trigger={<Icon name="help" />}
                  hoverable
                  position="top center"
                  wide="very"
                >
                  <Grid centered divided columns="equal">
                    {typeof window.__TAURI__ !== "undefined" && (
                      <Grid.Column textAlign="center" verticalAlign="top">
                        <Header as="h4">Native Serial</Header>
                        <p style={{ height: 120 }}>
                          Discover Twinleaf devices over serial via Rust proxy
                        </p>
                        {apiType === "Tauri" ? (
                          <Button disabled>in use</Button>
                        ) : (
                          <Button onClick={() => changeAPIType("Tauri")}>
                            switch
                          </Button>
                        )}
                      </Grid.Column>
                    )}
                    <Grid.Column textAlign="center" verticalAlign="top">
                      <Header as="h4">WebSerial</Header>
                      <p style={{ height: 120 }}>
                        Discover Twinleaf devices over TIO via WebSerial
                      </p>
                      {apiType === "WebSerial" ? (
                        <Button disabled>in use</Button>
                      ) : (
                        <Button>switch (experimental)</Button>
                      )}
                    </Grid.Column>
                    <Grid.Column textAlign="center" verticalAlign="top">
                      <Header as="h4">WebSocket</Header>
                      <p style={{ height: 120 }}>
                        Discover Twinleaf devices through a tio-proxy via
                        WebSocket communication
                      </p>
                      {apiType === "WebSocket" ? (
                        <Button disabled>in use</Button>
                      ) : (
                        <Button disabled>not yet</Button>
                      )}
                    </Grid.Column>
                    <Grid.Column textAlign="center" verticalAlign="top">
                      <Header as="h4">Demo</Header>
                      <p style={{ height: 120 }}>
                        Don't have a Twinleaf device? Use fake devices to see
                        how things work.
                      </p>
                      {apiType === "Demo" ? (
                        <Button disabled>in use</Button>
                      ) : (
                        <Button onClick={() => changeAPIType("Demo")}>
                          switch
                        </Button>
                      )}
                    </Grid.Column>
                  </Grid>
                </Popup>
              </Menu.Item>
            </Menu>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    </Table>
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
  const handleItemClick = (_: MouseEvent, { name }: MenuItemProps) => {
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
    setPlotting(false);
    plot.current?.stop && plot.current.stop();
  };

  useWhatChanged({ dataBuffer, el }, "running create plot useEffect");
  useEffect(() => {
    if (el) {
      el.innerHTML = "";
      plot.current = makePlot(el, dataBuffer);
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
      range: [-1, 1] as [number, number],
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

  function fpsFormat(num: number) {
    return ("0000" + (Math.round(num * 10) / 10).toFixed(1)).slice(-6);
  }

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
      dataBuffer.deviceName +
      " - receiving at " +
      fpsFormat(observedHz()) +
      " Hz";

    scheduledPlotUpdate = requestAnimationFrame(update);
  }

  // TODO move this into a hook
  let lastResize = 0;
  window.addEventListener("resize", () => {
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
