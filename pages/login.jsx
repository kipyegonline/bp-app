import React from "react";
import axios from "axios";
import Router from "next/router";
import Head from "next/head";
import Link from "next/link";
import ErrorIcon from "@material-ui/icons/Error";
// import { useSession, signin, signout } from "next-auth/client";
import {
  Grid,
  Card,
  Input,
  InputLabel,
  FormControl,
  Typography,
  CardActions,
  CardContent,
  Button,
  Snackbar,
  LinearProgress,
  Divider,
  makeStyles,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
//import { useAuth } from "../components/Layout";

const useStyles = makeStyles({
  card: {
    maxWidth: 500,
    margin: "3rem auto",
    padding: "1.3rem",
  },
  logincontainer: {
    background: "#ccc",
    padding: "1rem",
    width: "100%",
    height: "100vh",
  },
  input: {
    width: "80%",
    display: "block",
    margin: ".5rem auto",
  },
  btn: {
    width: "80%",
    display: "block",
    margin: ".5rem auto",
  },
});

function Login() {
  // initialize state
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [spinner, setSpinner] = React.useState(false);
  const [emailerr, setEmailerr] = React.useState("");
  const [perr, setPerr] = React.useState("");
  const [errmsg, setError] = React.useState("");
  const classes = useStyles();
  // const [session, loading] = useSession();

  //React.useEffect(() => {}, []);
  const handleChange = (e) => {
    // get input and set state
    /* eslint-disable prefer-template */
    const setState = eval("set" + e.target.name);
    setState(e.target.value);
  };

  const handleBlur = (e) => {
    if (e.target.name === "Email") {
      if (e.target.value.length) setEmailerr("");
    }

    if (e.target.name === "Password") {
      if (e.target.value.length > 5) setPerr("");
    }
  };
  /* eslint-disable no-unused-expressions */
  const handleSubmit = (e) => {
    e.preventDefault();
    // validate the damn data
    if (!email.trim() && !password.trim()) {
      setEmailerr(" is required.");
      setPerr(" is required");
    } else if (email.trim().length < 6) {
      email.length < 1
        ? setEmailerr("is required")
        : setEmailerr(" is invalid");
    } else if (password.trim().length < 6) {
      password.length < 1
        ? setPerr("is required")
        : setPerr(" must have atleast 6 characters.");
    } else if (email.trim().length > 5 && password.trim().length > 5) {
      // if it looks good,remove error messages and  send to the server,
      setPerr("");
      setEmailerr("");
      setSpinner(true);

      /* eslint-disable no-undef */

      // send to server
      axios
        .post("./handlelogin", { email, password })
        .then((res) => {
          const { data } = res;
          console.log(res);
          setSpinner(false);
          if (data.status === 200) {
            setPassword("");
            setEmail("");
            // store the return token on local storage  and route to home page
            // global this is an addition to ES2020
            globalThis &&
              localStorage.setItem("systolediastole", JSON.stringify(data));

            data?.doctor ? Router.push("/") : Router.push("/daily-readings");
          } else {
            throw new Error(data.msg);
          }
        })
        .catch((error) => {
          setError(error.message);
        })
        .finally(() => {
          setSpinner(false);
          setTimeout(() => setError(""), 5000);
        });
    } else {
      // unknown unknown errors
      setError("Error logging in...Check network and try again....");
      setTimeout(() => setError(""), 3000);
    }
  };
  return (
    <Grid className={classes.logincontainer}>
      <Head>
        <title>Login | Comms App </title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width"
          key="title"
        />
      </Head>
      <Card className={classes.card} elevation={10}>
        <Typography variant="h5" align="center">
          BP App
        </Typography>
        <Divider />
        <form onSubmit={handleSubmit}>
          <CardContent style={{ maxWidth: 500 }}>
            <FormControl className={classes.input}>
              <InputLabel error={!!emailerr.length}>
                Email {emailerr}
              </InputLabel>
              <Input
                type="email"
                name="Email"
                fullWidth
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl className={classes.input}>
              <InputLabel error={!!perr.length}>Password {perr}</InputLabel>
              <Input
                type="password"
                fullWidth
                name="Password"
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </FormControl>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              className={classes.input}
              color="primary"
              type="submit"
              disabled={spinner}
            >
              {spinner ? "Logging in " : "Log in"}
            </Button>
          </CardActions>
          {spinner ? <LinearProgress /> : null}
          {errmsg && (
            <Alert
              action={<ErrorIcon />}
              severity="error"
              variant="filled"
              className="p-2 m-2"
            >
              {errmsg}
            </Alert>
          )}
          <Typography align="center">
            <Link href="/reset-password">
              <a>Forgot password </a>
            </Link>
          </Typography>
        </form>
      </Card>
      {/* eslint-disable react/jsx-one-expression-per-line */}
      <style jsx>{`
        .login {
          max-width: 500px;
          margin: auto;
          padding: 1rem;
          background: red;
        }
        .login-container {
          background: #ccc;
          padding: 1rem;
          margin: 3rem auto;
          border: 1px solid red;
        }
      `}</style>
    </Grid>
  );
}
export default Login;

//mysql://username:password@127.0.0.1:3306/database_name?synchronize=true

/**import React from 'react'
import { 
  useSession, 
  signin, 
  signout 
} from 'next-auth/client'

export default function myComponent() {
  const [ session, loading ] = useSession()

  return <p>
    {!session && <>
      Not signed in <br/>
      <button onClick={signin}>Sign in</button>
    </>}
    {session && <>
      Signed in as {session.user.email} <br/>
      <button onClick={signout}>Sign out</button>
    </>}
  </p>
}

import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const options = {
  providers: [
    // OAuth authentication providers
    Providers.Apple({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_SECRET
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
    // Sign in with passwordless email link
    Providers.Email({
      server: process.env.MAIL_SERVER,
      from: '<no-reply@example.com>'
    }),
  ],
  // SQL or MongoDB database (or leave empty)
  database: process.env.DATABASE_URL
}

export default (req, res) => NextAuth(req, res, options)


*/
