import {
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Button,
  Link as MLink,
} from "@material-ui/core";
import React from "react";
import Link from "next/link";

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
            <TableCell>Email</TableCell>
            <TableCell>Location </TableCell>
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
    <TableCell>{patient_email}</TableCell>
    <TableCell>{patient_location} </TableCell>
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
