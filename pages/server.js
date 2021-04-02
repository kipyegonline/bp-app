/*
import express from "express";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { ServerStyleSheets, ThemeProvider } from "@material-ui/core/styles";
import App from "./App";
import theme from "./theme";

function handleRender(req, res) {
  const sheets = new ServerStyleSheets();

  // Render the component to a string.
  const html = ReactDOMServer.renderToString(
    sheets.collect(
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    )
  );

  // Grab the CSS from the sheets.
  const css = sheets.toString();

  // Send the rendered page back to the client.
  res.send(renderFullPage(html, css));
}

const app = express();

app.use("/build", express.static("build"));

// This is fired every time the server-side receives a request.
app.use(handleRender);

const port = 3000;
app.listen(port);
function renderFullPage(html, css) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>My page</title>
        <style id="jss-server-side">${css}</style>
      </head>
      <body>
        <div id="root">${html}</div>
      </body>
    </html>
  `;
}

/*
client side 
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import App from './App';
import theme from './theme';

function Main() {
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
}

ReactDOM.hydrate(<Main />, document.querySelector('#root'));*/
export default function Server() {
  return <p>Server...</p>;
}
