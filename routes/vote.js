    const express = require('express')
    const router = express.Router()
    const mongoose = require('mongoose')
    const path  = require('path')

    const requireLogin = require('../middleware/requirelogin')

    require('../models/voter');
    require('../models/vote');
    require('../models/ballot');

    const Voter = mongoose.model('Voter');
    const Vote = mongoose.model('Vote');
    const Ballot = mongoose.model('Ballot');

    router.post('/vote/:v_cnic/:c_cnic',async (req,res)=>{    

 
            //will use the city to get all the candidates present for that campaign
   
          //voter will select a candidate,his/her name and hash will be shown(Front-End)}
      
        //then a vote will generated containing voter and candidate info
        
        //now all candidates are found
       //now voter will select one candidate and vote will be submitted
      //from the front end<->to<->backend

    })

    module.exports = router;