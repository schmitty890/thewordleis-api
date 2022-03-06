import express from "express";
import bodyParser from "body-parser";
import wordleRoutes from "./routes/wordleRoutes";
import mongoose from "mongoose";
import http from "http";

const PORT = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;

const app = express();

// body parser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// mongoose connection
mongoose.Promise = global.Promise;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/wordleDB";
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// serving static files
app.use(express.static("public"));

app.get("/test", (req, res) => {
  res.send("test route!");
});

// app.use("/docs", swaggerUi.serve);

wordleRoutes(app);

app.get("/", (req, res) => {
  console.log(`hi on port ${PORT}`);
});

setInterval(function () {
  http.get("https://thewordleis-api.herokuapp.com/api/v1/test");
}, 300000); // every 5 minutes (300000)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
