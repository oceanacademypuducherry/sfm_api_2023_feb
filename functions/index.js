const functions = require("firebase-functions");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//

const express = require("express");
const cors = require("cors");
// const dotenv = require("dotenv");
//
const user = require("./routes/user_action");
const mission = require("./routes/mission_action");
const achievement = require("./routes/achievement_action");
const journal = require("./routes/journal_action");
//
// dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  res.send("it is working");
});
app.use("/user", user);
app.use("/mission", mission);
app.use("/achievement", achievement);
app.use("/journal", journal);

exports.app = functions.https.onRequest(app);
