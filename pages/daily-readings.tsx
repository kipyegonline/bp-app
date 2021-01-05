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
} from "@material-ui/core";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import axios from "axios";
import React from "react";
import Layout from "../components/ui/Layout";

const timeOfDay: { time: string; id: number; checked: boolean }[] = [
  { time: "Morning", id: 1, checked: false },
  { time: "Evening", id: 2, checked: false },
  { time: "Whole day", id: 3, checked: false },
];
export default function DailyReadings(): React.ReactNode {
  const [systoleErr, setSytoleErr] = React.useState("");
  const [diaErr, setdiaErr] = React.useState("");
  const [systole, setSystole] = React.useState<number | string>("");
  const [diastole, setDiastole] = React.useState<number | string>("");
  const [heartbeat, setHeartbeat] = React.useState<number | string>("");
  const [date, setDate] = React.useState<string>("");
  const [moment, setMoment] = React.useState(timeOfDay);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const setState = eval("set" + target.id);
    if (Number.isNaN(Number(target.value)))
      setSytoleErr("Enter a proper number");
    else setState(+target.value);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ systole, diastole, heartbeat, date });
    if (Number(systole) > 0 && +diastole > 0 && +heartbeat > 0 && date.length) {
      //send to server
      axios
        .post("add-readings", {
          diastole,
          systole,
          heartbeat,
          addedon: new Date().toLocaleDateString(),
          date,
          timeofday: moment.find((item) => item.checked)?.id,
        })
        .then((res) => {
          const { data } = res;
          if (data.status === 200) {
            console.log(res);
          } else {
            throw new Error(data.msg);
          }
        });
      setTimeout(() => {
        setSystole("");
        setDiastole("");
        setHeartbeat("");
        setDate("");
      }, 5000);
    } else {
      throw new TypeError("NaN");
    }
  };
  const handleBlurs = (event: React.FocusEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
  };

  /*
          <Button
            key={item.id}
            variant={item.checked ? "contained" : "outlined"}
            size="small"
            className="mr-10"
            color="primary"
          >
            {item.time}
          </Button>*/
  const handleChecks = (id: number) => {
    setMoment(
      moment.map((item) =>
        item.id === id
          ? { ...item, checked: true }
          : { ...item, checked: false }
      )
    );
  };
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
            <form onSubmit={handleSubmit}>
              <div>
                <TextField
                  type="date"
                  className="mx-auto my-4 p-2"
                  helperText="Choose date"
                  onChange={(e) => setDate(e?.target?.value)}
                  value={date}
                />
                {date && btns}
                <Divider className="my-4 " />
                <TextField
                  type="number"
                  label="Systole"
                  onBlur={handleBlurs}
                  helperText={systoleErr}
                  // error={!!systoleErr}
                  value={systole}
                  placeholder="Enter upper reading"
                  id="Systole"
                  margin="dense"
                  variant="outlined"
                  size="small"
                  onChange={handleChange}
                  className="m-3 p-2 w-full"
                />

                <TextField
                  type="number"
                  label="Diastole"
                  placeholder="Enter lower reading"
                  margin="dense"
                  id="Diastole"
                  variant="outlined"
                  size="small"
                  onChange={handleChange}
                  value={diastole}
                  className="m-3 p-2 w-full"
                  error={!!diaErr}
                />

                <TextField
                  type="number"
                  id="Heartbeat"
                  margin="dense"
                  placeholder="Enter heartbeat"
                  label="Heartbeart"
                  variant="filled"
                  size="small"
                  value={heartbeat}
                  onChange={handleChange}
                  className="m-3 p-2 w-full"
                />
              </div>
              <Box className="mt-4">
                <Button
                  type="submit"
                  variant="contained"
                  className="w-full "
                  color="primary"
                >
                  Add Readings
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
        <Divider />
      </Paper>
    </Layout>
  );
}