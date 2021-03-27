import {
  Divider,
  Paper,
  Typography,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Box,
  ButtonGroup,
  Checkbox,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from "@material-ui/core";
import axios from "axios";
import Router from "next/router";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import React from "react";
import Layout, { getToken } from "../components/ui/Layout";
import {
  ArrowRight,
  CheckCircleRounded,
  SystemUpdateOutlined,
} from "@material-ui/icons";
import { Alert } from "@material-ui/lab";

const timeOfDay: { time: string; id: number; checked: boolean }[] = [
  { time: "Morning", id: 1, checked: false },
  { time: "Evening", id: 2, checked: false },
  { time: "Whole day", id: 3, checked: false },
];

type Symptoms = { id: number; symptom: string; clicked: boolean };

export default function DailyReadings(): React.ReactNode {
  const [systoleErr, setSytoleErr] = React.useState(false);
  const [pulseErr, setPulseErr] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSucces] = React.useState("");
  const [diaErr, setdiaErr] = React.useState(false);
  const [systole, setSystole] = React.useState<string>("");
  const [diastole, setDiastole] = React.useState<string>("");
  const [heartbeat, setHeartbeat] = React.useState<string>("");
  const [meals, setMeal] = React.useState("");
  const [stressed, setStressed] = React.useState(false);
  const [date, setDate] = React.useState<string>("");
  const [symptoms, setSymptoms] = React.useState<Symptoms[]>([]);
  const [moment, setMoment] = React.useState(timeOfDay);
  const [spinner, setSpinner] = React.useState(false);
  const [dspinner, setDspinner] = React.useState(false);
  const [section, setSection] = React.useState(1);
  const [modal, setModal] = React.useState(section === 1);
  const [visible, setVisible] = React.useState(true);

  const fetchSymptoms = async () => {
    try {
      const res = await axios.get("/fetch-symptoms");

      setSymptoms(
        res.data.map((item: Symptoms) => ({ ...item, clicked: false }))
      );
    } catch (error) {
      setSymptoms(syms);
      console.log(error.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const setState = eval("set" + target.id);
    if (Number.isNaN(Number(target.value))) setError("Enter a proper number");
    else setState(+target.value);
  };

  const handleDuplicates = () => {
    const selectedMoment = moment.find((item) => item.checked);
    if (selectedMoment?.checked && date) {
      setDspinner(true);
      setVisible(true);
      let id = 1;

      axios
        .get(`/check-duplicates/${id}/${selectedMoment?.id}/${date}`)
        .then((res) => {
          console.log(res);
          const { data } = res;
          if (!data) {
            setModal(false);
            setSection(2);
            setError("");
          } else {
            throw new ReferenceError(
              `You have already added readings for ${date} (${selectedMoment?.time})`
            );
          }
          // setModal(false);
        })
        .catch((error) => {
          setDspinner(false);
          setError(error.message);
        });
      // .finally(() => setTimeout(() => setError(""), 3000));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const timeofday = moment.find((item) => item.checked)?.id;
    systole ? setSytoleErr(false) : setSytoleErr(true);
    diastole ? setdiaErr(false) : setdiaErr(true);
    heartbeat ? setPulseErr(false) : setPulseErr(true);
    console.log(systole, diastole, heartbeat);
    // verify sytole readings
    if (!SystemUpdateOutlined) {
      return setError("Enter the systole readings...");
    }
    // verify diastole readings
    if (!diastole) {
      return setError("Enter the systole readings...");
    }
    // verify pulse readings
    if (!heartbeat) {
      return setError("Enter the systole readings...");
    }
    // if pressure is above normal,show symptoms
    if (Number(systole) > 120 && section < 3) return setSection(3);
    // if everythings seems good proceed

    if (
      Number(systole) > 0 &&
      +diastole > 0 &&
      +heartbeat > 0 &&
      date.length &&
      timeofday
    ) {
      const selectedSymptoms = symptoms
        .filter((item) => item.clicked)
        .map((item) => item.id)
        .join("*");
      const { altId } = getToken();
      /* delete this on prod */
      console.log({
        diastole,
        systole,
        uuid: 1,
        heartbeat,
        addedon: new Date().toLocaleDateString(),
        date,
        timeofday,
        symptoms: selectedSymptoms,
        meals,
      });
      //send to server  via axios
      setSpinner(true);
      axios
        .post("add-readings", {
          diastole,
          systole,
          uuid: altId,
          heartbeat,
          addedon: new Date().toLocaleDateString(),
          date,
          timeofday,
          symptoms: selectedSymptoms,
          meals,
          stressed,
        })
        .then((res) => {
          const { data } = res;
          // status property is set manually by dev on server
          if (data?.status === 200) {
            console.log(res);
            setSucces(data.msg);
            setSection(5);
            setSystole("");
            setDiastole("");
            setHeartbeat("");

            setMeal("");
            setDate("");
            setMoment(moment.map((item) => ({ ...item, checked: false })));
            setSymptoms(
              symptoms.map((item: Symptoms) => ({ ...item, clicked: false }))
            );
            //setTimeout(() => setSucces(""), 3000);
          } else {
            throw new Error(data.msg);
          }
        })
        .catch((error) => setError(error.message))
        .finally(() => {
          setSpinner(false);
          setTimeout(() => {
            setError("");
          }, 3000);
        });
    } else {
      setError("Some field(s) are missing.");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };
  const handleBlurs = (event: React.FocusEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    if (target.value) {
      if (target.id === "Systole") return setSytoleErr(false);
      if (target.id === "Diastole") return setdiaErr(false);
      if (target.id === "Heartbeat") return setPulseErr(false);
    }
  };

  const handleChecks = (id: number) => {
    setMoment(
      moment.map((item) =>
        item.id === id
          ? { ...item, checked: true }
          : { ...item, checked: false }
      )
    );
  };
  const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (new Date(target.value) > new Date()) {
      setDate("");
      return setError("Invalid date, We're not yet there.....");
    } else {
      setError("");
      setDate(target.value);
    }
  };
  const handleSymptoms = (id: number) => {
    // check if symptom has already been clikcked
    const alreadyClicked = symptoms.find(
      (item) => item.id === id && item.clicked
    );

    // serios ternary operator
    alreadyClicked?.id
      ? setSymptoms(
          symptoms.map((item) =>
            item.id === id ? { ...item, clicked: false } : item
          )
        )
      : setSymptoms(
          symptoms.map((item) =>
            item.id === id ? { ...item, clicked: true } : item
          )
        );
  };

  const handleModal = () => {
    setMoment(moment.map((item) => ({ ...item, checked: false })));
    setModal(false);
    Router.push("/");
  };
  const spinnerEl = (
    <div className="mx-auto p-2 text-center">
      <CircularProgress color="primary" size="2rem" />
    </div>
  );
  /*The damn hook */
  React.useEffect(() => {
    fetchSymptoms();

    window.addEventListener("online", () => console.log("you're online"));
    window.addEventListener("offline", () => console.log("you're offline"));
  }, []);

  let BpJsx = null;
  // freadings btns
  const btns = (
    <FormControl component="fieldset" className="my-4">
      <FormLabel component="legend" disabled>
        Select time of day.
      </FormLabel>
      <FormGroup row>
        {moment.map((item) => (
          <FormControlLabel
            key={item.id}
            control={
              <Radio
                key={item.id}
                color="secondary"
                onChange={() => handleChecks(item.id)}
                value={item.time}
                checked={item.checked}
              />
            }
            label={item.time}
          />
        ))}
      </FormGroup>
    </FormControl>
  );

  const DateReadings = (
    <Dialog open={modal} className="p-4">
      <DialogTitle>Choose date</DialogTitle>
      <DialogContent>
        <TextField
          type="date"
          className="mx-auto my-4 p-2"
          helperText="Choose date"
          onChange={handleDate}
          value={date}
        />
        <Box>{date && btns}</Box>
        {dspinner && <LinearProgress color="primary" />}
        {error && (
          <Typography variant="body1" className="p-2 m-2  text-red-600">
            {error}
          </Typography>
        )}

        <DialogActions>
          {dspinner ? (
            <Typography variant="body1" className="text-green-500">
              Checking details....
            </Typography>
          ) : (
            <Button color="secondary" variant="contained" onClick={handleModal}>
              Close
            </Button>
          )}
          {!dspinner && (
            <Button
              color="primary"
              disabled={!moment.some((item) => item.checked)}
              onClick={handleDuplicates}
              variant="contained"
            >
              Continue
            </Button>
          )}
        </DialogActions>
      </DialogContent>
    </Dialog>
  );

  const BpReadings = (
    <>
      <TextField
        type="text"
        label="Systole"
        onBlur={handleBlurs}
        error={systoleErr}
        // error={!!systoleErr}
        value={systole}
        placeholder="Enter upper reading"
        id="Systole"
        margin="dense"
        variant="outlined"
        size="small"
        onChange={handleChange}
        required
        className="m-3 p-2 w-full"
      />

      <TextField
        type="text"
        label="Diastole"
        onBlur={handleBlurs}
        placeholder="Enter lower reading"
        margin="dense"
        id="Diastole"
        variant="outlined"
        size="small"
        onChange={handleChange}
        value={diastole}
        className="m-3 p-2 w-full"
        required
        error={diaErr}
      />

      <TextField
        type="text"
        id="Heartbeat"
        onBlur={handleBlurs}
        margin="dense"
        placeholder="Enter heartbeat"
        label="Heartbeart"
        variant="filled"
        size="small"
        value={heartbeat}
        required
        onChange={handleChange}
        error={pulseErr}
        className="m-3 p-2 w-full"
      />
    </>
  );

  const BpSymptoms = (
    <Box>
      {!!symptoms.length && (
        <UserSymptoms symptoms={symptoms} sendClicked={handleSymptoms} />
      )}
      <Button
        variant="outlined"
        color="primary"
        style={{ width: "100%" }}
        onClick={() => setSection(4)}
        endIcon={<ArrowRight />}
      >
        Next
      </Button>
    </Box>
  );
  const BPMeals = (
    <div>
      <Divider />
      <FormControlLabel
        name="Feeling unwell or stressful day?"
        label="Feeling unwell or having a stressful day?"
        control={
          <Checkbox
            value={stressed}
            checked={stressed}
            onChange={(e) => setStressed(e.target.checked)}
          />
        }
      />

      <Divider />
      <TextField
        type="text"
        id="Meal"
        margin="dense"
        placeholder=""
        variant="outlined"
        helperText="Did you eat/drink something unusual today?"
        multiline
        error={!meals}
        rows={4}
        value={meals}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setMeal(e.target.value)
        }
        className="m-3 p-2 w-full"
      />
    </div>
  );
  const BpSuccess = (
    <Box>
      {success && (
        <Alert
          severity="success"
          variant="filled"
          className="text-white p-4 my-2"
        >
          {" "}
          {success}
        </Alert>
      )}
      <Button variant="outlined" color="secondary">
        Add another reading
      </Button>
    </Box>
  );
  switch (section) {
    case 1:
      BpJsx = DateReadings;
      break;
    case 2:
      BpJsx = BpReadings;
      break;
    case 3:
      BpJsx = BpSymptoms;
      break;
    case 4:
      BpJsx = BPMeals;
      break;
    case 5:
      BpJsx = BpSuccess;
      break;
    default:
      BpJsx = BpSuccess;
      break;
  }

  return (
    <Layout title="Add today's readings...">
      <Paper className="mx-5 my-3 p-4">
        <Card variant="outlined" style={{ maxWidth: 400 }}>
          <CardHeader
            subheader={
              <Typography align="center" variant="h6">
                Add Blood pressure readings
              </Typography>
            }
            title=""
          />
          <CardContent>
            <Typography paragraph className="p-2 font-bold">
              {date ? new Date(date).toDateString() : new Date().toDateString()}
              {"  "} {` (${moment.find((item) => item.checked)?.time})`}
            </Typography>
            <form
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
              style={{ visibility: visible ? "visible" : "hidden" }}
            >
              <div>{DateReadings}</div>
              {BpJsx}

              <Box className="mt-4">
                {error && (
                  <Typography variant="body1" className="p-1 m-2  text-red-600">
                    {error}
                  </Typography>
                )}

                {spinner && spinnerEl}
                {section !== 3 && (
                  <Button
                    type="submit"
                    variant="contained"
                    className="w-full my-4"
                    color="primary"
                    disabled={spinner}
                  >
                    {spinner ? "Adding Readings" : "Add Readings."}
                  </Button>
                )}
              </Box>
            </form>
          </CardContent>
        </Card>
        <Divider />
      </Paper>
    </Layout>
  );
}

const UserSymptoms: React.FC<{
  symptoms: Symptoms[];
  sendClicked: (id: number) => void;
}> = ({ symptoms = [], sendClicked = (f) => f }) => {
  return (
    <>
      <Typography align="center" className="p-2" variant="subtitle1">
        Click on the symptoms you might be feeling
      </Typography>
      <List>
        {symptoms.map((item, i) => (
          <ListItem
            key={item.id}
            button
            dense
            className={item.clicked ? "bg-red-700" : ""}
            selected={item.clicked}
            onClick={() => sendClicked(item.id)}
          >
            <Checkbox
              checked={item.clicked}
              color="primary"
              onChange={() => sendClicked(item.id)}
            />
            {i + 1}. {"  "}
            {item.symptom}
            {item.clicked && (
              <CheckCircleRounded className="ml-5" htmlColor="green" />
            )}
          </ListItem>
        ))}
      </List>
    </>
  );
};

const syms = [...Array(10)].map((it, i) => ({
  id: i + 1,
  symptom: "Headache",
  clicked: false,
}));
