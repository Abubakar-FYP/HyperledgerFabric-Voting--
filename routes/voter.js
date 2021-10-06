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
    .exec((err, docs) => {
      if (!err) {
        return res.status(200).json({ message: docs });
      } else {
        return res.status(400).json({ message: "user does not exist" });
      }
    })
    .catch((err) => console.log(err));
});

router.get("/getvotedusers", async (req, res) => {
  Voter.find({ voteflag: false })
    .exec((err, docs) => {
      if (!err) {
        return res.status(200).json({ message: docs });
      } else {
        return res.status(400).json({ message: "users does not exist" });
      }
    })
    .catch((err) => console.log(err));
});

//get ballot of the voter assigned ballot

router.get("/getballot", async (req, res) => {});
