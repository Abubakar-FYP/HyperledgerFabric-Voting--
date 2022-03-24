//packages imported
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const sendEmail = require("../utils/sendEmail");
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
require("../Models/election");
require("../Models/poller");
require("../Models/polls");
require("../Models/ballot");

//models
const Admin = mongoose.model("Admin");
const Voter = mongoose.model("Voter");
const Nadra = mongoose.model("Nadra");
const Elections = mongoose.model("Election");
const Poller = mongoose.model("Poller");
const Polls = mongoose.model("Polls");
const Ballot = mongoose.model("Ballot");
//HERE OTP WORK WAS DONE

router.post("/signinadmin", requireLogin, (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ error: "one or more fields are empty" });
  }
  try {
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
        return res.json({ message: err });
      });
  } catch (err) {
    console.log(err);
  }
});

router.post("/signup", async (req, res, next) => {
  // console.log("signup api=============", req.body)
  try {
    const { email, cnic, password } = req.body;

    if (!email || !cnic || !password) {
      return res
        .status(422)
        .send({ message: "one or more of the fields are empty" });
    }

    const resp = await Nadra.findOne({ cnic: cnic });

    if (!resp || resp.cnic !== cnic) {
      res.status(400).json({ message: `User does not exist` });
      return;
    }

    if (resp?.nationality !== "Pakistan") {
      res.status(400).json({ message: "user is not a pakistani citizen" });
      return;
    }

    const voter1 = await Voter.findOne({ cnic: cnic });
    const voter2 = await Voter.findOne({ email: email });
    /* console.log("voterCnic=====>", voter); */
    if (voter1 || voter2 || voter2?.email == email || voter1?.cnic == cnic) {
      res.send({ message: "voter already registered" });
      return;
    }

    const ballot = await Ballot.findOne({ ballotname: resp.area });
    if (ballot == null) {
      return res.json({ message: "cannot assign ballotid to user" });
    }

    const newVoter = new Voter({
      cnic: cnic,
      password: password,
      ballotId: ballot._id,
      email: email,
    });

    await newVoter.save();

    try {
      console.log(
        `\n\n\n This email is about to notify you that you have registered as a voter successfully`
      );
      console.log(typeof email, email);
      await sendEmail({
        email: email,
        subject: "Voter Successful Registration",
        message: `This email is about to notify you that you have registered as a voter successfully`,
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
    console.log("running");
    res.status(200).send(newVoter);
  } catch (err) {
    console.log(err);
  }
});

router.post("/profile", async (req, res) => {
  //console.log("req.body", req.body);
  const { cnic } = req.body;

  if (!cnic) {
    return res.status(400).json({ message: "field is empty" });
  }
  try {
    const elections = await Elections.find({});
    elections.sort((b, a) => a?.endTime - b?.endTime);
    const latestElections = elections[0];

    const doc = await Voter.findOne({ cnic: cnic }).select("-password");
    if (!doc) return res.send("You Are Not A Registered Voter");

    const user = await Nadra.findOne({ cnic: cnic });

    console.log("Result=========", user);
    res.send({ doc, user, latestElections });
  } catch (err) {
    console.log(err);
  }
});

router.post("/signin", async (req, res) => {
  const { cnic, password } = req.body;
  if (!cnic || !password) {
    return res.json({ message: "one or more fields is empty" });
  }
  try {
    const elections = await Elections.find({});
    let latestElections;
    if (elections == null || elections == undefined) {
      elections = null;
    } else {
      elections.sort((b, a) => a?.endTime - b?.endTime);
      latestElections = elections[0];
    }
    console.log("Latest------->", latestElections);
    const doc = await Voter.findOne({ cnic: cnic, password: password }).select(
      "-password"
    );
    if (!doc) return res.status(400).send("You Are Not A Registered Voter");
    const user = await Nadra.findOne({ cnic: cnic });
    console.log("Result=========", user);
    const token = jwt.sign({ _id: doc._id }, JWTKEY);
    res.status(200).send({ token, doc, user, latestElections });
  } catch (err) {
    console.log(err);
  }
});

router.post("/get/reset/password/token", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.send("Email is required");
    const voter = await Voter.findOne({ email: email });
    if (!voter) return res.send("Voter with the give email is not present");

    const randomNum = Math.round(
      (Math.random() * 34567456784568987654) / 26543
    );
    const url = "http://localhost:3000/reset/password/" + `${randomNum}`;

    console.log("urlllllll==========", url);

    voter.resetPassToken = randomNum;

    await voter.save();

    const message = `Your "Reset Password Token" has been generated. Kindly click the link below to reset it.
  \n\n${url}\n\n
  If you have not requested this email, you may ignore it.`;
    try {
      console.log("Message===============", message);

      await sendEmail({
        email: voter.email,
        subject: "Password recovery email",
        message,
      });
      res.status(200).send(`Email sent to ${user.email}`);
    } catch (err) {
      // voter.resetPassToken = undefined

      await voter.save({ validateBeforeSave: false });
      return new Error("internal server error");
    }
    // res.status(200).send("Check Your Email")
  } catch (err) {
    console.log(err);
  }
});

router.post("/reset/password", async (req, res) => {
  try {
    const { newPassword, confirmPassword, token } = req.body;
    if (!newPassword || !confirmPassword || !token)
      return res.send("Some Fields Are Missing");
    if (newPassword !== confirmPassword)
      return res.send("Both Passwords Should be same");
    const voter = await Voter.findOne({ resetPassToken: token });
    if (!voter) return res.send("Token is not correct or it has been expired");
    console.log(voter);
    voter.resetPassToken = null;
    voter.password = confirmPassword;

    await voter.save();

    res.status(200).send("Password has been updated successfully");
  } catch (err) {
    console.log(err);
  }
});

//no again account
router.post("/signup/poller", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "one or more fields are empty" });
  }
  try {
    const pollers = await Poller.find({});

    let check1 = false;
    pollers.map((poller) => {
      //checks if poller exists already
      if (poller.email == email) {
        check1 = true;
      }
    });

    if (check1 == true)
      return res.status(400).json({ message: "user already exists" });

    const newPoller = new Poller({
      email: email,
      password: password,
    });

    await newPoller.save().catch((err) => {
      console.log(err);
    });

    try {
      console.log(
        `\n\n\n This email is about to notify you that you have registered as a poller successfully`
      );
      await sendEmail({
        email: email,
        subject: "Poller Successfull Registration",
        message: `This email is about to notify you that you have registered as a poller successfully`,
      });
    } catch (error) {
      res.status(400).send(error.message);
    }

    res.status(200).send(newPoller);
  } catch (err) {
    console.log(err);
  }
});

router.post("/signin/poller", async (req, res) => {
  const { email, password } = req.body;
  console.log("req.body=========================", req.body);
  if (!email || !password) {
    return res.status(400).send("one or more fields are empty");
  }
  try {
    const _polls = await Polls.find({});

    let latestPoll;
    _polls.map((poll) => {
      if (
        Date.now() >= Number(poll.startTime) &&
        Date.now() <= Number(poll.endTime)
      ) {
        latestPoll = poll;
      }
    });

    let check1 = false;
    const poller = await Poller.findOne({ email: email });

    /*   console.log(typeof poller.password, typeof password);
  console.log(typeof poller.email, typeof email);
 */
    if (
      poller == null ||
      !poller ||
      poller == undefined ||
      poller.password != password ||
      poller.email != email
    ) {
      return res.status(400).send("user does not exist");
    }

    const token = jwt.sign({ password: poller.password }, JWTKEY);
    poller.password = null;
    console.log(poller);
    res.send({ token, poller, latestPoll });
    //token is the jwt token, poller is the user without the password
    //latestPoll is the current single poll running
  } catch (err) {
    console.log(err);
  }
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
