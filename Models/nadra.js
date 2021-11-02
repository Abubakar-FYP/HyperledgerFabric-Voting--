const mongoose = require("mongoose");

const NadraSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  email: {
    type: String,
  },

  cnic: {
    type: String,
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

mongoose.model("Nadra", NadraSchema);
module.exports = global.Nadra;
