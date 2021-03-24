import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

type SVGProps = { h: number; w: number; classlist: string; bg: string };
//svg
export const SVG = styled.svg.attrs((props: SVGProps) => ({
  height: props.h,
  width: props.w,
  className: props.classlist,
}))`
  background: ${(props: SVGProps) => props.bg};
  border-radius: 10px;
  margin: auto;
`;

SVG.propTypes = {
  h: PropTypes.number.isRequired,
  w: PropTypes.number.isRequired,
  bg: PropTypes.string.isRequired,
};
SVG.defaultProps = {
  h: 480,
  w: 500,
  bg: "#fefefe",
};
//group tag
type GroupProps = {
  classlist: string;
  gh: number;
  gw: number;
  x: number;
  y: number;
};
export const Group = styled.g.attrs((props: GroupProps) => ({
  className: props.classlist,
  height: props.gh,
  width: props.gw,
}))`
  transform: translate(
    ${(props: GroupProps) => props.x}px,
    ${(props: GroupProps) => props.y}px
  );
`;

Group.defaultProps = {
  gw: 0,
  gh: 0,
  classlist: "",
  x: 0,
  y: 0,
};
//rect
export const Rect = styled.rect.attrs((props: RectpropTypes) => ({
  onClick: props.hc,
  onMouseOver: props.hh,
  onMouseLeave: props.hl,
  className: props.classlist,
  x: props.x,
  y: props.y,
  width: props.width,
  height: props.height,
}))`
  shaperendering: crispEdges;
  opacity: ${(props: RectpropTypes) => props.opacity};
  fill: ${(props: RectpropTypes) => props.fill};
  transform: translate(
    ${(props: RectpropTypes) => props.tx}px,
    ${(props: RectpropTypes) => props.ty}px
  );
  transition: all 0.2s linear;

  &:hover {
    fill: orange;
    width: ${(props: RectpropTypes) => props.hover + 5}px;
    opacity: ${(props: RectpropTypes) => props.opacitad};
    z-index: 10;
  }
`;
type RectpropTypes = {
  hc: () => void;
  hh: () => void;
  fill: string;
  hl: () => void;
  classlist: string;
  x: number;
  y: number;
  width: number;
  height: number;
  opacitad: number;
  ty: number;
  tx: number;
  hover: number;
  opacity: number;
};
Rect.defaultProps = {
  x: 0,
  y: 480,
  height: 0,
  tx: 0,
  ty: 0,
};
//Text
export const Text = ({
  x,
  y,
  text,
  transform,
  classlist,
}: TextProps): JSX.Element => (
  <text x={x} y={y} fill={"black"} transform={transform} className={classlist}>
    {text}
  </text>
);

`
   x:${(props: TextProps) => props.x};
   y:${(props: TextProps) => props.y};
   fill:${(props: TextProps) => props.fill};
   `;
type TextProps = {
  x: number;
  y: number;
  text: string;
  classlist: string;
  fill: string;
  transform: string;
};

//path

export const Path = styled.path.attrs((props: PathProps) => ({
  onClick: props.hc,
  onMouseOver: props.hh,
  onMouseLeave: props.hl,
  className: props.classlist,
  d: props.d,
}))`
  opacity: ${(props: PathProps) => props.opacity};
  stroke: ${(props: PathProps) => props.stroke};
  fill: ${(props: PathProps) => props.fill};
  shaperendering: crispEdges;
  strokewidth: ${(props: PathProps) => props.strokew}px;
`;

type PathProps = {
  hc: () => void;
  hh: () => void;
  hl: () => void;
  classlist: string;
  d: string;
  opacity: number;
  stroke: string;
  fill: string;
  strokew: number;
};
//circle
export const Circle = styled.circle.attrs((props: CircleProps) => ({
  onClick: props.hc,
  onMouseOver: props.hh,
  onMouseLeave: props.hl,
  className: props.classlist,
}))`
  cx: ${(props: CircleProps) => props.cx}px;
  cy: ${(props: CircleProps) => props.cy}px;
  r: ${(props: CircleProps) => props.r}px;
  shaperendering: crispEdges;
  fill: ${(props: CircleProps) => props.fill};
  opacity: ${(props: CircleProps) => props.opacity};
  transition: all.2s easse-in-out;
  &:hover {
    fill: deepskyblue;
  }
`;
type CircleProps = {
  hc: () => void;
  hh: () => void;
  hl: () => void;
  classlist: string;
  cx: number;
  cy: number;
  r: number;
  fill: string;
  opacity: number;
};

Circle.defaultProps = {
  cx: 0,
  cy: 0,
  fill: "black",
  r: 5,
  opacity: 0.8,
};
export const ToolTip = styled.div.attrs((props: ToolTipProps) => ({
  className: "covid-tip",
}))`
  width: ${(props: ToolTipProps) => props.data.w || 0}px;
  border-radius: 10px;
  background: ${(props: ToolTipProps) => props.data.bg};
  padding: 0.5rem;
  font-size: 1rem;
  margin: 5px;
  top: ${(props: ToolTipProps) => props.data.y / 2 || 0}px;
  left: ${(props: ToolTipProps) => props.data.x + 40 || 0}px;
  position: absolute;
  z-index: 110;
  height: auto;
  opacity: ${(props: ToolTipProps) => (props.data.tool ? 1 : 0)};
  transition: all 0.25s ease-in;
  box-shadow: -2px -2px 3px #fff, 2px 2px 3px #fff;
  pointer-events: none;

  @media (max-width: 480px) {
     {
      padding: 0.5rem;
      text-align: left !important;

      margin: 5px;
      width: ${(props: ToolTipProps) => props.data.w / 2 || 0}px;
      font-size: 1rem;
    }
  }
  @media (min-width: 480px) and(max-width:768px) {
     {
      padding: 0.5rem;
      text-align: left !important;
      margin: 5px;
      width: ${(props: ToolTipProps) => props.data.w / 2 || 0}px;
      font-size: 1rem;
    }
    & img {
      width: 30px;
    }
  }
`;
type ToolTipProps = {
  w: number;
  bg: string;
  y: number;
  x: number;

  tool: boolean;
  data: {};
};
ToolTip.defaultProps = {
  w: 100,
  bg: "#fff",
  tool: false,
  x: 0,
  y: 0,
};
export const Tip = styled.span.attrs((props: TipProps) => ({
  className: props.classlist,
}))`
  padding: 0.25rem;
  display: block;
  margin: 0;
  font-size: 1rem;
  font-family: roboto;
  @media (max-width: 480px) {
    padding: 0.25rem;
    font-size: 1rem;
  }
`;

type TipProps = {
  classlist: string;
};
export const TextArea = ({
  children,
  x,
  y,
  fill,
  rotate,
  fontSize,
  fontWeight,
}: TextAreaProps): JSX.Element => (
  <text
    x={x}
    y={y}
    fill={fill}
    fontWeight={fontWeight}
    transform={`rotate(${rotate})`}
    fontSize={fontSize}
  >
    {children}
  </text>
);

export const setLables = <T extends number, X extends string>(
  x: T,
  y: T,
  fill: X,
  rotate: T,
  fontSize: X,
  fontWeight: X
): LabelProps => {
  const w = globalThis.window && document.documentElement.clientWidth;
  if (w <= 480) {
    return { x, y, fill, rotate, fontSize, fontWeight };
  } else if (w <= 768) {
    return { x, y, fill, rotate, fontSize, fontWeight };
  }
  return { x, y, fill, rotate, fontSize, fontWeight };
};
type LabelProps = {
  x: number;
  y: number;
  fill: string;
  rotate: number;
  fontSize: string;
  fontWeight: string;
};
type TextAreaProps = {
  children: React.ReactNode;
  fill: string;
  rotate: number;
  x: number;
  y: number;
  fontSize: string;
  fontWeight: string;
};

TextArea.defaultProps = {
  fill: "black",
  rotate: 0,
  x: 0,
  y: 0,
  fontSize: "1rem",
  fontWeight: "normal",
};

export const setToolTip = (a: number, b: number, c: number): number => {
  const w = globalThis.window && document.documentElement.clientWidth;
  if (w <= 480) {
    return a;
  } else if (w <= 768) {
    return b;
  } else {
    return c;
  }
};
