import React from "react";
import axios from "axios";
import Link from "next/link";
import Layout from "../components/Layout";
import {
  Container,
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
  TextField,
  FormControl,
  Typography,
  FormHelperText,
  Snackbar,
  CircularProgress,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

function ResetPassword() {
  const [text, setText] = React.useState("");
  const [errormsg, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [spinner, setSpinner] = React.useState(false);

  const handleReset = () => {
    if (!text) setError("Enter email to reset password");

    if (text.trim().length > 8 && text.includes("@")) {
      setSpinner(true);
      axios
        .post("/reset-password", { email: text })
        .then((res) => {
          const { data } = res;
          if (data.status === 200) {
            setSuccess(data.msg);
          } else {
            setError(data.msg);
          }
        })
        .catch((error) => setError(error.message))
        .finally(() => setSpinner(false));
    } else {
      setError("Enter a valid email address");
    }
    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 5000);
  };
  const SpinnerContent = (
    <div className="my-2 mx-auto py-2 text-center">
      <CircularProgress size="1.5rem" color="primary" />
    </div>
  );
  return (
    <Container className="bg-gray-500 w11/12 w-full h-full p-4">
      <Card className="mt-20 mx-auto" style={{ maxWidth: 400 }}>
        <CardHeader
          title={<Typography align="center">Reset Password</Typography>}
        />
        <CardContent>
          <FormControl className="block my-3" style={{ width: "100%" }}>
            <TextField
              className="block"
              type="email"
              onChange={(e) => setText(e.target.value)}
              label="Enter your email address"
              variant="filled"
            />
          </FormControl>
          <FormHelperText className="p-2 text-center text-2xl" error>
            {errormsg}
          </FormHelperText>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            className="block  w-full"
            onClick={handleReset}
          >
            {spinner ? "submitting" : "Submit"}
          </Button>

          {spinner && SpinnerContent}
          <Snackbar open={!!success}>
            <Alert severity="success" variant="filled">
              {success}
            </Alert>
          </Snackbar>

          <Typography align="center">
            <Link href="/login">
              <a>Login</a>
            </Link>
          </Typography>
        </CardContent>
      </Card>
      <style jsx>
        {`
          body {
            background: #ccc;
          }
        `}
      </style>
    </Container>
  );
}
export default ResetPassword;
