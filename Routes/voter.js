const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const requireLogin = require("../middleware/requirelogin");

//Registering Models
require("../Models/voter");
//Models
const Voter = mongoose.model("Voter");

//check all of these, if not working

//this is for his dashboard,where when he/she signs up
router.get("/getuserinfo/:_id", async (req, res) => {
  Voter.findOne({ _id: _id })
    .populate("ballotId")
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
//
router.get("/getcountvotedusers", async (req, res) => {
  Voter.countDocuments({ voteflag: true })
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
router.get("/checkifvotedalready/:cnic", async (req, res) => {
  const { cnic } = req.params.cnic;
  const findVoter = await Voter.findOne({ cnic: cnic }).exec().lean();
  if (findVoter.voteflag == true) {
    return res
      .status(200)
      .json({ message: "voter has already voted,logging out :)" });
  }
});

//voter will be assigned ballot as per, ballot names will be shown to him
//he selects one,the whole object of that ballot will be saved
//now that ballotid from that object will be inserted the voter's ballot
router.put("/assignballotuser/:cnic/:ballotid", async (req, res) => {
  const { cnic, ballotid } = req.params;
  if (!cnic || !ballotid) {
    return res.status(400).json({ message: "field or fields are empty" });
  }

  Voter.findOneAndUpdate(
    { cnic: cnic },
    { ballotid: ballotid },
    (err, result) => {
      if (!err) {
        return res
          .status(200)
          .json({ message: "ballot successfully assigned to voter" });
      } else {
        return res
          .status(400)
          .json({ message: "there was a problem inserting ballot" });
      }
    }
  );
});

module.exports = router;
