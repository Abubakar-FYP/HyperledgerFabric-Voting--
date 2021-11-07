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
  const { email, cnic, password } = req.body;

  if (!email || !cnic || !password) {
    return res
      .status(422)
      .send({ message: "one or more of the fields are empty" });
  }

  const resp = await Nadra.findOne({ cnic: cnic });

  if (!resp || resp.cnic !== cnic || resp.email !== email) {
    res.status(400).json({ message: `User does not exist` });
    return;
  }

  if (resp?.nationality !== "Pakistan") {
    res.status(400).json({ message: "user is not a pakistani citizen" });
    return;
  }

  const voter = await Voter.findOne({ cnic: cnic });
  /* console.log("voterCnic=====>", voter); */
  if (voter) {
    res.status(400).send({ message: "voter already registered" });
    return;
  }

  const ballot = await Ballot.findOne({ ballotname: resp.area });
  if (ballot == null) {
    return res.json({ message: "cannot assign ballotid to user" });
  }
  let gender = cnic.toString().charAt(cnic.length - 1);

  const newVoter = new Voter({
    cnic: cnic,
    password: password,
    ballotId: ballot._id,
    email: email,
  });

  await newVoter.save();
  res.send(newVoter);
});

router.get("/profile", async (req, res) => {
  const { cnic, password } = req.body;

  if (!cnic || !password) {
    return res.status(400).json({ message: "field is empty" });
  }
  const doc = await Voter.findOne({ cnic: cnic, password: password }).select(
    "-password"
  );
  if (!doc) return res.status(400).send("You Are Not A Registered Voter");

  const user = await Nadra.findOne({ cnic: cnic });

  console.log("Result=========", user);
  res.send({ doc, user });
});

router.post("/signin", async (req, res) => {
  const { cnic, password } = req.body;

  if (!cnic || !password) {
    return res.status(400).json({ message: "field is empty" });
  }
  const doc = await Voter.findOne({ cnic: cnic, password: password }).select(
    "-password"
  );
  if (!doc) return res.status(400).send("You Are Not A Registered Voter");

  const user = await Nadra.findOne({ cnic: cnic });

  console.log("Result=========", user);
  const token = jwt.sign({ _id: doc._id }, JWTKEY);
  res.send({ token, doc, user });
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
