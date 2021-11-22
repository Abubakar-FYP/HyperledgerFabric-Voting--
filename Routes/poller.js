const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

require("../Models/party");
require("../Models/election");
//
const Party = mongoose.model("Party");
const Election = require("../Models/election");

module.exports = router;
