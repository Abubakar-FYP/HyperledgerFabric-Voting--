const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const requireLogin = require("../Middleware/requirelogin");

//Registering Models
require("../Models/voter");
require("../Models/nadra");
//Models
const Voter = mongoose.model("Voter");
const Nadra = mongoose.model("Nadra");
//check all of these, if not working

//this is for his dashboard,where when he/she signs up
//gets userInfo against his/her cnic
router.get("/getuserinfo/:cnic", async (req, res) => {
  await Nadra.findOne({ cnic: req.params.cnic })
    .exec((err, docs) => {
      if (!err) {
        return res.status(200).json({ message: docs });
      } else {
        return res.status(400).json({ message: "user does not exist" });
      }
    })
    .catch((err) => console.log(err));
});

//returns the number of user who have voted
//returns a number of users who have voted
router.get("/getcountvotedusers", async (req, res) => {
  await Voter.countDocuments({ voteflag: true })
    .exec((err, count) => {
      if (!err) {
        return res.status(200).json({ message: count });
      } else {
        return res.status(400).json({ message: "no user has voted yet" });
      }
    })
    .catch((err) => console.log(err));
});

//check if voted already
//check this when this user tries to signin
router.get("/checkifvotedalready/:_id", async (req, res) => {
  const findVoter = await Voter.findOne({ _id: req.params._id }).exec().lean();
  if (findVoter.voteflag == true) {
    return res
      .status(200)
      .json({ message: "voter has already voted,logging out :)" });
  }
});

//voter will be assigned ballot as per, ballot names will be shown to him
//he selects one,the whole object of that ballot will be saved
//now that ballotid from that object will be inserted the voter's ballot
router.put("/assignballotuser/voterid", async (req, res) => {
  const getVoter = await Voter.findOne({ _id: req.params.voterid });

  console.log(getVoter);

  await Voter.findOneAndUpdate(
    { _id: req.params.voterid },
    { ballotId: req.params.ballotId },
    (err, result) => {
      if (!err) {
        return res
          .status(200)
          .json({ message: "ballot successfully assigned to voter" });
      } else {
        return res
          .status(400)
          .json({ message: "there was a problem assigning ballot to user" });
      }
    }
  );
});

module.exports = router;
