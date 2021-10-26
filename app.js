const express = require("express");
const mongoose = require("mongoose");
const { MONGOURI } = require("./Keys/keys");
const bodyparser = require("body-parser");
require("dotenv").config();
const requirelogin = require("./Middleware/requirelogin"); //middleware

const app = express();
app.use(express.json({limit: '50mb'})); //to parse outgoing json in the post req

const cors = require("cors");

app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  next();
});

app.use(express.urlencoded({ extended: true })); //parse html forms, like post methods etc

//Models registering
require("./Models/admin");
require("./Models/voter");
require("./Models/vote");
require("./Models/campaign");
require("./Models/ballot");
require("./Models/party");
require("./Models/poll");
require("./Models/polls");
require("./Models/candidate");
require("./Models/nadra");
require("./Models/criminal");
require("./Models/election");

//Routes Registering
var vote = require("./Routes/vote");
var voter = require("./Routes/voter");
var signup = require("./Routes/signup");
var admin = require("./Routes/admin");
var ballot = require("./Routes/ballot");
var campaign = require("./Routes/campaign");
var party = require("./Routes/party");
var candidate = require("./Routes/candidate");
var poll = require("./Routes/poll");
var election = require("./Routes/election");

app.use([
  signup,
  ballot,
  vote,
  candidate,
  party,
  admin,
  campaign,
  voter,
  poll,
  election,
]); //using the routes

const serverNumber = 1970;

///////MongoDB connection/////////////////////

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}); //to remove deprecated warnings

mongoose.connection.on("connected", () => {
  console.log("Successfully made a connection with MONGO");
});

mongoose.connection.on("error", (err) => {
  console.log("Failed to connect with MONGO", err);
  mongoose.connection.close();
});

mongoose.connection.on("exit", (err) => {
  console.log("Failed to connect with MONGO", err);
  mongoose.connection.close();
});

///////*MongoDB connection//////////////////////

app.get("/", (req, res) => {
  res.send("home");
});
const serverDebuger = require("debug")("app:server");
app.listen(serverNumber, () => {
  serverDebuger(`connected to ${serverNumber}`);
});
