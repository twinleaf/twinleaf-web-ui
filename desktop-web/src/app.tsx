import { Component, useState, MouseEvent, useRef, useCallback } from "react";
import uPlot from "uplot";
import {
  Button,
  Container,
  Grid,
  Header,
  Icon,
  Image,
  Item,
  Label,
  Menu,
  MenuItemProps,
  Segment,
  Step,
  Table,
} from "semantic-ui-react";

type ContentPane = "configure" | "plot" | "about";

export const App = () => {
  const [activePane, setActivePane] = useState<ContentPane>("configure");

  return (
    <Container fluid={true}>
      <TopBar activePane={activePane} setActivePane={setActivePane} />
      <Header as="h1">{activePane}</Header>
      <ExampleGraph hidden={activePane !== "plot"} />
      {activePane === "configure"
        ? "this is where you configure"
        : activePane === "about"
        ? "this is an about page, do we need this?"
        : null}
    </Container>
  );
};

function foo(x: number): number {
  return "asdf"; // this is a type error! and that shows TypeScript is working.
  // However, esbuild is not a type checker! It bundles code with type errors no problem.
}

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
    </Menu>
  );
};

type ExampleGraphProps = {
  hidden: boolean;
};

const ExampleGraph = (props: ExampleGraphProps) => {
  const plotBuffer = useRef<FakePlotBuffer>(
    new FakePlotBuffer({
      interval: 50,
      loop: 1000,
    })
  );
  (window as any).plotBuffer = plotBuffer.current; // a way to debug an object interactively

  const elRef = useRef<HTMLDivElement>();
  const setEl = useCallback((el) => {
    elRef.current = el;
    // kick something off synchronously here
    plotBuffer.current.start();
    makePlot(el, plotBuffer.current.data);
  }, []);

  return <div ref={setEl} />;
};

class FakePlotBuffer {
  interval: number;
  loop: number;
  data: [number[], number[], number[], number[]] = [[], [], [], []];
  intervalTimer: ReturnType<typeof setInterval>;

  constructor({ interval, loop }: { interval: number; loop: number }) {
    this.loop = loop;
    this.interval = interval;
  }

  addData = () => {
    if (this.data[0].length === this.loop) {
      this.data[0].shift();
      this.data[1].shift();
      this.data[2].shift();
      this.data[3].shift();
    }

    this.data[0].push(Date.now());
    this.data[1].push(0 - Math.random());
    this.data[2].push(-1 - Math.random());
    this.data[3].push(-2 - Math.random());
  };

  start() {
    this.intervalTimer = setInterval(this.addData, this.interval);
  }

  stop() {
    clearTimeout(this.intervalTimer);
  }
}

function makePlot(
  el: HTMLElement,
  data: [number[], number[], number[], number[]]
) {
  const windowSize = 120000; // What the heck is windowSize?
  function getSize() {
    return {
      //width: window.innerWidth - 100,
      //height: window.innerHeight / 3,
      width: 800,
      height: 400,
    };
  }

  const scales = {
    x: {},
    y: {
      auto: false,
      range: [-3.5, 1.5] as [number, number],
    },
  };

  const opts = {
    title: "Scrolling Data Example",
    ...getSize(),
    pxAlign: 0,
    ms: 1 as const,
    scales,
    pxSnap: false,
    series: [
      {},
      {
        stroke: "red",
        paths: uPlot.paths.linear(),
        spanGaps: true,
        pxAlign: 0,
        points: { show: true },
      },
      {
        stroke: "blue",
        paths: uPlot.paths.spline(),
        spanGaps: true,
        pxAlign: 0,
        points: { show: true },
      },
      {
        stroke: "purple",
        paths: uPlot.paths.stepped({ align: 1 }),
        spanGaps: true,
        pxAlign: 0,
        points: { show: true },
      },
    ],
  };

  let u = new uPlot(opts, data, el);

  function update() {
    const now = Date.now();
    const scale = { min: now - windowSize, max: now };

    u.setData(data, false);
    u.setScale("x", scale);

    requestAnimationFrame(update);
  }

  update();

  window.addEventListener("resize", (e) => {
    u.setSize(getSize());
  });
}
