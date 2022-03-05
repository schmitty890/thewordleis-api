import express from "express";
import bodyParser from "body-parser";

const PORT = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8081;

const app = express();

// body parser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// serving static files
app.use(express.static("public"));

app.get("/test", (req, res) => {
  res.send("test route!");
});

app.get("/", (req, res) => {
  console.log(`hi on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
