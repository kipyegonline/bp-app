import React from "react";
import {
  Grid,
  Card,
  Input,
  ButtonGroup,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  FormHelperText,
  Box,
  CircularProgress,
} from "@material-ui/core";
import { v4 } from "uuid";
import ArrowNext from "@material-ui/icons/ArrowRight";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/CancelOutlined";
import { useInput, InputEl } from "./add-doctor";
import Layout from "../components/ui/Layout";
import axios from "axios";

export default function AddPatient(): React.ReactNode {
  const [patientName, resetPatient] = useInput("");
  const [patientLocation, resetLocation] = useInput("");
  const [patientPhone, resetPhone] = useInput("");
  const [patientAge, resetAge] = useInput("");
  const [patientInfo, resetInfo] = useInput("");
  const [patientEmail, resetEmail] = useInput("");
  const [patientPassword, resetPassword] = useInput("");
  const [patientConfPassword, resetConfPassword] = useInput("");
  const [doctors, setDoctors] = React.useState([]);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("/fetch-doctors");
      console.log(res);
      if (res.data) {
        setDoctors(res.data);
      }
    } catch (error) {
      throw new Error("No payload found");
    }
  };
  React.useEffect(() => {
    fetchDoctors();
  }, []);
  // work
  const [showDialog, setDialog] = React.useState(false);

  const [doctor, setDoctor] = React.useState(1);
  const [success, setSuccess] = React.useState("");
  const [errmsg, setError] = React.useState("");
  const [sideB, setSideB] = React.useState(false);
  const [spinner, setSpinner] = React.useState(false);

  const handleSideA = () => {
    if (
      patientName.value.trim().length < 5 ||
      !patientName.value.trim().includes(" ")
    ) {
      patientName.value.trim().length < 3
        ? setError("Enter patient name")
        : setError("Enter patient second name");
      setTimeout(() => setError(""), 3000);
    } else if (!patientLocation.value.trim()) {
      setError("Enter patient Location");
      setTimeout(() => setError(""), 3000);
    } else if (!patientInfo.value.trim()) {
      setError("Enter patient information");
      setTimeout(() => setError(""), 3000);
    } else if (!Number(patientAge.value.trim())) {
      setError("Enter patient age");
      setTimeout(() => setError(""), 3000);
    } else if (patientPhone.value.trim().length < 9) {
      patientPhone.value.trim().length < 1
        ? setError("Enter phone number")
        : setError("Phone number is invalid");
      setTimeout(() => setError(""), 3000);
    } else if (
      patientEmail.value.trim().length < 9 ||
      !patientEmail.value.trim().includes("@")
    ) {
      patientEmail.value.trim().length < 9
        ? setError("Enter  email address")
        : setError("Invalid email");
      setTimeout(() => setError(""), 3000);
    } else if (
      patientName.value.length > 5 &&
      +patientAge.value > 0 &&
      patientLocation.value.length > 0 &&
      patientPhone.value.length > 9 &&
      patientEmail.value.length > 5 &&
      patientInfo.value.length > 0
    ) {
      setSideB(true);
    } else {
      setError("Error adding doctor... Try again later.");
      setTimeout(() => setError(""), 3000);
    }
  };
  const handleSubmit = (e: React.FormEvent, cancelled = false) => {
    e.preventDefault();
    if (cancelled) {
      setSideB(false);
      return;
    }
    if (patientPassword.value.trim().length < 5) {
      patientConfPassword.value.trim().length < 1
        ? setError("Enter password")
        : setError("Password must be atleast 6 characters long");
      setTimeout(() => setError(""), 3000);
    } else if (+doctor < 1) {
      setError("Kindly assign doctor to patient");
      setTimeout(() => setError(""), 3000);
    } else if (patientConfPassword.value.trim().length < 5) {
      patientConfPassword.value.trim().length < 1
        ? setError("Enter confirmation password")
        : setError("confirmation Password must be atleast 6 characters long");
      setTimeout(() => setError(""), 3000);
    } else if (
      patientPassword.value.trim() !== patientConfPassword.value.trim()
    ) {
      setError("Passwords do not match");
      setTimeout(() => setError(""), 3000);
    } else {
      // prepare to send to server
      setSpinner(true);
      axios
        .post("/add-patient", {
          patientName: patientName.value,
          patientAge: patientAge.value,
          patientLocation: patientLocation.value,
          patientPhone: patientPhone.value,
          patientEmail: patientEmail.value,
          patientPassword: patientPassword.value,
          patientInfo: patientInfo.value,
          doctor,
          altId: v4(),
          addedon: new Date().toDateString(),
        })
        .then((res) => {
          const { data } = res;

          if (data.status === 200) {
            setSuccess(data.msg);
            // reset states
            setTimeout(() => {
              resetPatient();
              resetAge();
              resetLocation();
              resetPhone();
              resetEmail();
              resetPassword();
              resetConfPassword();
              resetInfo();
              setDoctor(0);
              setSideB(false);
            }, 3000);
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
          }, 3000);
        });
    }
  };
  const SpinnerEl = (
    <div className="text-center mx-auto p-4 ">
      <CircularProgress color="primary" size="3rem" />
    </div>
  );
  const ShowSideB = (
    <UseDialog
      open={sideB}
      title={`Assign doctor and choose initial password for ${
        patientName.value.split(" ")[0]
      }`}
    >
      <Box>
        {!!doctors.length && (
          <SelectInput doctors={doctors} getDoctor={setDoctor} />
        )}
        <InputEl
          label="Enter Password"
          type="password"
          props={patientPassword}
        />
        {/**Patient confirm password */}
        <InputEl
          label="Confirm passsword"
          type="password"
          props={patientConfPassword}
        />
        <Box>
          <FormHelperText error>{errmsg}</FormHelperText>
          {success && (
            <Typography className="p-4 m-2 text-white bg-green-700">
              {success}
            </Typography>
          )}
        </Box>
        {!spinner ? (
          <ButtonGroup className="my-2 p-2 ">
            <Button
              variant="contained"
              color="primary"
              className="mr-3 p-2"
              endIcon={<SaveIcon />}
              onClick={(e) => handleSubmit(e)}
              size="medium"
              style={{ marginRight: 10 }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              type="submit"
              onClick={(e) => handleSubmit(e, true)}
              color="secondary"
              endIcon={<CancelIcon />}
              className="mx-3 p-2"
              size="medium"
            >
              Cancel
            </Button>
          </ButtonGroup>
        ) : (
          SpinnerEl
        )}
      </Box>
    </UseDialog>
  );
  return (
    <Layout>
      <Grid className="m-4 p-4 bg-gray-600 ">
        <Card style={{ maxWidth: 1000 }} className="p-4">
          <Typography variant="h5" align="center" className="p-2 m-2">
            Add Patient biodata
          </Typography>
          <form onSubmit={handleSubmit}>
            {ShowSideB}
            <Grid container>
              <Grid item xs={12} md={6} lg={6} className="m-4 p-2">
                {/**Patient name */}
                <InputEl label="Enter name" type="text" props={patientName} />
                {/**Patientlocation */}
                <InputEl
                  label="Enter location"
                  type="text"
                  props={patientLocation}
                />
                {/**Patient phone*/}
                <InputEl
                  label="Enter Phone number"
                  type="text"
                  props={patientPhone}
                />
                {/**Patient name */}
                <InputEl
                  label="Enter Email address"
                  type="text"
                  props={patientEmail}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6} className="m-4 p-2">
                <Typography className="p-2">Details</Typography>
                {/**Describe condition */}
                <TextField
                  {...patientInfo}
                  variant="filled"
                  rows={4}
                  multiline
                  className="p-2 m-3"
                  label="Details of blood pressure condition"
                  fullWidth
                />
                {/**Patient age*/}
                <InputEl
                  label="Enter patient age"
                  type="number"
                  props={patientAge}
                />
                {!sideB && (
                  <div className="p-4 mx-auto">
                    <FormHelperText error>{errmsg}</FormHelperText>
                    <Button
                      color="primary"
                      variant="contained"
                      endIcon={<ArrowNext />}
                      onClick={handleSideA}
                      className="w-100 ml-10"
                    >
                      Continue
                    </Button>
                  </div>
                )}
                <Typography>{success}</Typography>
              </Grid>
            </Grid>
          </form>
        </Card>
      </Grid>
    </Layout>
  );
}
type Docs = { id: number; doctor: string };
type Select = {
  doctors: Docs[];
  getDoctor: React.Dispatch<React.SetStateAction<number>>;
};
export const SelectInput: React.FC<{
  doctors: Docs[];
  getDoctor: (value: number) => void;
}> = ({ doctors = [], getDoctor = (f: number) => f }) => {
  const [selected, setSelected] = React.useState(0);
  const handleSelect = (
    e: React.ChangeEvent<{ name?: string | undefined; value: unknown }>
  ) => {
    const selected = +(e.target as HTMLSelectElement).value;
    if (!selected) return;
    setSelected(selected);
    getDoctor(selected);
  };
  return (
    <FormControl className="w-100 p-4 my-4">
      <InputLabel id="assign-doc">Assign Doctor</InputLabel>
      <Select
        id="assign-doc"
        style={{ minWidth: 150 }}
        onChange={handleSelect}
        value={selected}
      >
        <MenuItem value={0}>Choose doctor...</MenuItem>
        {doctors.map((doctor) => (
          <MenuItem value={doctor.id} key={doctor.id}>
            {doctor.doctor}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
type UseModalProps = {
  open: boolean;
  title: string;
  children: React.ReactChild;
};

export const UseDialog = ({ open, title, children }: UseModalProps) => {
  return (
    <Dialog open={open}>
      <DialogTitle className=" p-4 bg-blue-600 text-white">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};
