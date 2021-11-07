const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const requireLogin = require("../Middleware/requirelogin");
const { compareSync } = require("bcryptjs");

require("../Models/candidate");
require("../Models/nadra");
require("../Models/poll");
require("../Models/polls");
require("../Models/voter");

const Polls = mongoose.model("Polls");
const Voter = mongoose.model("Voter");
const Candidate = mongoose.model("Candidate");

/*

/createpoll , in Routes/polls.js , creates a poll runtime

/getvalidpolls , in Routes/polls.js , gets all valid polls, meaning that are in progress
/getinvalidpolls,in Routes/polls.js , gets all invalid polls meaning that thev'e finished
/getallpolls ,in Routes/polls.js , gets all poll

/startpoll , in Routes/polls.js, starts all the polls whose time has come
/stoppoll , in Routes/polls.js, stops all the polls whose time has come


//current work!!!!!!!!

/createpoll
/currentpolls
/previouspolls
/abouttostartpolls
/getallpolls
/getresultofallpolls
/votepoll/:p_id/:v_id/:c_id  , p_id(pollId),v_id(voter_id),c_id(candidate_id)
/stoppoll
/startpoll 
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
      return res.json({ message: "poll already present with this name" });
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

  if (newPol.startTime == new Date() || new Date() > newPol.startTime) {
    newPol.valid = true;
  } else {
    newPol.valid = false;
  }

  newPol
    .save()
    .then(() => {
      return res.json({ message: "poll saved successfully" });
    })
    .catch((err) => {
      console.log(err);
    });
});
//those which are in progress
router.get("/currentpolls", async (req, res) => {
  const polls = await Polls.find({ valid: true })
    .populate({
      path: "candidates",
      populate: {
        path: "candidate.id",
        select: "-voters -voteCount -is_criminal -cnic -__v -ballotId",
        populate: {
          path: "partyId",
          select:
            "-partySymbol -partyImg -partyLeaderCnic -candidate -voters -voteCount -is_valid -_id -__v",
        },
      },
    })
    .select("-valid -voters -_id")
    .catch((err) => {
      console.log(err);
      return res.json({ message: "there was an error finding polls" });
    });

  res.json({ message: polls });
});

//invalid marks as previous or not started
router.get("/previouspolls", async (req, res) => {
  const polls = await Polls.find({ valid: false })
    .populate({
      path: "candidates",
      populate: {
        path: "candidate.id",
        select: "-voters -voteCount -is_criminal -cnic -__v -ballotId",
        populate: {
          path: "partyId",
          select:
            "-partySymbol -partyImg -partyLeaderCnic -candidate -voters -voteCount -is_valid -_id -__v",
        },
      },
    })
    .select("-voters -_id")
    .catch((err) => {
      console.log(err);
      return res.json({ message: "there was an error finding polls" });
    });
  const previousPolls = new Array();
  polls.map((poll) => {
    if (new Date() > poll.endTime) {
      previousPolls.push(poll);
    }
  });

  res.json(previousPolls);
});

router.get("/abouttostartpolls", async (req, res) => {
  const polls = await Polls.find({})
    .populate({
      path: "candidates",
      populate: {
        path: "candidate.id",
        select: "-voters -voteCount -is_criminal -cnic -__v -ballotId",
        populate: {
          path: "partyId",
          select:
            "-partySymbol -partyImg -partyLeaderCnic -candidate -voters -voteCount -is_valid -_id -__v",
        },
      },
    })
    .select("-voters -_id")
    .catch((err) => {
      console.log(err);
      return res.json({ message: "there was an error finding polls" });
    });
  const upComingPolls = new Array();
  polls.map((poll) => {
    if (new Date() < poll.startTime) {
      upComingPolls.push(poll);
    }
  });

  res.json(upComingPolls);
});

//all started,yet to start and finished polls
router.get("/getallpolls", async (req, res) => {
  const polls = await Polls.find({})
    .populate({
      path: "candidates",
      populate: {
        path: "candidate.id",
        select: "-voters -voteCount -is_criminal -cnic -__v -ballotId",
        populate: {
          path: "partyId",
          select:
            "-partySymbol -partyImg -partyLeaderCnic -candidate -voters -voteCount -is_valid -_id -__v",
        },
      },
    })
    .catch((err) => {
      console.log(err);
      return res.json({ message: "there was an error finding polls" });
    });

  res.json({ message: polls });
});

router.get("/getresultofallpolls", async (req, res) => {
  const polls = await Polls.find({})
    .populate({
      path: "candidates",
      populate: {
        path: "candidate.id",
        select: "-voters -voteCount -is_criminal -cnic -__v -ballotId",
        populate: {
          path: "partyId",
          select:
            "-partySymbol -partyImg -partyLeaderCnic -candidate -voters -voteCount -is_valid -_id -__v",
        },
      },
    })
    .catch((err) => {
      console.log(err);
      return res.json({ message: "there was an error finding polls" });
    });

  polls.map((poll) => {
    console.log(
      poll.candidates.sort(
        (b, a) => a?.candidate?.voteCount - b?.candidate?.voteCount
      )
    );
  });

  res.json(polls);

  // find all polls from Polls model
  // count candidates vote count, and sort the candidate list
  // send it
});

//p_id is pollid,v_id is voter id,c_id is candidate id
router.post("/votepoll/:p_id/:v_id/:c_id", async (req, res) => {
  //check if any poll exists or not in polls Model
  await Voter.findOne({ _id: req.params.v_id })
    .then((resp) => {
      if (resp == null || !resp) {
        return res.json({ message: "voter with the given id does not exist" });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ message: "voter with the given id does not exist" });
    });

  await Candidate.findOne({ _id: req.params.c_id })
    .then((resp) => {
      if (resp == null || !resp) {
        return res.json({
          message: "candidate with the given id does not exist",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({
        message: "candidate with the given id does not exist",
      });
    });

  const poll = await Polls.findOne({ _id: req.params.p_id })
    .populate({
      path: "candidates",
      populate: {
        path: "candidate.id",
        select: "-voters -voteCount -is_criminal -cnic -__v -ballotId",
        populate: {
          path: "partyId",
          select:
            "-partySymbol -partyImg -partyLeaderCnic -candidate -voters -voteCount -is_valid -_id -__v",
        },
      },
    })
    .catch((err) => {
      console.log(err);
      return res.json({ message: "poll with the given id does not exist" });
    });

  if (poll == [] || !poll) {
    return res.json({ message: "there is no poll with this id" });
  } else {
    let check = false;
    poll.voters.map((voter) => {
      if (voter == req.params.v_id) {
        check = true;
      }
    });
    if (check === true) {
      return res.json({ message: "you have already voted in this poll" });
    }
    poll.voters.push(req.params.v_id);
    poll.candidates.map((candidate) => {
      console.log(candidate.candidate.id._id, req.params.c_id);
      if (candidate.candidate.id._id == req.params.c_id) {
        candidate.candidate.voteCount = candidate.candidate.voteCount + 1;
      }
    });

    console.log(poll.candidates);

    poll
      .save()
      .then(() => {
        return res.json({ message: "voted successfully" });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //if they do check poll id
  //store votes in poll model
  //increment in polls model, candidate.votCount field
});

router.put("/stoppoll", async (req, res) => {
  const polls = await Polls.find({ valid: true }).catch((err) => {
    console.log(err);
  });

  if (!polls || polls === null || polls === []) {
    return res.json({ message: "There are no polls" });
  }

  polls.map((poll) => {
    if (poll.endTime == new Date() || new Date() > poll.endTime) {
      poll.valid = false;
      poll
        .save()
        .then((resp) => console.log(resp))
        .catch((err) => {
          console.log(err);
        });
    }
  });

  res.json(polls);
});

router.put("/startpoll", async (req, res) => {
  const polls = await Polls.find({ valid: false }).catch((err) => {
    console.log(err);
  });

  if (!polls || polls === null || polls === []) {
    return res.json({ message: "There are no polls" });
  }

  polls.map((poll) => {
    if (poll.startTime == new Date() || new Date() > poll.startTime) {
      poll.valid = true;
      poll
        .save()
        .then((resp) => console.log(resp))
        .catch((err) => {
          console.log(err);
        });
    }
  });

  res.json(polls);
});

module.exports = router;
