import React from "react";
import axios from "axios";
import Router, { useRouter } from "next/router";
import Layout, { getToken } from "../../components/ui/Layout";
import { Skeleton } from "@material-ui/lab";
import { getWidth, getHeight } from "../../components/svg/helpers";
import Line, { BpToolTip } from "../../components/svg/line";
import {
  Box,
  Slider,
  Grid,
  Typography,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  CircularProgress,
} from "@material-ui/core";
import { ArrowBack, ArrowRight, Error } from "@material-ui/icons";

type Readings = {
  systole: number;
  diastole: number;
  addedon: Date;
  id: number;
  aboveNormal: string;
  selecteddate: string;
  timeofday: string;
};

type Symptoms = { id: number; symptom: string };
type UserSymptoms = {
  id: number;
  user_id: number;
  symptoms: string;
  stressed: boolean;
  timeofday: number;
  selecteddate: string;
};
type Profile = {
  name?: string;
  phone?: string;
  email?: string;
};

export default function Patient() {
  // the actual readings
  const [readings, setReadings] = React.useState<Readings[]>([]);
  const [meal, setMeal] = React.useState<{ meal?: string; stressed?: number }>(
    {}
  );
  const [otherReadins, setOthers] = React.useState<{
    evening: Readings;
    whole: Readings;
  }>({});
  const [profile, setProfile] = React.useState<Profile>({});
  const [spinner, setSpinner] = React.useState(false);

  // all symptoms
  const [symptoms, setSymptoms] = React.useState<Symptoms[]>([]);
  // user symptoms
  const [userSymptoms, setUserSymptoms] = React.useState<UserSymptoms[]>([]);

  const {
    query: { name },
  } = useRouter();

  // readings
  const fetchReadings = async (slug: string) => {
    try {
      setSpinner(true);
      const {
        data: { readings, profile },
      } = await axios.get(`/fetch-readings/${slug}`);
      if (profile?.name) setProfile(profile);

      if (readings.length) {
        setReadings(readings);
      } else {
        throw new ReferenceError("User readings not found");
      }
    } catch (error) {
      console.log(error);
      setSpinner(false);
      setTimeout(() => {
        setReadings(theReadings);
        setUserSymptoms(uus);
        setProfile({
          name: "Kimaiga Nelson",
          email: "nelsonkimaiga@gmail.com",
          phone: "0788287557",
        });
      }, 3000);
    }
  };
  // sort symptoms

  const sortSymptoms = (userSymptoms: Symptoms[], symptoms: Symptoms[]) => {
    let syms: Symptoms[] = [];
    userSymptoms.forEach((userSym: Symptoms) => {
      const symp = symptoms.find((item) => item.id === +userSym);
      syms = [...syms, symp];
    });

    return syms;
  };
  // clicked symptoms, if any
  const fetchClickedSymptoms = async (reading: Readings) => {
    if (!Number(reading?.aboveNormal)) return;

    try {
      // destructure payload
      const {
        data: { fetchedsymptoms, meals, evening, whole },
      } = await axios.get(
        `/get-readings-symptoms/${name}/${reading.timeofday}/${reading.selecteddate}`
      );
      // evening or whole day reads
      setOthers({
        evening: evening.length ? evening : {},
        whole: whole.length ? whole : {},
      });
      // check if payload exist
      if (fetchedsymptoms[0]?.symptoms.length) {
        // destructure object from array
        const [returnedSyms] = fetchedsymptoms;
        setMeal({ meal: meals[0]?.meals, stressed: returnedSyms.stressed });
        // make an array from the string on object by splitting the array
        const userSysms = returnedSyms.symptoms.split("*");
        // finally get the symptoms
        const syms: Symptoms[] = sortSymptoms(userSysms, symptoms);
        setUserSymptoms(syms);
      } else {
        setUserSymptoms([]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  //fetch all symptoms
  const fetchSymptoms = async () => {
    try {
      const res = await axios.get("/fetch-symptoms");
      setSymptoms(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  const getHoverInfo = (hoverInfo: Reading) => {
    const { data } = hoverInfo;

    fetchClickedSymptoms(data);
  };
  const handleMouseLeave = (bool: boolean) => {
    setUserSymptoms([]);
    setMeal({});
  };
  React.useEffect(() => {
    // fetch symptoms
    fetchSymptoms();
    // destructure the slug from url query param

    if (name && name !== "bp-app") {
      localStorage.setItem("current-reading", name) as any;
      fetchReadings(name);
    } else {
      //route.push("/");
      const name = localStorage.getItem("current-reading") as any;
      fetchReadings(name);
    }
  }, []);
  console.log("other readings", otherReadins);
  return (
    <Layout>
      <Grid
        className="my-4 p-4 "
        spacing={0}
        justify="space-evenly"
        alignItems="flex-start"
        container
      >
        {/*.filter((reading) => reading.timeofday === 1)*/}
        <Grid item sm={12} md={9} lg={9} className="p-4">
          {/*  <IconButton title="Back" onClick={() => Router.push("/")}>
            <ArrowBack />{" "}
  </IconButton>*/}
          {readings.length ? (
            <>
              <Line
                data={readings}
                getOp={handleMouseLeave}
                getTools={getHoverInfo}
                profile={profile}
              />
            </>
          ) : !spinner ? (
            <Box className="text-center p-4 mx-auto my-4">
              <Typography color="secondary" variant="body1">
                {" "}
                <Error color="secondary" /> User readings not found...
              </Typography>
            </Box>
          ) : (
            <Box className="text-center p-4 mx-auto my-4">
              <CircularProgress color="primary" size="5rem" />
              <Typography>Loading chart...</Typography>
            </Box>
          )}
        </Grid>
        <Grid item sm={12} md={3} lg={3}>
          {!!userSymptoms.length && (
            <>
              <SymptomsList
                symptoms={userSymptoms}
                meal={meal}
                others={otherReadins}
                profile={profile}
              />
            </>
          )}
        </Grid>
      </Grid>
    </Layout>
  );
}

function BpSlider({ data }) {
  const [readings, setReadings] = React.useState([]);
  const handleChange = (e: any, newValue: number | number[]) => {
    //console.log(newValue);
    setReadings(newValue as number[]);
  };
  function valuetext(value: number) {
    return `${value}°C`;
  }
  React.useEffect(() => {
    const sortedData = [
      ...data
        .sort((a, b) => new Date(a) - new Date(b))
        .map((item) => item.toDateString()),
    ];

    setReadings([0, sortedData.length - 1]);
  }, [data]);
  console.log(readings);
  return (
    <Box style={{ maxWidth: 500 }} className="my-2 p-4">
      <Slider
        getAriaValueText={valuetext}
        value={readings}
        onChange={handleChange}
        valueLabelDisplay="on"
        marks={data.map((item, i) => ({
          value: i + 20,
          label: item.toString(),
        }))}
      />
    </Box>
  );
}

const SymptomsList: React.FC<{
  symptoms: Symptoms[];
  meal: { meal: string; stressed: number };
  profile: Profile;
  others: { evening: Readings; whole: Readings };
}> = ({ symptoms = [], meal = {}, profile = {}, others = {} }) => (
  <Card>
    <CardContent>
      <Typography variant="h6">{profile.name}</Typography>
      <Typography variant="body2">{profile.phone}</Typography>
      <Typography variant="body1" className="text-center font-bold">
        Symptoms
      </Typography>
      <List>
        {symptoms.map((item, i) => (
          <ListItem key={item?.id} dense divider>
            <ListItemIcon>
              <ArrowRight />
            </ListItemIcon>
            {item?.symptom}
          </ListItem>
        ))}
      </List>
      {!!meal.stressed && (
        <Typography variant="body2">Stressed and feeling unwell</Typography>
      )}
      {!!meal.meal && (
        <Box>
          <Typography variant="h6" className="text-center">
            Meal
          </Typography>
          <Typography variant="body2">{meal.meal}</Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);
function generateNums() {
  let readings: number[] = [];
  let lastreading: number | undefined;

  function inner(read, a, b) {
    while (readings.length < 30) {
      const num = Math.floor(Math.random() * read);
      if (num < a || num > b || readings.indexOf(num) > 0) {
        inner(read, a, b);
        continue;
      }
      lastreading = num;
      readings = [...readings, num];
    }
    return readings;
  }
  return inner;
}
const bp = generateNums();
const bp1 = generateNums();
const systole = bp(140, 80, 150);
const diastole = bp1(90, 60, 100);
const theReadings = systole.map((sys, i) => ({
  id: i + 1,
  systole: sys,
  aboveNormal: i % 2 == 0 ? "1" : "0",
  diastole: diastole[i],
  selecteddate: new Date("2021", "02", i + 1),
}));

const syms = [...Array(10)].map((item, i) => ({
  id: i + 1,
  symptom: i % 2 === 0 ? "Feverish" : "Headache",
}));
const uus = [...Array(5)].map((item, idx) => ({
  id: idx + 1,
  symptom: idx % 2 === 0 ? "The Jules" : "The Vince",
}));
