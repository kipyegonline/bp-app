import React from "react";
import axios from "axios";
import {
  Box,
  Card,
  TextField,
  Typography,
  Button,
  FormControl,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/DeleteForever";
import ErrorIcon from "@material-ui/icons/ErrorOutline";
import Layout from "../components/ui/Layout";

const Symptoms = () => {
  const [symptoms, setSymptoms] = React.useState<Symptom[]>([]);
  const [spinner, setSpinner] = React.useState(false);
  const fetchSymptoms = async () => {
    setSpinner(true);
    try {
      const res = await axios.get("/fetch-symptoms");
      setSymptoms(res.data);
      setSpinner(false);
    } catch (error) {
      setSpinner(false);
      console.log(error.message);
    }
  };
  const handleDelete = (id: number) => {
    if (confirm("Delete symptom?")) {
      fetch(`/delete-symptom/${id}`)
        .then((res) => res.json())
        .then((res) => {
          fetchSymptoms();
        })
        .catch((error) => console.log(error.message));
    }
  };
  React.useEffect(() => {
    fetchSymptoms();
  }, []);
  return (
    <Layout>
      <Grid container>
        <Grid item xs={12} md={6} lg={6}>
          <AddSymptoms fetchSymptoms={fetchSymptoms} />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Card className="p-4 mt-2 mx-auto">
            {symptoms.length ? (
              <SymptomList sympto={symptoms} sendClick={handleDelete} />
            ) : spinner ? (
              <div className="mx-auto text-center p-4 m-4">
                <CircularProgress color="primary" size="3rem" />
              </div>
            ) : (
              <Typography className="p-4 my-auto">
                {" "}
                <ErrorIcon color="secondary" /> Error fetching symptoms
              </Typography>
            )}
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};
export default Symptoms;

function AddSymptoms({
  fetchSymptoms = () => console.log("fetched"),
}): JSX.Element {
  const [text, setText] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const form = React.useRef<null | HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) return;

    axios
      .post("/add-symptom", { text })
      .then((res) => {
        setSuccess(res?.data?.msg);
        form?.current?.reset();
        fetchSymptoms();
        setTimeout(() => setSuccess(""), 3000);
      })
      .catch((error) => console.log(error.message))
      .finally(() => setText(""));
  };
  return (
    <Card className="p-4 mt-2 mx-auto" style={{ maxWidth: 500 }}>
      <form onSubmit={handleSubmit} ref={form}>
        <Typography variant="body2">Enter BP symptom </Typography>
        <FormControl className="w-100" style={{ width: "100%" }}>
          <TextField
            rows="3"
            variant="filled"
            label="Enter BP symptom "
            multiline
            fullWidth
            onChange={(e) => setText(e.target.value)}
          />
        </FormControl>
        {success && (
          <Typography className="text-green-700 p-2 m-2">{success}</Typography>
        )}
        <div className="my-2 w-100">
          <Button
            type="submit"
            style={{ width: "100%" }}
            color="primary"
            className="w-100"
            variant="contained"
          >
            Add Symptom
          </Button>
        </div>
      </form>
    </Card>
  );
}

type Symptom = {
  symptom: string;
  id: number;
};
const SymptomList: React.FC<{
  sympto: Symptom[];
  sendClick: (id: number) => void;
}> = ({ sympto, sendClick = (f: number) => f }) => {
  return (
    <List>
      {sympto.map((item: Symptom, i: number) => (
        <ListItem key={item.id} button divider>
          <ListItemText primary={` ${i + 1}. ${item.symptom}`} />{" "}
          <ListItemIcon>
            <DeleteIcon onClick={() => sendClick(item.id)} />
          </ListItemIcon>
        </ListItem>
      ))}
    </List>
  );
};
