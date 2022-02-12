const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const requireLogin = require("../Middleware/requirelogin");

require("../Models/candidate");
require("../Models/nadra");
require("../Models/voter");

const Candidate = mongoose.model("Candidate");
const Nadra = mongoose.model("Nadra");
const Ballot = mongoose.model("Ballot");
const Voter = mongoose.model("Voter");

//delete's candidate with id in params
//hold onto this one right now
router.delete("/deletecandidate/:_id", async (req, res) => {
  const { _id } = req.body;
  if (!_id) {
    return res.status(400).json({ message: "field is empty" });
  }
  Candidate.deleteOne({ _id: req.params._id })
    .then(() => {
      res.json(`candidate has been deleted`);
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

router.get("/getmalevoters", async (req, res) => {
  const voters = await Voter.find({}).select(
    "-password -role -resetPassToken -ballotId"
  );
  const nadra = await Nadra.find({ gender: "Male" });

  if (voters == null || voters == [] || voters == undefined) {
    return res
      .status(400)
      .json({ message: "no vote has been casted by females" });
  }

  if (nadra == null || nadra == [] || nadra == undefined) {
    return res
      .status(400)
      .json({ message: "there are no candidates in nadra" });
  }
  const male = new Array();
  for (var i = 0; i < voters.length; i++) {
    for (var j = 0; j < nadra.length; j++) {
      if (nadra[j].cnic == voters[i].cnic) {
        male.push(voters[i]);
      }
    }
  }

  return res.status(200).json({ message: male });
});

router.get("/getfemalevoters", async (req, res) => {
  const voters = await Voter.find({}).select(
    "-password -role -resetPassToken -ballotId"
  );
  const nadra = await Nadra.find({ gender: "Female" });

  if (voters == null || voters == [] || voters == undefined) {
    return res
      .status(400)
      .json({ message: "no vote has been casted by females" });
  }

  if (nadra == null || nadra == [] || nadra == undefined) {
    return res
      .status(400)
      .json({ message: "there are no candidates in nadra" });
  }
  const female = new Array();
  for (var i = 0; i < voters.length; i++) {
    for (var j = 0; j < nadra.length; j++) {
      if (nadra[j].cnic == voters[i].cnic) {
        female.push(voters[i]);
      }
    }
  }

  return res.status(200).json({ message: female });
});

//gets all candidates by ballot their ballot id
//returns the list of candidates
router.get("/getcandidatebyballotid/:ballotid", async (req, res) => {
  const candidate = await Candidate.find({
    ballotId: req.params.ballotid,
  });
  console.log(candidate);
  res.json({ message: candidate });
});

module.exports = router;
