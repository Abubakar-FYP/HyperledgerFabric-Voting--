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

    const elections = await Election.find({});

    let check1 = false; //checks for current
    let check2 = false; //checks for future
    if (elections) {
      elections.map((election) => {
        if (
          Number(new Date()) >= Number(election.startTime) &&
          Number(new Date()) <= Number(election.endTime)
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
    if (Number(new Date()) >= election.startTime) election.valid = true;

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
  const elections = await Election.find({})
    .populate({
      path: "parties",
      select: "-partyImg",
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: "there was an error fetching elections" });
    });

  /* for(var i=0;i<elections.length;i++){
    if (Number(new Date()) >= Number(elections[i].endTime)) elections[i].valid = false;
    if (elections[i].valid == false) {
    for(var j=0;j<elections.parties.length;i++){

      if (party.participate.inelection == true) {
        //if election has ended, then set party to not participate in any election
        party.participate.inelection = false;
        const updateParty = await Party.findOne({ _id: party._id });
        if (!updateParty || updateParty == null || updateParty == []) {
          check1 = true;
          break
        }
      }
    }
    }
    
  }
 */

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

module.exports = router;
