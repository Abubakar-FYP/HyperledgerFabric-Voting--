const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const campaign = new Schema({
  campaignId: {
    type: Number,
  },

  campaignName: {
    type: String,
  },

  ballotId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ballot",
      default: null,
    },
  ],

  voteCounts: {
    type: [
      {
        partyName: {
          type: String,
        },
        voteCount: {
          type: Number,
        },
      },
    ],
  },
});

const Campaign = global.Campaign || mongoose.model("Campaign", campaign);
module.exports = Campaign;
