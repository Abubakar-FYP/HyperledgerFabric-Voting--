const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const requireLogin = require("../Middleware/requirelogin");

require("../Models/candidate");
require("../Models/nadra");
require("../Models/poll");
require("../Models/polls");

const Polls = mongoose.model("Polls");
const Poll = mongoose.model("Poll");

/*
created two DBs, 
Polls : consist of polls created
Poll : consist of polls in which vote are saved

/createpoll , in Routes/polls.js , creates a poll runtime
/getpollforcandidates/:voterId in Routes/polls.js , gets poll for registered and approved party candidates 
/getvalidpolls , in Routes/polls.js , gets all valid polls, meaning that are in progress
/getinvalidpolls,in Routes/polls.js , gets all invalid polls meaning that thev'e finished
/getallpolls ,in Routes/polls.js , gets all poll
 */

router.post("/createpoll", async (req, res) => {
  const { pollId, pollname, type, description, candidate } = req.body;

  if (!pollId || !pollname || !type || !description || !candidate) {
    return res.json({ message: "one or more fields are empty" });
  }

  await Polls.findOne({ pollId: pollId }).exec((err, doc) => {
    if (!err) {
      res.json({ message: doc });
    } else {
      console.log(err);
    }
  });

  const newPoll = new Polls({
    pollId: pollId,
    pollname: pollname,
    type: type,
    description: description,
    candidate: candidate,
  });

  newPoll
    .save()
    .then((resp) => {
      res.json({ message: "poll successfully created" });
    })
    .catch((err) => console.log(err));
});

//gets voterId(candidate's) objectId
//get poll for who are approved party candidates, who are voters
//good to go
router.get("/getpollforcandidates/:voterId", async (req, res) => {
  //getvoters info //getcandidateinfo compare cnic
  //getpartyinfo
  //checkifvalidparty
  const voter = await Voter.findOne({ _id: req.params.voterId });
  if (voter == null) {
    return res.json({ message: "voter does not exist" });
  }
  const candidate = await Candidate.findOne({ cnic: voter.cnic });
  if (candidate == null) {
    return res.json({ message: "candidate is not registered party member" });
  }

  const party = await Party.findOne({ _id: candidate.partyId });
  if (party == null) {
    return res.json({ message: "party does not exist with this" });
  }
  if (!party.is_valid) {
    return res.json({ message: "you belong to a invalid party" });
  }
  const polls = await Polls.find({});
  if (polls === null || polls.length === 0) {
    return res.json({ message: "there are currently no polls" });
  } else {
    res.json(polls);
  }
});

router.get("/getvalidpolls", async (req, res) => {
  const polls = await Polls.find({ valid: true });
  if (polls === null || polls.length === 0) {
    return res.json({ message: "there are currently no polls" });
  } else {
    res.json(polls);
  }
});
router.get("/getinvalidpolls", async (req, res) => {
  const polls = await Polls.find({ valid: false });
  if (polls === null || polls.length === 0) {
    return res.json({ message: "there are currently no polls" });
  } else {
    res.json(polls);
  }
});
router.get("/getallpolls", async (req, res) => {
  const polls = await Polls.find({});
  if (polls === null || polls.length === 0) {
    return res.json({ message: "there are currently no polls" });
  } else {
    res.json(polls);
  }
});

router.post("/vote/:pollid/:voterid/:candidateid", async (req, res) => {
  //get poll info
  //insert voterinfo and candidateinfo
  //insertpoll info
});

router.post("/getresultofallpolls", async (req, res) => {
  //count number of times candidate came
  //or remodel for count
});

router.put("/insertendtime", async (req, res) => {
  //insert end time or just add 1 hour to model
});
router.get("/stoppoll/pollId", async (req, res) => {});

router.get("/gettimeremaining", async (req, res) => {});

module.exports = router;
