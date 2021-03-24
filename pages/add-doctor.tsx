import {
  Button,
  Card,
  FormControl,
  InputLabel,
  Grid,
  Input,
  Box,
  Typography,
  makeStyles,
  FormHelperText,
  CircularProgress,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import axios from "axios";
import { v4 } from "uuid";
import React from "react";
import Layout from "../components/ui/Layout";

const useStyles = makeStyles({
  formControl: { width: "100%" },
  btn: { width: "100%", margin: ".5rem 0" },
});
export default function AddDoctor(): React.ReactNode {
  const [doctor, resetDoctor] = useInput("");
  const [title, resetTitle] = useInput("");
  const [phone, resetPhone] = useInput("");
  const [email, resetEmail] = useInput("");
  const [password, resetPassword] = useInput("");
  const [confPassword, resetConfPassword] = useInput("");
  const classes: ReturnType<typeof useStyles> = useStyles();
  const [errmsg, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [spinner, setSpinner] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const doctorName = doctor.value.trim(),
      doctorTitle = title.value.trim(),
      doctorPhone = phone.value.trim(),
      doctorEmail = email.value.trim(),
      doctorPassword = password.value.trim(),
      doctorPasswordConf = confPassword.value.trim();

    if (doctorName.length < 5 || !doctorName.includes(" ")) {
      doctorName.length < 3
        ? setError("Enter name")
        : setError("Enter second name");
      setTimeout(() => setError(""), 3000);
    } else if (!doctorTitle) {
      setError("Enter title");
      setTimeout(() => setError(""), 3000);
    } else if (doctorPhone.length < 9) {
      doctorPhone.length < 1
        ? setError("Enter phone number")
        : setError("Phone number is invalid");
      setTimeout(() => setError(""), 3000);
    } else if (doctorEmail.length < 9 || !doctorEmail.includes("@")) {
      doctorEmail.length < 9
        ? setError("Enter  email address")
        : setError("Invalid email");
      setTimeout(() => setError(""), 3000);
    } else if (doctorPassword.length < 5) {
      doctorPassword.length < 1
        ? setError("Enter password")
        : setError("Password must be atleast 6 characters long");
      setTimeout(() => setError(""), 3000);
    } else if (doctorPasswordConf.length < 5) {
      doctorPasswordConf.length < 1
        ? setError("Enter confirmation password")
        : setError("confirmation Password must be atleast 6 characters long");
      setTimeout(() => setError(""), 3000);
    } else if (doctorPassword !== doctorPasswordConf) {
      setError("Passwords do not match");
      setTimeout(() => setError(""), 3000);
    } else if (
      doctorName.length > 5 &&
      doctorTitle.length > 0 &&
      doctorPhone.length > 9 &&
      doctorEmail.length > 5 &&
      doctorPassword.length > 5
    ) {
      setError("");
      setSpinner(true);
      axios
        .post("/add-doctor", {
          doctorName,
          doctorTitle,
          doctorPhone,
          doctorEmail,
          doctorPassword,
          uuid: v4(),
        })
        .then((res) => {
          const { data } = res;
          if (data.status === 200) {
            setSuccess(data.msg);

            resetDoctor();
            resetTitle();
            resetPhone();
            resetEmail();
            resetPassword();
            resetConfPassword();
          } else {
            throw new Error(data.msg);
          }
        })
        .catch((error) => {
          setError(error.message);

          setTimeout(() => setError(""), 3000);
        })
        .finally(() => {
          setSpinner(false);
          setTimeout(() => {
            setSuccess("");
            setError("");
          }, 3000);
        });
    } else {
      setError("Error adding doctor... Try again later.");
    }
  };
  return (
    <Layout>
      <Grid container spacing={4} className="py-3">
        <Grid item xs={12} md={12} lg={12}>
          <Card className="p-4 m-4" style={{ maxWidth: 600, margin: "auto" }}>
            <form onSubmit={handleSubmit} className="p-4">
              <Typography variant="body1" align="center">
                Add Doctor
              </Typography>
              {/*DoctorName */}
              <InputEl label="Doctor Name" props={doctor} />
              {/*Doctortitle */}
              <InputEl label="Title" props={title} />
              {/*Doctor phone*/}
              <InputEl label="Phone" type="telephone" props={phone} />
              {/*Doctoremail */}
              <InputEl label="Email" type="email" props={email} />
              {/*Doctorpassword */}
              <InputEl label="Password" type="password" props={password} />
              {/*Doctorconfirm password */}
              <InputEl
                label="Confirm Password"
                type="password"
                props={confPassword}
              />
              <div className="my-2 p-1 ">
                {spinner && (
                  <Box className="text-center mx-auto">
                    <CircularProgress size="3rem" color="primary" />
                  </Box>
                )}
                {errmsg && (
                  <FormHelperText className="center" error>
                    {errmsg}
                  </FormHelperText>
                )}
                {success && (
                  <Alert severity="success" variant="filled">
                    <FormHelperText className="text-white">
                      {" "}
                      {success}
                    </FormHelperText>
                  </Alert>
                )}
              </div>
              <Button
                type="submit"
                className={classes.btn}
                size="medium"
                variant="contained"
                disabled={spinner}
                color="primary"
              >
                {spinner ? "Adding doctor" : "Add Doctor"}
              </Button>
            </form>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export const useInput = (initialValue: any): any[] => {
  const [value, setValue] = React.useState(initialValue);
  return [
    {
      value,

      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setValue(e.target.value),
    },

    () => {
      setValue(initialValue);
    },
  ];
};
type InputElProps = {
  props: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  label: string;
  type?: string;
};
export const InputEl = ({
  props,
  label,
  type = "text",
}: InputElProps): JSX.Element => {
  const classes: ReturnType<typeof useStyles> = useStyles();
  return (
    <FormControl className={classes.formControl}>
      <InputLabel>{label}</InputLabel>
      <Input {...props} fullWidth type={type} />
    </FormControl>
  );
};
