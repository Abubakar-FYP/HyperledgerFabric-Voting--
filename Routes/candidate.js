const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const requireLogin = require("../Middleware/requirelogin");

require("../Models/candidate");

const Candidate = mongoose.model("Candidate");

//use this route after the create party,
//chain the createparty and this route, because
//createparty returns an array of candidates
//those candidates will now be added to Candidate Model
router.post("/createcandidate", async (req, res) => {
  const { candidate } = req.body; //traverse this array and insert one by one
  if (!candidate) {
    return res.status(400).json({ message: "field is empty" });
  }

  const candidates = candidate.map(async (item) => {
    const newCandidate = new Candidate({
      _id: item._id,
      name: item.name,
      cnic: item.cnic,
      position: item.position,
      ballotId: item.ballotId,
      partyId: item.partyId,
    });

    await newCandidate.save().catch((err) => {
      console.log(err);
    });
  });

  res.status(200).json({ message: "Candidates have been registered" });
});

//delete's candidate with id in params
//hold onto this one right now
router.delete("/deletecandidate/:_id", async (req, res) => {
  const { _id } = req.body;
  if (!_id) {
    return res.status(400).json({ message: "field is empty" });
  }
  Candidate.deleteOne({ _id: _id })
    .then(() => {
      res.json(`${_id} has been deleted`);
    })
    .catch((err) => {
      console.log(err);
      res.json("There was a problem deleting");
    });
});

//use this during candidate insertion
//finds the candidate with given id in params
//returns whole candidate or returns null
//populate required
router.get("/findcandidate/:_id", async (req, res) => {
  const { _id } = req.params._id;
  if (!_id) {
    return res.status(400).json({ message: "field is empty" });
  }
  await Candidate.findOne({ _id: _id }).exec((err, doc) => {
    if (!err) {
      return res.status(200).json({ message: doc });
    } else {
      console.log(err);
      return res.status(400).json({ message: null });
    }
  });
});

//gets all the candidates
//populate required
router.get("/findallcandidate", async (req, res) => {
  await Candidate.find({}).exec((err, docs) => {
    if (!err) {
      return res.status(200).json({ message: docs });
    } else {
      return res.status(400).json({ message: err });
    }
  });
});

//!use this route after candidate has been referenced  in party and made in candidate model
//this route will execute when a user is selected for a ballot
//a ballot id will be assigned to him
//used by partyLeader
//candidateId and ballotid both are objectId
router.put(
  "/assignballotidtocandidate/:ballotid/:candidateId",
  async (req, res) => {
    //find that candidate and give him the ballot id
    await Candidate.findOne({ _id: req.params.candidateId }).exec(
      async (err, doc) => {
        if (!err) {
          doc.ballotid = req.params.ballotid;
          await doc
            .save()
            .then((resp) => {
              res
                .status(200)
                .json({ message: "ballot successfully assigned to candidate" });
              return req.params.candidateId;
            })
            .catch((err) => {
              console.log(err);
              res
                .status(200)
                .json({ message: "ballot assignment to candidate failed" });
            });
        }
      }
    );
  }
);

//returns candidate postitions mpa and mna
//hard code return
router.get("/getpositions", async (req, res) => {
  const positions = { MPA: "MPA", MNA: "MNA" };
  return res.status(200).json({ positions });
});

module.exports = router;
