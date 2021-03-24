import React from "react";
import {
  Grid,
  Paper,
  TableContainer,
  Table,
  TableHead,
  Typography,
  TableCell,
  TableBody,
  TableRow,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/DeleteForeverOutlined";
import { useDoctor } from "../../../pages/doctors";
import { Pagination } from "@material-ui/lab";
export type Doctor = {
  id?: number;
  doctor_name?: string;
  doctor_phone?: string;
  doctor_email?: string;
  doctor_title?: string;
};
export type Doctors = Doctor[];
type Index = { index: number };

export interface DoctorInt extends Doctor {
  sendDelete: (id: number | undefined) => void;
  sendEdit: (id: number | undefined) => void;
}
export interface DoctorsInt extends Doctors {
  sendDelete: (id: number | undefined) => void;
  sendEdit: (id: number | undefined) => void;
}
export default function DoctorTable(): JSX.Element {
  const { doctors, handleEdit, handleDelete } = useDoctor();
  const [current, setCurrent] = React.useState(0);
  const perpage = doctors.length < 9 ? doctors.length : 10;
  const pages = Math.ceil(doctors.length / perpage);
  const start = current * perpage;
  const end = current * perpage + perpage;
  const handleChange = (event: React.ChangeEvent<unknown>, p: number) =>
    setCurrent(p - 1);

  return (
    <Paper className="my-3 p-4">
      <Grid
        container
        justify="space-evenly"
        alignItems="flex-start"
        spacing={2}
      >
        <Grid item xs={12} md={8} lg={8}>
          <Typography variant="body1" align="center" className="p-2  font-bold">
            {!!doctors.length && doctors.length} Doctors
          </Typography>
          <DTable
            doctors={doctors.slice(start, end)}
            sendEdit={handleEdit}
            sendDelete={handleDelete}
            counter={start}
          />
          {doctors.length > 10 && (
            <Pagination
              count={pages}
              onChange={handleChange}
              page={current + 1}
              defaultPage={current + 1}
              color="primary"
              shape="rounded"
              className="mx-auto p-2 text-center my-3"
            />
          )}
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <Typography>Patients</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

const DTable: React.FC<{
  doctors: Doctors;
  sendEdit: (f: number | undefined) => void;
  sendDelete: (f: number | undefined) => void;
  counter: number;
}> = ({ doctors, sendEdit, sendDelete, counter }) => {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {doctors.map((doctor: Doctor, index: number) => (
            <DBody
              key={doctor.id}
              index={index + counter}
              {...doctor}
              sendEdit={sendEdit}
              sendDelete={sendDelete}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
const DBody = ({
  id,
  index,
  doctor,
  phone,
  email,
  title,
  sendEdit = (f) => f,
  sendDelete = (f) => f,
}: DoctorInt & Index) => (
  <TableRow>
    <TableCell>{index + 1}</TableCell>
    <TableCell>{doctor}</TableCell>
    <TableCell>{phone}</TableCell>
    <TableCell>{email}</TableCell>
    <TableCell>{title}</TableCell>
    <TableCell>
      <EditIcon color="primary" onClick={() => sendEdit(id)} />|
      <DeleteIcon color="secondary" onClick={() => sendDelete(id)} />
    </TableCell>
  </TableRow>
);
