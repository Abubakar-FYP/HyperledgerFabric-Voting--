const { Schema } = require("mongoose"); //Admin editable only
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const ballotSchema = new mongoose.Schema({
  ballotname: {
    type: String,
  },

  ballotid: {
    type: Number,
  },

  type: {
    type: String,
  },

  campaignId: {
    type: mongoose.Types.ObjectId,
    ref: "Campaign",
  },

  candidate: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Candidate",
      default: null,
    },
  ],
});

global.Ballot = global.Ballot || mongoose.model("Ballot", ballotSchema);
module.exports = global.Ballot;
