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
import { LogEntry, useDeviceAPI, useDevices, useFPS, useLogs } from "./hooks";
import { DataBuffer } from "./plotting";
import { APIType, DeviceId, DeviceInfo, API } from "./api";
import { CombinedSpectrumPlot, TracePlot } from "./plot_components";

type ContentPane = "configure" | "plot" | "about" | "Scalar" | "Vector" | "Heater" | "Laser";

export const App = () => {
  const { api, changeAPIType } = useDeviceAPI();
  const [logs, addLogMessage] = useLogs(100);
  const { setFPSRef } = useFPS(true);

  const [activePane, setActivePane] = useState<ContentPane>("configure");

  const { connect, connectedDevice, dataBuffer, devices, disconnect, updateDevices } = useDevices(
    api,
    addLogMessage
  );
  const connectAndViewPlot = async (id: string) => {
    await connect(id);
    setActivePane("plot");
  };

  return (
    <>
      <TopBar activePane={activePane} setActivePane={setActivePane} setFPSRef={setFPSRef} />
      <Container fluid>
        {activePane === "plot" && !dataBuffer ? (
          <Header>
            <Button onClick={() => setActivePane("configure")}>Connect a device first</Button>
          </Header>
        ) : activePane === "plot" && dataBuffer ? (
          <PlotPane dataBuffer={dataBuffer} api ={api} numNoise = {3} numPlots = {dataBuffer.channelNames.length -1} />
        ) : activePane === "configure" ? (
          <ConfigurePane
            apiType={api.type}
            changeAPIType={changeAPIType}
            connect={connectAndViewPlot}
            connectedDevice={connectedDevice}
            devices={devices}
            disconnect={disconnect}
            logs={logs}
            updateDevices={updateDevices}
          />
        ) : activePane === "about" ? (
          <h4>
            <a href="https://twinleaf.com/" target="_blank">
              Twinleaf website
            </a>
          </h4>
        ) : activePane === "Scalar" && dataBuffer && dataBuffer.viewers.includes("Scalar") ? (
          <ScalarPane dataBuffer={dataBuffer} api ={api} />
        ) : activePane === "Vector" && dataBuffer && dataBuffer.viewers.includes("Vector") ? (
          <PlotPane dataBuffer={dataBuffer} api ={api} numPlots = {3} numNoise = {3}/>
        ) : activePane === "Heater" && dataBuffer && dataBuffer.viewers.includes("Heater") ? (
          <PlotPane dataBuffer={dataBuffer} api ={api} numPlots = {3} numNoise = {2}/>
        ) : activePane === "Laser" && dataBuffer && dataBuffer.viewers.includes("Laser") ? (
          <LaserPane dataBuffer={dataBuffer} api ={api} />
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
  updateDevices,
}: ConfigurePaneProps) => {
  const connectedDeviceInfo = connectedDevice === undefined ? undefined : devices[connectedDevice];
  const connectedName = connectedDeviceInfo?.name || connectedDevice;

  return (
    <>
      <Header as="h1">
        {connectedDevice ? "Connected to " + connectedName : "Not connected to a device"}
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
          <pre>{logs.map((x) => `${x.log_type}: ${x.log_message}`).join("\n")}</pre>
        </code>
      </div>
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
  const { changeAPIType, connect, connectedDevice, devices, disconnect, updateDevices, apiType } =
    props;
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
                <pre>{devices[id] ? JSON.stringify(devices[id], null, 2) : ""}</pre>
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
                using {apiType === "Tauri" ? "Rust Proxy" : apiType} to find devices
                <Popup trigger={<Icon name="help" />} hoverable position="top center">
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
                          <Button onClick={() => changeAPIType("Tauri")}>switch</Button>
                        )}
                      </Grid.Column>
                    )}
                    <Grid.Column textAlign="center" verticalAlign="top">
                      <Header as="h4">Demo</Header>
                      <p style={{ height: 120 }}>
                        Don't have a Twinleaf device? Use fake devices to see how things work.
                      </p>
                      {apiType === "Demo" ? (
                        <Button disabled>in use</Button>
                      ) : (
                        <Button onClick={() => changeAPIType("Demo")}>switch</Button>
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
      <Image src="./img/Twinleaf-Logo-White.png" size="small" style={{ margin: "10px" }} />
      <Menu.Item name="configure" active={activePane === "configure"} onClick={handleItemClick}>
        Configure
      </Menu.Item>
      <Menu.Item name="plot" active={activePane === "plot"} onClick={handleItemClick}>
        Plot
      </Menu.Item>
      <Menu.Item name="about" active={activePane === "about"} onClick={handleItemClick}>
        About
      </Menu.Item>
      <Menu.Item>
        <span ref={setFPSRef} />
      </Menu.Item>
      <Menu.Item name="Scalar" active={activePane === "Scalar"} onClick={handleItemClick}>
        Scalar
      </Menu.Item>
      <Menu.Item name="Vector" active={activePane === "Vector"} onClick={handleItemClick}>
        Vector
      </Menu.Item>
      <Menu.Item name="Heater" active={activePane === "Heater"} onClick={handleItemClick}>
        Heater
      </Menu.Item>
      <Menu.Item name="Laser" active={activePane === "Laser"} onClick={handleItemClick}>
        Laser
      </Menu.Item>
    </Menu>
  );
};

type SliderProps = {
  min: number;
  max: number;
  onChange: (n: number) => void;
  initial: number;
};
const Slider = ({ min, max, onChange, initial }: SliderProps) => {
  const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.valueAsNumber);
  };
  return (
    <input value={initial} onChange={_onChange} type="range" name="window" min={min} max={max} />
  );
};



type PlotPaneProps = {
  dataBuffer: DataBuffer;
  api: API;
  numPlots: number;
  numNoise: number;
};
const PlotPane = ({ dataBuffer, api:API, numPlots, numNoise}: PlotPaneProps) => {
  (window as any).plotBuffer = dataBuffer; // a way to debug an object interactively
  const [windowSize, setWindowSize] = useState(dataBuffer.size/dataBuffer.dataRate);
  const [initial_rate, setDataRate] = useState(dataBuffer.dataRate);
  const [paused, setPaused] = useState(false);

  const colors = ["red", "green", "blue"];

  const needsRPC = true;//typeof window.__TAURI__ !== "undefined";
  const dataSlider = needsRPC ? 
  <Slider
        min={20}
        max={1000}
        onChange={(n: number) => {
          API.data_rate(n)
          dataBuffer.setDataRate(n)
          setDataRate(n)
        }}
        initial={initial_rate}
      />
      : null;

  return (
    <div>
      <Button onClick={() => setPaused(false)} disabled={!paused}>
        Start plotting
      </Button>
      <Button onClick={() => setPaused(true)} disabled={paused}>
        Pause plotting
      </Button>
      <Slider
        min={1}
        max={400}
        onChange={(n: number) => {
          dataBuffer.setWindowSize(n*dataBuffer.dataRate);
          setWindowSize(n);
        }}
        initial={windowSize}//dataBuffer.size/dataBuffer.dataRate}
      />
      {windowSize} seconds 
      {dataSlider} 
      {initial_rate} Hz
      {dataBuffer.channelNames.slice(0,numPlots).map((_name, i) => (
        <TracePlot
          key={i}
          color={colors[i % colors.length]}
          channelIndex={i}
          dataBuffer={dataBuffer}
          showTitle={i === 0}
          showAxis={i == numPlots-1}
          paused={paused}
          height = {300}
        />
      ))}
      {<CombinedSpectrumPlot dataBuffer={dataBuffer} paused={paused} num_field = {numNoise} />}
    </div>
  );
};

type ScalarPaneProps = {
  dataBuffer: DataBuffer;
  api: API;
};
const ScalarPane = ({ dataBuffer, api:API}: ScalarPaneProps) => {
  (window as any).plotBuffer = dataBuffer; // a way to debug an object interactively
  const [windowSize, setWindowSize] = useState(dataBuffer.size/dataBuffer.dataRate);
  const [_initial_rate, _setDataRate] = useState(dataBuffer.dataRate);
  const [paused, setPaused] = useState(false);

  const colors = ["red", "green", "blue"];
  const index = dataBuffer.viewers.indexOf("Scalar");

  return (
    <div>
      <Button onClick={() => setPaused(false)} disabled={!paused}>
        Start plotting
      </Button>
      <Button onClick={() => setPaused(true)} disabled={paused}>
        Pause plotting
      </Button>
      <Slider
        min={1}
        max={400}
        onChange={(n: number) => {
          dataBuffer.setWindowSize(n*dataBuffer.dataRate);
          setWindowSize(n);
        }}
        initial={windowSize}
      />
      {/* <SizeReading dataBuffer = {dataBuffer} /> */}
      {windowSize} seconds <br></br>
      <div style={{display: 'flex'}}>
      {dataBuffer.viewer_rpcs[index].map((name, i) => (
        <Reading name = {name} api = {API} dataBuffer = {dataBuffer} vindex = {index} rpcindex = {i}/>
      ))
      }
      </div>
      {dataBuffer.channelNames.slice(0,3).map((_name, i) => (
        <TracePlot
          key={i}
          color={colors[i % colors.length]}
          channelIndex={i}
          dataBuffer={dataBuffer}
          showTitle={i === 0}
          showAxis={i == 2}
          paused={paused}
          height = {300}
        />
      ))}
      {<CombinedSpectrumPlot dataBuffer={dataBuffer} paused={paused} num_field = {2} />}
    </div>
  );
};

const SizeReading = ({dataBuffer}: {dataBuffer: DataBuffer}) => {
  const [size, setSize] = useState(dataBuffer.size/dataBuffer.dataRate);
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //console.log("running handle change");
    setSize(e.target.size);
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    dataBuffer.setWindowSize(size*dataBuffer.dataRate);
    setSize(size);
    e.preventDefault();
  }
  return(
    <form id = "windowSize" onSubmit = {handleSubmit} >
    <p></p>
          <label>
              Window Size:
              &nbsp;
              <input type="text" name="windowSize" value = {size} onChange = {handleChange} size = {5}/>
              &nbsp;&nbsp;&nbsp;
            </label>
    </form>
    )

  
}

const Reading = ({name, api, dataBuffer, vindex, rpcindex}: {name: string, api: API, dataBuffer: DataBuffer, vindex: number, rpcindex: number}) => {
  const [enabled, setEnabled] = useState(true);
  useEffect(() => {
    if (dataBuffer.viewer_rpcs_isbool[vindex][rpcindex] == true) {
      api.rpc(name,null).then((initialValue) => {
        // not sure if this is the best check here - I imagine this will change when the metadata changes
        if (initialValue == "\u{1}") {
          setEnabled(true);
        } else {
          setEnabled(false);
        }
      });
    }
  }, [])
  const handleChecking = () => {
    setEnabled(!enabled);
    if (!enabled == false) {
      console.log("here");
      api.rpc(name, "0");
    } else {
      api.rpc(name, "1");
    }
  }
  const [value, setValue] = useState("loading");
  useEffect(() => {
    api.rpc(name,null).then((initialValue) => setValue(initialValue));
  }, [])
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //console.log("running handle change");
    setValue(e.target.value);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await api.rpc(name,value);
  }
if (dataBuffer.viewer_rpcs_isbool[vindex][rpcindex] == false){ 
  return(
  <form id = {name} onSubmit = {handleSubmit} >
  <p></p>
        <label>
            {name}
            &nbsp;
            <input type="text" name="name" value = {value} onChange = {handleChange} size = {5}/>
            &nbsp;&nbsp;&nbsp;
          </label>
  </form>
  )
}
else {
  return(
    <form id = {name} onSubmit = {handleSubmit} >
    <p></p>
          <label>
              <input type="checkbox" id="name" name = "name" checked = {enabled} onChange = {handleChecking} size = {5}/>
              {name}
              &nbsp;&nbsp;&nbsp;
            </label>
    </form>
  )
}
}

type LaserPaneProps = {
  dataBuffer: DataBuffer;
  api: API;
};
const LaserPane = ({ dataBuffer, api:API}: LaserPaneProps) => {
  (window as any).plotBuffer = dataBuffer; // a way to debug an object interactively
  const [windowSize, setWindowSize] = useState(dataBuffer.size/dataBuffer.dataRate);
  const [initial_rate, setDataRate] = useState(dataBuffer.dataRate);
  const [paused, _setPaused] = useState(false);
  const colors = ["red", "green", "blue"];
  const index = dataBuffer.viewers.indexOf("Laser");
  const needsRPC = true;//typeof window.__TAURI__ !== "undefined";
  const dataSlider = needsRPC ? 
  <Slider
        min={20}
        max={1000}
        onChange={(n: number) => {
          API.data_rate(n)
          dataBuffer.setDataRate(n)
          setDataRate(n)
        }}
        initial={initial_rate}
      />
      : null;
  
  const laserMeasureIndex = dataBuffer.channelNames.indexOf("laser.measure");
  const laserOutputIndex = dataBuffer.channelNames.indexOf("laser.output");
  const supplyCurrentIndex = dataBuffer.channelNames.indexOf("supply.current");

  return (
    <div>
      <Slider
        min={1}
        max={400}
        onChange={(n: number) => {
          dataBuffer.setWindowSize(n*dataBuffer.dataRate);
          setWindowSize(n);
        }}
        initial={windowSize}
      />
      {windowSize} seconds
      {dataSlider} 
      {initial_rate} Hz
      {
        <TracePlot
          key={laserMeasureIndex}
          color={colors[laserMeasureIndex % colors.length]}
          channelIndex={laserMeasureIndex}
          dataBuffer={dataBuffer}
          showTitle={false}
          showAxis={false}
          paused={paused}
          height = {400}
        />
      }
      {
        <TracePlot
          key={laserOutputIndex}
          color={colors[laserOutputIndex % colors.length]}
          channelIndex={laserOutputIndex}
          dataBuffer={dataBuffer}
          showTitle={false}
          showAxis={false}
          paused={paused}
          height = {400}
        />
      }
      {
        <TracePlot
          key={supplyCurrentIndex}
          color={colors[supplyCurrentIndex % colors.length]}
          channelIndex={supplyCurrentIndex}
          dataBuffer={dataBuffer}
          showTitle={false}
          showAxis={false}
          paused={paused}
          height = {400}
        />
      }
      {dataBuffer.viewer_rpcs[index].map((name, _i) => (
      <form>
        <label>
          {name}
          <input type="text" name="name"/>
        </label>
      </form>
      ))
      }
      <br></br>
    </div>
  );
};

// type StatusProps = {
//   api: API,
//   dataBuffer: DataBuffer,
//   numPlots: number,
//   numNoise: number,
//   status: string[],
// }
// const StatusProps = ({ dataBuffer, api:API, numPlots, numNoise, status}: StatusProps) => {
//   if (status.includes("Scalar")) {

//   }
// })
