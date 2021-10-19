const { Schema } = require("mongoose"); //Admin editable only
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const ballotSchema = new mongoose.Schema({
  ballotname: {
    type: String,
    required: true,
  },

  ballotid: {
    type: Number,
    required: true,
  },

  campaignId: {
    type: Schema.Types.ObjectId,
    ref: "Campaign",
  },

  candidate: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Candidate",
    },
  ],
});

global.Ballot = global.Ballot || mongoose.model("Ballot", ballotSchema);
module.exports = global.Ballot;
