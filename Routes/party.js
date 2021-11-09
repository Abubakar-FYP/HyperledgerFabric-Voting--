const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const requireLogin = require("../Middleware/requirelogin");

//Registering Models
require("../Models/party");
require("../Models/criminal");
require("../Models/candidate");

//Models
const Party = mongoose.model("Party");
const Candidate = mongoose.model("Candidate");
const Criminal = mongoose.model("Criminal");

//use the findparty or getparty dapi to check if its new or not
//returns a list of candidates,chain this api to create candidate api
router.post("/createparty", async (req, res) => {
  const { partyName, partyImg, partySymbol, partyLeaderCnic, candidate } =
    req.body;
  const candidates = await Candidate.find({})
    .select(
      "-position -partyId -voters -voteCount -is_criminal -_id -__v -ballotId -name"
    )
    .lean();

  console.log(candidates);

  const cnics = candidates.map((num) => {
    return Number(num.cnic);
  });

  if (
    !partyName ||
    !partyImg ||
    !partyLeaderCnic ||
    !partySymbol ||
    !candidate
  ) {
    return res.status(408).json({ message: "one or more fields are empty" });
  }
  const parties = await Party.find({}).lean();

  let check3 = false;
  let check4 = false;
  parties.map((partys) => {
    if (partys.partyName == partyName) {
      check3 = true;
    } //checks wheather party name is already present
    if (partys.partyLeaderCnic == partyLeaderCnic) {
      check4 = true;
    } //checks wheather party leader has already registered a party
  });

  if (check3 == true)
    return res.json({ message: "Party with same name is Already Exists" });

  if (check4 == true)
    return res.json({ message: "Party Leader has already registered a party" });

  const newParty = new Party({
    partyName,
    partyImg,
    partySymbol,
    partyLeaderCnic,
  });

  const candidateList = candidate.map((item) => {
    /*     console.log("candidate========", item);
     */ return item;
  }); //returns candidates object 1 by 1

  let check1 = false;
  for (let i = 0; i < candidateList.length; i++) {
    for (let j = 0; j < cnics.length; j++) {
      if (candidateList[i].cnic == cnics[j]) {
        check1 = true;
      }
    }
  } //checks if candidate already exists in Candidate DB

  if (check1) {
    return res.json({
      message: "Party cannot be registered due to candidate already registered",
    });
  }

  const candidatel = candidate.map(async (item) => {
    const newCandidate = new Candidate({
      cnic: item.cnic,
      name: item.name,
      position: item.position,
      partyId: newParty._id,
      ballotId: item.ballotId,
      candidate,
    });

    newCandidate.ballotId = mongoose.Types.ObjectId(newCandidate.ballotId);
    /*      console.log(typeof newCandidate.ballotId);
     */
    newParty.candidate.push(newCandidate._id);
    /*     console.log(newCandidate);
     */
    await newCandidate.save().catch((err) => {
      return console.log(err);
    });
  });
  /*   console.log(newParty);
   */
  await newParty.save().catch((err) => {
    return console.log(err);
  });

  res.status(200).json({ message: "Party has been registered" });
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

module.exports = router;
