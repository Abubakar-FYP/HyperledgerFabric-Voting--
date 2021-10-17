const { Schema } = require("mongoose"); //Admin editable only
const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "",
  },

  cnic: {
    type: Number,
    default: 0000,
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

  is_criminal: {
    type: Boolean,
    default: false,
  },
});

global.Candidate =
  global.Candidate || mongoose.model("Candidate", candidateSchema);
module.exports = global.Candidate;
