    const express = require('express')
    const router = express.Router()
    const mongoose = require('mongoose')
    const path  = require('path')

    const requireLogin = require('../middleware/requirelogin')

    require('../models/voter')
    require('../models/vote')
    require('../models/ballot')

    const Voter = mongoose.model('Voter') 
    const Vote = mongoose.model('Vote')
    const Ballot = mongoose.model('Ballot')

    router.post('/vote',(req,res)=>{    
        const {cnic} = req.body  //we get info from the session and req all info from the cnic session!!
        
        
        //{cnic and ballotid will come from voters session rather than entering him/herself  !!!
       
          //will use the city to get all the candidates present for that campaign
   
        //voter will select a candidate,his/her name and hash will be shown(Front-End)}
     
      //that candidate(info) will be fetched using the hash
     //then a vote will generated containing voter and candidate info
        
        //now all candidates are found
       //now voter will select one candidate and vote will be submitted
      //from the front end<->to<->backend

    })
  
    module.exports = router