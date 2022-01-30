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
      type: mongoose.Types.ObjectId,
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
          defualt: 0,
        },
      },
    ],
  },
});

global.Campaign = global.Campaign || mongoose.model("Campaign", campaign);
module.exports = global.Campaign;
