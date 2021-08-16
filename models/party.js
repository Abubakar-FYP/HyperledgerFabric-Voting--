const mongoose = require('mongoose')

const partySchema = new mongoose.Schema({
    
    partyId:{
        type:Number,
        required:true
    },

    name:{
        type:String,
        required:true
    },

    img:{
        data:Buffer,
        contentType:String,
        required:true
    },

    candidateList:{
        type: [mongoose.Schema.Types.ObjectId],
        ref:'Candidate',
        required:true
    }

})

global.Party = global.Party || mongoose.model("Party",partySchema);
module.exports = global.Party;