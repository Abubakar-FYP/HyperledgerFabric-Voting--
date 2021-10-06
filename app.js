const express = require("express");
const mongoose = require("mongoose");
const { MONGOURI } = require("./Keys/keys");
const bodyparser = require("body-parser");

const requirelogin = require("./Middleware/requirelogin"); //middleware

const app = express();

app.use(express.json()); //to parse outgoing json in the post req
app.use(express.urlencoded({ extended: true })); //parse html forms, like post methods etc

//Models registering
require("./Models/admin");
require("./Models/voter");
require("./Models/vote");
require("./Models/campaign");
require("./Models/ballot");
require("./Models/party");
require("./Models/criminal");

//Routes Registering
var vote = require("./Routes/vote");
var signup = require("./Routes/signup");
var admin = require("./Routes/admin");
var ballot = require("./Routes/ballot");
var campaign = require("./Routes/campaign");
var party = require("./Routes/party");

app.use([signup, vote, party, admin, ballot, campaign]); //using the routes

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

app.listen(serverNumber, () => {
  console.log(`connected to ${serverNumber}`);
});
