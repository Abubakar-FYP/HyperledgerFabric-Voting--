const mongoose = require('mongoose')
const {Schema} = require('mongoose')

const partySchema = new Schema({
    
    partyId:{
        type:Number,
        required:true
    },

    name:{
        type:String,
        required:true
    },

    img:{
        type:String,
        default:'...'
    },

});

mongoose.model("Party",partySchema);
global.Party = global.Party || mongoose.model("Party",partySchema);

module.exports = global.Party;