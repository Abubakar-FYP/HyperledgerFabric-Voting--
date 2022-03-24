import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { url } from "../../constants";
import axios from "axios";
import {Link} from "react-router-dom"
const Polls = () => {
  const [activePolls, setActivePolls] = useState(null);
  const [endedPolls, setEndedPolls] = useState(null);
  const [allPolls, setAllPolls] = useState(null);
  const [pollsInQue, setPollsInQue] = useState(null)
  const getActivePolls = async () => {
    try {
      const { data } = await axios.get(url + "/currentpolls");

      console.log("data from active polls", data.message);
      setActivePolls(data.message);
    } catch (error) {
      console.log("error from active polls", error.message);
      // toast.error("No current Active Polls are available");
    }
  };
  const getQuePolls = async () => {
    try {
      const { data } = await axios.get(url + "/abouttostartpolls");

      console.log("data from Que polls", data);
      setPollsInQue(data);
    } catch (error) {
      console.log("error from Que polls", error.message);
      // toast.error("No current Active Polls are available");
    }
  };
  const getEndedPolls = async () => {
    try {
      const { data } = await axios.get(url + "/previouspolls");

      console.log("data from ended polls", data);
      setEndedPolls(data);
    } catch (error) {
      console.log("error from ended polls", error.message);
      // toast.error("there is an error in getting previous polls");
    }
  };
  const getAllPolls = async () => {
    try {
      const { data } = await axios.get(url + "/getallpolls");

      console.log("data from all polls", data.message);
      setAllPolls(data.message);
    } catch (error) {
      console.log("error from all polls", error.message);
      // toast.error("there is an error in getting all polls");
    }
  };

  useEffect(() => {
    getActivePolls();
    getAllPolls();
    getEndedPolls();
    getQuePolls()
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      getActivePolls();
    getQuePolls()

    }, 60000)
    return () => {
      clearInterval(interval)
    }
  },[])
  return (
    <div className="container">
      <div className="card">
        <div className="card-header">Polls</div>
        <div className="card-body">
        <div className="card mt-5">
            <div className="card-header">Polls About to start</div>
            <div className="card-body">
              <div className="row">
                {pollsInQue?.length &&
                  pollsInQue.map((poll) => (
                    <div className="card bg-warning text-light col-md-3">
                      <div className="card-body">
                        <p>
                          <strong>Poal Name</strong>: {poll.pollname}
                        </p>
                        <p>
                          <strong>Poal Type</strong>: {poll.type}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="card mt-5">
            <div className="card-header">Active Polls</div>
            <div className="card-body">
              <div className="row">
                {activePolls &&
                    <Link to={`/poll/${activePolls?._id}`} style={{textDecoration: "none"}} className="card bg-warning text-light col-md-3">
                      <div className="card-body">
                        <p>
                          <strong>Poal Name</strong>: {activePolls?.pollname}
                        </p>
                        <p>
                          <strong>Poal Type</strong>: {activePolls?.type}
                        </p>
                      </div>
                    </Link>
                  }
              </div>
            </div>
          </div>
          <div className="card mt-5">
            <div className="card-header">Ended Polls</div>
            <div className="card-body">
              <div className="row">
                {endedPolls?.length &&
                  endedPolls.map((poll) => (
                    <div className="card bg-warning text-light col-md-3">
                      <div className="card-body">
                        <p>
                          <strong>Poal Name</strong>: {poll.pollname}
                        </p>
                        <p>
                          <strong>Poal Type</strong>: {poll.type}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="card mt-5">
            <div className="card-header">All Polls</div>
            <div className="card-body">
              <div className="row">
                {console.log("allPollsallPollsallPollsallPolls", allPolls)}
                {allPolls?.length &&
                  allPolls.map((poll) => (
                    <Link to={`/poll/result/${poll?._id}`} style={{textDecoration: "none"}} className="card bg-warning text-light col-md-3">
                      <div className="card-body">
                        <p>
                          <strong>Poal Name</strong>: {poll.pollname}
                        </p>
                        <p>
                          <strong>Poal Type</strong>: {poll.type}
                        </p>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Polls;
