import React from "react";

export function formatNums(num: number): string | number {
  if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + "M";
  }
  if (num >= 1000) {
    return (num / 1e3).toFixed() + "K";
  }
  return num;
}

export function formatNumLocale(num: number): string | number {
  return num !== undefined ? num.toLocaleString("en") : 0;
}

export function getWidth() {
  let w = globalThis.window && document.documentElement.clientWidth;
  if (w <= 480) {
    return [300, 200];
  } else if (w <= 768) {
    return [600, 480];
  } else {
    return [800, 680];
  }
}
export function getHeight() {
  let w = globalThis.window && document.documentElement.clientWidth;
  if (w <= 480) {
    return [300, 180];
  } else {
    return [400, 280];
  }
}

export function sumValues(arr: any[], field: string) {
  const answer = arr
    .filter((ar) => !Number.isNaN(Number(ar[field])))
    .reduce((a, b) => a + b[field], 0);
  return answer > 1e3 ? answer.toLocaleString() : answer;
}

export const Suspense = ({
  chart,
  spinner,
}: {
  chart: JSX.Element;
  spinner: boolean;
}): JSX.Element => (
  <div className=" mt-5 mx-auto p-5">
    {spinner ? <p className=" text-center ">spinner</p> : null}
    {spinner ? (
      <p className="suspense-p text-center">Loading {chart}....</p>
    ) : (
      <p className="text-danger">
        Error loading {chart}. <br /> Check internet connection and try again
      </p>
    )}
  </div>
);
//pagination
export const paginationDevice = (): number => {
  const w = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;
  if (w <= 360) {
    return Math.ceil(height / 65) * 2;
  } else if (w <= 768) {
    return Math.ceil(height / 88) * 3;
  }
  return 25;
};
export const useMobile = (): boolean =>
  document.documentElement.clientWidth <= 480 ? true : false;
