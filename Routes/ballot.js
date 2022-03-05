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
//Models
const Ballot = mongoose.model("Ballot");
const Party = mongoose.model("Party");
const Election = mongoose.model("Election");
const Campaign = mongoose.model("Campaign");

router.post("/createballot", async (req, res) => {
  const { _id, ballotid, ballotname, type, campaignId } = req.body; //send objectId of AreaId

  if (!ballotid || !ballotname || !type || !campaignId) {
    return res.status(400).json({ message: "one or more fields are empty" });
  }

  await Ballot.findOne({ ballotid }).then((resp) => {
    if (resp) {
      return res.json({ message: "ballot already present with this id" });
    }
  });

  const newBallot = new Ballot({
    _id,
    ballotid,
    ballotname,
    type,
    campaignId,
  });

  newBallot.campaignId = mongoose.Types.ObjectId(newBallot.campaignId);
  newBallot._id = mongoose.Types.ObjectId(newBallot._id);

  newBallot
    .save()
    .then((resp) => {
      return res.status(200).json({ message: "ballot successfully saved" });
    })
    .catch((err) => {
      return res.status(400).json({ message: err });
    });
});

router.put("/update_id", async (req, res) => {
  const { _id, up_id } = req.body;

  await Ballot.find({ _id: _id });
});

router.put("/updatecampaignidofballot", async (req, res) => {
  const { _id, campaignId } = req.body;

  await Ballot.findByIdAndUpdate({ _id: _id }, { campaignId: campaignId });
});

//use this on every insertion of ballot,
//verifies if ballot is ok or not
//good to go
router.get("/findballot/:_id", async (req, res) => {
  try {
    if (!req.params._id) {
      return res.status(400).json({ message: "field is empty" });
    }

    const elections = await Election.find({});
    let latestelection = null;
    let check1 = false;
    elections.map((election) => {
      if (
        Date.now() >= Number(election.startTime) && //means that is the election is currently running
        Date.now() <= Number(election.endTime) &&
        election.valid == true
      ) {
        latestelection = election;
        check1 = true;
      }
    });

    if (check1 == false) {
      return res.status(400).json({ message: "election is not running" });
    }

    await Ballot.findOne({ _id: req.params._id })
      .populate("candidate", "_id name position partyId")
      .populate("partyId", "partyName")
      .lean()
      .exec((err, ballot) => {
        if (err) {
          return res.status(400).json({ message: err });
        } else {
          return res.status(200).send({ ballot });
        }
      });
  } catch (err) {
    return console.log(err);
  }
});

router.delete("/deleteballot", async (req, res) => {
  if (!ballotid) {
    return res.status(400).json({ message: "field is empty" });
  }

  Ballot.findOneAndDelete({ ballotid: req.params._id })
    .then((resp) => {
      if (resp) {
        return res.status(200).json({ message: "ballot successfully deleted" });
      } else {
        return res
          .status(400)
          .json({ message: "there was an error deleting Ballot" });
      }
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
      return res.status(200).json({ message: docs });
    } else {
      return res.status(400).json({ message: err });
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
        docs.map(
          (doc) =>
            (doc.candidate = doc.candidate.sort(
              (a, b) => b?.voteCount - a?.voteCount
            ))
        );
        // console.log("saperate docs=======", docs[i])
        console.log("docs ==============", docs);
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
  try {
    const party = await Party.find().select("partyName");
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
        const allWinnerCandidatesFromABallot = docs.map((compaign) =>
          compaign.ballotId.map((ballot) => ballot.candidate)
        );

        // get same parties from each compaign
        // const data =

        // get all the winners
        console.log("winners", allWinnerCandidatesFromABallot);
        res.send({
          candidates: allWinnerCandidatesFromABallot,
          // winners: firsWinningCandidates,
          // party
        });
      });
  } catch (err) {
    console.log(err);
  }
});

router.get("/getoverallpartywinner", async (req, res) => {
  try {
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
        if (!err) {
          docs.sort((a, b) => b?.voteCount - a?.voteCount);
          res.json({
            voteCount: docs[0]?.voteCount,
            partyName: docs[0]?.partyName,
          });
        } else {
          console.log(err);
        }
      });
  } catch (err) {
    console.log(err);
  }
});

router.get("/getallpartyvotes", async (req, res) => {
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
      docs.sort((a, b) => b?.voteCount - a?.voteCount);
      docs = docs.map((party) => {
        return {
          voteCount: party.voteCount,
          partyName: party.partyName,
        };
      });
      console.log("docssss===========", docs);
      res.send({
        docs,
      });
    });
});

router.get("/electionresultdata", async (req, res) => {
  await Campaign.find({})
    // .select("campaignName voteCounts")
    .exec((err, docs) => {
      let result = docs.map((cam) => {
        return {
          campaignName: cam.campaignName,
          voteCounts: cam.voteCounts,
        };
      });
      // docs.sort((a,b) => b?.voteCount - a?.voteCount);
      //       filteredResult = docs[docs.length - 1];
      //       result.partyName = filteredResult.partyName;
      //       result.voteCount = filteredResult.voteCount;
      //       result.ballotId = new Array();
      //       result.candidateName = new Array();

      //       for (const candidate of filteredResult.candidate) {
      //         /*  console.log("Candidate===================>", candidate);
      //         console.log(
      //           "BallotId===================>",
      //           candidate.ballotId.ballotid
      //         ); */
      //         result.candidateName.push(candidate.name);
      //         //name is coming up empty
      //         result.ballotId.push(candidate.ballotId.ballotid);
      //       }
      //       /*
      //       console.log(
      //         //candidate[0].name is returning undefined
      //         "CandidateName===================>",
      //         filteredResult.candidate[0].name
      //       );
      //  */

      //       console.log("Result======================>", result);
      res.json({ result });
    });
});

//overall winner (party) //hold

module.exports = router;
