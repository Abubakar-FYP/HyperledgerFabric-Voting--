const {Schema,mongoose} = require('mongoose');

const areaSchema = new mongoose.Schema({
    
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
    },

});

global.Area = global.Area || mongoose.model("Area",areaSchema) 
module.exports = global.Area