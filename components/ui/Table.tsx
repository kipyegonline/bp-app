import {
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Button,
  Link as MLink,
  Typography,
} from "@material-ui/core";
import React from "react";
import Link from "next/link";
import Add from "@material-ui/icons/Add";
import Router from "next/router";
import { getToken } from "./Layout";

type TablePatients = {
  patients: Patient[];
  sendClicked: (id: number) => void;
  counter: number;
};

function TablePatients({
  patients = [],
  sendClicked = (f: number) => f,
  counter,
}: TablePatients): JSX.Element {
  return (
    <TableContainer className="p-4">
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Phone</TableCell>

            <TableCell>Doctor</TableCell>

            <TableCell>Add readings </TableCell>
            <TableCell>Profile</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((patient: Patient, index: number) => (
            <TablePatientsRow
              key={index}
              index={index + counter}
              {...patient}
              sendClicked={sendClicked}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export type Patient = {
  id?: number;
  patient_name?: string;
  patient_age?: number;
  patient_phone?: string;
  patient_email?: string;
  patient_location?: string;
  altId?: string;
  doc_altId: string;
  doctor_name: string;
};
type PatientI = Patient & I;

type I = { index: number; sendClicked: (id: number) => void };

const TablePatientsRow: React.FC<PatientI> = ({
  id,
  patient_name,
  patient_age,
  patient_phone,
  patient_email,
  patient_location,
  altId,
  index,
  doctor_name,
  doc_altId,
  sendClicked,
}) => (
  <TableRow selected>
    <TableCell>{index + 1}</TableCell>
    <TableCell>
      <Link href={altId ? `/patient/${altId}` : `/patient/bp-app`}>
        <MLink>{patient_name}</MLink>
      </Link>
    </TableCell>
    <TableCell align="right">{patient_age}</TableCell>
    <TableCell>{patient_phone}</TableCell>

    <TableCell>
      {getToken()?.altId === doc_altId ? "You" : doctor_name}
    </TableCell>

    <TableCell>
      <Button
        color="secondary"
        variant="outlined"
        size="small"
        startIcon={<Add color="secondary" />}
        onClick={() => Router.push(`/daily-readings?user=${altId}`)}
      >
        {" "}
        <Link href={`/daily-readings?user=${altId}`} as="user-readings">
          <a>Add</a>
        </Link>
      </Button>
    </TableCell>
    <TableCell>
      <Button
        color="primary"
        variant="outlined"
        onClick={() => id && sendClicked(id)}
      >
        Profile
      </Button>
    </TableCell>
  </TableRow>
);
export default TablePatients;
