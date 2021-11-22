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
  pollvote:[{
    type: mongoose.Types.ObjectId,
    ref: "Polls"
  }]
});

global.Poller = global.Poller || mongoose.model("Poller", pollerSchema);
module.exports = global.Poller;
