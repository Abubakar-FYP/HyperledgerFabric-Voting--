const mongoose = require('mongoose')

const adminSchema = mongoose.Schema({
    
    email:{
        type:String,
        required:true
    },
    
    password:{
        type:String,
        required:true       
    }

})

global.Admin = global.Admin || mongoose.model("Admin",adminSchema) 
module.exports = global.Admin