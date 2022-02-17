const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const Poller = require("./poller").schema;

const pollLedger = new Schema({
  poller: [Poller],
});

const PollLedger =
  global.PollLedger || mongoose.model("PollLedger", pollLedger);
//for polls

module.exports = PollLedger;
