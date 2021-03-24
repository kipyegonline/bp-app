import React from "react";
import axios from "axios";
import DoctorTable, {
  Doctor,
  Doctors,
} from "../components/ui/doctors/doctorTable";
import Layout from "../components/ui/Layout";
import { CircularProgress, Typography } from "@material-ui/core";

interface Doctext {
  handleEdit: (f: number | undefined) => void;
  handleDelete: (f: number | undefined) => void;
  doctors: Doctors;
}

const DoctorContext = React.createContext<Doctext>({
  doctors: [],
  handleEdit: (f: number | undefined) => f,
  handleDelete: (f: number | undefined) => f,
});

export const useDoctor = () => React.useContext(DoctorContext);

export default function DoctorsPage() {
  const [doctors, setDoctors] = React.useState<Doctors>([]);
  const [doctor, setDoctor] = React.useState<Doctor>({});
  const [spinner, setSpinner] = React.useState(false);
  const fetchDoctors = async () => {
    setSpinner(true);
    try {
      const { data } = await axios.get("/fetch-doctors");
      if (Array.isArray(data) || data.length) {
        setDoctors(data);
      } else {
        throw new Error("No data found");
      }
    } catch (error) {
      setSpinner(false);
      console.error(error.message);
    }
  };
  const handleDelete = (id: number | undefined) => {
    if (confirm("This will delete doctor and assign their patients to you?")) {
      axios
        .get(`delete-doctor/${id}`)
        .then((res) => {
          if (res.status === 200) {
            setDoctors(doctors.filter((doctor) => doctor.id !== id));
          }
        })
        .catch((error) => console.log(error.message));
    }
  };
  const handleEdit = (id: number | undefined) => {
    const doc = doctors.find((doctor) => doctor.id === id);
    if (doc) setDoctor(doc);
    alert(JSON.stringify(doc));
  };
  React.useEffect(() => {
    fetchDoctors();
  }, []);
  const Spinner = (
    <div className="mx-auto my-4 p-4 text-center">
      <CircularProgress size="3rem" color="primary" />
    </div>
  );
  const Errmsg = (
    <div className="mx-auto my-4 p-4 text-center">
      <Typography variant="body1">
        Error loading doctors...Check network and try again later.
      </Typography>
    </div>
  );
  return (
    <Layout title="Doctors">
      <DoctorContext.Provider value={{ doctors, handleDelete, handleEdit }}>
        {doctors.length ? <DoctorTable /> : spinner ? Spinner : Errmsg}
      </DoctorContext.Provider>
    </Layout>
  );
}
const docs = [...Array(20)].map((item, i) =>
  i >= 10
    ? {
        id: 1 + i++,
        doctor_name: "Jules",
        doctor_phone: "07903377730",
        doctor_email: "jules11@gmail.com",
        doctor_title: "Cardio",
      }
    : {
        id: 1 + i++,
        doctor_name: "Vince",
        doctor_phone: "0788287557",
        doctor_email: "vinnykipx@gmail.com",
        doctor_title: "CO",
      }
);
