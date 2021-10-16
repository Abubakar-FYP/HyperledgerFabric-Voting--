const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const requireLogin = require("../middleware/requirelogin");

//Registering Models
require("../Models/party");
require("../Models/criminal");

//Models
const Party = mongoose.model("Party");
const Criminal = mongoose.model("Criminal");

//use findparty before running this to find that if there is not any other party than this party
//use the find candidate on front end before running this to make sure candidates are not duplicated
//collect all the data from different forms then make this request
router.post("/createparty", async (req, res) => {
  const {
    partyId,
    partyName,
    partyImg,
    partyLeaderName,
    partyLeaderCnic,
    partyLeaderPhoneNumber,
    partyLeaderGender,
    partyLeaderAge,
    partyLeaderReligion,
    partyLeaderAddress,
    candidate,
  } = req.body;

  if (
    !partyId ||
    !partyName ||
    !partyImg ||
    !partyLeaderName ||
    !partyLeaderCnic ||
    !partyLeaderPhoneNumber ||
    !partyLeaderGender ||
    !partyLeaderAge ||
    !partyLeaderReligion ||
    !partyLeaderAddress ||
    !candidate
  ) {
    return res.status(408).json({ message: "one or more fields are empty" });
  }

  let newParty = new Party({
    partyId,
    partyName,
    partyImg,
    partyLeaderName,
    partyLeaderCnic,
    partyLeaderPhoneNumber,
    partyLeaderGender,
    partyLeaderAge,
    partyLeaderReligion,
    partyLeaderAddress,
    candidate,
  });

  const _id = newParty._id;
  const updatedParty = newParty.candidate.map((item) => {
    item.partyId = _id;
    item.ballotid = null;
    return item;
  });

  newParty.candidate.splice(0, newParty.candidate.length, ...updatedParty);

  newParty
    .save()
    .then(res.status(200).json({ message: "a new party is created" }))
    .catch((err) => res.status(200).json({ message: err }));
});

//use this api on the front-end using axios, for one by one check during insertion
//front end check while inserting single candidate
//returns a list of objects,A candidate if found, or null
router.get("/findcandidate", async (req, res) => {
  const { cnic } = req.body;
  if (!cnic) {
    return res.status(400).json({ message: "field is empty" });
  }
  const found = await Party.findOne({ "candidate.cnic": cnic }).lean();
  if (found == null) {
    return res.status(400).json({ message: null });
  } else {
    const candidate = found.candidate
      .map((item) => {
        return item.cnic == cnic ? item : null;
      })
      .filter((item) => {
        return item !== null;
      });
    console.log(candidate);
    return res.status(200).json({ message: candidate });
  }
});

//returns string or null if not criminal
router.get("/getcriminal", async (req, res) => {
  const { cnic } = req.body;

  if (!cnic) {
    return res.status(400).json({ message: "field is empty" });
  }

  Criminal.findOne({ cnic })
    .then((resp) => {
      if (resp !== null) {
        return res.status(200).json({ message: "candidate is a criminal" });
      } else {
        return res.status(200).json({ message: null });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/findparty", async (req, res) => {
  const { partyId } = req.body;

  if (!partyId) {
    return res.status(400).json({ message: "field empty" });
  }

  const found = await Party.find({}).lean();

  if (!found) {
    return res.status(400).json({ message: null });
  }

  const findParty = found.find((party) => party.partyId == partyId);

  return res.status(200).json({ message: findParty });
});

router.delete("/deleteparty", async (req, res) => {
  const { partyId } = req.body;

  if (!partyId) {
    return res.status(400).json({ message: "field is empty" });
  }

  const found = await Party.findOne({ partyId });
  if (found !== null) {
    Party.findOneAndDelete({ partyId }, (resp) => {
      return res
        .status(200)
        .json({ message: `party has been successfully deleted` });
    }).catch((err) => {
      return res.status(403).json({ message: err });
    });
  } else {
    return res
      .status(400)
      .json({ message: "party with this party-id does not exist" });
  }
});

{
  /* 
//a substitute has been made in the createparty,to solve this problem
//dont use this
//inserts party id into candidate info,after
//for single and many candidates
router.put("/updatepartyid", async (req, res) => {
  const { partyId } = req.body;

  if (!partyId) {
    return res.status(400).json({ message: "field is empty" });
  }

  const found = await axios({
    url: "http://localhost:1970/findparty",
    method: "get",
    data: {
      partyId: partyId,
    },
  })
    .then(async (resp) => {
      if (resp.data["message"] == null) {
        return res
          .status(403)
          .json({ message: "party not present with this id" });
      } else {
        const _id = resp.data.message._id;

        const party = Party.findOne({ _id }).then((resp) => {
          for (var i = 0; i < resp.candidate.length; i++) {
            resp.candidate[i].partyId = _id;
          }
          resp.save();
        });
      }
    })
    .catch((err) => console.log(err));
});
 */
}

//this route will execute when a user is selected for a ballot
//a ballot id will be assigned to him
router.put(
  "/updatepartycandidateballot/:ballotid/:partyId",
  async (req, res) => {
    const { ballotid } = req.params.ballotid;
    if (!ballotid) {
      return res.status(400).json({ message: "field is empty" });
    }
    Party.findOne({ partyId })
      .exec((err, doc) => {
        doc.ballotid = ballotid;
        doc.save().catch((err) => console.log(err));
        res.status(200).json({ message: "candidate is given a ballotid" });
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

router.get("/getcandidateid/:candidateid", async (req, res) => {
  const { candidateid } = req.params;
  if (!candidateid) {
    res.status(400).json({ message: "field is empty" });
  }

  Party.findOne({ "candidate.candidateId": candidateid })
    .select("_id")
    .exec((err, doc) => {
      if (!err) {
        res.status(200).json({ message: doc });
      } else {
        res.status(400).json({ message: err });
      }
    });
});

//returns mpa and mna
//hard coded

router.get("/getpositions", async (req, res) => {
  const positions = { MPA: "MPA", MNA: "MNA" };
  return res.status(200).json({positions});
});

const removeNull = (array) => {
  return array.filter((item) => {
    item !== null;
  });
};

module.exports = router;
