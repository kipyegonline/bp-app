import React from "react";
import Link from "next/link";
import { AppBar, IconButton, List, ListItem } from "@material-ui/core";
import { ExitToApp } from "@material-ui/icons";

export default function Nav() {
  const handleLogout = () => {
    localStorage.removeItem("systolediastole");
    location.pathname = "/login";
    location.reload();
  };
  return (
    <div>
      <AppBar position="relative" color="transparent">
        <List className="flex justify-center flex-no-wrap ">
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
            <Link href="/daily-readings">
              <a href="#">Add Readings</a>
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
          <ListItem>
            <IconButton
              onClick={handleLogout}
              color="primary"
              variant="outlined"
            >
              <ExitToApp />
            </IconButton>
          </ListItem>
        </List>
      </AppBar>
    </div>
  );
}
