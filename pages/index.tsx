import React from "react";
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
} from "@material-ui/core";
import AccountIcon from "@material-ui/icons/AccountBoxOutlined";
import Layout from "../components/ui/Layout";
import { SelectInput } from "./add-patient";
import TablePatients, { Patient } from "../components/ui/Table";
import { Pagination } from "@material-ui/lab";
import { Error } from "@material-ui/icons";

export default function Home(): React.ReactNode {
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [patient, setPatient] = React.useState<Patient | undefined>({});
  const [spinner, setSpinner] = React.useState(false);
  const [doctors, setDoctors] = React.useState([]);
  const [errmsg, setError] = React.useState("");
  // pagination logic
  const [current, setCurrent] = React.useState(0);
  const perpage = patients.length < 9 ? patients.length : 10;
  const pages = Math.ceil(patients.length / perpage);
  const start = current * perpage;
  const end = current * perpage + perpage;

  const handleChange = (event: React.ChangeEvent<unknown>, p: number) =>
    setCurrent(p - 1);

  const fetchDoctors = () => {
    fetch("/fetch-doctors")
      .then((res) => res.json())
      .then((data) => setDoctors(data))
      .catch((error) => console.log(error));
  };
  const fetchPatients = async () => {
    setSpinner(true);
    try {
      const res = await axios.get("/fetch-patients");
      setPatients(res.data);
      setSpinner(false);
    } catch (error) {
      setSpinner(false);
      console.log(error.message);
    }
  };

  const fetchDoctorPatients = (doctorId: number): void => {
    axios
      .get(`/fetch-doctor-patients/${doctorId}`)
      .then((res) => {
        const { data } = res;
        if (!Array.isArray(data) || !res.data.length) {
          throw new TypeError("No patient assigned");
        }
        setPatients(data);
      })
      .catch((error) => setError(error.message));
  };
  const handleClick = (id: number) =>
    setPatient(
      patients.find((patient) => ("id" in patient ? patient.id === id : {}))
    );
  React.useEffect(() => {
    Promise.all([fetchPatients(), fetchDoctors()]);
    // setTimeout(() => setPatients(pat), 3000);
  }, []);
  const SpinnerEl = (
    <div className="text-center mx-auto p-4 ">
      <CircularProgress color="primary" size="3rem" />
    </div>
  );

  return (
    <Layout>
      <Grid
        container
        spacing={4}
        justify="center"
        alignItems="flex-start"
        className="p-4 mx-auto my-4"
      >
        <Grid item xs={2} lg={2} md={2}>
          <Card>Side Menu</Card>
        </Grid>
        <Grid item xs={8} lg={8} md={8}>
          <Typography>Toolbar</Typography>
        </Grid>
        <Grid item xs={2} lg={2} md={2}>
          <Card>
            <SelectInput doctors={doctors} getDoctor={fetchDoctorPatients} />
          </Card>
        </Grid>
      </Grid>
      <Box>
        <Card>
          {pat.length ? (
            <Card>
              <TablePatients
                patients={pat.slice(start, end)}
                sendClicked={handleClick}
                counter={start}
              />
            </Card>
          ) : spinner ? (
            SpinnerEl
          ) : (
            <Typography className="text-center p-4  mx-auto my-4 text-red-600 text-lg">
              <Error color="secondary" /> No data found
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
}));
/*
export const getStaticProps = async () => {
  try {
    let pats = await fetch("/fetch-doctors");
    pats = await pats.json();
    return {
      props: {
        pats,
      },
    };
  } catch (error) {
    throw new ReferenceError(error.message);
  }
};
*/
