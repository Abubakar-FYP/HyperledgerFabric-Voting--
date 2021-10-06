const mongoose = require("mongoose"); //mongoose imported

const voterSchema = new mongoose.Schema({
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

  voteflag: {
    type: Boolean,
    default: false,
  }, //to check whether he has voted or not,Initially false

  ballotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ballot",
  }, //this will be assigned based on the area

  area: {
    type: String,
    required: true,
  },//by area I will search ballot by name then get its ballot _id for ballot id

  street: {
    type: String,
    required: true,
  },

  house: {
    type: String,
    required: true,
  },
}); //all the data's hash will be created to login next time*

global.Voter = global.Voter || mongoose.model("Voter", voterSchema);
module.exports = global.Voter;

//Voter model registered,
//we also can export this model,but mongoose object stores it
