import React from "react";
import Router from "next/router";
import axios from "axios";
import {
  Card,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  CircularProgress,
  Box,
  Input,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  CardHeader,
  CardContent,
  CardActions,
  Snackbar,
  Avatar,
} from "@material-ui/core";
import AccountIcon from "@material-ui/icons/AccountBoxOutlined";
import TablePatients, { Patient } from "../components/ui/Table";
import { Alert, Pagination } from "@material-ui/lab";
import {
  ArrowRight,
  Email,
  Error,
  LocationCity,
  Map,
  Phone,
  PinDrop,
  Search as SearchIcon,
  VerifiedUser,
} from "@material-ui/icons";
import Layout, { getToken } from "../components/ui/Layout";
import { SelectInput } from "./add-patient";
import { UseDialog } from "./add-patient";

export default function Home(): React.ReactNode {
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [patient, setPatient] = React.useState<Patient | undefined>({});
  const [spinner, setSpinner] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [searchResult, SetResult] = React.useState("");
  const [doctors, setDoctors] = React.useState([]);
  const [errmsg, setError] = React.useState("");
  // pagination logic
  const [current, setCurrent] = React.useState(0);
  const perpage = patients.length < 9 ? patients.length : 10;
  const pages = Math.ceil(patients.length / perpage);
  const start = current * perpage;
  const end = current * perpage + perpage;

  const token = getToken();
  const handleChange = (event: React.ChangeEvent<unknown>, p: number) =>
    setCurrent(p - 1);

  const fetchDoctors = () => {
    fetch("/fetch-doctors")
      .then((res) => res.json())
      .then((data) => setDoctors(data))
      .catch((error) => console.log(error));
  };
  const fetchPatients = async () => {
    const { altId } = getToken();
    setSpinner(true);
    try {
      const res = await axios.get(`/fetch-patients/${altId}`);
      if (!res?.data.length) throw Error("No data found");
      setPatients(res.data);
      setSpinner(false);
    } catch (error) {
      setSpinner(false);
      // remember to hide this on prod
      setPatients(pat);
      console.log(error.message);
    }
  };

  const fetchDoctorPatients = (doctorId: number): void => {
    axios
      .get(`/fetch-doctor-patients/${doctorId}`)
      .then((res) => {
        const { data } = res;
        if (!Array.isArray(data) || !res.data.length) {
          throw new ReferenceError("No result for the selected doctor");
        }
        setPatients(data);
      })
      .catch((error) => {
        SetResult(error.message);
        setTimeout(() => SetResult(""), 3000);
      });
  };
  const handleClick = (id: number) =>
    setPatient(
      patients.find((patient) => ("id" in patient ? patient.id === id : {}))
    );

  const getSearchValue = (value: string) => {
    if (value === "//11") {
      if (!search.trim()) return;
      axios
        .get(`/search-patient?q=${search.trim()}`)
        .then((res) => {
          const { data } = res;
          if (Array.isArray(data) && data.length) {
            setPatients(data);
          } else {
            SetResult("No name result");

            throw new ReferenceError("No search result for  " + search);
          }
        })
        .catch((error) => {
          console.log(error.status);
          SetResult(error.message);
          setTimeout(() => SetResult(""), 3000);
        });
    } else {
      setSearch(value);
    }
  };

  React.useEffect(() => {
    if (token?.doctor) Promise.all([fetchPatients(), fetchDoctors()]);
    // setTimeout(() => setPatients(pat), 3000);
  }, []);
  const SpinnerEl = (
    <div className="text-center mx-auto p-4 ">
      <CircularProgress color="primary" size="3rem" />
    </div>
  );
  //Authorizatiom
  //if (!token?.doctor) Router.push("/doctors");

  return (
    <Layout>
      {patient?.id && <PatientProfile data={patient} />}
      <Grid
        container
        spacing={4}
        justify="center"
        alignItems="flex-start"
        className="p-4 mx-auto my-4"
      >
        <Grid item xs={12} lg={2} md={2}>
          <Avatar>
            {token?.username ? token?.username[0].toUpperCase() : "U"}
          </Avatar>
          <Typography>
            {token?.title || ""}
            {"  "}
            {token?.username}
          </Typography>
        </Grid>
        <Grid item xs={12} lg={8} md={8}>
          <SearchBar
            sendValue={getSearchValue}
            value={search}
            result={searchResult}
          />
          <Button
            onClick={() => fetchPatients() && setSearch("")}
            variant="outlined"
            color="primary"
            style={{ padding: 5, margin: " auto 10px" }}
            size="medium"
          >
            All
          </Button>
        </Grid>
        <Grid item xs={12} lg={2} md={2}>
          <Card>
            <SelectInput
              doctors={doctors}
              getDoctor={fetchDoctorPatients}
              title="View by doctor"
            />
          </Card>
        </Grid>
      </Grid>
      <Box>
        <Card>
          {patients.length ? (
            <Card>
              <TablePatients
                patients={patients.slice(start, end)}
                sendClicked={handleClick}
                counter={start}
              />
            </Card>
          ) : spinner ? (
            SpinnerEl
          ) : (
            <Typography className="text-center p-4  mx-auto my-4 text-red-600 text-lg">
              <Error color="secondary" /> No patients assigned to you currently.
            </Typography>
          )}

          {patients.length > 10 && (
            <Pagination
              count={pages}
              onChange={handleChange}
              page={current + 1}
              defaultPage={current + 1}
              color="primary"
              shape="rounded"
              className="mx-auto p-2"
            />
          )}
        </Card>
      </Box>
    </Layout>
  );
}

const PatientsList: React.FC<{ patients: Patient[] }> = ({ patients = [] }) => {
  return (
    <List>
      {patients.map((patient: Patient, i: number) => (
        <ListItem key={patient.id}>
          <ListItemIcon>
            <AccountIcon />
          </ListItemIcon>
          <ListItemText primary={`${i + 1} ${patient.patient_name}`} />
        </ListItem>
      ))}
    </List>
  );
};

const SearchBar: React.FC<{
  sendValue: (f: string) => void;
  result: string;
  value: string;
}> = ({ sendValue = (f: string) => f, result = "", value = "" }) => {
  return (
    <>
      <FormControl style={{ width: "80%" }}>
        <Input
          type="search"
          fullWidth
          style={{
            borderRadius: 20,
            borderBottom: "none",
            outline: "none",
            fontSize: 16,
          }}
          value={value}
          className="bg-white p-2 pl-4 text-center text-lg border-r"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            sendValue(e.target.value)
          }
          onKeyDown={(e) => e.key === "Enter" && sendValue("//11")}
          placeholder="Search patients"
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={() => sendValue("//11")}>
                <SearchIcon color="primary" />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <Snackbar open={!!result}>
        <Alert severity="error" variant="filled" className="p-2">
          {result}
        </Alert>
      </Snackbar>
    </>
  );
};

const PatientProfile = ({ data = {} }) => {
  const [user, setUser] = React.useState(data);
  const [open, setOpen] = React.useState(true);

  React.useEffect(() => {
    setUser(data);
    setOpen(!!data?.id);
  }, [data]);

  return (
    <UseDialog
      open={open}
      handleClose={() => setOpen(false)}
      title={user?.patient_name}
    >
      <Card className="px-4 py-2 m-2">
        <CardContent>
          <List>
            <ListItem dense divider>
              {" "}
              <ListItemIcon>
                <VerifiedUser htmlColor="green" />
              </ListItemIcon>
              {user?.patient_age}
            </ListItem>
            <ListItem dense divider>
              {" "}
              <ListItemIcon>
                <Phone htmlColor="brown" />
              </ListItemIcon>
              {user?.patient_phone}
            </ListItem>
            <ListItem dense divider>
              {" "}
              <ListItemIcon>
                <Email htmlColor="brown" />
              </ListItemIcon>
              {user?.patient_email}
            </ListItem>
            <ListItem dense divider>
              {" "}
              <ListItemIcon>
                <PinDrop htmlColor="brown" />
              </ListItemIcon>
              {user?.patient_location}
            </ListItem>
            <ListItem dense divider>
              <ListItemIcon>
                <AccountIcon htmlColor="green" />
              </ListItemIcon>
              {user?.doctor_name}
            </ListItem>
          </List>
          <Typography variant="body1" className="p-2">
            {user?.patient_note}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(false)}
            size="small"
          >
            Close
          </Button>
        </CardActions>
      </Card>
    </UseDialog>
  );
};
const docs = [
  { doctor: "Vince", id: 1 },
  { doctor: "Jules", id: 2 },
];
const pat = [...Array(20)].map((item, i) => ({
  patient_name: "Vincent Kipyegon",
  patient_age: 34 + i,
  id: i,
  patient_phone: "0788287557",
  patient_email: "vinnykipx@gmail.com",
  patient_location: "Litein",
  doctor_name: i % 2 === 0 ? "Da Baby" : "Da Vince",
}));
