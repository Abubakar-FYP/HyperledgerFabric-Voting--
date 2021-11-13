const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { restart } = require("nodemon");
const path = require("path");

const requireLogin = require("../Middleware/requirelogin");

require("../Models/voter");
require("../Models/ballot");
require("../Models/party");
require("../Models/candidate");

const Voter = mongoose.model("Voter");
const Ballot = mongoose.model("Ballot");
const Party = mongoose.model("Party");
const Candidate = mongoose.model("Candidate");

router.post("/vote/:voter/:candidate", async (req, res) => {
  const voter = await Voter.findOne({
    _id: req.params.voter,
  }).catch((err) => console.log(err));

  console.log(voter.voteflag);

  if (voter.voteflag == true) {
   return res.json({ message:true});
  } 

  
  console.log("Voter=====>", voter); 

  const candidate = await Candidate.findOne({
    _id: req.params.candidate,
  }).catch((err) => console.log(err));

  const party = await Party.findOne({
    _id: candidate.partyId,
  });
  console.log("party========", party);
  console.log("Candidate=====>", candidate, candidate.partyId);
  const ballot = await Ballot.findOne({ _id: candidate.ballotId });

  console.log("Ballot=====>", ballot);

  const campaign = await Campaign.findOne({ _id: ballot.campaignId });

  console.log("Campaign=====>", campaign);

  const newCount = campaign.voteCounts?.find(
    (part) => part?.partyName === party.partyName
  );
  console.log("new count===========", newCount);
  if (newCount) {
    newCount.voteCount = newCount?.voteCount + 1;
  } else {
    let obj = {};
    obj.partyName = party.partyName;
    obj.voteCount = 1;

    campaign.voteCounts.push(obj);
  }

  party.voters.push(req.params.voter);
  party.voteCount = party.voteCount + 1;

  voter.voted = req.params.candidate;
  voter.voteflag = true;
  candidate.voteCount = candidate.voteCount + 1;
  candidate.voters.push(req.params.voter);

  await voter.save().catch(err=>{console.log(err)})
  await campaign.save().catch(err=>{console.log(err)});
  await candidate.save().catch(err=>{console.log(err)});
  await party.save().catch(err=>{console.log(err)});

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
