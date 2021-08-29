const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requirelogin");

//Register Models
require("../Models/campaign");

//Models
const Campaign = mongoose.model("Campaign");

router.post("/createCampaign", async (req, res) => {
  const { campaignId, campaignName } = req.body;

  if (!campaignId || !campaignId) {
    return res.status(403).json({ error: "one or more fields are empty" });
  }

  Campaign.findOne({ campaignId })
    .then((resp) => {
      if (resp) {
        return res.status(403).json({ message: "campaign is already present" });
      }
    })
    .catch((err) => {
      if (err) {
        return res
          .status(200)
          .json({ error: "campain not found,Ready to register" });
      }
    });

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

router.get("/findCampaign", async (req, res) => {
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
      return res
        .status(403)
        .json({ error: "couldn't find the campaignId given" });
    });
});

router.put("/updateCampaign/:campaignId", async (req, res) => {
  const { campaignId, campaignName } = req.body;

  if (campaignId) {
    Campaign.findOneAndUpdate(req.params.campaignId, campaignId, (resp) => {
      if (resp) {
        res.status(200).json({ message: "Successfully updated" });
      }
    }).catch((err) => {
      res.status(403).json({ error: "couldn't update campaign-id" });
    });
  }

  if (campaignName) {
    Campaign.findOneAndUpdate(req.params.campaignId, campaignName, (resp) => {
      if (resp) {
        res.status(200).json({ message: "Successfully updated" });
      }
    }).catch((err) => {
      res.status(403).json({ error: "couldn't update campaign-name" });
    });
  }

  if(!campaignId&&!campaignName){
    return res.status(403).json({error:"all of the fields is empty"});
  }

});

router.delete("/deleteCampaign", async (req, res) => {
    const {campaignId} = req.body;
    
    if(!campaignId){
        return res.status(403).json({ error: "campaign-id field is empty" });
    }

    Campaign.findOneAndDelete(campaignId,(resp)=>{
        if(resp){
            return res.status(403).json({ message: "campaign successfully deleted" });
        }
    })
    .catch((err)=>{
        return res.status(403).json({error:"couldn't delete campaign"});
    })

});

module.exports = router;