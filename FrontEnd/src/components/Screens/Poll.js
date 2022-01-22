import React, { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../../constants";
import { toast } from "react-toastify";
import {useHistory} from "react-router-dom"
const Poll = ({ match }) => {
  const history = useHistory()
  const [onePoll, setOnePoll] = useState(null);
  const [isVoteCasted, setIsVoteCasted] = useState(false)
const [user, setUser] = useState(null)
  const getSinglePoll = async () => {
    try {
      const { data } = await axios.get(
        url + "/getonepoll" + `/${match.params.id}`
      );

      console.log("data from single polls", data);
      setOnePoll(data.message);
    } catch (error) {
      console.log("error from single polls", error.message);
      toast.error("There is some error for fetching a poll");
    }
  };

  useEffect(() => {
    getSinglePoll();
    const userData = JSON.parse(localStorage.getItem("userData"))
    if(userData){
      setUser(userData)
    }else{
      toast.error("Login First To Cast Vote")
      history.push("/")
    }
    
  }, []);
  useEffect(() => {

    console.log("cccdddddddddddddddddddddd", user)
    if(user?.poller){

      const isVoted = onePoll?.voters?.find(id => id === user.poller._id)
      console.log("isVoteeeeeeeeedddddddddddddddd", isVoted)
      if(isVoted){
        setIsVoteCasted(true)
      }else{
        setIsVoteCasted(false)
      }
    }
    
  }, [user, onePoll])
  const castAVote = async (canId) => {
    console.log("clickeddddddddddd", canId)

    try {
      const { data } = await axios.post(
        url + "/votepoll" + `/${match.params.id}` + `/${user?.poller?._id}` + `/${canId}`
      );

      console.log("data from vote casting", data);
      // setOnePoll(data.message);
      if(data.message){
        toast.success(data.message)
        setIsVoteCasted(true)
        setTimeout(() => {
          history.push("/polls")
        }, 3000)
      }
    } catch (error) {
      console.log("error from Vote Casting", error.message);
      toast.error("there is an error in vote casting");
    }
  }
  return (
    <div className="mx-5">
      <div className="row">
        <div className="col-md-6  col-12">
          <div className="card">
            <div className="card-header">Poll Data</div>
            <div className="card-body">
              <p className="align-left">
                <strong>Poal Name</strong>: {onePoll?.pollname}
              </p>
              <p>
                <strong>Poal Type</strong>: {onePoll?.type}
              </p>
              <p>
                <strong>Description</strong>: {onePoll?.description}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6  col-12">
          <div className="card">
            <div className="card-header">Candidates</div>
            <div className="card-body">
              <div className="">
              {onePoll?.items?.length && onePoll.items.map(item => (
                  <div key={item._id}>
                  <div className="mt-4">
                    <strong>Candidate Name :  </strong>
                    {item.item.name}
                  </div>
                  <div className="mt-4">
                    <button
                      disabled={isVoteCasted}
                      onClick={() => castAVote(item._id)}
                      className="btn btn-success">Vote</button>
                  </div>
                  <hr />
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Poll;
