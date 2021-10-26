const { Schema } = require("mongoose"); //Admin editable only
const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
  pollname: {
    type: String,
  },

  startTime: {
    type: Date,
    default: Date.now(),
  }, //default

  endTime: {
    type: Date,
  }, //enter this runtime

  voter: {
    type: mongoose.Types.ObjectId,
    ref: "Voter",
  },

  candidate: {
    type: mongoose.Types.ObjectId,
    ref: "Candidate",
  },
});

global.Poll = global.Poll || mongoose.model("Poll", pollSchema);
module.exports = global.Poll;
