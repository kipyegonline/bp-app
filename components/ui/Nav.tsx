import React from "react";
import Link from "next/link";
import { AppBar, List, ListItem } from "@material-ui/core";

export default function Nav() {
  return (
    <div>
      <AppBar position="relative" color="transparent">
        <List className="flex justify-between">
          <ListItem>
            <Link href="/">
              <a href="#">Home</a>
            </Link>
          </ListItem>
          <ListItem>
            <Link href="/login">
              <a href="#">Login</a>
            </Link>
          </ListItem>
          <ListItem>
            <Link href="/doctors">
              <a href="#">Doctors</a>
            </Link>
          </ListItem>
          <ListItem>
            <Link href="/patients">
              <a href="#">Patients</a>
            </Link>
          </ListItem>
          <ListItem>
            <Link href="/add-patient">
              <a href="#">Add Patients</a>
            </Link>
          </ListItem>
          <ListItem>
            <Link href="/add-doctor">
              <a href="#">Add doctor</a>
            </Link>
          </ListItem>
          <ListItem>
            <Link href="/symptoms">
              <a href="#">Add Symptom</a>
            </Link>
          </ListItem>
        </List>
      </AppBar>
    </div>
  );
}
