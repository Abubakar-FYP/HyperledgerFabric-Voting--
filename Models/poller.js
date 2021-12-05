const { Schema } = require("mongoose"); //Admin editable only
const mongoose = require("mongoose");

const pollerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "Poller",
  },
  pollvote: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Polls",
    },
  ],
  pollcandidate: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Candidate",
    },
  ],
});

global.Poller = global.Poller || mongoose.model("Poller", pollerSchema);
module.exports = global.Poller;
