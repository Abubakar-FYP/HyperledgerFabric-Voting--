const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requirelogin");


//Register Models
require("../Models/campaign");

//Models
const Campaign = mongoose.model("Campaign");

router.post("/createcampaign", async (req, res) => {
  const { campaignId, campaignName } = req.body;

  if (!campaignId || !campaignName) {
    return res.status(403).json({ error: "one or more fields are empty" });
  }

  const found = await Campaign.findOne({ campaignId })
    .then((resp) => {
      if(resp) {
        return res.status(200).json({ message: "campaign is already present" });
      }
    }).catch((err)=>{
      return res.status(400).json({message:err});
    })

    if(found) {
      return res.status(200).json({ message: "campaign is already present" });
    }
    
  const newCampaign = new Campaign({
    campaignId,
    campaignName,
  });

  newCampaign
    .save()
    .then((resp) => {
      if (resp) {
        return res.status(200).json({ message: "campaign successfully saved" });
      }
    })
    .catch((err) => {
      if (err) {
        return res
          .status(403)
          .json({ error: "there seems to be an error saving the campaign" });
      }
    });

});

router.get("/findcampaign", async (req, res) => {
  const { campaignId } = req.body;

  if (!campaignId) {
    return res.status(403).json({ error: "field is empty" });
  }

  Campaign.findOne({ campaignId })
    .then((resp) => {
      if (resp) {
        return res.status(200).json({ message: resp });
      }
    })
    .catch((err) => {
      return res.status(403).json({message:err});
    });
});

router.put("/updatecampaign", async (req, res) => {
  
  const {campaignId,campaignName} = req.body;

  if(!campaignId){
    return res.status(403).json({error:"field is empty"});
  }

  if(campaignName){
    Campaign.findOneAndUpdate({campaignId},{campaignName},(resp=>{
      return res.status(200).json({message:resp});
    }))
    .catch(err=>{
      return res.status(400).json({message:err});
    });
  }

  if(!campaignId&&!campaignName){
    return res.status(403).json({error:"fields are empty"});
  }

});

router.delete("/deletecampaign", async (req, res) => {
    const {campaignId} = req.body;
    
    if(!campaignId){
        return res.status(403).json({ error: "campaign-id field is empty" });
    }

    Campaign.findOneAndDelete({campaignId},(resp)=>{
            return res.status(200).json({ message: `campaign ${campaignId} successfully deleted`});
    })
    .catch((err)=>{
        return res.status(403).json({error:err});
    });
    
});

router.get('/findallcampaigns',async (req,res)=>{
    
    Campaign.find()
    .then((resp)=>{
      return res.status(200).json({message:resp});
    })
    .catch((err)=>{
      return res.status(400).json({message:err});
    });    
    
});

module.exports = router;