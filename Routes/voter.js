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
  try {
    await Nadra.findOne({ cnic: req.params.cnic })
      .exec((err, docs) => {
        if (!err) {
          return res.status(200).json({ message: docs });
        } else {
          return res.status(400).json({ message: "user does not exist" });
        }
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
});

//returns the number of user who have voted
//returns a number of users who have voted
router.get("/getcountvotedusers", async (req, res) => {
  try {
    await Voter.countDocuments({ voteflag: true })
      .exec((err, count) => {
        if (!err) {
          return res.status(200).json({ message: count });
        } else {
          return res.status(400).json({ message: "no user has voted yet" });
        }
      })
      .catch((err) => console.log(err.message));
  } catch (err) {
    console.log(err.message);
  }
});

//check if voted already
//check this when this user tries to signin
router.get("/checkifvotedalready/:_id", async (req, res) => {
  try {
    const findVoter = await Voter.findOne({ _id: req.params._id })
      .exec()
      .lean();
    if (findVoter.voteflag == true) {
      return res
        .status(200)
        .json({ message: "voter has already voted,logging out :)" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.put("/put/votertrueflag", async (req, res) => {
  await Voter.updateMany({ voteflag: false }, { voteflag: true });
});

module.exports = router;
