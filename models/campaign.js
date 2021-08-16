const {mongoose,Schema} = require('mongoose');
const Area = require('../Models/area');

const campaign = new mongoose.Schema({

    campaignId:{
        type: Number,
        required: true
    },

    campaignName:{
        type: String,
        required: true
    }

});

global.Campaign = global.Campaign || mongoose.model("Campaign",campaign); 
module.exports = global.Campaign;
