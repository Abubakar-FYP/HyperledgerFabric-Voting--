const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/sendEmail");
const requireLogin = require("../Middleware/requirelogin");
const { compareSync } = require("bcryptjs");
const Axios = require("axios");

require("../Models/nadra");
require("../Models/polls");
require("../Models/voter");
require("../Models/poller");

const Polls = mongoose.model("Polls");
const Voter = mongoose.model("Voter");
const Poller = mongoose.model("Poller");

/*

/createpoll , in Routes/polls.js , creates a poll runtime

/getvalidpolls , in Routes/polls.js , gets all valid polls, meaning that are in progress
/getinvalidpolls,in Routes/polls.js , gets all invalid polls meaning that thev'e finished
/getallpolls ,in Routes/polls.js , gets all poll

/startpoll , in Routes/polls.js, starts all the polls whose time has come
/stoppoll , in Routes/polls.js, stops all the polls whose time has come


//current work!!!!!!!!

/createpoll
/currentpolls
/previouspolls
/abouttostartpolls
/getallpolls
/getresultofallpolls
/votepoll/:p_id/:v_id  , p_id(pollId),v_id(voter_id)
/stoppoll
/startpoll 
*/

router.post("/createpoll", async (req, res) => {
  const { pollname, type, description, startTime, endTime, items } = req.body;

  if (!pollname || !type || !startTime || !endTime || !description || !items) {
    return res.status(400).json({ message: "one or more fields are empty" });
  }
  try {
    const pollers = await Poller.find({});

    if (endTime < startTime) {
      //if end time is < start time
      return res.status(400).json({
        message: "invalid time entered,end-time is less than start-time",
      });
    }

    console.log(Date.now(), startTime);
    console.log(Date.now() > startTime);

    if (Date.now() > startTime) {
      // if start time is < current time
      return res.status(400).json({
        message: "invalid time entered, start time is less than current time",
      });
    }

    let check1 = false; //check for poll name
    let check2 = false; //check for current poll
    let check3 = false; //check for about to start poll
    const polls = await Polls.find({});

    polls.map((poll) => {
      if (poll.pollname == pollname) check1 = true;
      if (
        Number(new Date()) >= Number(poll.startTime) &&
        Number(new Date()) <= Number(poll.endTime)
      )
        check2 = true;

      if (Number(new Date()) < Number(poll.startTime)) check3 = true;
    });

    if (check1 == true || check1)
      return res
        .status(400)
        .json({ message: "poll already present with this name" });

    if (check2 == true || check2)
      return res.status(400).json({
        message: "another poll is already running,cannot create a new poll",
      });

    if (check3 == true || check3)
      return res
        .status(400)
        .json({ message: "a poll is in que,connot create a new poll" });

    const newPol = new Polls({
      pollname: pollname,
      type: type,
      description: description,
      endTime: endTime,
      startTime: startTime,
      items: items,
    });

    /*  try {
      const emailsList = pollers.map((poller) => {
        return poller.email;
      });
      const emails = emailsList.join(",");
      //console.log("Emails==>", emails);
      console.log(startTime, endTime);
      //console.log("Emails==>", emails);
      console.log(`\n\n\n This email is about to notify you that a new poll is coming up at
      ${new Date(Number(startTime))} and is closing at ${new Date(endTime)}`);
      await sendEmail({
        email: emails,
        subject: "Poll Commence Email",
        message: `This email is about to notify you that a new poll is coming up at
         ${new Date(Number(startTime))} and is closing at ${new Date(endTime)}`,
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
 */
    await newPol
      .save()
      .then(() => {
        return res.status(200).json({ message: "poll saved successfully" });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
});
//those which are in progress

router.get("/currentpolls", async (req, res) => {
  try {
    const polls = await Polls.find({})
      .select("-valid -voters")
      .catch((err) => {
        console.log(err);
        return res
          .status(400)
          .json({ message: "there was an error finding polls" });
      });

    let currentPoll;
    let check1 = false; //checks if current poll is present
    polls.map((poll) => {
      console.log(
        Number(Date.now()),
        Number(poll.startTime),
        Number(Date.now()),
        Number(poll.endTime)
      );
      if (
        Number(Date.now()) >= Number(poll.startTime) &&
        Number(Date.now()) < Number(poll.endTime)
      ) {
        currentPoll = poll;
        check1 = true;
      }
    });

    if (!check1 || check1 == false) {
      return res.status(400).send("there is no current poll running");
    }

    res.json({ message: currentPoll });
  } catch (err) {
    console.log(err);
  }
});

//invalid marks as previous or not started
router.get("/previouspolls", async (req, res) => {
  try {
    const polls = await Polls.find({})
      .select("-voters -_id")
      .catch((err) => {
        console.log(err);
        return res
          .status(400)
          .json({ message: "there was an error finding polls" });
      });

    const previousPolls = new Array();
    polls.map((poll) => {
      if (Number(new Date()) >= Number(poll.endTime)) {
        previousPolls.push(poll);
      }
    });

    res.json(previousPolls);
  } catch (err) {
    console.log(err);
  }
});

router.get("/abouttostartpolls", async (req, res) => {
  try {
    const polls = await Polls.find({})
      .select("-voters -_id")
      .catch((err) => {
        console.log(err);
        return res
          .status(400)
          .json({ message: "there was an error finding polls" });
      });

    let check1 = false; //checks if there are no polls
    const upComingPolls = new Array();

    polls.map((poll) => {
      console.log(Number(new Date()), Number(poll.startTime));

      if (Number(new Date()) < Number(poll.startTime)) {
        upComingPolls.push(poll);
        check1 = true;
      }
    });

    if (check1 == false) {
      console.log("empty");
      return res
        .status(400)
        .json({ message: "there are no up-coming poll right now" });
    }

    res.json(upComingPolls);
  } catch (err) {
    console.log(err);
  }
});

//all started,yet to start and finished polls
router.get("/getallpolls", async (req, res) => {
  try {
    const polls = await Polls.find({})
      .populate("pollvote")
      .catch((err) => {
        console.log(err);
        return res
          .status(400)
          .json({ message: "there was an error finding polls" });
      });

    if (polls == null || !polls || polls == []) {
      return res.status(400).json({ message: "polls not found" });
    }

    res.status(200).json({ message: polls });
  } catch (err) {
    console.log(err);
  }
});

router.get("/getonepoll/:p_id", async (req, res) => {
  try {
    const poll = await Polls.findOne({ _id: req.params.p_id }).catch((err) => {
      console.log(err);
      return res
        .status(400)
        .json({ message: "there was an error finding polls" });
    });

    if (poll == null || !poll || poll == []) {
      return res.status(400).json({ message: "poll not found" });
    }

    poll.items.sort((a, b) => {
      return b?.item?.voteCount - a?.item?.voteCount;
    });

    res.json({ message: poll });
  } catch (err) {
    console.log(err);
  }
});

router.get("/getresultofallpolls", async (req, res) => {
  try {
    const polls = await Polls.find({}).catch((err) => {
      console.log(err);
      return res
        .status(400)
        .json({ message: "there was an error finding polls" });
    });

    if (polls == null || !polls || polls == []) {
      return res.status(400).json({ message: "polls not found" });
    }

    polls.map((poll) => {
      console.log(
        poll.items.sort((b, a) => a?.item?.voteCount - b?.item?.voteCount)
      );
    });

    res.json(polls);
  } catch (err) {
    console.log(err);
  }
  // find all polls from Polls model
  // count items vote count, and sort the item list
  // send it
});

//p_id is poll-id
//v_id is poller-id
//i_id is item-id
router.post("/votepoll/:p_id/:v_id/:i_id", async (req, res) => {
  //check if any poll exists or not in polls Model
  try {
    const poller = await Poller.findOne({ _id: req.params.v_id }).catch(
      (err) => {
        console.log(err);
        return res
          .status(400)
          .json({ message: "voter with the given id does not exist" });
      }
    );

    if (poller == null || !poller) {
      return res.status(400).json({ message: "poller does not exist" });
    }

    let check5; //check if already participated in the same poll

    poller?.pollvote?.map((poll) => {
      //  console.log("Poller-Poll-Id===>",typeof toString(poll),"Poll-Sent-Id",typeof req.params.p_id)
      if (toString(poll) == req.params.p_id) {
        check5 = true;
      }
    });

    if (check5 == true || check5)
      return res
        .status(400)
        .json({ message: "poller has already participated in this poll" });

    const poll = await Polls.findOne({ _id: req.params.p_id }) //finds poll
      .catch((err) => {
        console.log(err);
        return res.status(400).json({
          message: "there was an error finding the poll with that id",
        });
      });

    if (poll == null || !poll || poll == []) {
      return res.status(400).json({ message: "poll not found" });
    }

    let check4 = false;
    poll.voters.map((voter) => {
      if (voter == req.params.v_id) {
        check4 = true;
      }
    });

    if (check4 == true)
      return res
        .status(400)
        .json({ message: "voter has already voted in this poll" });

    if (poll == [] || !poll) {
      return res.status(400).json({ message: "there is no poll with this id" });
    } else {
      console.log(Date.now() >= Number(poll.startTime));
      console.log(Date.now(), Number(poll.endTime));
      console.log(Date.now() >= Number(poll.endTime));
      if (
        //checks if the poll entered is currently ongoing
        Date.now() >= Number(poll.startTime) &&
        Date.now() <= Number(poll.endTime)
      ) {
        let check = false;
        poll.voters.map((voter) => {
          if (voter == req.params.v_id) {
            check = true;
          }
        });
        if (check === true) {
          return res
            .status(400)
            .json({ message: "you have already voted in this poll" });
        }

        let check6 = false; //checks if item is present or not
        poll.voters.push(req.params.v_id); //pushes voter id,into poll
        let itemVoted = null;
        poll.items.map((item) => {
          console.log(item.item._id, req.params.i_id);
          if (item._id == req.params.i_id) {
            //increases vote count of item
            check6 = true;
            item.item.voteCount = item.item.voteCount + 1; //updates vote count of item
            poller.pollitem = item.item.name;
          }
        });

        if (!check6 || check6 == false) {
          return res
            .status(400)
            .json({ message: "item does not exist for this poll" });
        }

        poller.pollvote.push(req.params.p_id); //pushing poll id to the poller

        console.log(poller);
        console.log(poller?.pollvote);

        //API blockchain data save

        try {
          const url =
            "http://localhost:5000/channels/pev/chaincodes/transaction";
          const body = {
            func: "castPollVote",
            chaincodeName: "transaction",
            channelName: "pev",
            args: [poller.email, poller.pollitem, poll.pollname],
          };

          const pollResponse = await Axios.post(url, body, {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjM2MDAwMDAwMDE2NDgyMjczMDAsInVzZXJuYW1lIjoiYWJ1YmFrYXIiLCJvcmdOYW1lIjoiUEVWMSIsImlhdCI6MTY0ODIyNzU0NH0.gCO7q-E6LEw3PyDje_s7voQtSPfCLFZPD5DbFIKq7Lw",
            },
          });
          console.log("Hellp Poll Response here ------------->", pollResponse);
          if (pollResponse.status === 200) {
            console.log("I am here ----------------->");
            await poll
              .save()
              .then(() => {
                return res.json({ message: "voted successfully" });
              })
              .catch((err) => {
                console.log(err);
              });

            await poller.save().catch((err) => {
              console.log(err);
              return res
                .status(400)
                .json({ message: "couldnt save poll in poller" });
            });
          } else {
            res.status(500).json({
              msg: "Somthing went wrong on blockchain",
              status: false,
            });
          }
        } catch (error) {
          console.log("Error Displaying ------------>", error);
          return res.status(500).json({
            msg: error,
            status: false,
          });
        }

        try {
          console.log(
            `\n This email is about to notify you that the you have casted your vote in poll successfully`
          );
          await sendEmail({
            email: poller.email,
            subject: "Vote Successfully Casted in Poll",
            message: `This email is about to notify you that the you have casted your vote in poll successfully`,
          });
        } catch (error) {
          res.status(400).send(error.message);
        }
      } else {
        return res.status(400).json({ message: "There is no poll in session" });
      }
    }
  } catch (err) {
    console.log(err);
  }
  //if they do check poll id
  //store votes in poll model
  //increment in polls model, item.voteCount field
});

//Add to cron-job
router.put("/stoppoll", async (req, res) => {
  try {
    const polls = await Polls.find({}).catch((err) => {
      console.log(err);
    });

    if (!polls || polls === null || polls === []) {
      return res.status(400).json({ message: "There are no polls" });
    }

    const pollers = await Poller.find({});

    polls.map((poll) => {
      if (Number(new Date()) >= Number(poll.endTime) && poll.valid == true) {
        poll.valid = false;
        poll
          .save()
          .then((resp) => console.log(resp))
          .catch((err) => {
            console.log(err);
          });
      }
    });

    try {
      const emailsList = pollers.map((poller) => {
        return poller.email;
      });
      const emails = emailsList.join(",");
      //console.log("Emails==>", emails);
      console.log(startTime, endTime);
      //console.log("Emails==>", emails);
      console.log(
        `\n\n\n This email is about to notify you that the current poll has ended`
      );
      await sendEmail({
        email: emails,
        subject: "Poll Ended Email",
        message: `This email is about to notify you that the current poll has ended`,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  } catch (err) {
    console.log(err);
  }
});

router.put("/startpoll", async (req, res) => {
  try {
    const polls = await Polls.find({}).catch((err) => {
      console.log(err);
    });

    if (!polls || polls === null || polls === []) {
      return res.status(400).json({ message: "There are no polls" });
    }

    polls.map((poll) => {
      if (
        //checks if its a polls valid time
        Number(Date.now()) >= Number(poll.startTime) &&
        Number(Date.now()) <= Number(poll.endTime)
      ) {
        poll.valid = true;
        poll
          .save()
          .then((resp) => console.log(resp))
          .catch((err) => {
            console.log(err);
          });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
