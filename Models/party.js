const mongoose = require("mongoose");
const { Schema } = require("mongoose");

require("../Models/ballot");
const Ballot = mongoose.model("Ballot");

const partySchema = new Schema({
  partyName: {
    type: String,
  },

  partySymbol: {
    type: String,
  },

  partyImg: {
    type: String,
    default: "...",
  },

  partyLeaderCnic: {
    type: Number,
  },

  candidate: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Candidate",
    },
  ],

  voters: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Voter",
    },
  ],

  voteCount: {
    type: Number,
    default: 0,
  },

  //ballot reference ? reverse...
  is_valid: {
    type: Boolean,
    default: false,
  },
});

global.Party = global.Party || mongoose.model("Party", partySchema);

module.exports = global.Party;
