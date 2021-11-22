const { Schema } = require("mongoose"); //Admin editable only
const mongoose = require("mongoose");

const pollsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

global.Polls = global.Polls || mongoose.model("Polls", pollsSchema);
module.exports = global.Polls;
