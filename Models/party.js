const mongoose = require("mongoose");
const { Schema } = require("mongoose");

require("../Models/ballot");
const Ballot = mongoose.model("Ballot");

const partySchema = new Schema({
  partyName: {
    type: String,
  },

  partySlogan: {
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
  //ballot reference ? reverse...
  is_valid: {
    type: Boolean,
    default: false,
  },
});

global.Party = global.Party || mongoose.model("Party", partySchema);

module.exports = global.Party;
