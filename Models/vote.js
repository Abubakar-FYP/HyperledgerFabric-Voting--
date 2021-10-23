const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  voterCnic: {
    type: Number,
  },

  candidateCnic: {
    type: Number,
  },

  time: {
    type: Date,
    default: Date.now,
  }, //automatically gets the current date and time

  ballotid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ballot",
  },
});

global.Vote = global.Vote || mongoose.model("Vote", voteSchema);
module.exports = global.Vote;
