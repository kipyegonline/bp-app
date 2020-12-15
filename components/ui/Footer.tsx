import React from "react";
import { Typography } from "@material-ui/core";

const Footer = (): JSX.Element => (
  <footer className="footer">
    <Typography variant="body1" className="center ">
      All Rights Reserved. &copy; {new Date().getFullYear()}
    </Typography>
    <style jsx>{`
      .footer {
        width: 100%;
        height: 50px;
        color: white;
        border-top: 1px solid #eaeaea;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rebeccapurple;
      }
    `}</style>
  </footer>
);
export default Footer;
