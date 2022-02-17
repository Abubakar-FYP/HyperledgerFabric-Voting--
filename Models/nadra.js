const mongoose = require("mongoose");

const NadraSchema = new mongoose.Schema({
  name: {
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

const Nadra = global.Nadra || mongoose.model("Nadra", NadraSchema);
module.exports = Nadra;
