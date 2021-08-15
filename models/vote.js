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

    voterId:{
        type:Number,
        required:true
    },

    candidateId:{
        type:Number,
        required:true
    },

    time:{
        type:Date,
        default:Date.now,         
        required:true
    }, //automatically gets the current date and time

    ballotid:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }

});

global.Vote = global.Vote || mongoose.model("Vote",voteSchema); 
module.exports = global.Vote;