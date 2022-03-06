import {
  test,
  getTheWordle,
  updateDBTimeZones,
  wordleCronJob,
  getWordByDate,
} from "../controllers/wordleController";
// console.log(test);
// determine port server is running on
// const PORT = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
// determine port for swagger docs
// let hostURL =
//   PORT === 8080
//     ? "localhost:8080"
//     : "aws-celebrity-recognition-6k8zj.ondigitalocean.app";

// define routes
const routes = (app) => {
  app.route("/api/v1/test").get(test);

  app.route("/api/v1/getthewordle").get(getTheWordle);

  app.route("/api/v1/updatedbtimezones").get(updateDBTimeZones);

  app.route("/api/v1/wordlecronjob").get(wordleCronJob);

  app.route("/api/v1/getWordByDate").get(getWordByDate);
};

export default routes;
