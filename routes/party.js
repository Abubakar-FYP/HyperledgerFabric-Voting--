const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const requireLogin = require("../middleware/requirelogin");

//Registering Models
require("../Models/party");
require('../Models/criminal')

//Models
const Party = mongoose.model("Party");
const Criminal = mongoose.model("Criminal");

router.post("/createparty", async (req, res) => {
  const {
    partyId,
    partyName,
    partyImg,
    partyLeaderName,
    partyLeaderCnic,
    partyLeaderPhoneNumber,
    partyLeaderGender,
    partyLeaderAge,
    partyLeaderReligion,
    partyLeaderAddress,
  } = req.body;

  if (
    !partyId ||
    !partyName ||
    !partyImg ||
    !partyLeaderName ||
    !partyLeaderCnic ||
    !partyLeaderPhoneNumber ||
    !partyLeaderGender ||
    !partyLeaderAge ||
    !partyLeaderReligion ||
    !partyLeaderAddress
  ) {
    return res.status(408).json({ message: "one or more fields are empty" });
  }

  //find

  const found = await axios({
    method: "get",
    url: "http://localhost:1970/findparty",
    data: { partyId },
  })
    .then((resp) => {
      if (resp.data["message"] != null) {
        return res
          .status(200)
          .json({ message: "Party with this ID already present" });
      }
    })
    .catch((err) => {
      console.log(err);
    });

  const newParty = new Party({
    partyId,
    partyName,
    partyImg,
    partyLeaderName,
    partyLeaderCnic,
    partyLeaderPhoneNumber,
    partyLeaderGender,
    partyLeaderAge,
    partyLeaderReligion,
    partyLeaderAddress,
  });

  newParty
    .save()
    .then((resp) => {
      res.status(408).json({ message: "party successfully saved" });
    })
    .catch((err) => {
      res.status(408).json({ message: err });
    });

  //party created,Now create the candidate list, save the partyID for candidates
});

router.post("/createcandidatelist/:partyId", async (req, res) => {
  const { candidate } = req.body;

  if (!candidate) {
    return res.status(400).json({ message: "field is empty" });
  }

  for(var i=0;i<candidate.length;i++){  

/*     const found = axios({
      url:"http://localhost:1970/getcriminal",
      method:"get",
      data: candidate[i].cnic
    })
    .then((resp)=>{
      if(resp.data["message"]!=null){
        return res.status(400).json({message:"candidate is a criminal"});
      }
    });
 */

  }

  //found

  //update
});

router.get("/getcriminal",async (req,res)=>{
  const {cnic} = req.body;

  if(!cnic){
    return res.status(400).json({message:"field is empty"});
  }

  Criminal.findOne({cnic})
  .then((resp)=>{
    if(resp){
      return res.status(200).json({message:resp});
    }
  })
  .catch((err)=>{
    console.log(err);
  });

})

router.get('/findparentdoc',async (req,res)=>{
  const {_id} = req.body;

  Party.findOne({_id})
  then((resp)=>{
    return res.status(200).json({message:resp});
  }).
  catch((err)=>{
    console.log(err);
  });

})

router.get("/findparty", async (req, res) => {
  const { partyId } = req.body;

  if (!partyId) {
    return res.status(400).json({ message: "field empty" });
  }

  Party.findOne({ partyId })
    .then((found) => {
      return res.status(200).json({ message: found });
    })
    .catch((err) => {
      return res.status(400).json({ message: err });
    });
});

router.delete("/deleteparty", async (req, res) => {
  const { partyId } = req.body;

  if (!partyId) {
    return res.status(400).json({ message: "field is empty" });
  }

  Party.findOneAndDelete({ partyId }, (resp) => {
    return res
      .status(200)
      .json({ message: `party has been successfully deleted` });
  }).catch((err) => {
    return res.status(403).json({ error: err });
  });
});

module.exports = router;