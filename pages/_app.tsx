import React from "react";
import type { AppProps /*, AppContext */ } from "next/app";
import "typeface-roboto";
import "typeface-raleway";
import "../styles/tailwind.css";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps): React.ReactNode {
  React.useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  return <Component {...pageProps} />;
}

export default MyApp;
