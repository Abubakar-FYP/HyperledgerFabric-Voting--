const { Schema } = require("mongoose"); //Admin editable only
const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  cnic: {
    type: Number,
    default: 0000,
  },

  name: {
    type: String,
  },

  position: {
    type: String,
    default: "",
  },

  ballotId: {
    //assigned by party leader to candidate
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ballot",
    default: null,
  },

  partyId: {
    //assigned as party is created
    type: mongoose.Schema.Types.ObjectId,
    ref: "Party",
    default: null,
  },

  voters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voter",
    },
  ],

  voteCount: {
    type: Number,
    default: 0,
  },

  is_criminal: {
    type: Boolean,
    default: false,
  },
});

const Candidate =
  global.Candidate || mongoose.model("Candidate", candidateSchema);
module.exports = Candidate;
