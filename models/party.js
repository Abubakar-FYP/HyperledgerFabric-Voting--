const mongoose = require("mongoose");
const { Schema } = require("mongoose");

require("../Models/ballot");
const Ballot = mongoose.model("Ballot");

const partySchema = new Schema({
  partyId: {
    type: Number,
    required: true,
  },
  partyName: {
    type: String,
    required: true,
  },
  partyImg: {
    type: String,
    default: "...",
    required: true,
  },
  partyLeaderName: {
    type: String,
    required: true,
  },
  partyLeaderCnic: {
    type: Number,
    required: true,
  },
  partyLeaderPhoneNumber: {
    type: Number,
    required: true,
  },
  partyLeaderGender: {
    type: String,
    required: true,
  },
  partyLeaderAge: {
    type: Number,
    required: true,
  },
  partyLeaderReligion: {
    type: String,
    required: true,
  },
  partyLeaderAddress: {
    type: String,
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
