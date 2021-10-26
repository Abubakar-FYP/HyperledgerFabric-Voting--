const express = require("express");
const router = express.Router()
const Election = require("../Models/election")
const mongoose = require('mongoose');


require("../Models/party");
// 
const Party = mongoose.model("Party");


router.post("/create/election" , async (req,res) => { 
    // destructure the req.body
    console.log("req bod=================", req.body.candidates)
    const {electionName, startTime, endTime, electionType, candidates} = req.body
    if( !electionName, !startTime, !endTime, !electionType, !candidates){
        return res.status(400).send("One or more fields are not present")
    }

    const election = new Election();
    election.electionName = electionName
    election.startTime = startTime
    election.endTime = endTime
    election.electionType = electionType

    if(electionType.toLowerCase() === "country"){
        const parties = await Party.find({is_valid: true})
        console.log("parties=========", parties.map(party => party._id))
        const partyList = parties.map(party => party._id)
        election.parties = partyList
    }
    if(electionType.toLowerCase() === "poal"){
        console.log("poal==========")
    election.candidates =candidates
    }
    await election.save()
    res.send({election })
})




module.exports = router;
