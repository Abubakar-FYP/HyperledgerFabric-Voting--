const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  email: {
    type: String,
  },

  password: {
    type: String,
  },
});

global.Admin = global.Admin || mongoose.model("Admin", adminSchema);
module.exports = global.Admin;
