const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const requireLogin = require("../middleware/requirelogin");

//Registering Models
require("../Models/area");

//Models
const Area = mongoose.model("Area");

router.delete("/deletearea", async (req, res) => {
  const { areaId } = req.body;

  if (!areaId) {
    return res.status(400).json({ message: "field is empty" });
  }

  Area.findOneAndDelete({ areaId }, (resp) => {
    return res
      .status(200)
      .json({ message: `area ${areaId} has been successfully deleted` });
  }).catch((err) => {
    return res.status(403).json({ error: err });
  });
});

router.put("/updatearea", async (req, res) => {
  const { areaId, areaName, campaignId } = req.body;

  if (!areaId) {
    return res.status(400).json({ message: "field is empty" });
  }

  if (areaName) {
    Area.findOneAndUpdate({ areaId }, { areaName }, (resp) => {
      res.status(200).json({ message: "successfully updated area-name" });
    }).catch((err) => {
      return res.status(403).json({ message: err });
    });
  }

  if (campaignId) {
    Area.findOneAndUpdate({ areaId }, { campaignId }, (resp) => {
      res.status(200).json({ message: "successfully updated campaign-id" });
    }).catch((err) => {
      return res.status(403).json({ message: err });
    });
  }

  if (!campaignId && !areaName) {
    return res.status(400).json({ message: "no updation fields are entered" });
  }
});

router.post("/createarea", async (req, res) => {
  const { areaId, areaName, campaignId } = req.body;

  if (!areaId || !areaName || !campaignId) {
    return res.status(400).json({ message: "one or more fields are empty" });
  }

  const found = await Area.findOne({ areaId })
  .then((resp) => {
    if(resp){
        return res.json({ message: "the area already exists with this id" });
    }  
    });

  if (found) {
    return res.json({ message: "the area already exists with this id" });
  }

  const newArea = new Area({
    areaId,
    areaName,
    campaignId,
  });

  newArea
    .save()
    .then((resp) => {
      return res
        .json({ message: "area is successfully registered" });
    })
    .catch((err) => {
      return res.json({ message: err });
    });
});

router.get("/getallarea", async (req, res) => {
  Area.find()
    .then((resp) => {
      return res.status(400).json({ message: resp });
    })
    .catch((err) => {
      return res.status(400).json({ message: err });
    });
});

router.get("/getallinfo", async (req, res) => {
  Area.find({})
    .populate("campaignId")
    .exec((err, docs) => {
      if (err) {
        return res.status(400).json({ message: err });
      } else {
        return res.status(200).json({ message: docs });
      }
    });
});

router.get("/findarea", async (req, res) => {
  const { areaId } = req.body;

  if (!areaId) {
    return res.status(400).json({ message: "field is empty" });
  }

  Area.findOne({ areaId })
    .then((resp) => {
      return res.status(400).json({ message: resp });
    })
    .catch((err) => {
      return res.status(400).json({ message: err });
    });
});

module.exports = router;
