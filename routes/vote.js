    const express = require('express')
    const router = express.Router()
    const mongoose = require('mongoose')
    const path  = require('path')
    const candidate = require('./candidate');

    const requireLogin = require('../middleware/requirelogin')

    require('../models/voter');
    require('../models/vote');
    require('../models/ballot');
    require('../models/candidate');

    const Voter = mongoose.model('Voter');
    const Candidate = mongoose.model('Candidate');
    const Vote = mongoose.model('Vote');
    const Ballot = mongoose.model('Ballot');

    router.post('/vote/:v_cnic/:c_cnic',async (req,res)=>{    

      Voter.findOne({cnic:req.params.v_cnic})
      .then((resp)=>{
        if(resp.voteflag == true){
          return res.status(400).json({message:"user has already voted"});
        }//to check if voter has voted or not
      });

      const voter = await Voter.findOne({cnic:req.params.v_cnic})
      .catch(err=>{
        return res.status(403).json({message:"voter not found"});
      });

      const candidate = await Candidate.findOne({cnic:req.params.c_cnic})
      .catch((err)=>{
        return res.status(403).json({message:"candidate not found"});
      });

      const newVote = new Vote({
        votername:voter.votername,
        candidatename:candidate.candidatename,
        voterCnic:voter.cnic,
        candidateCnic:candidate.cnic,
        ballotid:voter.ballotid
      });

      newVote.save()
      .catch((err)=>{
        return res.status(400).json({message:err});
      });

      Voter.findOneAndUpdate({cnic:req.params.v_cnic},{voteflag:true},(resp)=>{
        if(resp){
          return res.status(200).json({message:"voter has successfully voted"});
        }
      }).catch((err)=>{
        return res.status(400).json({message:err});
      });

      });

 
            //will use the city to get all the candidates present for that campaign
   
          //voter will select a candidate,his/her name and hash will be shown(Front-End)}
      
        //then a vote will generated containing voter and candidate info
        
        //now all candidates are found
       //now voter will select one candidate and vote will be submitted
      //from the front end<->to<->backend


    module.exports = router