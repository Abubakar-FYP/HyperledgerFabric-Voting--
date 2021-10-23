const mongoose = require("mongoose");

const NadraSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  email: {
    type: String,
  },

  cnic: {
    type: Number,
  },

  phoneNumber: {
    type: Number,
  },

  age: {
    type: Number,
  },

  gender: {
    type: String,
  },

  nationality: {
    type: String,
  },

  area: {
    type: String,
  },

  street: {
    type: String,
  },

  house: {
    type: String,
  },
});

global.Nadra = global.Nadra || mongoose.model("Nadra", NadraSchema);
module.exports = global.Nadra;
