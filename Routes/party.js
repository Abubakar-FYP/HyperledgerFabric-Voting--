const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const requireLogin = require("../Middleware/requirelogin");

//Registering Models
require("../Models/party");
require("../Models/criminal");
require("../Models/candidate");
require("../Models/nadra");
require("../Models/election");

//Models
const Party = mongoose.model("Party");
const Candidate = mongoose.model("Candidate");
const Criminal = mongoose.model("Criminal");
const Nadra = mongoose.model("Nadra");
const Election = mongoose.model("Election");

router.post("/createparty", async (req, res) => {
  const { partyName, partyImg, partySymbol, partyLeaderCnic, candidate } =
    req.body;

  if (
    !partyName ||
    !partyImg ||
    !partyLeaderCnic ||
    !partySymbol ||
    !candidate
  ) {
    return res.json({ message: "one or more fields are empty" });
  }

  const elections = await Election.find({}).catch((err) => {
    return res
      .status(400)
      .json({ message: "there was an error finding elections" });
  });

  const nadra = await Nadra.find({})
    .lean()
    .catch((err) => {
      return res
        .status(400)
        .json({ message: "there was an error finding citizens" });
    });

  const ballots = await Ballot.find({}).catch((err) => {
    return res
      .status(400)
      .json({ message: "there was an error finding ballots" });
  });

  const candidates = await Candidate.find({})
    .select(
      "-position -partyId -voters -voteCount -is_criminal -_id -__v -ballotId -name"
    )
    .lean()
    .catch((err) => {
      return res
        .status(400)
        .json({ message: "there was an error finding candidates" });
    });

  const parties = await Party.find({})
    .lean()
    .catch((err) => {
      return res
        .status(400)
        .json({ message: "there was an error finding parties" });
    });

  let check5 = false;
  let check6 = false;
  nadra.map((citizen) => {
    if (Number(citizen.cnic) == Number(partyLeaderCnic)) {
      check5 = true;
    } //checks whether party leader exists in nadra

    candidate.map((cand) => {
      if (Number(candidate.cnic) != Number(citizen.cnic)) {
        check6 = true;
      }
    }); //checks if candidates exist in nadra
  });

  if (!check5 || check5 == false)
    return res.json({ message: "party leader does not exist in nadra" });

  if (check6 || check6 == true)
    return res.json({
      message:
        "one or more of the candidates does not exist in nadra, check their cnic",
    });

  //check if candidate is a party leader of a party

  let check3 = false;
  let check4 = false;
  let check11 = false;
  let check12 = false;

  parties.map((partys) => {
    //this is good
    if (partys.partyName == partyName) {
      check3 = true;
    } //checks wheather party name is already present

    if (partys.partyLeaderCnic == partyLeaderCnic) {
      check4 = true;
    } //checks wheather party leader has alreayd registered a party

    partys.candidate.map((cand) => {
      if (Number(cand.cnic) == Number(partyLeaderCnic)) {
        check11 = true;
      } //if party leader is a candidate of a party

      candidate.map((candi) => {
        if (candi.cnic == partys.partyLeaderCnic) {
          check12 = true;
        } //checks if any entered candidate is a party leader
      });
    });
  });

  if (check3 == true)
    return res
      .status(400)
      .json({ message: "Party with same name is Already Exists" });

  if (check4 == true)
    return res
      .status(400)
      .json({ message: "Party Leader has already registered a party" });

  if (check11 == true)
    return res.status(400).json({
      message: "Party Leader already belongs as a candidate in a party",
    });

  if (check12 == true)
    return res
      .status(400)
      .json({ message: "One of the candidates is already a party leader" });

  const newParty = new Party({
    partyName,
    partySymbol,
    partyImg,
    partyLeaderCnic,
  });

  //////////////////

  console.log("Election HIIIIIIII");
  let check8 = false; //current
  let check9 = false; //future
  let check10 = false; //if no upcoming
  //checks for future elections and inserts parties in upcoming elections
  if (elections) {
    elections.map(async (election) => {
      // this is good
      if (
        Number(new Date()) >= Number(election.startTime) &&
        Number(new Date()) <= Number(election.endTime)
      ) {
        check8 = true;
      } //checks for any running elections or a single election

      if (Number(new Date()) < Number(election.startTime)) {
        check9 = true;
        newParty.participate.election.push(election._id);
        newParty.participate.inelection = true;
      } //checks for any elections that are about to start in future
      //console.log("new Date",Number(new Date),"end tIME",Number(election.endTime))

      if (Number(new Date()) < Number(election.endTime)) {
        check10 = true;
        election.parties.push(newParty._id);
        //pushes party id into election
        candidate.map((cand) => {
          election.candidates.push(cand.cnic);
        });

        console.log("Update Election=====>", election);

        await election.save().catch((err) => {
          res
            .status(400)
            .json({ message: "there was an error saving election" });
        });

        //similar to above condition
      }
    });

    if (check8 == true) {
      return res
        .status(400)
        .send("you create party when an election is currently running");
    }

    if (check10 == false) {
      return res
        .status(400)
        .send("you cannot enter a party when there are no up-coming elections");
    }
  }

  let check1 = false; //not good ?
  for (let i = 0; i < candidate.length; i++) {
    for (let j = 0; j < candidates.length; j++) {
      if (candidate[i].cnic == candidates[j].cnic) {
        check1 = true;
      }
    }
  } //checks if a candidate already exists in Candidate DB
  //even if one candidate is present, The party is rejected from creation
  if (check1) {
    return res.json({
      message: "Party cannot be registered due to candidate already registered",
    });
  }

  candidate.map(async (item) => {
    const newCandidate = new Candidate({
      cnic: item.cnic,
      name: item.name,
      position: item.position,
      partyId: newParty._id,
      ballotId: item.ballotId,
      candidate,
    });

    newCandidate.ballotId = mongoose.Types.ObjectId(newCandidate.ballotId);

    newParty.candidate.push(newCandidate._id);
    //candidates to the party are added here

    console.log("New Candidate=====>", newCandidate);

    await newCandidate.save().catch((err) => {
      //candidate save
      res.status(400).json({ message: "there was an error saving election" });
    });

    ballots.map(async (ballot) => {
      //good
      if (ballot._id == newCandidate.ballotId) {
        ballot.candidate.push(newCandidate._id);
        console.log("Update Ballot====>", ballot);

        await ballot.save().catch((err) => {
          //ballot save
          console.log(err);
          return res
            .status(400)
            .json({ message: "there was an error saving election" });
        });
      }
    });
  }); //saving candidates in model and candidates in ballot one by one

  console.log("New Party=====>", newParty);
  await newParty.save().catch((err) => {
    //party save
    console.log(err);
    return res
      .status(400)
      .json({ message: "there was an error saving election" });
  });

  console.log("Complete HIIIIIIII");
  res.status(200).json({ message: "Party has been registered" });
  //check ballot candidate issue
});

//chain use during candidate registration by party leader
//null is a positive reply,that a person is not a criminal
//true means that he/she is a criminal
router.get("/getcriminal/:_id", async (req, res) => {
  await Criminal.findOne({ _id: _id }).exec((err, doc) => {
    if (!err) {
      res.status(200).json({ message: null });
    } else {
      res.status(400).json({ message: true });
    }
  });
});

//takes _id as input for party and returns party
//and its ref data as well
router.get("/findparty/:_id", async (req, res) => {
  if (!req.params._id) {
    return res.status(400).json({ message: "field is empty" });
  }

  const found = await Party.find({ _id: req.params._id })
    .populate({
      path: "candidate",
      populate: {
        path: "ballotId",
      },
    })
    .exec((err, docs) => {
      if (!err) {
        return res.status(200).json({ message: docs });
      } else {
        return res.status(400).json({ message: err });
      }
    });
});

router.get("/getallpartyname", async (req, res) => {
  await Party.find({})
    .select("partyName")
    .exec((err, docs) => {
      if (!err) {
        res.json(docs);
      } else {
        console.log(err);
      }
    });
});

router.get("/getallparty", async (req, res) => {
  await Party.find({})
    .populate("candidate")
    .select("-partyImg")
    .exec((err, docs) => {
      if (!err) {
        res.json(docs);
      } else {
        console.log(err);
      }
    });
});

router.get("/checkcnic", async (req, res) => {
  const { cnic } = req.body;
  console.log("CNIC====>", req.body);
  const parties = await Party.find({})
    .populate("candidate")
    .select("-partyImg");

  let check = false;

  parties.map((party) => {
    party.candidate.map((candidate) => {
      console.log(candidate.cnic, cnic);
      if (candidate.cnic == cnic) {
        check = true;
      }
    });
  });

  if (check == true) {
    res.json("good");
  } else {
    res.json("not good");
  }
});

router.get("/getallcnic", async (req, res) => {
  const nadra = await Nadra.find({});
  nadra.map((citizen) => {
    console.log("citizen=====>", citizen.cnic);
  });
});

module.exports = router;
