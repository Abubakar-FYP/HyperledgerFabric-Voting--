const express = require("express");
const mongoose = require("mongoose");
const { MONGOURI } = require("./Keys/keys");
const bodyparser = require("body-parser");
require("dotenv").config();
const requirelogin = require("./Middleware/requirelogin"); //middleware
const cron = require("node-cron");

const Election = require("./Models/election");

const app = express();
app.use(express.json({ limit: "50mb" })); //to parse outgoing json in the post req

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
require("./Models/campaign");
require("./Models/ballot");
require("./Models/party");
require("./Models/polls");
require("./Models/candidate");
require("./Models/nadra");
require("./Models/criminal");
require("./Models/election");
require("./Models/poller");

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
var poller = require("./Routes/poller");

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

const path = require("path");
if (process.env.NODE_ENV === "production") {
  console.log("production mode");
  app.use(express.static(path.resolve(process.cwd(), "FrontEnd/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(process.cwd(), "FrontEnd/build/index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Api is Running");
  });
}

app.get("/", (req, res) => {
  res.send("home");
});
const serverDebuger = require("debug")("app:server");
app.listen(serverNumber, () => {
  serverDebuger(`connected to ${serverNumber}`);
});

//stop election cronjob for every 1 min
cron.schedule("*/1 * * * * *",router.put("/stopelection", async (req, res) => {
  const elections = await Election.find({})
    .populate({
      path: "parties",
      select: "-partyImg",
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: "there was an error fetching elections" });
    });

  elections.map(async (election) => {
    if (Number(new Date()) >= Number(election.endTime)) election.valid = false;
    if (election.valid == false) {
      //checks if election has ended
      election.parties.map(async (party) => {
        if (party.participate.inelection == true) {
          //if election has ended, then set party to not participate in any election
          const updateParty = await Party.findOne({ _id: party._id });
          updateParty.participate.inelection = false;
          await updateParty.save().catch((err) => {
            console.log(err);
          });
        }
      });
    }
    await election.save().catch((err) => {
      console.log(err);
    });
  });

  res.json({ message: elections });

  //check if already participated and valid
  //parties particpate.inelection = false
}))
