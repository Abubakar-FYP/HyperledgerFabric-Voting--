const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const requireLogin = require("../middleware/requirelogin");

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
    partyId,
    partyName,
    partyImg,
    partyLeaderName,
    partyLeaderCnic,
    partyLeaderPhoneNumber,
    partyLeaderGender,
    partyLeaderAge,
    partyLeaderReligion,
    partyLeaderAddress,
    candidate,
  } = req.body;

  if (
    !partyId ||
    !partyName ||
    !partyImg ||
    !partyLeaderName ||
    !partyLeaderCnic ||
    !partyLeaderPhoneNumber ||
    !partyLeaderGender ||
    !partyLeaderAge ||
    !partyLeaderReligion ||
    !partyLeaderAddress ||
    !candidate
  ) {
    return res.status(408).json({ message: "one or more fields are empty" });
  }

  const newParty = new Party({
    partyId,
    partyName,
    partyImg,
    partyLeaderName,
    partyLeaderCnic,
    partyLeaderPhoneNumber,
    partyLeaderGender,
    partyLeaderAge,
    partyLeaderReligion,
    partyLeaderAddress,
    candidate,
  });

  const candidateList = candidate.map((item) => {
    return new Candidate({
      name: item.name,
      cnic: item.cnic,
      partyId: newParty._id,
      position: item.position,
    });
  }); // send these to candidate

  const candidateIds = candidateList.map((item) => {
    return item._id;
  });

  newParty.candidate = candidateIds;

  const resp = await newParty.save();
  if (resp !== newParty) {
    res.status(400).json({ message: "party did not save successfully" });
  } else {
    res.status(200).json({ message: "party saved sucessfully" });
  }

  return candidateList; //returns list of candidates
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

//takes _id as parameters
//deletes a party
router.delete("/deleteparty/:id", async (req, res) => {
  const { _id } = req.params._id;

  if (!_id) {
    return res.status(400).json({ message: "field is empty" });
  }

  await Party.deleteOne({ _id: _id }, (resp) => {
    if (resp) {
      return res.status(200).json({ message: "party successfully deleted" });
    }
  }).catch((err) => {
    console.log(err);
    return res
      .status(400)
      .json({ message: "there's seems to be a problem deleting the Party" });
  });
});

const removeNull = (array) => {
  return array.filter((item) => {
    item !== null;
  });
};

module.exports = router;
