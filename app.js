const express = require("express");
const mongoose = require("mongoose");
const { MONGOURI } = require("./Keys/keys");
const bodyparser = require("body-parser");
require("dotenv").config();
const requirelogin = require("./Middleware/requirelogin"); //middleware
const cron = require("node-cron");
const sendEmail = require("./utils/sendEmail");

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
require("./Models/electionLedger");
require("./Models/pollLedger");

//Routes Registering
const vote = require("./Routes/vote");
const voter = require("./Routes/voter");
const signup = require("./Routes/signup");
const admin = require("./Routes/admin");
const ballot = require("./Routes/ballot");
const campaign = require("./Routes/campaign");
const party = require("./Routes/party");
const candidate = require("./Routes/candidate");
const poll = require("./Routes/poll");
const election = require("./Routes/election");
const poller = require("./Routes/poller");

const Election = mongoose.model("Election");
const Voter = mongoose.model("Voter");
const Ballot = mongoose.model("Ballot");
const Polls = mongoose.model("Polls");
const Poller = mongoose.model("Poller");
const Campaign = mongoose.model("Campaign");
const Party = mongoose.model("Party");
const Nadra = mongoose.model("Nadra");
const Candidate = mongoose.model("Candidate");
const ElectionLedger = mongoose.model("ElectionLedger");
const PollLedger = mongoose.model("PollLedger");

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
  poller,
]); //using the routes

const serverNumber = process.env.PORT || 1970;

///////MongoDB connection/////////////////////

const serverDebuger = require("debug")("app:server");

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}); //to remove deprecated warnings

mongoose.connection.on("connected", () => {
  console.log("Successfully made a connection with MONGO");
  app.listen(serverNumber, () => {
    serverDebuger(`connected to ${serverNumber}`);
  });
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

//stopping Election
cron.schedule("*/15 * * * * *", async () => {
  console.log("Stopping Election");
  try {
    const elections = await Election.find({})
      .populate({
        path: "parties",
        select: "-partyImg",
      })
      .catch((err) => {
        return console.log(err);
      });

    let check1 = false; //checks if the current election has ended or not

    elections.map(async (election) => {
      if (
        Number(Date.now()) >= Number(election.endTime) &&
        election.valid == true
      ) {
        console.log(
          election.valid == true &&
            Number(Date.now()) >= Number(election.endTime)
        );
        election.valid = false;
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
        await election.save().catch((err) => {
          console.log(err);
        });
        check1 = true;
      }
    });
    //check for election end
    if (check1 == false) {
      return console.log("no election end");
    }
  } catch (err) {
    console.log(err);
  }

  //sends email to all voters
  /* try {
      const emailsList = cloneVoters.map((voter) => {
        console.log("Voter==>", voter.email);
        return voter.email;
      });
      const emails = emailsList.join(",");
      //console.log("Emails==>", emails);
      console.log(
        `\n This email is about to notify you that the current election has ended, you the results are announced on our website https://pak-vote.herokuapp.com/`
      );
      await sendEmail({
        email: emails,
        subject: "Election End & Result Announcement",
        message: `This email is about to notify you that the election has ended, you can view the results on our website \n https://pak-vote.herokuapp.com/ `,
      });
    } catch (error) {
      console.log(error.message);
    } */

  console.log("election ended");
});

//start election
cron.schedule("*/18 * * * * *", async () => {
  console.log("start election");
  const elections = await Election.find({}).catch((err) => {
    console.log(err);
  });

  let electionStartCheck = false;
  elections.map(async (election) => {
    if (
      Date.now() >= Number(election.startTime) &&
      Date.now() <= Number(election.endTime)
    ) {
      election.valid = true;
      await election.save();
      electionStartCheck = true;
    }
  });

  if (electionStartCheck == false) {
    return console.log("no elections are running");
  }
  console.log("election has started");
});

//start polls
cron.schedule("*/35 * * * * *", async () => {
  try {
    const polls = await Polls.find({}).catch((err) => {
      console.log(err);
    });

    if (!polls || polls === null || polls === []) {
      return res.status(400).json({ message: "There are no polls" });
    }

    polls.map(async (poll) => {
      if (
        //checks if its a polls valid time
        Date.now() >= Number(poll.startTime) &&
        Date.now() <= Number(poll.endTime) &&
        poll.valid == false
      ) {
        poll.valid = true;
        await poll.save().catch((err) => {
          console.log(err);
        });
        check1 = true;
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//stop polls ***
cron.schedule("*/40 * * * * *", async () => {
  console.log("Stopping Poll");
  try {
    const polls = await Polls.find({}).catch((err) => {
      return console.log(err);
    });

    const pollers = await Poller.find({})
      .populate("pollvote")
      .catch((err) => console.log(err));

    //console.log(pollers);

    let check1 = false; //checks if the current poll has ended or not

    polls.map(async (poll) => {
      if (Date.now() >= Number(poll.endTime) && poll.valid == true) {
        poll.valid = false;
        check1 = true;
        await poll.save().catch((err) => {
          console.log(err);
        });
        //checks if poll has ended
      }
    });

    if (!check1 || check1 == false) {
      console.log("no poll in que for ending");
      //checks if the current poll has ended, if it has then a email will not be generated
      return;
    }

    const newPollLedger = new PollLedger({
      poller: pollers,
    }); //creates an instance of poll ledger

    await newPollLedger
      .save()
      .then(() => {
        console.log("Poll Ledger Succesfully Saved");
      })
      .catch((err) => {
        console.log(err);
      }); //saves the model for the poll ledger

    //sends email to all voters
    const emailsList = pollers.map((poller) => {
      return poller.email;
    });
    const emails = emailsList.join(",");

    /* try {
      await sendEmail({
        email: emails,
        subject: "Poll End & Result Announcement",
        message: `This email is about to notify you that the election has ended, you can view the results on our website \n https://pak-vote.herokuapp.com/ `,
      }).catch((err) => {
        console.log(err);
      });
    } catch (err) {
      console.log(err);
    }  */
  } catch (err) {
    console.log(err);
  }
});
