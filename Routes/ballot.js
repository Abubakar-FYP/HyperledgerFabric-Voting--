const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const requireLogin = require("../Middleware/requirelogin");
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

//it gets the candidate having the same ballotid
//the candidats belonging to the same ballot
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
//use this for all ballots winner as well
//!!!chain this for the all ballots winner
//returns information about the candidate who won from the ballot
//hit this one time when election time ends
router.get("/getballotwinner/:_id", async (req, res) => {
  const ballots = await Ballot.findOne({ _id: req.params._id })
    .select("_id candidate")
    .populate({
      path: "candidate _id cnic partyId",
      populate: {
        path: "partyId",
        model: "Party",
        select: "partyName partyImg",
      },
    })
    .lean();
  const cnicFiltered = ballots.candidate.map((item) => {
    return item.cnic;
  });

  const mapping = new Map();

  for (const cnic of cnicFiltered) {
    mapping.set(cnic, await Vote.where({ cnic: cnic }).countDocuments());
  }

  let winner;
  const max = ("max", Math.max(...mapping.values()));
  for (const [key, value] of mapping.entries()) {
    if (value == max) {
      winner = key;
    }
  }

  let winnerInfo = ballots.candidate.find((item) => {
    if (item.cnic == winner) {
      return item;
    }
  });

  res.status(200).json({ message: winnerInfo });
  return winnerInfo;
});

router.get("/getallballotwinner", async (req, res) => {
  var candidateCnic = new Array();
  await Ballot.find({})
    .populate({
      path: "candidate",
    })
    .lean()
    .exec(async (err, docs) => {
      if (!err) {
        for (const ballot of docs) {
          ballot.candidate.map((item) => {
            candidateCnic.push(item.cnic);
          });
        }

        const mapping = new Map();

        for (const cnic of candidateCnic) {
          mapping.set(
            cnic,
            await Vote.where({ candidateCnic: cnic }).countDocuments()
          );
        }

        let winner;
        const max = ("max", Math.max(...mapping.values()));
        for (const [key, value] of mapping.entries()) {
          if (value == max) {
            winner = key;
          }
        }
        var winnerInfo;
        for (const candidate of docs) {
          for (var i = 0; i < candidate.candidate.length; i++) {
            if (candidate.candidate[i].cnic == winner) {
              winnerInfo = candidate.candidate[i];
              break;
            }
          }
        }

        winnerInfo.votes = max;
        console.log(winnerInfo);

        res.status(200).json({ message: winnerInfo });
        return winnerInfo;
      } else {
        console.log(err);
      }
    });
});

//campaign winner (party)
//returns campaign winner, first counts the number of candidates won in ballots
//then after that it counts the number of which party has the most ballots won
//then gets the info of the party that won and with how many ballots in one campaign
router.get("/getcampaignwinner/:_id", async (req, res) => {
  const ballots = await Campaign.findOne({ _id: req.params._id }).select(
    "ballotId"
  );
  var counter = 0;
  var winners = new Array();
  const winnerPartyVoteMapping = new Map();
  for (const ballot of ballots.ballotId) {
    counter++;
    winners.push(
      await axios({
        method: "get",
        url: `http://localhost:1970/getballotwinner/${mongoose.Types.ObjectId(
          ballot
        )}`,
      })
        .then((resp) => {
          return resp.data;
        })
        .catch((err) => console.log(err))
    );
  }

  const winnerPartyNames = winners.map((item) => {
    console.log(item);
    return item.message.partyId.partyName;
  });

  const partySet = new Set(winnerPartyNames); //unique values
  const partySetToArray = Array.from(partySet);
  const partyVoteMapping = new Map();

  for (var i = 0; i < partySetToArray.length; i++) {
    let counter = 0;
    for (var j = 0; j < winnerPartyNames.length; j++) {
      if (partySetToArray[i] === winnerPartyNames[j]) {
        counter++;
      }
    }
    partyVoteMapping.set(partySetToArray[i], counter);
  }

  var winner;
  const max = ("max", Math.max(...partyVoteMapping.values()));
  for (const [key, value] of partyVoteMapping.entries()) {
    if (value == max) {
      winner = key;
    }
  }

  var winnerInfo;
  for (const candidate of winners) {
    if (candidate.message.partyId.partyName == winner) {
      winnerInfo = candidate.message.partyId;
      break;
    }
  }
  winnerInfo.won = max;
  winnerInfo.ballotOutOf = counter;
  console.log(winnerInfo);

  return winnerInfo;
});

//overall winner (party) //hold

module.exports = router;
