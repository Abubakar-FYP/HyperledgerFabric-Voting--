const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const requireLogin = require("../Middleware/requirelogin");

//Register Models
require("../Models/campaign");
require("../Models/ballot");
//Models
const Campaign = mongoose.model("Campaign");
const Ballot = mongoose.model("Ballot");

router.post("/createcampaign", async (req, res) => {
  const { campaignId, campaignName, ballot } = req.body;

  if (!campaignId || !campaignName || !ballot) {
    return res.status(403).json({ error: "one or more fields are empty" });
  }

  const found = await Campaign.findOne({ campaignId })
    .then((resp) => {
      if (resp) {
        return res.status(200).json({ message: "campaign is already present" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ message: err });
    });

  if (found) {
    return res.status(200).json({ message: "campaign is already present" });
  }

  const newCampaign = new Campaign({
    campaignId,
    campaignName,
    ballot,
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
    .populate("ballotId")
    .exec((err, doc) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ message: err });
      } else {
        console.log(doc);
        return res.status(200).json({ message: doc });
      }
    });
});

router.delete("/deletecampaign", async (req, res) => {
  const { campaignId } = req.body;

  if (!campaignId) {
    return res.status(403).json({ error: "campaign-id field is empty" });
  }

  Campaign.findOneAndDelete({ campaignId }, (resp) => {
    return res
      .status(200)
      .json({ message: `campaign ${campaignId} successfully deleted` });
  }).catch((err) => {
    return res.status(403).json({ error: err });
  });
});

router.get("/findallcampaigns", async (req, res) => {
  Campaign.find({})
    .populate("ballotId")
    .exec((err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ message: err });
      } else {
        console.log(docs);
        return res.status(200).json({ message: docs });
      }
    });
});

//first inserts in ballot then in campaign
//make sure ballot ids are unique
//it takes ballot array
router.put("/updatecampaign", async (req, res) => {
  const { ballot } = req.body; //list of ballots(object List)
  var campaign_Id;
  var storeBallotIds = new Array();

  if (!ballot) {
    return res.status(400).json({ message: "field is empty" });
  }

  const ballots = await Ballot.find().lean();

  const something = ballots.map((item) => {
    return item.ballotid;
  });

  for (const ballos of ballot) {
    for (const somethings of something) {
      if (ballos.ballotid == somethings) {
        res.status(400).json({
          message: "ballot or ballots already exists",
        });
      }
    }
  }

  for (const ballos of ballot) {
    const ballotObject = ballos;

    const newBallot = new Ballot({
      ballotname: ballotObject.ballotname,
      ballotid: ballotObject.ballotid,
      campaignId: ballotObject.campaignId,
    });

    storeBallotIds.push(newBallot._id);

    newBallot
      .save()
      .catch((err) =>
        res.status(400).json({ message: "error in saving a ballot or ballots" })
      );
  }

  const found = await Campaign.find().lean();
  var foundId;

  for (const ballos of ballot) {
    for (const foundit of found) {
      if (ballos.campaignId == foundit._id) {
        foundId = foundit._id;
      }
    }
  }
  console.log(foundId);

  Campaign.findOneAndUpdate(
    { _id: foundId },
    { $addToSet: { ballotId: storeBallotIds } },
    (req) => {
      //
    }
  );
});

module.exports = router;
