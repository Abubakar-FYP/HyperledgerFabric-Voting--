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
  const {
    partyName,
    partyImg,
    partySymbol,
    partyLeaderCnic,
    candidate,
    ballotId,
  } = req.body;

  if (
    !partyName ||
    !partyImg ||
    !partyLeaderCnic ||
    !partySymbol ||
    !candidate ||
    !ballotId
  ) {
    return res.status(408).json({ message: "one or more fields are empty" });
  }
  const party = await Party.findOne({partyName: partyName})
  if(party) return res.status(400).send("Party with same name is Already Exists")
  const newParty = new Party({
    partyName,
    partyImg,
    partySymbol,
    partyLeaderCnic,
  });

  const candidateIds = candidateList.map((item) => {
    return item._id;
  });

  newParty.candidate = candidateIds;

  const resp = await newParty.save();

  const candidates = candidate.map(async (item) => {
    const newCandidate = new Candidate({
      cnic: item.cnic,
      position: item.position,
      partyId: newParty._id,
      ballotId: item.ballotId,
    });

    await newCandidate.save().catch((err) => {
      return console.log(err);
    });
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

const removeNull = (array) => {
  return array.filter((item) => {
    item !== null;
  });
};

module.exports = router;
