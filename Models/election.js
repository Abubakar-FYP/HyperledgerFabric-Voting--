const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema({
  startTime: {
    type: String,
  },
  endTime: {
    type: Number,
  },
  electionName: {
    type: String,
  },
  electionType: {
    type: String,
  },
  candidates: [
    {
      type: String,
      default: null,
    },
  ],
  parties: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Party",
    },
  ],

  valid: {
    type: Boolean,
    default: false,
  },
});

const Election = mongoose.model("Election", electionSchema);
module.exports = Election;
