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

    const elections = Election.find({});

    let check1 = false;
    let check2 = false;
    if (elections) {
      elections.map((election) => {
        if (
          new Date() >= election.startTime &&
          new Date() <= election.endTime
        ) {
          check1 = true;
        } //checks for any running elections or a single election

        if (new Date() < election.startTime) {
          check2 = true;
        } //checks for any elections that are about to start in future
      });

      if (check1 == true) {
        return res.json(
          "you cannot create a election, when an election is currently running"
        );
      }
      if (check2 == true) {
        return res.json(
          "you cannot create a election, when an election is in queue"
        );
      }
    } //checks for any currently running elections or future elections

    if (electionType === "poal" && !candidates)
      return res.status(400).send("candidates are required for Poaling");

    const election = new Election();
    election.electionName = electionName;
    election.startTime = startTime;
    election.endTime = endTime;
    election.electionType = electionType;

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

module.exports = router;
