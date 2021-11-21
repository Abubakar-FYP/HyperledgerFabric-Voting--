import React, { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../../constants";
import { toast } from "react-toastify";
const Poll = ({ match }) => {
  const [onsePoll, setOnePoll] = useState(null);

  const getSinglePoll = async () => {
    try {
      const { data } = await axios.get(
        url + "/getonepoll" + `/${match.params.id}`
      );

      console.log("data from single polls", data);
      setOnePoll(data.message);
    } catch (error) {
      console.log("error from single polls", error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getSinglePoll();
  }, []);
  return (
    <div className="mx-5">
      <div className="row">
        <div className="col-md-6  col-12">
          <div className="card">
            <div className="card-header">Poll Data</div>
            <div className="card-body">
              <p className="align-left">
                <strong>Poal Name</strong>: {onsePoll?.pollname}
              </p>
              <p>
                <strong>Poal Type</strong>: {onsePoll?.type}
              </p>
              <p>
                <strong>Description</strong>: {onsePoll?.description}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6  col-12">
          <div className="card">
            <div className="card-header">Candidates</div>
            <div className="card-body">
                
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Poll;
