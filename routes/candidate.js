const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const requireLogin = require("../middleware/requirelogin");

require("../Models/candidate");

const Candidate = mongoose.model("Candidate");

module.exports = router;
