const mongoose = require("mongoose");

const criminalSchema = new mongoose.Schema({
  cnic: {
    type: Number,
    required: true,
  },
});

global.Criminal = global.Criminal || mongoose.model("Criminal", criminalSchema);
module.exports = global.Criminal;
