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
      default: null,
    },
  ],
  pollitem: [
    {
      type: String,
      default: null,
    },
  ],
  resetPassToken: {
    type: String,
    default: null,
  },
});

global.Poller = global.Poller || mongoose.model("Poller", pollerSchema);
module.exports = global.Poller;
