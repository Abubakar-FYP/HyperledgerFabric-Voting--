const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const requireLogin = require("../middleware/requirelogin");
const { response } = require("express");

//Registering Models
require("../Models/voter");
//Models
const Voter = mongoose.model("Voter");

//this is for his dashboard,where when he/she signs up
router.get("/getuserinfo/:cnic", async (req, res) => {
  Voter.findOne({ cnic })
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

router.put("/assignballotuser/:cnic/:ballotid", async (req, res) => {});
