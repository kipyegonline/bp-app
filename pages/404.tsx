import { Box, Typography } from "@material-ui/core";
import { Error } from "@material-ui/icons";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import Layout from "../components/ui/Layout";

export default function Error404() {
  return (
    <Layout>
      <>
        <Head>
          <title>Not Found</title>
        </Head>
        <Box className="bg-white p-4 mx-auto my-10 w-4/12">
          <Typography className="text-center p-4">
            {" "}
            <Error color="secondary" /> Could not find this resource path
          </Typography>
          <Link href="/">
            <a href="#">Let's get you back home </a>
          </Link>
        </Box>
      </>
    </Layout>
  );
}
