const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const requireLogin = require("../Middleware/requirelogin");
const { compareSync } = require("bcryptjs");

require("../Models/candidate");
require("../Models/nadra");
require("../Models/polls");
require("../Models/voter");
require("../Models/poller");

const Polls = mongoose.model("Polls");
const Voter = mongoose.model("Voter");
const Candidate = mongoose.model("Candidate");
const Poller = mongoose.model("Poller");

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

  if (Number(endTime) < Number(startTime)) {
    //if end time is < start time
    return res.status(400).json({
      message: "invalid time entered,end-time is less than start-time",
    });
  }

  if (Number(startTime) < Number(new Date())) {
    // if start time is < current time
    return res.status(400).json({
      message: "invalid time entered, start time is less than current time",
    });
  }

  let check1 = false; //check for poll name
  let check2 = false; //check for current poll
  let check3 = false; //check for about to start poll
  const polls = await Polls.find({});

  polls.map((poll) => {
    if (poll.pollname == pollname) check1 = true;
    if (
      Number(new Date()) >= Number(poll.startTime) &&
      Number(new Date()) <= Number(poll.endTime)
    )
      check2 = true;

    if (Number(new Date()) < Number(poll.startTime)) check3 = true;
  });

  if (check1 == true || check1)
    return res.json({ message: "poll already present with this name" });

  if (check2 == true || check2)
    return res.json({
      message: "another poll is already running,cannot create a new poll",
    });

  if (check3 == true || check3)
    return res.json({ message: "a poll is in que,connot create a new poll" });

  const newPol = new Polls({
    pollname: pollname,
    type: type,
    description: description,
    endTime: endTime,
    startTime: startTime,
    candidates: candidates,
  });

  if (newPol.startTime >= new Date()) {
    newPol.valid = true;
  } else {
    newPol.valid = false;
  }

  await newPol
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
    .select("-valid -voters")
    .catch((err) => {
      console.log(err);
      return res.json({ message: "there was an error finding polls" });
    });
  let currentPoll;
  let check1 = false; //checks if current poll is present
  polls.map((poll) => {
    if (
      Number(new Date()) >= Number(poll.startTime) &&
      Number(new Date()) < Number(poll.endTime)
    ) {
      currentPoll = poll;
      check1 = true;
    }
  });

  if (!check1 || check1 == false) {
    return res
      .status(200)
      .json({ message: "there is no current poll running" });
  }

  res.json({ message: currentPoll });
});

//invalid marks as previous or not started
router.get("/previouspolls", async (req, res) => {
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

  const previousPolls = new Array();
  polls.map((poll) => {
    if (Number(new Date()) >= Number(poll.endTime)) {
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

  let check1 = false; //checks if there are no polls
  const upComingPolls = new Array();
  polls.map((poll) => {
    if (Number(new Date()) < Number(poll.startTime)) {
      upComingPolls.push(poll);
    }
  });

  if (upComingPolls == null || upComingPolls === [] || upComingPolls == []) {
    console.log("empty");
    return res
      .status(400)
      .json({ message: "there are no up-coming poll right now" });
  }

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

router.get("/getonepoll/:p_id", async (req, res) => {
  const polls = await Polls.findOne({ _id: req.params.p_id })
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

//p_id is pollid
//v_id is poller id
//c_id is candidate id
router.post("/votepoll/:p_id/:v_id/:c_id", async (req, res) => {
  //check if any poll exists or not in polls Model
  const poller = await Poller.findOne({ _id: req.params.v_id }) //finds poller
    .catch((err) => {
      console.log(err);
      return res.json({ message: "voter with the given id does not exist" });
    });

  if (poller == null || !poller) {
    return res.status(400).json({ message: "poller does not exist" });
  }

  await Candidate.findOne({ _id: req.params.c_id }) //finds candidate
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

  const poll = await Polls.findOne({ _id: req.params.p_id }) //finds poll
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
  let check4 = false;
  poll.voters.map((voter) => {
    if (voter == req.params.v_id) {
      check4 = true;
    }
  });

  if (check4 == true)
    return res
      .status(400)
      .json({ message: "voter has already voted in this poll" });

  if (poll == [] || !poll) {
    return res.json({ message: "there is no poll with this id" });
  } else {
    if (
      //checks if the poll entered is currently ongoing
      Number(new Date()) >= poll.startTime &&
      Number(new Date()) <= poll.endTime &&
      poll.valid == true
    ) {
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

      poller.pollvote.push(req.params.p_id);

      await poller.save().catch((err) => {
        console.log(err);
        return res.status(400).json({ message: "couldnt save poll in poller" });
      });

      await poll
        .save()
        .then(() => {
          return res.json({ message: "voted successfully" });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return res.status(400).json({ message: "There is no poll in session" });
    }
  }
  //if they do check poll id
  //store votes in poll model
  //increment in polls model, candidate.votCount field
});

router.put("/stoppoll", async (req, res) => {
  const polls = await Polls.find({}).catch((err) => {
    console.log(err);
  });

  if (!polls || polls === null || polls === []) {
    return res.json({ message: "There are no polls" });
  }

  polls.map((poll) => {
    if (Number(new Date()) >= Number(poll.endTime) && poll.valid == true) {
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
  const polls = await Polls.find({}).catch((err) => {
    console.log(err);
  });

  if (!polls || polls === null || polls === []) {
    return res.json({ message: "There are no polls" });
  }

  polls.map((poll) => {
    if (
      //checks if its a polls valid time
      Number(new Date()) >= Number(poll.startTime) &&
      Number(new Date()) <= Number(poll.endTime) &&
      poll.valid == false
    ) {
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
