const mongoose = require('mongoose') //Admin editable only

const ballotSchema = new mongoose.Schema({


    ballotname:{
        type:String,
        required:true
    },
 
    ballotid:{
        type:Number,
        required:true
    },

    ballothash:{
        Type:String     
    }

})

mongoose.model("Ballot",ballotSchema);