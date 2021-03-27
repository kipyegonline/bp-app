import React from "react";
import {
  Backdrop,
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@material-ui/core";
import Router from "next/router";
import Header from "./Head";
import Footer from "./Footer";
import Nav from "./Nav";
import Drawer from "./sideNav";

type Layout = { children: React.ReactNode; title?: string };
export const getToken = () =>
  globalThis.window &&
  JSON.parse(localStorage.getItem("systolediastole") as any);

function Layout({ children, title }: Layout): React.ReactElement {
  const [auth, setAuth] = React.useState(getToken());
  const [redirect, setRedirect] = React.useState("Opening....");

  React.useEffect(() => {
    console.log("running effect", auth);
    const token = getToken();
    console.log(token, "token");
    if (!auth?.altId) setAuth(getToken());
  }, []);

  const Loading = () => {
    React.useEffect(() => {
      console.log("watching auth changes", auth);
      const token = getToken();

      if (!token?.altId) {
        setRedirect("Redirecting to login...");
        Router.push("/login");
      }
    }, [auth]);
    return (
      <div>
        <Backdrop open={true}>
          <Box>
            <CircularProgress color="primary" size="3rem" />
            <Typography>{redirect}</Typography>
          </Box>
        </Backdrop>
      </div>
    );
  };

  if (!globalThis.window) {
    return <Loading />;
  }

  if (!auth?.altId) return <Loading />;
  return (
    <>
      <div className="layout">
        <Header title={title} />
        <Nav />
        {/* 
        <Grid container justify="flex-start" spacing={0}>
          <Grid
            item
            xs={12}
            lg={2}
            md={2}
            style={{ border: "1px solid blue", margin: "10px 0" }}
          >
            <Drawer />
          </Grid>
          <Grid
            item
            lg={9}
            md={9}
            xs={12}
            style={{ border: "1px solid red", margin: 20 }}
          >
          
          </Grid>
        </Grid>
        */}

        {children}
        <style jsx global>{`
          html {
            box-sizing: border-box;
            margin: 0;
          }
          body {
            background: #ccc;
            width: 100%;
            padding: 0 1rem;
            margin: 0 auto;
            font-family: roboto;
          }
          .layout {
            min-height: 100vh;
            padding: 0.75rem 0.5rem;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: space-evenly;
            border: 1px solid green;
          }

          @media (max-width: 480px) {
            .layout {
              border: 1px solid red;
              max-width: 480px;
            }
          }
        `}</style>
      </div>
      <Footer />
    </>
  );

  /*: (
    <div>
      <Backdrop open={true}>
        <CircularProgress color="primary" />
        <Typography>Opening....</Typography>
      </Backdrop>
    </div>
  );*/
}
export default Layout;
