import * as d3 from "d3";
import React, { useState, useEffect, ReactNode } from "react";
import { List, ListItem } from "@material-ui/core";
import {
  getWidth,
  getHeight,
  formatNums,
  formatNumLocale,
  sumValues,
} from "./helpers";

import {
  SVG,
  Group,
  Circle,
  Path,
  Rect,
  ToolTip,
  setLables,
  TextArea,
  setToolTip,
} from "./svg";
import { node } from "prop-types";

type Readings = {
  systole: number;
  diastole: number;
  addedon: Date;
  id: number;
  selecteddate: Date;
};
interface LineProps {
  data: Readings[];
  getTools: (info: any) => void;
  getOp: (f: boolean) => boolean;
}

let fill = "blue";
const bg = "skyblue";

const [h, gh] = getHeight();
const [w, gw] = getWidth();
/*SCALES AND AXIS */
//scales
const xScale = d3.scaleTime().rangeRound([0, gw]);
const yScale = d3.scaleLinear().rangeRound([gh, 0]);
const aScale = d3.scaleSqrt().range([0, 10]);
const color = d3.scaleOrdinal(d3.schemeCategory10);

//axis
const yaxis = d3
  .axisLeft(yScale)
  .ticks(6)
  .tickFormat((d) => (d > 0 ? formatNums(d) : ""));

const xaxis = d3.axisBottom(xScale); //.ticks(20).tickFormat(d => new Date(d).toDateString());
//grid lines
const gridlines = () => d3.axisLeft(yScale);
const xlabel = setLables(gw / 2.5, h - 50, "black", 0, "1rem", "bold");
const ylabel = setLables(-gh / 1.4, -55, "black", -90, "1rem", "bold");
const title = setLables(50, 0, "black", 0, "1rem", "bold");
type Reading = {
  w: number;
  x: number;
  y: number;
  tool: boolean;
  bg: string;
  data: Readings;
  profile: {
    name: string;
    email: string;
    phone: string;
  };
};

function Line({ data, getTools, getOp, profile }: LineProps): JSX.Element {
  const [lines, setLines] = useState(false);
  const [circles, setCircles] = useState(false);

  const [reading, setReading] = React.useState<Reading>({});

  const useMobile = () =>
    document.documentElement.clientWidth <= 480 ? true : false;

  const [guide, setGuide] = useState("");
  /* Scales and axis invocation */

  useEffect(() => {
    const timer = setTimeout(
      () =>
        setGuide(
          "Hover on the coloured circles to view more info, use menu on right side to refine visuals"
        ),
      3000
    );
    return () => clearTimeout(timer);
  }, []);
  const updateScales = (data: Readings[]) => {
    //attach domain to scale
    const xtent: [Date, Date] = d3.extent(
      data,
      (d: Readings) => new Date(d["selecteddate"])
    );
    const max = d3.max(data, (d) => d["systole"]);

    xScale.domain(xtent);
    yScale.domain([40, 200]);
    aScale.domain([0, max]);
  };
  const updateAxis = () => {
    const ygrp = d3.select(".lygrp");
    const xgrp = d3.select(".lxgrp");
    const gridline = d3.select(".grid");
    //axis
    ygrp.transition().duration(1000).call(yaxis);
    xgrp.transition().duration(1000).call(xaxis);
    //grids
    //gridline.call(gridlines().tickSize(-2000, 0, 0).tickFormat(""));

    //text on y axis
    ygrp
      .selectAll("text")
      .transition()
      .duration(1000)
      .attr("font-size", "1rem")
      .attr("font-family", "roboto")
      .attr("x", -15);
    //text on x axis
    xgrp
      .selectAll("text")
      .transition()
      .duration(1000)
      .attr("fill", "black")
      .attr("transform", "rotate(-60)")
      .attr("font-family", "roboto")
      .attr("font-size", "1rem")

      .attr("text-anchor", "end")
      .attr("y", 0)
      .attr("x", -15);
  };
  // update scales
  updateScales(data);
  const from = new Date(data[0]?.selecteddate).toDateString();
  const to = new Date(data[data.length - 1]?.selecteddate).toDateString();

  const fdataset = forceLayout(data);
  const force = d3
    .forceSimulation(fdataset.nodes)
    .force("charge", d3.forceManyBody)
    .force("link", d3.forceLink(fdataset.edges))
    .force(
      "center",
      d3
        .forceCenter()
        .x(gw / 2)
        .y(gh / 2)
    );

  /*force.on("tick", function () {
    const { edges, nodes } = fdataset;
    edges
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
    nodes.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  });*/
  //console.log(force, fdataset);
  return (
    <div className="relative">
      {reading?.tool && <BpToolTip payload={reading} />}
      <SVG w={w} h={h} bg={bg}>
        {/*overall group */}
        <Group x={80} y={40} gw={gw} gh={gh}>
          {/*Legend*/}
          <Legend defaultData={info} />

          {data.map((d, i) => {
            setTimeout(() => updateAxis(), 100);
            return (
              <Group key={i}>
                <PathF
                  dataset={[
                    { systole: 120, selecteddate: data[0]?.selecteddate },
                    {
                      systole: 120,
                      selecteddate: data[data.length - 1]?.selecteddate,
                    },
                  ]}
                  stroke=""
                  strokew={1}
                  accessor="systole"
                  ccolor="gray"
                />

                <PathF
                  dataset={[
                    { systole: 80, selecteddate: data[0]?.selecteddate },
                    {
                      systole: 80,
                      selecteddate: data[data.length - 1]?.selecteddate,
                    },
                  ]}
                  stroke=""
                  strokew={1}
                  accessor="systole"
                  ccolor="gray"
                />

                {/*Path remover*/}
                {!lines ? (
                  <PathF
                    dataset={data}
                    stroke=""
                    strokew={2}
                    accessor="systole"
                  />
                ) : null}
                {!lines ? (
                  <PathF
                    dataset={data}
                    stroke=""
                    strokew={2}
                    accessor="diastole"
                  />
                ) : null}
                {/*Check for mobile devices*/}
                {!useMobile() ? (
                  !circles ? (
                    <Circles
                      a="systole"
                      defaultData={data}
                      gt={getTools}
                      getOp={getOp}
                      fill={color(i)}
                      getReading={setReading}
                      renderProp={(num: number) =>
                        num > 120 ? "red" : "green"
                      }
                    />
                  ) : null
                ) : null}
                {!useMobile() ? (
                  !circles ? (
                    <Circles
                      a="diastole"
                      defaultData={data}
                      gt={getTools}
                      getOp={getOp}
                      fill={color(i)}
                      getReading={setReading}
                      renderProp={(num: number) =>
                        num < 80 ? "orange" : "green"
                      }
                    />
                  ) : null
                ) : null}
              </Group>
            );
          })}
          <TextArea {...title}>
            {profile.name}: {from} - {to}
          </TextArea>
          <TextArea {...ylabel}>Readings</TextArea>
          <TextArea {...xlabel}>Date</TextArea>

          {/*y axis */}
          <Group classlist="lygrp" x={0} y={0}></Group>
          {/*x axis */}
          <Group classlist="lxgrp" x={0} y={gh}></Group>
          {/*grid lines axis */}
          <Group classlist="grid" x={0} y={0}></Group>
        </Group>
      </SVG>
    </div>
  );
}

export default Line;

type CircleProps = {
  defaultData: Readings[];
  a: string;
  fill: string;
  gt: (a: any) => void;
  getOp: (a: boolean) => boolean;
  getReading: (payload: any) => void;
  renderProp: (num: number) => string;
};
const Circles = ({
  defaultData = [],
  a = "systole",
  fill = "#000",
  gt,
  getOp = (f: boolean) => f,
  getReading,
  renderProp,
}: CircleProps) => {
  const [hover, setHover] = useState(0);

  const handleHover = (
    e: React.MouseEvent<SVGCircleElement>,
    data: Readings
  ) => {
    // use d3 to select
    const selected = d3.select(e.target as SVGCircleElement);

    const coords = {
      x: Number(selected.attr("cx")),
      y: Number(selected.attr("cy")),
      w: 150, //Number(selected.attr("width")),
      tool: true,
      bg: "white",
      data,
    };
    getOp(true);
    gt(coords);
    getReading(coords);
  };

  const handleLeave = (e: React.MouseEvent<HTMLOrSVGElement>) => {
    getOp(false);
    gt({});
    getReading({});
  };

  return (
    <>
      {defaultData.map((item: Readings, i: number) => {
        const y = yScale(item[a]);

        return (
          <circle
            fill={renderProp(item[a])}
            key={i}
            onMouseLeave={(e) => handleLeave(e)}
            onMouseOver={(e) => handleHover(e, item)}
            opacity={0.7}
            cx={xScale(new Date(item.selecteddate))}
            cy={y}
            r={5}
          />
        );
      })}
    </>
  );
};

const Legend = ({
  defaultData,
}: {
  defaultData: { color: string; info: string; id: number }[];
}) => (
  <Group classlist="legend" x={200} y={70}>
    {defaultData.map((data, i) => (
      <Group key={data.id}>
        <Rect width={20} fill={data.color} y={-i * 20} height={10} />
        <text key={i} x={25} y={-(i * 20) + 10} width={10} height={10}>
          {data.info}
        </text>
      </Group>
    ))}
  </Group>
);

type PathF = {
  dataset: Readings[];
  stroke: string;
  strokew: number;
  accessor: string;
  cccolor?: string;
};
const PathF = ({
  dataset,
  stroke,
  strokew = 20,
  accessor,
  ccolor = "#ccc",
}: PathF) => {
  const line = d3
    .line()
    .x((d) => xScale(new Date(d["selecteddate"])))
    .y((d) => {
      // d[accessor] > 90 ? (ccolor = "red") : (ccolor = "#ccc");

      return yScale(d[accessor]) > gh
        ? Math.abs(gh - yScale(d[accessor]))
        : yScale(d[accessor]);
    });

  const path = line(dataset);

  return <Path d={path} stroke={ccolor} strokeWidth={strokew} fill="none" />;
};

export const BpToolTip = ({ payload }) => {
  return (
    <ToolTip data={payload}>
      <List>
        <ListItem dense divider>
          <b>{new Date(payload?.data?.selecteddate).toDateString()}</b>
        </ListItem>
        <ListItem dense divider>
          Systole: <b>{payload?.data?.systole}</b>
        </ListItem>
        <ListItem dense divider>
          Diastole: <b>{payload?.data?.diastole}</b>
        </ListItem>
        <ListItem dense divider>
          Heart rate: <b> {payload?.data?.heartbeat}</b>
        </ListItem>
      </List>
    </ToolTip>
  );
};
const info = [
  { id: 3, color: "orange", info: "below normal" },

  { id: 2, color: "green", info: "normal" },
  { id: 1, color: "red", info: "above normal" },
];

function forceLayout(dataset) {
  return {
    nodes: dataset.map((item) => ({ name: item.selecteddate })),
    edges: dataset.map((item, i) => ({ source: i, target: i })),
  };
}
