const {Schema} = require('mongoose');
const mongoose = require('mongoose');

const campaign = new Schema({

    campaignId:{
        type: Number,
        required: true
    },

    campaignName:{
        type: String,
        required: true
    },

    areaId:{
        type:[Schema.Types.ObjectId],
        ref:"Ballot"
    }

});

global.Campaign = global.Campaign || mongoose.model("Campaign",campaign); 
module.exports = global.Campaign;
