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

//models
const Admin = mongoose.model("Admin");
const Voter = mongoose.model("Voter");
const Nadra = mongoose.model("Nadra");
const Elections = mongoose.model("Election");
const Poller = mongoose.model("Poller");
const Polls = mongoose.model("Polls");
//HERE OTP WORK WAS DONE

router.post("/signinadmin", requireLogin, (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ error: "one or more fields are empty" });
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
      return res.json({ message: err });
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

  if (!resp || resp.cnic !== cnic) {
    res.json({ message: `User does not exist` });
    return;
  }

  if (resp?.nationality !== "Pakistan") {
    res.json({ message: "user is not a pakistani citizen" });
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
  res.send(newVoter);
});

router.post("/profile", async (req, res) => {
  console.log("req.body", req.body);
  const { cnic } = req.body;

  if (!cnic) {
    return res.json({ message: "field is empty" });
  }

  const elections = await Elections.find({});
  elections.sort((b, a) => a?.endTime - b?.endTime);
  const latestElections = elections[0];

  const doc = await Voter.findOne({ cnic: cnic }).select("-password");
  if (!doc) return res.send("You Are Not A Registered Voter");

  const user = await Nadra.findOne({ cnic: cnic });

  console.log("Result=========", user);
  res.send({ doc, user, latestElections });
});

router.post("/signin", async (req, res) => {
  const { cnic, password } = req.body;

  if (!cnic || !password) {
    return res.json({ message: "one or more fields is empty" });
  }

  const elections = await Elections.find({});
  let latestElections;
  if (elections == null || elections == undefined) {
    elections = null;
  } else {
    elections.sort((b, a) => a?.endTime - b?.endTime);
    latestElections = elections[0];
  }
  //compare endTime of a election with new Date
  //see which is closer
  //finds the current or latest ended election

  console.log("Elections======>", elections);
  //current elections or recently ended election

  const doc = await Voter.findOne({ cnic: cnic, password: password }).select(
    "-password"
  );
  if (!doc) return res.send("You Are Not A Registered Voter");

  const user = await Nadra.findOne({ cnic: cnic });

  console.log("Result=========", user);
  const token = jwt.sign({ _id: doc._id }, JWTKEY);
  res.send({ token, doc, user, latestElections });
});

router.post("/get/reset/password/token", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.send("Email is required");
  const voter = await Voter.findOne({ email: email });
  if (!voter) return res.send("Voter with the give email is not present");

  const randomNum = Math.round((Math.random() * 34567456784568987654) / 26543);
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
});
router.post("/reset/password", async (req, res) => {
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
});

//poller signup
router.post("/signup/poller",async(req,res)=>{
  
  if(!email||!password){
    return res.status(400).json({message:"one or more fields are empty"});
  }
  
  const pollers = await Poller.find({});

  let check1 = false;
  pollers.map((poller)=>{//checks if poller exists already
    if(poller.email==email && poller.password==password){
      check1 = true;
    }
  });

  if(check1==true)
    return res.status(400).json({message:"user already exists"});

  const newPoller = new Poller({
    email:email,
    password:password
  });

  await newPoller.save().catch((err)=>{console.log(err)});
  res.send(newPoller);
});




//poller signin
router.post("/signin/poller",async (req,res)=>{
  if(!email||!password){
    return res.status(400).json({message:"one or more fields are empty"});
  }

  const _polls = await Polls.find({});
  let latestPoll;
  _polls.map((poll)=>{
    if(Number(new Date()) >= Number(poll.startTime) && Number(new Date()) <= Number(poll.endTime)){
      latestPoll = poll;
    }
  })

  
  let check1 = false;
  const poller = await Poller
  .findOne({email:email},{password:password})
  .select("-password")

  if(poller==null||!poller||poller==undefined){
    return res.status(400).json({message:"user does not exist"});
  }
  
    const token = jwt.sign({ _id: doc._id }, JWTKEY);

    res.send({token,poller,latestPoll});
  //token is the jwt token, poller is the user without the password
  //latestPoll is the current single poll running 
})

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
