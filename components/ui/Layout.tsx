import React from "react";
import { Container } from "@material-ui/core";
import Header from "./Head";
import Footer from "./Footer";
import Nav from "./Nav";

type Layout = { children: React.ReactNode; title?: string };

function Layout({ children, title }: Layout): React.ReactElement {
  return (
    <>
      <Container className="layout">
        <Header title={title} />
        <Nav />
        {children}

        <style jsx global>{`
          html {
            box-sizing: border-box;
            margin: 0;
          }
          body {
            background: #ccc;
            width: 90%;
            padding: 1rem;
            margin: 0 auto;
            font-family: roboto;
          }
          .layout {
            min-height: 100vh;
            padding: 0.75rem 0.5rem;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            border: 1px solid red;
          }
        `}</style>
      </Container>
      <Footer />
    </>
  );
}
export default Layout;
