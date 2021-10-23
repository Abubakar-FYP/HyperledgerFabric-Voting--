const mongoose = require("mongoose");
const { Schema } = require("mongoose");

require("../Models/ballot");
const Ballot = mongoose.model("Ballot");

const partySchema = new Schema({
  partyName: {
    type: String,
    required: true,
  },

  partySlogan: {
    type: String,
    required: true,
  },

  partyImg: {
    type: String,
    default: "...",
    required: true,
  },

  partyLeaderCnic: {
    type: Number,
    required: true,
  },

  candidate: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Candidate",
    },
  ],
  //ballot reference ? reverse...
  is_valid: {
    type: Boolean,
    default: false,
  },
});

global.Party = global.Party || mongoose.model("Party", partySchema);

module.exports = global.Party;
