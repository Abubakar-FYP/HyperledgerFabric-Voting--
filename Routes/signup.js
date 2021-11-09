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
    res.status(400).send({ message: "voter already registered" });
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


router.post("/get/reset/password/token" , async(req,res) => {
  const {email} = req.body
  if(!email) return res.status(400).send("Email is required")
  const voter = await Voter.findOne({email: email})
  if(!voter) return res.status(400).send("Voter with the give email is not present")

  const randomNum = Math.round(Math.random()*34567456784568987654/26543)
  const url = "http://localhost:3000/reset/password/" + `${randomNum}`

  console.log("urlllllll==========", url)

  voter.resetPassToken = randomNum

  await voter.save()

  res.status(200).send("Check Your Email")

})
router.post("/reset/password" , async(req,res) => {
  const {newPassword, confirmPassword , token} = req.body
  if(!newPassword || !confirmPassword || !token) return res.status(400).send("Some Fields Are Missing")
  if(newPassword !== confirmPassword) return res.status(400).send("Both Passwords Should be same")
  const voter = await Voter.findOne({resetPassToken: token})
  if(!voter) return res.status(400).send("Token is not correct or it has been expired")
console.log(voter)
  voter.resetPassToken = null
  voter.password = confirmPassword

  await voter.save()

  res.status(200).send("Password has been updated successfully")

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
