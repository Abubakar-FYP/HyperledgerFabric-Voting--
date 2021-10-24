const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const requireLogin = require("../Middleware/requirelogin");
const { compareSync } = require("bcryptjs");
const { getFCP } = require("web-vitals");
const response = require("debug")("app:response");

//Register Models
require("../Models/ballot");
require("../Models/party");
require("../Models/vote");
//Models
const Ballot = mongoose.model("Ballot");
const Party = mongoose.model("Party");
const Vote = mongoose.model("Vote");
const Campaign = mongoose.model("Campaign");

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

  Ballot.findOneAndDelete({ ballotid })
    .then(() => {
      res.status(200).json({ message: "ballot successfully deleted" });
    })
    .catch((err) => {
      res.status(400).json({ message: err });
    });
});

//finds all ballots and their campaigns
//good to go
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
//good to go
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

//gets all ballot name by type(MPA or MNA)
//good to go
router.get("/getballotbytype/:type", async (req, res) => {
  await Ballot.find({ type: req.params.type }).exec((err, docs) => {
    if (!err) {
      res.json(docs);
    } else {
      console.log(err);
    }
  });
});

//gets all ballot type
//return ballot type
//good to go
router.get("/getallballotbytype", async (req, res) => {
  await Ballot.find({})
    .select("_id ballotname type")
    .then((resp) => {
      if (resp == null) {
        return res.status(400).json({ message: "id does not exist" });
      } else {
        res.json({ message: resp });
      }
    })
    .catch((err) => console.log(err));
});

//gets a single ballot type
//returns mpa or mna
//good to go
router.get("/getballotbytype/:_id", async (req, res) => {
  if (!req.params._id) {
    return res.status(400).json({ message: "field is empty" });
  }
  await Ballot.findOne({ _id: req.params._id })
    .then((resp) => {
      if (resp == null) {
        return res.status(400).json({ message: "id does not exist" });
      } else {
        res.json({ message: resp.type });
      }
    })
    .catch((err) => console.log(err));
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

//good to go
router.get("/getcandidateswithballotid/:ballotId", async (req, res) => {
  Candidate.find({ ballotId: req.params.ballotId }).exec((err, docs) => {
    if (!err) {
      res.status(200).json({ message: docs });
    } else {
      res.status(400).json({ message: err });
    }
  });
});

//single ballots winner
//good to go
router.get("/getballotwinner/:_id", async (req, res) => {
  const ballots = await Ballot.findOne({ _id: req.params._id })
    .select("_id ballotname ballotid")
    .lean()
    .populate({
      path: "candidate",
      select: " _id voters name cnic",
      populate: {
        path: "partyId",
        model: "Party",
        select: "partyName partyid",
      },
    })
    .exec((err, docs) => {
      if (!err) {
        const response = docs.candidate.map((item) => {
          if (item.voters === undefined) {
            item.voteCount = null;
          }

          if (item.voteCount === null) {
            item.voteCount = 0;
          } else {
            item.voteCount = item.voters.length;
          }
          return item;
        });
        response.ballotId = docs.ballotid;
        res.json(response);
      } else {
        console.log(err);
      }
    });
});

//good to go
router.get("/getallballotwinner", async (req, res) => {
  await Ballot.find({})
    .populate({
      path: "candidate",
      populate: {
        path: "partyId",
      },
    })
    .lean()
    .exec(async (err, docs) => {
      if (!err) {
        docs.map(doc => (
          doc.candidate = doc.candidate.sort((a,b) => b?.voteCount - a?.voteCount )
        ))
          // console.log("saperate docs=======", docs[i])
        console.log("docs ==============", docs)
        res.json(docs);
      } else {
        console.log(err);
      }
    });
});

//good to go
router.get("/getcampaignwinner", async (req, res) => {
  await Campaign.find({})
    .populate({
      path: "ballotId",
      populate: {
        path: "candidate",
        populate: {
          path: "partyId",
        },
      },
    })
    .exec((err, docs) => {
      res.json(docs);
    });
});

//good to go
router.get("/getcampaignwinner/:_id", async (req, res) => {
  const mapping = new Map();
  await Campaign.findOne({ _id: req.params._id })
    .lean()
    .populate({
      path: "ballotId",
      select: "ballotname",
      populate: {
        path: "candidate",
        populate: {
          path: "partyId",
          select: "partyName",
        },
      },
    })
    .exec((err, docs) => {
      const campaignName = docs.campaignName;
      const mapping = new Map();

      const candidates = docs.ballotId.map((item) => {
        //returns object of candidates for a ballot
        return item.candidate
          .map((item) => {
            if (item.voters === undefined) {
              item.voteCount = null;
            }

            if (item.voteCount === null) {
              item.voteCount = 0;
            } else {
              item.voteCount = item.voters.length;
            }
            return item;
          })
          .map((item) => {
            if (!mapping.has(item.partyId.partyName)) {
              mapping.set(item.partyId.partyName, item.voteCount);
            } else {
              for (const [key, value] of mapping) {
                if (key === item.partyId.partyName) {
                  mapping.set(key, value + item.voteCount);
                }
              }
            }
          }); //returns from candidate array
      });
      console.log(mapping);
      res.json(mapping);
    });
});

//good to go
router.get("/getallcampaignwinner", async (req, res) => {
  await Campaign.find({})
    .lean()
    .populate({
      path: "ballotId",
      select: "ballotname",
      populate: {
        path: "candidate",
        populate: {
          path: "partyId -_id -_cnic -position",
          select: "partyName",
        },
      },
    })
    .exec((err, docs) => {
      const sorted = new Array();

      docs.map((doc) =>
        // console.log("docs=====================", doc.ballotId[1].candidate)
        doc.ballotId.map(
          (ballot) =>
            // console.log("ballot=================", ballot.candidate)
            (ballot.candidate = ballot.candidate.sort(
              (a, b) => b?.voteCount - a?.voteCount
              // console.log("candidate===========", cand)
            ))
        )
      );
      res.send(docs);
    });
});

router.get("/getoverallpartywinner", async (req, res) => {
  await Party.find({})
    .lean()
    .populate({
      path: "ballotId",
      select: "ballotname",
      populate: {
        path: "candidate",
        populate: {
          path: "partyId",
          select: "partyName",
        },
      },
    })
    .exec((err, docs) => {
      docs.sort((a, b) => a?.voteCount - b?.voteCount);
      res.json(docs);
    });
});

//overall winner (party) //hold

module.exports = router;
