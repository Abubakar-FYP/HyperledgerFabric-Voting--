const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

require("../Models/polls");
require("../Models/poller");
//
const Polls = mongoose.model("Polls");
const Poller = mongoose.model("Poller");

router.get("/getallpollers", async (req, res) => {
  const pollers = await Poller.find({})
    .populate("pollvote")
    .catch((err) => console.log(err));

  res.status(200).json({ message: pollers });
});

module.exports = router;
