const mongoose = require("mongoose"); //mongoose imported

const voterSchema = new mongoose.Schema({
  cnic: {
    type: Number,
  },

  password: {
    type: String,
  },

  voteflag: {
    type: Boolean,
    default: false,
  }, //to check whether he has voted or not,Initially false

  ballotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ballot",
    default: null,
  }, //this will be assigned based on the area of the voter

  voted: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate",
  },

  role: {
    type: String,
    default: "Voter",
  },
}); //all the data's hash will be created to login next time*

global.Voter = global.Voter || mongoose.model("Voter", voterSchema);
module.exports = global.Voter;

//Voter model registered,
//we also can export this model,but mongoose object stores it
