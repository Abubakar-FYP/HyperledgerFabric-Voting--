const { Schema } = require("mongoose"); //Admin editable only
const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  candidate: [
    {
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

      ballotid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ballot",
        default: null,
      },

      partyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Party",
        default: null,
      },

      is_criminal: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

global.Candidate =
  global.Candidate || mongoose.model("Candidate", candidateSchema);
module.exports = global.Candidate;
