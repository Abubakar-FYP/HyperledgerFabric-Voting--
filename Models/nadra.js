const mongoose = require("mongoose");

const NadraSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  cnic: {
    type: Number,
    required: true,
  },

  phoneNumber: {
    type: Number,
    required: true,
  },

  age: {
    type: Number,
    required: true,
  },

  gender: {
    type: String,
    required: true,
  },

  nationality: {
    type: String,
    required: true,
  },

  area: {
    type: String,
    required: true,
  },

  street: {
    type: String,
    required: true,
  },

  house: {
    type: String,
    required: true,
  },
});

global.Nadra = global.Nadra || mongoose.model("Nadra", NadraSchema);
module.exports = global.Nadra;
