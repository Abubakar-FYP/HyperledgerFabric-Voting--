//packages imported
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//middleware
const jwt = require("jsonwebtoken");
const { JWTKEY } = require("../Urls/keys");
const requireLogin = require("../Middleware/requirelogin");
const otp = require("../Middleware/otp");

//registering models
require("../Models/admin");
require("../Models/voter");
require("../Models/hash");

//models
const Admin = mongoose.model("Admin");
const Voter = mongoose.model("Voter");
const Hash = mongoose.model("Hash");

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
  
  const {cnic, phoneNumber} = req.body;

  if (!cnic || !phoneNumber) {
    return res.status(422).json({ message: "one or more of the fields are empty" });
  }

  Voter.findOne({cnic}).then((found) => {
    if (found) {
      return res.status(400).json({ message: "voter already registered" });
    }
  });

  const genOtp = otp.otpSender(phoneNumber); //middleware,for sending otp, and saves the otp in variable
  console.log(genOtp);
  
  if (typeof genOtp == "string") {
    res.json({ message: genOtp.toString() });
  }
 
  res.status(200).json({ message: "successufully otp sent" });

});

router.post("/signupotp", async (req, res, next) => {
  const genOtp = localStorage.getItem("myOtp"); //we get our otp from previous route

  if (req.body.otp != genOtp) {
    return res.status(404).json({ message: "the otp does not match" });
  }
});

router.post("/signupinfo", async (req, res) => {
  const {
    name,
    cnic,
    email,
    age,
    phoneNumber,
    gender,
    nationality,
    area,
    street,
    house,
  } = req.body;

  if (
    !name ||
    !cnic ||
    !email ||
    !age ||
    !phoneNumber ||
    !gender ||
    !nationality ||
    !area ||
    !street ||
    !house
  ) {
    return res.status(400).json({ error: "One of the fields is empty" });
  }

  if (age < 18) {
    return res
      .status(403)
      .json({ error: "The age is not sufficient enough as voter" });
  }

  const newVoter = new Voter({
    name,
    cnic,
    email,
    age,
    phoneNumber,
    gender,
    nationality,
    area,
    street,
    house,
  });

  newVoter
    .save()
    .then((resp) => {
      res.json({ message: "Voter successfully saved" });
    })
    .catch((err) => {
      return res.json({ message: `there was some error saving the voter` });
    });
});

router.post("/signin", async (req, res, next) => {
  const {cnic} = req.body;

  if (!cnic) {
    return res.status(400).json({ message: "field is empty" });
  }

  Voter.findOne({ cnic })
    .then((resp) => {
      console.log(resp);
      const token = jwt.sign({ _id: resp._id }, JWTKEY);
      res.status(200).json({ token});
    })
    .catch((err) => {
      if(err){
        return res.status(403).json({ message: err });
      }
    });

  const genOtp = otp.otpSender(phoneNumber);

  localStorage.setItem("sOtp", genOtp);
});

router.post("/signinotp", async (req, res) => {
  const genOtp = localStorage.getItem("sOtp");

  if (genOtp != (await req.body.otpNumber)) {
    return await res
      .status(400)
      .json({
        message: "otp entered in the field does not match otp generated",
      });
  }

  res.status(200).json({ message: "successfully login" });
});

module.exports = router;
