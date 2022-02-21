const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const sendEmail = require("../utils/sendEmail");

require("../Models/party");
require("../Models/election");
require("../Models/ballot");
require("../Models/voter");
//
const Party = mongoose.model("Party");
const Election = mongoose.model("Election");
const Ballot = mongoose.model("Ballot");
const Voter = mongoose.model("Voter");

router.post("/create/election", async (req, res) => {
  try {
    // destructure the req.body
    const voters = await Voter.find({});

    console.log("req bod=================", req.body);
    const { electionName, startTime, endTime, electionType, candidates } =
      req.body;

    if ((!electionName, !startTime, !endTime, !electionType)) {
      return res.status(400).send("One or more fields are not present");
    }

    if (endTime < startTime) {
      return res.status(400).json({
        message: "invalid time entered, end-time is less than start time",
      });
    }

    if (Date.now() > startTime) {
      return res.status(400).json({
        message: "invalid time entered, start time is less than current time",
      });
    }

    const elections = await Election.find({}).lean();

    let check1 = false; //checks for current
    let check2 = false; //checks for future
    if (elections) {
      elections.map((election) => {
        if (
          Number(Date.now()) >= Number(election.startTime) &&
          Number(Date.now()) <= Number(election.endTime)
        ) {
          check1 = true;
        } //checks for any running elections or a single election

        if (Number(new Date()) < Number(election.startTime)) {
          check2 = true;
        } //checks for any elections that are about to start in future
      });

      if (check1 == true) {
        console.log("current here");
        return res
          .status(400)
          .send(
            "you cannot create a election, when an election is currently running"
          );
      } //current election check

      if (check2 == true) {
        console.log("future here");
        return res
          .status(400)
          .send("you cannot create a election, when an election is in queue");
      } //future election check
    } //checks for any currently running elections or future elections

    if (electionType === "poal" && !candidates)
      return res.status(400).send("candidates are required for Poaling");

    const election = new Election();
    election.electionName = electionName;
    election.startTime = startTime;
    election.endTime = endTime;
    election.electionType = electionType;
    if (
      Date.now() >= Number(election.startTime) &&
      Date.now() <= election.endTime
    )
      election.valid = true;

    console.log(Date.now() <= Number(election.startTime));
    console.log(Date.now(), Number(election.startTime));
    console.log(typeof Date.now(), typeof Number(election.startTime));

    if (electionType.toLowerCase() === "country") {
      const parties = await Party.find({ is_valid: true });
      console.log(
        "parties=========",
        parties.map((party) => party._id)
      );
      const partyList = parties.map((party) => {
        return {
          id: party._id,
        };
      });
      election.parties = partyList;
    }
    if (electionType.toLowerCase() === "poal" && candidates) {
      election.candidates = candidates;
      console.log("poal==========", election.candidates);
    }
    await election.save();

    /* try {
      const emailsList = voters.map((voter) => {
        return voter.email;
      });
      const emails = emailsList.join(",");
      console.log(startTime, endTime);
      //console.log("Emails==>", emails);
      console.log(`\n\n\n This email is about to notify you that a new election is coming up at
      ${new Date(Number(startTime))} and is closing at ${new Date(endTime)}`);
      await sendEmail({
        email: emails,
        subject: "Election Commence Email",
        message: `this email is about to notify you that a new election is coming up at
         ${new Date(Number(election.startTime))} and is closing at ${new Date(
          election.endTime
        )}`,
      });
    } catch (error) {
      res.status(400).send(error.message);
    } */

    res.send({ election });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/get/election", async (req, res) => {
  try {
    const elections = await Election.find().select("-candidates -parties");
    if (!elections)
      return res.status(400).send("There are not elections present");

    res.send(elections);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/get/first/election", async (req, res) => {
  try {
    const election = await Election.find()
      .select("-candidates -parties")
      .limit(1);
    if (!election) {
      return res.status(400).send("There are not elections present");
    }
    res.send(election);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.put("/startelection", async (req, res) => {
  try {
    console.log("start election");
    const elections = await Election.find({}).catch((err) => {
      console.log(err);
    });

    let check1 = false;
    elections.map(async (election) => {
      if (
        Number(Date.now()) >= Number(election.startTime) &&
        Number(Date.now()) <= Number(election.endTime)
      ) {
        election.valid = true;
        await election.save();
        check1 = true;
      }
    });

    if (check1 == false) {
      return res.send("no elections are currently running");
    }

    console.log();
    console.log("election has started");
  } catch (err) {
    console.log(err);
  }
});

router.put("/stopelection", async (req, res) => {
  console.log("Stopping Election");
  try {
    const elections = await Election.find({})
      .populate({
        path: "parties",
        select: "-partyImg",
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: "there was an error fetching elections" });
      });

    const voters = await Voter.find({});
    const ballots = await Ballot.find({});

    elections.map(async (election) => {
      if (Number(new Date()) >= Number(election.endTime))
        election.valid = false;
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

    //sends email to all voters
    try {
      const emailsList = voters.map((voter) => {
        return voter.email;
      });
      const emails = emailsList.join(",");
      //console.log("Emails==>", emails);
      console.log(
        `\n This email is about to notify you that the current election has ended`
      );
      await sendEmail({
        email: emails,
        subject: "Election Ended",
        message: `This email is about to notify you that the current election has ended`,
      });
    } catch (error) {
      res.status(400).send(error.message);
    }

    //Delete all ballot candidates
    ballots.map(async (ballot) => {
      console.log(ballot);
      ballot.candidate = [];
      await ballot.save().catch((err) => {
        console.log(err);
      });
    });

    res.json({ message: elections });
  } catch (err) {
    console.log(err);
  }
  //check if already participated and valid
  //parties particpate.inelection = false
});

router.get("/get/election/byid/:id", async (req, res) => {
  try {
    const election = await Election.findOne({ _id: req.params.id }).populate({
      path: "parties",
      populate: {
        path: "candidate",
        populate: {
          path: "ballotId",
          populate: {
            path: "candidate",
          },
        },
      },
    });

    if (election == null || election == undefined) {
      return res.status(400).json({ message: "election not found" });
    }
    return res.status(200).json({ message: election });
  } catch (err) {
    console.log(err);
  }
});

/* 
router.get("/get/election/foruser", async (req, res) => {
  //returned to the user
  const elections = await Election.find({}).populate({
    path: "parties",
    populate: {
      path: "candidate",
      populate: {
        path: "ballotId",
        populate: {
          path: "candidate",
        },
      },
    },
  }); //gets the election(ballots/candidates/party info of that election)

  let currentElection;
  let check1 = false; //checks if there are current running elections

  elections.map((election) => {
    //checks for currently running elections
    if (Date.now() >= election.startTime && Date.now() < election.endTime) {
      currentElection = election;
      check1 = true;
      console.log("inside here");
    }
  });

  if (check1 == false)
    return res
      .status(400)
      .json({ message: "there are no currently running elections" });

  return res.status(200).json({ message: currentElection });
});
 */

//gets previous election result
//get all parties in an election and store it in an array
//sort the parties of that array while traversing inside election
//sort them by their vote count
router.get("/get/election/previous", async (req, res) => {
  const elections = await Election.find({}).populate("parties");
  let previousElections = new Array();
  elections.map((election) => {
    if (Date.now() >= election.endTime) {
      previousElections.push(election);

      election.parties.sort((a, b) => {
        return b?.voteCount - a.voteCount;
      });
    }
  });

  res.status(200).json({ message: elections });
});

module.exports = router;
