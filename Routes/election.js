const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

require("../Models/party");
require("../Models/election");
//
const Party = mongoose.model("Party");
const Election = require("../Models/election");

router.post("/create/election", async (req, res) => {
  try {
    // destructure the req.body
    console.log("req bod=================", req.body);
    const { electionName, startTime, endTime, electionType, candidates } =
      req.body;
    if ((!electionName, !startTime, !endTime, !electionType)) {
      return res.status(400).send("One or more fields are not present");
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
  const elections = await Election.find({})
    .populate("parties")
    .select("-partyImg")
    .catch((err) => {
      console.log(err);
      res.json({ message: "there was an error fetching elections" });
    });

  elections.map(async (election) => {
    if (
      Number(new Date()) >= Number(election.startTime) &&
      Number(new Date()) <= Number(election.endTime)
    )
      election.valid = true;
    await election.save();
  });

  res.json({ message: elections });
});

router.put("/stopelection", async (req, res) => {
  console.log("Stopping Election");
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
});

router.get("/get/election/byid/:id", async (req, res) => {
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
});

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

module.exports = router;
