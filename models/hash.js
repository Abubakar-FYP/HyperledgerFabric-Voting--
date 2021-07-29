const mongoose = require('mongoose')
const validator = require('express-validator')

const hashSchema = mongoose.Schema({
    
    hash:{
        type:String,
        required:true
    }

})

mongoose.model("Hash",hashSchema)