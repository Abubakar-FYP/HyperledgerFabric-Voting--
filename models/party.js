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

})

mongoose.model("Party",partySchema)