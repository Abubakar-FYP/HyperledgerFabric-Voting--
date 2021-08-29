const {Schema} = require('mongoose') //Admin editable only
const mongoose = require('mongoose')

const ballotSchema = new mongoose.Schema({

    ballotname:{
        type:String,
        required:true
    },
 
    ballotid:{
        type:Number,
        required:true
    },

    areaId:{
        type: Schema.Types.ObjectId,
        ref:'Area'
    }

});

global.Ballot = global.Ballot || mongoose.model("Ballot",ballotSchema);
module.exports = global.Ballot;