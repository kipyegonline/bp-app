import React from "react";
import type { AppProps /*, AppContext */ } from "next/app";
import "typeface-roboto";
import "typeface-raleway";
import "../styles/tailwind.css";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps): React.ReactNode {
  return <Component {...pageProps} />;
}

export default MyApp;
