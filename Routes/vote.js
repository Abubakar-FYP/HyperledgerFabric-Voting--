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
    cnic: req.params.voter,
  }).catch((err) => console.log(err));

  const candidate = await Candidate.findOne({
    cnic: req.params.candidate,
  }).catch((err) => console.log(err));

  const newVote = new Vote({
    voterCnic: voter.cnic,
    candidateCnic: candidate.cnic,
    ballotid: candidate.ballotid,
  });

  newVote
    .save()
    .then((resp) => console.log(resp))
    .catch((err) => {
      console.log(err);
    });

  Voter.findOneAndUpdate({ cnic: req.params.v_cnic }, { voteflag: true })
    .exec((err, doc) => {
      if (!err) {
        return res
          .status(200)
          .json({ message: "now you are logged out,Because you have voted" });
      } else {
        return res
          .status(400)
          .json({ message: "there was an error in voting,try again" });
      }
    })
    .catch((err) => console.log(err));
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
