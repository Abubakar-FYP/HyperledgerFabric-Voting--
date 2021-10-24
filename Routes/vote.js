const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { restart } = require("nodemon");
const path = require("path");

const requireLogin = require("../Middleware/requirelogin");

require("../Models/voter");
require("../Models/vote");
require("../Models/ballot");
require("../Models/party");
require("../Models/candidate");

const Voter = mongoose.model("Voter");
const Vote = mongoose.model("Vote");
const Ballot = mongoose.model("Ballot");
const Party = mongoose.model("Party");
const Candidate = mongoose.model("Candidate");

router.post("/vote/:voter/:candidate", async (req, res) => {
  const voter = await Voter.findOne({
    _id: req.params.voter,
  }).catch((err) => console.log(err));

  if (voter.voteflag === true) {
    res.send({ message: "you cannot vote again" });
  }

  console.log(voter);

  const candidate = await Candidate.findOne({
    _id: req.params.candidate,
  }).catch((err) => console.log(err));

  console.log(candidate);

  voter.voted = req.params.candidate;
  voter.voteflag = true;
  candidate.voters.push(req.params.voter);

  await voter.save();
  await candidate.save();

  res.send({ message: "vote has been casted" });
});

//returns if a voter has voted or not
//good to go
router.get("/votestatus/:_id", async (req, res) => {
  if (!req.params._id) {
    res.status(400).json({ message: "field is empty" });
  }
  await Voter.findOne({ _id: req.params._id })
    .then((resp) => {
      if (resp == null) {
        return res.status(400).json({ message: "This id doest not exist" });
      }
      if (resp.voteflag == true) {
        res.status(200).json({ message: "you have already voted" });
      } else {
        res.status(200).json({ message: "you have not voted yet" });
      }
    })
    .catch((err) => console.log(err));
});

module.exports = router;
