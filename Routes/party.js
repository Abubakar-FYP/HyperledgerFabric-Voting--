const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const requireLogin = require("../Middleware/requirelogin");
const sendEmail = require("../utils/sendEmail");

//Registering Models
require("../Models/party");
require("../Models/criminal");
require("../Models/candidate");
require("../Models/nadra");
require("../Models/election");
require("../Models/ballot");

//Models
const Party = mongoose.model("Party");
const Candidate = mongoose.model("Candidate");
const Criminal = mongoose.model("Criminal");
const Nadra = mongoose.model("Nadra");
const Election = mongoose.model("Election");
const Ballot = mongoose.model("Ballot");

router.post("/createparty", async (req, res) => {
  const {
    partyName,
    partyImg,
    partySymbol,
    partyLeaderEmail,
    partyLeaderCnic,
    candidate,
  } = req.body;

  if (
    !partyName ||
    !partyImg ||
    !partyLeaderEmail ||
    !partyLeaderCnic ||
    !partySymbol ||
    !candidate
  ) {
    return res.status(400).json({ message: "one or more fields are empty" });
  }
  try {
    const elections = await Election.find({}).catch((err) => {
      console.log(err);
      return res
        .status(400)
        .json({ message: "there was an error finding elections" });
    });

    const nadra = await Nadra.find({})
      .lean()
      .catch((err) => {
        return res
          .status(400)
          .json({ message: "there was an error finding citizens" });
      });

    let ballots = await Ballot.find({}) //there can be candidates belonging to differnt ballots
      .catch((err) => {
        return res
          .status(400)
          .json({ message: "there was an error finding ballots" });
      });

    const candidates = await Candidate.find({})
      .select(
        "-position -partyId -voters -voteCount -is_criminal -_id -__v -ballotId -name"
      )
      .catch((err) => {
        return res
          .status(400)
          .json({ message: "there was an error finding candidates" });
      });

    const parties = await Party.find({}).catch((err) => {
      return res
        .status(400)
        .json({ message: "there was an error finding parties" });
    });

    let check5 = false;
    let check6 = false;
    nadra.map((citizen) => {
      if (Number(citizen.cnic) == Number(partyLeaderCnic)) {
        console.log("citizen exists");
        check5 = true;
      } //checks whether party leader exists in nadra
    });

    let users = new Map();
    var check13 = new Array();
    for (var i = 0; i < candidate.length; i++) {
      for (var j = 0; j < nadra.length; j++) {
        if (Number(candidate[i].cnic) == Number(nadra[j].cnic)) {
          console.log(Number(candidate[i].cnic), Number(nadra[j].cnic));
          users.set(nadra[j].cnic, nadra[j].name);
          check13.push(candidate[i].cnic);
          if (check13.length == candidate.length) {
            //checks if number of candidates found and
            //pushed into the array are equal or not
            check6 = true;
          }
        }
      }
    } //checks if candidates exist in nadra

    if (!check5 || check5 == false)
      return res.json({ message: "party leader does not exist in nadra" });

    if (!check6 || check6 == false) {
      console.log("candidates not good to go");
      return res.json({
        message:
          "one or more of the candidates does not exist in nadra, check their cnic",
      });
    }
    ////////////////////////good/////

    //check if candidate is a party leader of a party

    let check3 = false;
    let check4 = false;
    let check11 = false;
    let check12 = false;
    let check14 = false;

    parties.map((partys) => {
      //this is good
      if (partys.partyName == partyName) {
        check3 = true;
      } //checks wheather party name is already present

      if (partys.partyLeaderCnic == partyLeaderCnic) {
        check4 = true;
      } //checks wheather party leader has already registered a party

      if (partys.partyLeaderEmail == partyLeaderEmail) {
        check14 = true;
      } //checks if party leader email is already registered to another party leader

      partys.candidate.map((cand) => {
        if (Number(cand.cnic) == Number(partyLeaderCnic)) {
          check11 = true;
        } //if party leader is a candidate of a party

        candidate.map(async (candi) => {
          if (Number(candi.cnic) == Number(partys.partyLeaderCnic)) {
            console.log(partys);
            check12 = true;
          } //checks if any entered candidate is a party leader
        });
      });
    });

    if (check3 == true) {
      console.log("party with the same name already exists");
      return res
        .status(400)
        .json({ message: "Party with same name is Already Exists" });
    }

    if (check4 == true) {
      console.log("party leader already has a party");
      return res
        .status(400)
        .json({ message: "Party Leader has already registered a party" });
    }

    if (check14 == true) {
      console.log("Party Leader email is already being used");
      return res
        .status(400)
        .json({ message: "Party leader email is already in use" });
    }

    if (check11 == true) {
      console.log("party leader is candidate already");
      return res.status(400).json({
        message: "Party Leader already belongs as a candidate in a party",
      });
    }

    if (check12 == true) {
      console.log("candidate is already a party leader");
      return res
        .status(400)
        .json({ message: "One of the candidates is already a party leader" });
    }

    const newParty = new Party({
      partyName,
      partySymbol,
      partyImg,
      partyLeaderEmail,
      partyLeaderCnic,
    });

    //////////////////

    console.log("Election HIIIIIIII");
    let check8 = false; //current
    let check9 = false; //future
    let check10 = false; //if no upcoming
    let electionTime = null;
    const names = new Array();

    //checks for future elections and inserts parties in upcoming elections
    if (elections) {
      elections.map(async (election) => {
        console.log(election.startTime);
        console.log("election startTime===>", election.startTime);
        // this is good
        if (
          Date.now() >= Number(election.startTime) &&
          Date.now() <= Number(election.endTime)
        ) {
          check8 = true;
        } //checks for any running elections or a single election

        if (Date.now() < Number(election.startTime)) {
          check9 = true;
          newParty.participate.election.push(election._id);
          newParty.participate.inelection = true;
        } //checks for any elections that are about to start in future
        //console.log("new Date",Number(new Date),"end tIME",Number(election.endTime))

        if (Date.now() < Number(election.endTime)) {
          check10 = true;
          election.parties.push(newParty._id);
          //pushes party id into election
          candidate.map((cand) => {
            election.candidates.push(cand.cnic);
          });

          /* console.log("Update Election=====>", election);
           */
          await election.save().catch((err) => {
            res
              .status(400)
              .json({ message: "there was an error saving election" });
          });

          //similar to above condition
        }
      });

      if (check8 == true) {
        return res.status(400).json({
          message:
            "you cannot create a party when an election is currently running",
        });
      }

      if (check10 == false) {
        return res.status(400).json({
          message:
            "you cannot enter a party when there are no up-coming elections",
        });
      }
    }

    let check1 = false; //not good ?
    for (let i = 0; i < candidate.length; i++) {
      for (let j = 0; j < candidates.length; j++) {
        if (candidate[i].cnic == candidates[j].cnic) {
          check1 = true;
        }
      }
    } //checks if a candidate already exists in Candidate DB
    //even if one candidate is present, The party is rejected from creation
    if (check1) {
      return res.json({
        message:
          "Party cannot be registered due to candidate already registered",
      });
    }

    /*   console.log("hashMap--->", users); */
    let ballotList = [];
    candidate.map(async (item) => {
      //enter names
      //traversing candidates list

      const newCandidate = new Candidate({
        cnic: item.cnic,
        name: item.name,
        position: item.position,
        partyId: newParty._id,
        //search this in ballot to find its _id to insert
      });

      names.push(users.get(item.cnic));
      /* console.log("name==>", names); */

      newCandidate.name = users.get(item.cnic);

      const candidate_id = newCandidate._id;

      newParty.candidate.push(newCandidate._id);
      //candidates to the party are added here

      console.log("New Candidate=====>", newCandidate);

      ballots.map(async (ballot) => {
        //good
        console.log("item===>", item); //req candidate object

        if (ballot.ballotid == item.ballotid) {
          // console.log("matched===>");
          //its matching if all of the ballot ids matches the new candidates ballot id
          ballot.candidate.push(candidate_id);
          newCandidate.ballotId = ballot._id;
          console.log("Update Ballot====>", ballot);

          await newCandidate.save().catch((err) => {
            //candidate save
            console.log(err);
            res
              .status(400)
              .json({ message: "there was an error saving candidate" });
          }); //correct till here

          const oldBallot = await Ballot.findOne({ _id: ballot._id });
          oldBallot.set(ballot);
          const newBallot = oldBallot.getChanges();
          await Ballot.updateOne({ _id: ballot._id }, newBallot);
        }
      });
    }); //saving candidates in model and candidates in ballot one by one

    console.log("New Party=====>", newParty);
    await newParty.save().catch((err) => {
      //party save
      console.log(err);
      return res
        .status(400)
        .json({ message: "there was an error saving election" });
    });

    /* try {
      const namesList = names.join(" , ");
      console.log(
        `Your party ${partyName} has been approved for the coming election`
      );
      await sendEmail({
        email: partyLeaderEmail,
        subject: "Party Approval Response",
        message: `Your party ${partyName} has been approved for the coming election, these are the candidates \n ${namesList}`,
      });
    } catch (error) {
      console.log(error);
    } */
  } catch (err) {
    console.log(err);
  }

  res.status(200).json({ message: "Party has been registered" });
  //check ballot candidate issue
});

router.get("/getcriminal/:_id", async (req, res) => {
  await Criminal.findOne({ _id: _id }).exec((err, doc) => {
    if (!err) {
      res.status(200).json({ message: null });
    } else {
      res.status(400).json({ message: true });
    }
  });
});

router.get("/findparty/:_id", async (req, res) => {
  if (!req.params._id) {
    return res.status(400).json({ message: "field is empty" });
  }

  try {
    await Party.find({ _id: req.params._id }) //not returning candidate name
      .populate({
        path: "candidate",
        populate: {
          path: "ballotId",
        },
      })
      .exec((err, docs) => {
        if (!err) {
          return res.status(200).json({ message: docs });
        } else {
          return res.status(400).json({ message: err });
        }
      });
  } catch (err) {
    console.log(err);
  }
});

router.get("/getallpartyname", async (req, res) => {
  try {
    await Party.find({})
      .select("partyName")
      .exec((err, docs) => {
        if (!err) {
          res.json(docs);
        } else {
          console.log(err);
        }
      });
  } catch (err) {
    console.log(err);
  }
});

router.get("/getallparty", async (req, res) => {
  try {
    await Party.find({})
      .populate("candidate")
      .select("-partyImg")
      .exec((err, docs) => {
        if (!err) {
          res.json(docs);
        } else {
          console.log(err);
        }
      });
  } catch (err) {
    console.log(err);
  }
});

router.get("/checkcnic", async (req, res) => {
  const { cnic } = req.body;
  console.log("CNIC====>", req.body);
  const parties = await Party.find({})
    .populate("candidate")
    .select("-partyImg");

  let check = false;

  parties.map((party) => {
    party.candidate.map((candidate) => {
      console.log(candidate.cnic, cnic);
      if (candidate.cnic == cnic) {
        check = true;
      }
    });
  });

  if (check == true) {
    res.json("good");
  } else {
    res.json("not good");
  }
});

router.get("/getallcnic", async (req, res) => {
  const nadra = await Nadra.find({});
  nadra.map((citizen) => {
    console.log("citizen=====>", citizen.cnic);
  });
});

router.put("/put/updateparty/:p_id", async (req, res) => {
  const {
    partyName,
    partySymbol,
    partyImg,
    partyLeaderCnic,
    partyLeaderEmail,
    candidate,
  } = req.body;

  const party = await Party.findOne({ _id: req.params.p_id });

  party.partyName = partyName;
  party.partySymbol = partySymbol;
  party.partyImg = partyImg;
  party.partyLeaderCnic = partyLeaderCnic;
  party.partyLeaderEmail = partyLeaderEmail;
  party.candidate = null;
  candidate.map((cand) => {
    party.candidate.push(cand._id);
  });

  console.log(party);
});

router.delete("/delete/deleteparty/:p_id", async (req, res) => {
  const party = await Party.findOne({ _id: req.params.p_id });
  if (party == [] || !party || party == null || party == undefined) {
    return res.status(400).json({ message: "party does not exist" });
  }

  await Party.deleteOne({ _id: req.params.p_id }).then(() => {
    res.status(200).json({ message: "party has been successfully deleted" });
  });
});

module.exports = router;
