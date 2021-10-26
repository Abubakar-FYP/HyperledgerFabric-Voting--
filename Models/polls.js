const { Schema } = require("mongoose"); //Admin editable only
const mongoose = require("mongoose");

const pollsSchema = new mongoose.Schema({
  pollId: {
    type: Number,
  },

  pollname: {
    type: String,
  },

  type: {
    type: String,
  },

  description: {
    type: String,
  },

  startTime: {
    type: Date,
    default: Date.now(),
  }, //default

  endTime: {
    type: Date,
  }, //enter this runtime

  candidate: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Candidate",
    },
  ],
});

global.Polls = global.Polls || mongoose.model("Polls", pollsSchema);
module.exports = global.Polls;
