const {Schema} = require('mongoose');
const mongoose = require('mongoose')

const areaSchema = new Schema({
    
    areaId:{
        type:Number,
        required:true
    },

    areaName:{
        type: String,
        required:true
    },

    campaignId:{
        type: Schema.Types.ObjectId,
        ref: 'Campaign'
    }

});

global.Area = global.Area || mongoose.model("Area",areaSchema); 
module.exports = global.Area;

// resolve uuid/objectId issue and populate confusion