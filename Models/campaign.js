const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const campaign = new Schema({
  campaignId: {
    type: Number,
  },

  campaignName: {
    type: String,
  },

  ballotId: {
    type: [Schema.Types.ObjectId],
    ref: "Ballot",
  },
});

global.Campaign = global.Campaign || mongoose.model("Campaign", campaign);
module.exports = global.Campaign;
