import React, { useState, useEffect } from "react";
import Pulses from "../../Pulses";
import CountUp from "react-countup";
import axios from "axios";
import { url } from "../../constants";
import BarChart from "./charts/BarChart";
const AdminDashboard = () => {
  const [totalVotes, setTotalVotes] = useState("");
  const [ballotWinners, setBallotWinners] = useState([]);
  const [maleVoters, setMaleVoters] = useState("");
  const [feMaleVoters, setfeMaleVoters] = useState("");
  const [allPartyOverallVotes, setAllPartyOverAllVotes] = useState([]);
  const [overallPartyWinner, setOverAllPartyWinner] = useState({
    voteCount: 0,
    partyName: "",
  });
  const [campaignWiseWinners, setCampaignWiseWinners] = useState([]);
  useEffect(() => {
    (async () => {
      const { data } = (await axios.get(url + "/getcountvotedusers")) || 0;
      // console.log(data)
      setTotalVotes(data.message);
    })();
    (async () => {
      let { data } = await axios.get(url + "/getallballotwinner");
      console.log("get all ballot winners", data);
      setBallotWinners(data);
    })();
    (async () => {
      const { data } = await axios.get(url + "/getmalevoters");
      console.log("data Maleeeeeeeeeeeeeeeeeeeeeeeeeeee", data);
      setMaleVoters(data.message.length);
    })();
    (async () => {
      const { data } = await axios.get(url + "/getfemalevoters");
      console.log("data femaleeeeeeeeeeeeeeeeeee", data);
      setfeMaleVoters(data.message.length);
    })();

    (async () => {
      const { data } = await axios.get(url + "/getoverallpartywinner");
      console.log("overall party winner", data);
      setOverAllPartyWinner(data);
    })();
    (async () => {
      const { data } = await axios.get(url + "/getallpartyvotes");
      console.log("overall party winner", data);
      setAllPartyOverAllVotes(data.docs);
    })();
    (async () => {
      const { data } = await axios.get(url + "/electionresultdata");
      console.log("campaign wise winner", data);
      setCampaignWiseWinners(data.result);
    })();
  }, []);
  // console.log("male voters===============", maleVoters)
  // console.log("female voters===============", feMaleVoters)
  // console.log("Ballot Winners===============", ballotWinners)
  // console.log("All party overall votes===============", allPartyOverallVotes)
  console.log("campaignWiseWinners ===============", campaignWiseWinners);
  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-6 col-12 pt-5'>
          <h6 className='text-success mt-5'>KNOW ABOUT ELECTION RESULTS</h6>
          <h4>See the Realtime Pakistan Election Result</h4>
          <h1 className=''>Election Results Situation!</h1>
          <p>
            All the following election votes data is been mapped through the
            blockchain which ensure a pure and transparent election, The votes
            results are real, with the following diverse data of Campaign,
            Ballot wise and party wise
          </p>
        </div>
        <div className='col-md-6 col-12' id='pakFlag'>
          <Pulses id='bolb1' />
          <Pulses id='bolb2' />
          <Pulses id='bolb3' />
          <Pulses id='bolb4' />
          <Pulses id='bolb5' />
          <Pulses id='bolb6' />
          <Pulses id='bolb7' />
          <img src='https://covid.gov.pk/v2/img/header-b.png' width='100%' />
        </div>
      </div>
      <div className='row'>
        <div className='row'>
          <div className='col-12 col-md-3'>
            <div className='card text-white bg-success'>
              <div className='card-header'>Total Votes</div>
              <div className='card-body'>
                <CountUp
                  start={0}
                  end={totalVotes}
                  duration={1}
                  separator=','
                />
              </div>
            </div>
          </div>
          <div className='col-12 col-md-3'>
            <div className='card text-white bg-danger'>
              <div className='card-header'>
                Overall Winner Party is {overallPartyWinner?.partyName}{" "}
              </div>
              <div className='card-body'>
                <CountUp
                  start={0}
                  end={overallPartyWinner?.voteCount}
                  duration={1}
                  separator=','
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-12 col-md-3'>
          <div className='card text-white bg-success'>
            <div className='card-header'>Male Voters</div>
            <div className='card-body'>
              <div className='row'>
                <div className='col-4'>
                  <i className='fas fa-male fa-2x text-start'></i>
                </div>
                <div className='col-8'>
                  <CountUp
                    start={0}
                    end={maleVoters}
                    duration={1}
                    separator=','
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-12 col-md-3'>
          <div className='card text-white bg-warning'>
            <div className='card-header'>Female Voters</div>
            <div className='card-body'>
              <div className='row'>
                <div className='col-4'>
                  <i className='fas fa-male fa-2x text-start'></i>
                </div>
                <div className='col-8'>
                  <CountUp
                    start={0}
                    end={feMaleVoters}
                    duration={1}
                    separator=','
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h3 className='text-start'>List Of Total Votes Of All Parties</h3>
      <div className='row'>
        {allPartyOverallVotes.map((party, i) => (
          <div className='col-12 col-md-3'>
            <div
              className={`card text-white bg-${
                i % 2 !== 0 ? "warning" : "dark"
              }`}
            >
              <div className='card-header'>
                Total Votes of {party.partyName}
              </div>
              <div className='card-body'>
                <CountUp
                  start={0}
                  end={party.voteCount}
                  duration={1}
                  separator=','
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='row'>
        <div className='col-md-6 d-flex flex-column'>
          <h3 className='text-start'>Campaign Wise Winner Party</h3>
          {campaignWiseWinners.map((party, i) => (
            <div className=''>
              <div
                className={`card text-white bg-${
                  i % 2 !== 0 ? "warning" : "dark"
                }`}
              >
                <div className='card-header'>
                  Total Votes {party.campaignName}
                </div>
                <div className='card-body'>
                  <span className=' mx-3'>
                    {party.voteCounts[0]?.partyName || " "}
                  </span>
                  <CountUp
                    start={0}
                    end={party.voteCounts[0]?.voteCount || 0}
                    duration={1}
                    separator=','
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className='col-md-6 d-flex flex-column'>
          <h3 className='text-start'>Campaign Wise Votes Status</h3>

          {campaignWiseWinners.map((party, i) => (
            <div className=''>
              <div
                className={`card text-white bg-${
                  i % 2 !== 0 ? "warning" : "dark"
                }`}
              >
                <div className='card-header'>
                  Total Votes {party.campaignName}
                </div>
                <div className='card-body'>
                  {party.voteCounts.map((cam, i) => {
                    return (
                      <div key={i}>
                        <span className=' mx-3'>{cam?.partyName}</span>
                        <CountUp
                          start={0}
                          end={cam?.voteCount || 0}
                          duration={1}
                          separator=','
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <h1 className='h3 text-start'>Single Ballot Winners</h1>
      <div className='row'>
        <div className='col-12'>
          <div className='table-responsive' style={{ maxHeight: "300px" }}>
            <table className='table table-striped'>
              <thead>
                <tr>
                  <th scope='col'>ballot Id</th>
                  <th scope='col'>Party</th>
                  <th scope='col'>Candidate</th>
                  <th scope='col'>Votes</th>
                </tr>
              </thead>
              <tbody>
                {ballotWinners.length &&
                  ballotWinners.map((ballot) => (
                    <tr key={ballot._id}>
                      <th scope='row'>{ballot?.ballotid}</th>
                      <td>
                        {ballot.candidate[0]?.partyId?.partyName || "Unknown"}
                      </td>
                      <td>{ballot.candidate[0]?.name || "Unknown"}</td>
                      <td>{ballot.candidate[0]?.voteCount || "0"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {maleVoters &&
        feMaleVoters &&
        allPartyOverallVotes.length &&
        ballotWinners?.length && (
          <BarChart
            mVotes={maleVoters}
            fVotes={feMaleVoters}
            allPartyOverallVotes={allPartyOverallVotes}
            ballotWinners={ballotWinners}
          />
        )}
    </div>
  );
};

export default AdminDashboard;
