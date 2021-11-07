const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const requireLogin = require("../Middleware/requirelogin");

require("../Models/candidate");
require("../Models/nadra");
require("../Models/poll");
require("../Models/polls");

const Polls = mongoose.model("Polls");
const PollVote = mongoose.model("PollVote");
const Candidate = mongoose.model("Candidate");

/*
created two DBs, 
Polls : consist of polls created
Poll : consist of polls in which vote are saved

/createpoll , in Routes/polls.js , creates a poll runtime

/getvalidpolls , in Routes/polls.js , gets all valid polls, meaning that are in progress
/getinvalidpolls,in Routes/polls.js , gets all invalid polls meaning that thev'e finished
/getallpolls ,in Routes/polls.js , gets all poll

/startpoll , in Routes/polls.js, starts all the polls whose time has come
/stoppoll , in Routes/polls.js, stops all the polls whose time has come


//current work!!!!!!!!

//create poll //good to go
//voter vote in poll


//show the previous election's result(check if already done),

/getvalidpollforcandidates/:voterId in Routes/polls.js ,
gets poll that are valid(whose time has started)
for all(needs updation) 

//show(current,previous) poll to all,
//poll results all(invalid,result)(sorted)
*/

router.post("/createpoll", async (req, res) => {
  const { pollname, type, description, startTime, endTime, candidates } =
    req.body;

  if (
    !pollname ||
    !type ||
    !startTime ||
    !endTime ||
    !description ||
    !candidates
  ) {
    return res.json({ message: "one or more fields are empty" });
  }

  const found = await Polls.findOne({ pollname: pollname });
  if (found) {
    if (found.pollname === pollname) {
      return res
        .status(400)
        .json({ message: "poll already present with this name" });
    }
  }

  const newPol = new Polls({
    pollname: pollname,
    type: type,
    description: description,
    endTime: endTime,
    startTime: startTime,
    candidates: candidates,
  });

  if (newPol.startTime == new Date() || newPol.startTime > new Date()) {
    newPol.valid = true;
  }

  res.json(newPol);

  newPol
    .save()
    .then(() => {
      return res.json({ message: "poll saved successfully" });
    })
    .catch((err) => {
      console.log(err);
    });
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

//invalid marks as previous or not started
router.get("/getinvalidpolls", async (req, res) => {
  const polls = await Polls.find({ valid: false });
  if (polls === null || polls.length === 0) {
    return res.json({ message: "there are currently no polls" });
  } else {
    res.json(polls);
  }
});
//all started,yet to start and finished polls
router.get("/getallpolls", async (req, res) => {
  const polls = await Polls.find({});
  if (polls === null || polls.length === 0) {
    return res.json({ message: "there are currently no polls" });
  } else {
    res.json(polls);
  }
});

//casts vote for polls, in pollVotes
router.post("/vote/:pollid/:voterid/:candidateid", async (req, res) => {
  const polls = await Polls.findOne({ _id: req.params.pollid });
  if (polls == null) {
    return res.json({ message: "poll does not exist with this id" });
  }

  const voter = await Voter.findOne({ _id: req.params.voterid });
  if (voter == null) {
    return res.json({ message: "voter does not exist" });
  }

  const candidate = await Candidate.findOne({ _id: req.params.candidateid });
  if (candidate == null) {
    return res.json({ message: "candidate does not exist in this poll" });
  }

  const newVote = new PollVote({
    pollName: polls.pollName,
    startTime: polls.startTime,
    endTime: polls.endTime,
    voter: req.params.voterid,
    candidate: req.params.candidateid,
  });

  newVote.save().then((resp) => {
    if (resp == undefined) {
      console.log("there was a problem saving the vote");
      return;
    } else {
      return res.json({ message: "you have sucessfully voted in the poll" });
    }
  });
  //get poll info
  //insert voterinfo and candidateinfo
  //insertpoll info
});

router.get("/getresultofallpolls", async (req, res) => {
  const polls = await Polls.find({});
  const candidates = await Candidate.find({});
  let mapping;
  let counter = 0;

  polls
    .map((candidate) => {
      return candidate.candidate;
    })
    .map((itemList) => {
      for (var i = 0; i < itemList.length; i++) {
        for (const candidate of candidates) {
          console.log(
            "Candidate=======>",
            candidate._id,
            "Poll=======>",
            candidate._id
          );
        }
      }
    });

  res.json({ message: candidates });
});
// find all polls
// find all candidates
//find check each candidate in polls and count him/her
//count number of times candidate came
//or remodel for count

router.put("/stoppoll", async (req, res) => {
  const polls = await Polls.find({});

  polls.map((poll) => {
    console.log(poll.startTime, poll.endTime);
    console.log(poll.startTime.getHours() == poll.endTime.getHours());
  });

  //find all polls
  //check their start and end time
  //compare and if same or exceeded
  //change its validity
});

router.put("/startpoll", async (req, res) => {
  const polls = await Polls.find({});
  if (!polls) {
    return res.json({ message: "There are no polls" });
  }
  res.json(polls);
});

router.post("/votepoll/p_id/v_id/:c_id", async (req, res) => {
  //check if any poll exists or not
  //if they do check poll id
  //store votes in poll model
  //increment in polls model, candidate.votCount field
});

router.get("/testshowpolls", async (req, res) => {
  const polls = await Polls.find({}).populate({
    path: "candidates",
    populate: {
      path: "candidate.id",
      select: "-voters -voteCount -is_criminal",
    },
  });
  console.log(polls);
  res.json(polls);
});

module.exports = router;
