const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({

    votername:{
        type:String,
        required:true
    },

    candidatename:{
        type:String,
        required:true
    },

    voterCnic:{
        type:Number,
        required:true
    },

    candidateCnic:{
        type:Number,
        required:true
    },

    time:{
        type:Date,
        default:Date.now
    }, //automatically gets the current date and time

    ballotid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Ballot",
        required:true
    }

});

global.Vote = global.Vote || mongoose.model("Vote",voteSchema); 
module.exports = global.Vote;