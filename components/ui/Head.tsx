import React from "react";
import Head from "next/head";

type title = { title?: string };
const Header = ({ title = "BP app" }: title): JSX.Element => (
  <Head>
    <title>{title}</title>
    <link rel="icon" href="/favicon.ico" />
  </Head>
);

export default Header;
