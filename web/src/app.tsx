import React, { useState, MouseEvent, useEffect } from "react";
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
  LogEntry,
  useAPI,
  useDevices,
  useFPS,
  useLogs,
  useUplot,
} from "./hooks";
import { DataBuffer, makeFFTPlot, makePlot } from "./plotting";
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
      <Container fluid>
        {activePane === "plot" && !dataBuffer && (
          <Header>
            <Button onClick={() => setActivePane("configure")}>
              Connect a device first
            </Button>
          </Header>
        )}
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
                        <Button disabled>switch (experimental)</Button>
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
        src="./img/Twinleaf-Logo-White.png"
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
const MultiChannelGraph = ({ dataBuffer, hidden }: MultiChannelGraphProps) => {
  (window as any).plotBuffer = dataBuffer; // a way to debug an object interactively
  const { setPlotEl, start, stop, plotting } = useUplot(dataBuffer, makePlot);
  const [windowSize, setWindowSize] = useState(dataBuffer.size);

  return (
    <div hidden={hidden}>
      <Button onClick={start} disabled={plotting}>
        Start plotting
      </Button>
      <Button onClick={stop} disabled={!plotting}>
        Pause plottling
      </Button>
      <Slider
        min={100}
        max={4000}
        onChange={(n: number) => {
          dataBuffer.setWindowSize(n);
          setWindowSize(n);
        }}
        initial={dataBuffer.size}
      />
      {windowSize} samples
      <div ref={setPlotEl} />
      {dataBuffer.channelNames.map((name, i) => (
        <FFTPlot
          key={i}
          dataBuffer={dataBuffer}
          i={i}
          started={plotting}
          showAxis={i == dataBuffer.channelNames.length - 1}
        ></FFTPlot>
      ))}
    </div>
  );
};

type FFTPlotProps = {
  dataBuffer: DataBuffer;
  i: number;
  started: boolean;
  showAxis?: boolean;
};
const FFTPlot = ({ dataBuffer, i, started, showAxis }: FFTPlotProps) => {
  const { setPlotEl, start, stop } = useUplot(
    dataBuffer,
    makeFFTPlot(i, !!showAxis)
  );

  useEffect(() => {
    if (started) start();
    return stop;
  }, [started]);

  return <div ref={setPlotEl}></div>;
};

type SliderProps = {
  min: number;
  max: number;
  onChange: (n: number) => void;
  initial: number;
};
const Slider = ({ min, max, onChange, initial }: SliderProps) => {
  const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("running onChange");
    onChange(e.target.valueAsNumber);
  };
  return (
    <input
      value={initial}
      onChange={_onChange}
      type="range"
      name="window"
      min={min}
      max={max}
    />
  );
};
