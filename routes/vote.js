const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { restart } = require("nodemon");
const path = require("path");

const requireLogin = require("../middleware/requirelogin");

require("../models/voter");
require("../models/vote");
require("../models/ballot");
require("../models/party");

const Voter = mongoose.model("Voter");
const Vote = mongoose.model("Vote");
const Ballot = mongoose.model("Ballot");
const Party = require("../Models/party");

router.post("/vote/:v_cnic/:c_cnic", async (req, res) => {
  if (req.params.v_cnic || req.params.c_cnic) {
    return res.status(400).json({ message: "one of the fields are empty" });
  }

  const voter = await Voter.findOne({
    cnic: req.params.v_cnic,
  })
    .lean()
    .catch((err) => console.log(err));

  const candidate = await Party.findOne({
    "candidate.cnic": req.params.c_cnic,
  })
    .lean()
    .catch((err) => console.log(err));

  const newVote = new Vote({
    votername: voter.name,
    candidatename: candidate.name,
    voterCnic: voter.cnic,
    candidateCnic: candidate.cnic,
    ballotid: candidate.ballotid,
  });

  newVote
    .save()
    .then((resp) =>
      res.status(200).json({ message: "you have successfully voted" })
    )
    .catch((err) => {
      res.status(400).json({ message: err });
    });
});

module.exports = router;
