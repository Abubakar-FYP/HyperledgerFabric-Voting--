const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const requireLogin = require("../Middleware/requirelogin");
const ObjectId = mongoose.Types.ObjectId;

//Register Models
require("../Models/ballot");
require("../Models/party");
//Models
const Ballot = mongoose.model("Ballot");
const Party = require("../Models/party");

router.post("/createballot", async (req, res) => {
  const { ballotid, ballotname } = req.body; //send objectId of AreaId

  if (!ballotid || !ballotname) {
    return res.status(400).json({ message: "one or more fields are empty" });
  }

  const found = await Ballot.findOne({ ballotid }).then((resp) => {
    if (resp) {
      return res.json({ message: "ballot already present with this id" });
    }
  });

  if (found) {
    return res.json({ message: "ballot already present with this id" });
  }

  const newBallot = new Ballot({
    ballotid,
    ballotname,
  });

  newBallot
    .save()
    .then((resp) => {
      return res.status(200).json({ message: "ballot successfully saved" });
    })
    .catch((err) => {
      return res.status(400).json({ message: err });
    });
});

//use this on every insertion of ballot,
//verifies if ballot is ok or not
//good to go
router.get("/findballot/:_id", async (req, res) => {
  if (!req.params._id) {
    return res.status(400).json({ message: "field is empty" });
  }

  Ballot.findOne({ _id: req.params._id })
    .populate("campaignId", "_id campaignId campaignName")
    .populate("candidate", "_id name position partyId")
    .lean()
    .exec((err, docs) => {
      if (err) {
        return res.status(400).json({ message: err });
      } else {
        return res.status(200).json({ message: docs });
      }
    });
});

router.delete("/deleteballot", async (req, res) => {
  const { ballotid } = req.body;

  if (!ballotid) {
    return res.status(400).json({ message: "field is empty" });
  }

  const found = await axios({
    method: "get",
    url: "http://localhost:1970/findballot",
    data: {
      ballotid: ballotid,
    },
  })
    .then((resp) => {
      console.log(resp.data);
      if (resp.data["message"] == null) {
        return res
          .status(403)
          .json({ message: "ballot not present with this id" });
      }
    })
    .catch((err) => console.log(err));

  Ballot.findOneAndDelete({ ballotid })
    .then(() => {
      res.status(200).json({ message: "ballot successfully deleted" });
    })
    .catch((err) => {
      res.status(400).json({ message: err });
    });
});

//finds all ballots and their campaigns
router.get("/findallballot", async (req, res) => {
  Ballot.find({})
    .populate("campaignId", "_id campaignId campaignName")
    .populate("candidate", "_id name position partyId")
    .lean()
    .exec((err, docs) => {
      if (err) {
        return res.status(400).json({ message: err });
      } else {
        return res.status(200).json({ message: docs });
      }
    });
});

//gets all the name of the ballots
//tested
//check again
router.get("/getballotname", async (req, res) => {
  await Ballot.find({})
    .select("_id ballotname")
    .exec((err, docs) => {
      if (!err) {
        return res.status(200).json({ message: docs });
      } else {
        console.log(err);
        return res.status(400).json({ message: err });
      }
    });
});

//!!! also chain this (after) candidate refers to ballot,
//meaning when candidate is inserted
router.put(
  "/updatecandidatesinballot/:ballotid/:candidateid", //both have to be _id
  async (req, res) => {
    const { ballotid, candidate } = req.params;

    if (!ballotid || !candidate) {
      res.status(400).json({ message: "field is empty" });
    }

    Ballot.findOne({ ballotid })
      .exec((err, doc) => {
        doc.candidate.push(candidate);
        doc
          .save((err, res) => {
            if (!err) {
              res
                .status(200)
                .json({ message: "candidate successfully saved in ballot" });
            } else {
              res
                .status(400)
                .json({ message: "error in saving candidate in ballot" });
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }
);

//it gets the candidate having the same ballotid
//the candidats belonging to the same ballot
router.get("/getcandidateswithballotid/:ballotid", async (req, res) => {});

//single ballot winner (candidate)
router.get("/getballotwinner", async (req, res) => {});
//overall winner (party)
//campaign winner (party)

//returns unique values
const unique = (value, index, self) => {
  return self.indexOf(value) === index;
};

module.exports = router;
