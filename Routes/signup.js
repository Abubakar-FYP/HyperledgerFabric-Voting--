//packages imported
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//middleware
const jwt = require("jsonwebtoken");
const { JWTKEY } = require("../Keys/keys");
const requireLogin = require("../Middleware/requirelogin");
const otp = require("../Middleware/otp");
const { compareSync } = require("bcrypt");

//registering models
require("../Models/admin");
require("../Models/voter");
require("../Models/nadra");

//models
const Admin = mongoose.model("Admin");
const Voter = mongoose.model("Voter");
const Nadra = mongoose.model("Nadra");

//HERE OTP WORK WAS DONE

router.post("/signinadmin", requireLogin, (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "one or more fields are empty" });
  }

  Admin.findOne({ email })
    .then((found) => {
      if (found) {
        const token = jwt.sign({ _id: found._id }, JWTKEY);
        res.status(200).json({ token });
        return;
      } else {
        res.json({ message: "wrong email or password" });
        return;
      }
    })
    .catch((err) => {
      return res.status(400).json({ message: err });
    });
});

router.post("/signup", async (req, res, next) => {
  // console.log("signup api=============", req.body)
  const { cnic, password } = req.body;

  if (!cnic || !password ) {
    return res
      .status(422)
      .send({ message: "one or more of the fields are empty" });
  }

  await Voter.findOne({ cnic }).then((found) => {
    if (found) {
      return res.status(400).send({ message: "voter already registered" });
    }
  });

  let gender = cnic.toString().charAt(cnic.length - 1)
 
  const newVoter = new Voter({
    cnic: cnic,
    password: password,
    gender: gender%2 === 0 ? "F" : "M"
  });

  newVoter.save();
  /*  const genOtp = otp.otpSender(phoneNumber); //middleware,for sending otp, and saves the otp in variable
  console.log(genOtp);

  if (typeof genOtp == "string") {
    res.json({ message: genOtp.toString() });
  }
 */
  res.send(newVoter);
});
/* 
router.post("/signupotp", async (req, res, next) => {
  const genOtp = localStorage.getItem("myOtp"); //we get our otp from previous route

  if (req.body.otp != genOtp) {
    return res.status(404).json({ message: "the otp does not match" });
  }
}); */

router.post("/signin", async (req, res) => {
  const { cnic, password } = req.body;

  if (!cnic || !password) {
    return res.status(400).json({ message: "field is empty" });
  }
  await Voter.findOne({ cnic: cnic, password: password })
    .select("-password")
    .exec((err, doc) => {
      if (doc) {
        console.log("Result=========", doc);
        const token = jwt.sign({ _id: doc._id }, JWTKEY);
        res.json({ token, doc });
      } else {
        console.log(err);
      }
    });
});
/* 
router.post("/signinotp", async (req, res) => {
  const genOtp = localStorage.getItem("sOtp");

  if (genOtp != req.body.otpNumber) {
    return res.status(400).json({
      message: "otp entered in the field does not match otp generated",
    });
  }

  res.status(200).json({ message: "successfully login" });
});
 */
module.exports = router;
