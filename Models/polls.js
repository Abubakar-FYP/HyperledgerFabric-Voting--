const { Schema } = require("mongoose"); //Admin editable only
const mongoose = require("mongoose");

const pollsSchema = new mongoose.Schema({
  pollname: {
    type: String,
  },
  type: {
    type: String,
  },
  valid: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
  },
  startTime: {
    type: Date,
  },

  endTime: {
    type: Date,
  },

  items: [
    {
      item: {
        name: {
          type: String,
        },
        voteCount: {
          type: Number,
          default: 0,
        },
      },
    },
  ],

  voters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voters",
    },
  ],
});

const Polls = global.Polls || mongoose.model("Polls", pollsSchema);
module.exports = Polls;
