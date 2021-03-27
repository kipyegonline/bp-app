/* global _, d3 */
const MARGIN = { top: 20, right: 20, bottom: 30, left: 50 };
const WIDTH = 550 - MARGIN.left - MARGIN.right;
const HEIGHT = 300 - MARGIN.top - MARGIN.bottom;
const DASH_LENGTH = 2;
const DASH_SEPARATOR_LENGTH = 2;

// Generate some random data to populate the chart:
const lineData = getRandomData();

// Draw the chart as usual:
const scales = {
  x: d3.time
    .scale()
    .domain(d3.extent(lineData, (d) => d.date))
    .range([0, WIDTH]),
  y: d3.scale
    .linear()
    .domain(d3.extent(lineData, (d) => d.value))
    .range([HEIGHT, 0]),
};

const xAxis = d3.svg.axis().scale(scales.x).orient("bottom");

const yAxis = d3.svg.axis().scale(scales.y).orient("left");

const line = d3.svg
  .line()
  .x((d) => scales.x(d.date))
  .y((d) => scales.y(d.value))
  .interpolate("basis");

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", WIDTH + MARGIN.left + MARGIN.right)
  .attr("height", HEIGHT + MARGIN.top + MARGIN.bottom)
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`);

svg
  .append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${HEIGHT})`)
  .call(xAxis);

svg.append("g").attr("class", "y axis").call(yAxis);

svg
  .append("path")
  .datum(lineData)
  .attr("class", "line")
  .attr("d", line)
  .attr("stroke-dasharray", function (d) {
    return getDashArray(d, this);
  });

// Dashing-related stuff begins here:

function getDashArray(data, path) {
  const dashedRanges = getDashedRanges(data);
  if (dashedRanges.length === 0) return null;

  const lengths = data.map((d) => getPathLengthAtX(path, scales.x(d.date)));
  return buildDashArray(dashedRanges, lengths);
}

function getDashedRanges(data) {
  const hasOpenRange = (arr) => _.last(arr) && !("end" in _.last(arr));
  const lastIndex = data.length - 1;

  return _.reduce(
    data,
    (res, d, i) => {
      const isRangeStart = !hasOpenRange(res) && isDashed(d);
      if (isRangeStart) res.push({ start: Math.max(0, i - 1) });

      const isRangeEnd = hasOpenRange(res) && (!isDashed(d) || i === lastIndex);
      if (isRangeEnd) res[res.length - 1].end = i;

      return res;
    },
    []
  );
}

function getPathLengthAtX(path, x) {
  const EPSILON = 1;
  let point;
  let target;
  let start = 0;
  let end = path.getTotalLength();

  // Mad binary search, yo
  while (true) {
    target = Math.floor((start + end) / 2);
    point = path.getPointAtLength(target);

    if (Math.abs(point.x - x) <= EPSILON) break;

    if ((target >= end || target <= start) && point.x !== x) {
      break;
    }

    if (point.x > x) {
      end = target;
    } else if (point.x < x) {
      start = target;
    } else {
      break;
    }
  }

  return target;
}

function buildDashArray(dashedRanges, lengths) {
  return _.reduce(
    dashedRanges,
    (res, { start, end }, i) => {
      const prevEnd = i === 0 ? 0 : dashedRanges[i - 1].end;

      const normalSegment = lengths[start] - lengths[prevEnd];
      const dashedSegment = getDashedSegment(lengths[end] - lengths[start]);

      return res.concat([normalSegment, dashedSegment]);
    },
    []
  );
}

function getDashedSegment(length) {
  const totalDashLen = DASH_LENGTH + DASH_SEPARATOR_LENGTH;
  const dashCount = Math.floor(length / totalDashLen);
  return _.range(dashCount)
    .map(() => DASH_SEPARATOR_LENGTH + "," + DASH_LENGTH)
    .concat(length - dashCount * totalDashLen)
    .join(",");
}

function isDashed(d) {
  return !d.certainty;
}

function getRandomData() {
  return _.range(2000, 2016).map((year) => ({
    date: new Date(year + ""),
    value: _.random(5),
    certainty: year % 5 > 0,
  }));
}
/*body {
  font: 10px sans-serif;
}

.axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.x.axis path {
  display: none;
}

.line {
  fill: none;
  stroke: steelblue;
  stroke-width: 1.5px;
}
*/
