const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types.ObjectId

const voteSchema = new mongoose.Schema({

    votername:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Voter",
        required:true
    },

    fromhash:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hash",
        required:true
    },

    candidatename:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Candidate",
        required:true
    },

    tohash:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hash",
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

    
})

global.Vote = global.Vote || mongoose.model("Vote",voteSchema) 
module.exports = global.Vote