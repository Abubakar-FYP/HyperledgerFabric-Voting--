const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const sendEmail = require("../utils/sendEmail");
const requireLogin = require("../Middleware/requirelogin");
const Axios = require("axios");

require("../Models/voter");
require("../Models/ballot");
require("../Models/party");
require("../Models/candidate");
require("../Models/election");
require("../Models/nadra");

const Voter = mongoose.model("Voter");
const Ballot = mongoose.model("Ballot");
const Party = mongoose.model("Party");
const Candidate = mongoose.model("Candidate");
const Election = mongoose.model("Election");
const Campaign = mongoose.model("Campaign");
const Nadra = mongoose.model("Nadra");

router.post("/vote/:voter/:candidate", async (req, res) => {
  try {
    const elections = await Election.find({});

    let check1 = false; //check for running elections
    elections.map(async (election) => {
      //checks if there are current running elections

      console.log(Number(new Date()), election.startTime);
      console.log(Number(new Date()), election.endTime);
      if (
        Date.now() >= Number(election.startTime) &&
        Date.now() <= Number(election.endTime) &&
        election.valid == true
      ) {
        check1 = true;
        const voter = await Voter.findOne({
          _id: req.params.voter,
        }).catch((err) => console.log(err));

        if (!voter || voter == null) {
          return res.status(400).json({ message: "Voter does not exist" });
        }

        console.log(voter.voteflag);

        if (voter.voteflag == true) {
          //means that voter has already voted
          return res.json({ message: true });
        }

        console.log("Voter=====>", voter);

        const candidate = await Candidate.findOne({
          _id: req.params.candidate,
        }).catch((err) => console.log(err));

        if (!candidate || candidate == null) {
          return res.status(400).json({ message: "Candidate does not exist" });
        }

        const party = await Party.findOne({
          _id: candidate.partyId,
        });
        if (!party || party == null)
          return res.status(400).send("Party does not exist");
        console.log("party========", party);
        console.log("Candidate=====>", candidate, candidate.partyId);
        const ballot = await Ballot.findOne({ _id: candidate.ballotId });
        if (!ballot || ballot == null) {
          return res.status(400).json({ message: "Ballot does not exist" });
        }

        console.log("Ballot=====>", ballot);

        const campaign = await Campaign.findOne({ _id: ballot.campaignId });
        if (!campaign || campaign == null) {
          return res.status(400).json({ message: "Campaign does not exist" });
        }

        console.log("Campaign=====>", campaign);

        const newCount = campaign.voteCounts?.find(
          (part) => part?.partyName === party?.partyName
        );
        console.log("new count===========", newCount);
        if (newCount) {
          newCount.voteCount = newCount?.voteCount + 1;
        } else {
          let obj = {};
          obj.partyName = party.partyName;
          obj.voteCount = 1;

          campaign.voteCounts.push(obj);
        }

        party.voters.push(req.params.voter);
        party.voteCount = party.voteCount + 1;

        voter.voted = req.params.candidate;
        voter.voteflag = true;
        candidate.voteCount = candidate.voteCount + 1;
        candidate.voters.push(req.params.voter);

        const nadraVoter = await Nadra.findOne({
          cnic: req.params.voter,
        })
          .select("name")
          .catch((err) => {
            console.log(err);
            return res
              .status(400)
              .json({ message: "There was an error finding nadra voter" });
          });

        const nadraCandidate = await Nadra.findOne({
          cnic: req.params.candidate,
        })
          .select("name")
          .catch((err) => {
            console.log(err);
            return res
              .status(400)
              .json({ message: "There was an error finding nadra candidate" });
          });

        try {
          const url =
            "http://localhost:5000/channels/pev/chaincodes/transaction";
          const body = {
            func: "castElectionVote",
            chaincodeName: "transaction",
            channelName: "pev",
            args: [nadraVoter.name, nadraCandidate.name],
          };

          const voteResponse = await Axios.post(url, body, {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjM2MDAwMDAwMDE2NDgyMjczMDAsInVzZXJuYW1lIjoiYWJ1YmFrYXIiLCJvcmdOYW1lIjoiUEVWMSIsImlhdCI6MTY0ODIyNzU0NH0.gCO7q-E6LEw3PyDje_s7voQtSPfCLFZPD5DbFIKq7Lw",
            },
          });

          if (voteResponse.status === 200) {
            await voter.save().catch((err) => {
              console.log(err);
            });
            await campaign.save().catch((err) => {
              console.log(err);
            });
            await candidate.save().catch((err) => {
              console.log(err);
            });
            await party.save().catch((err) => {
              console.log(err);
            });
          } else {
            res.status(500).json({
              msg: "Somthing went wrong on blockchain",
              status: false,
            });
          }
        } catch (error) {
          return res.status(500).json({
            msg: error,
            status: false,
          });
        } 

        //API call blockchain save data

        await voter.save().catch((err) => {
          console.log(err);
        });
        await campaign.save().catch((err) => {
          console.log(err);
        });
        await candidate.save().catch((err) => {
          console.log(err);
        });
        await party.save().catch((err) => {
          console.log(err);
        });

        try {
          console.log(
            `\n This email is about to notify you that the you have casted your vote successfully`
          );
          await sendEmail({
            email: voter.email,
            subject: "Vote Successfully Casted",
            message: `This email is about to notify you that the you have casted your vote successfully`,
          });
        } catch (error) {
          console.log(error.message);
        }

        res.status(200).send({ message: "vote has been casted" });
      } //checks if there are current running elections
    });
    if (!check1 || check1 == false) {
      res.status(400).json({
        message: "you cannot vote becuase there are no elections running",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

//returns if a voter has voted or not
//good to go
router.get("/votestatus/:_id", async (req, res) => {
  if (!req.params._id) {
    res.status(400).json({ message: "field is empty" });
  }
  try {
    await Voter.findOne({ _id: req.params._id })
      .then((resp) => {
        if (resp == null) {
          return res.status(400).json({ message: "This id doest not exist" });
        }
        if (resp.voteflag == true) {
          res.status(200).json({ message: "you have already voted" });
        } else {
          res.status(200).json({ message: "you have not voted yet" });
        }
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
