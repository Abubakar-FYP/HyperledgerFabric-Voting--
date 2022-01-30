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
  const { campaignId, campaignName, ballotId } = req.body;

  if (!campaignId || !campaignName || !ballotId) {
    return res.json({ error: "one or more fields are empty" });
  }

  await Campaign.findOne({ campaignId })
    .then((resp) => {
      if (resp) {
        return res.status(200).json({ message: "campaign is already present" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ message: err });
    });

  const newCampaign = new Campaign({
    campaignId,
    campaignName,
    ballotId,
  });

  newCampaign
    .save()
    .then((resp) => {
      if (resp) {
        return res.status(200).json({ message: newCampaign._id });
      }
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        return res
          .status(403)
          .json({ error: "there seems to be an error saving the campaign" });
      }
    });
});

//helper function
router.put("/ballotidinsertintocampaign", async (req, res) => {
  const { campaignId, ballotId } = req.body;
  if (!campaignId || !ballotId) {
    return res.json({ message: "one or more fields are empty" });
  }

  const ballotIds = ballotId.map((id) => {
    return new Ballot({})._id;
  });

  const campaign = await Campaign.findOne({ _id: campaignId });

  campaign.ballotId = ballotIds;
  campaign
    .save()
    .then(() => res.json({ message: "successful" }))
    .catch((err) => {
      console.log(err);
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
//check this again,its wrong
router.put("/updatecampaign/_id", async (req, res) => {
  var storeBallotIds = new Array();

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
