const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

require("../Models/polls");
require("../Models/poller");
//
const Polls = mongoose.model("Polls");
const Poller = mongoose.model("Poller");


//home page


module.exports = router;
