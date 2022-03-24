const mongoose = require("mongoose");
const { Schema } = require("mongoose");

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

  partyLeaderEmail: {
    type: String,
  },

  candidate: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
    },
  ],

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

  //checks if party is valid to take part in election
  is_valid: {
    type: Boolean,
    default: false,
  },

  participate: {
    election: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Election",
        default: null,
      },
    ],
    inelection: {
      type: Boolean,
      default: false,
    },
  },
});

const Party = global.Party || mongoose.model("Party", partySchema);

module.exports = Party;
