const mongoose = require('mongoose')
const validator = require('express-validator')

const hashSchema = mongoose.Schema({
    
    hash:{
        type:String,
        required:true
    }

})

global.Hash = global.Hash || mongoose.model("Hash",hashSchema) 
module.exports = global.Hash