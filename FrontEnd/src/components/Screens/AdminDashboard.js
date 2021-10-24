import React, { useState, useEffect } from 'react'
import Pulses from '../../Pulses'
import CountUp from 'react-countup';
import axios from "axios"
import { url } from "../../constants"
const AdminDashboard = () => {
    const [totalVotes, setTotalVotes] = useState("")
    const [compaigns, setCompaigns] = useState([])
    const [filteredCompaigns , setFilteredCompaigns] = useState(null)
    useEffect(() => {
        (async () => {
            const { data } = await axios.get(url + "/getcountvotedusers")
            // console.log(data)
            setTotalVotes(data.message)
        })();
        (async () => {
            const { data } = await axios.get(url + "/getcampaignwinner")
            // console.log(data)
            setCompaigns(data)
        })()
    }, [])
    useEffect(() => {
        const arr = [];
        if(compaigns.length){
            for(let a = 0; a<compaigns.length ; a++){
                const obj = {};
                obj.compaignName = compaigns[a].campaignName
                obj.candidates= compaigns[a].ballotId.map(can => can.candidate)
                obj.ballots= compaigns[a].ballotId.map(ballot => ballot)
                obj.ballotsLength = compaigns[a].ballotId.length
                arr.push(obj)
            }
        }
        console.log("arr", arr)
        setFilteredCompaigns(arr)
    }, [compaigns])
    console.log("compaigns===============", compaigns)
    console.log("filtered compaigns===============", filteredCompaigns)
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 col-12 pt-5">
                    <h6 className="text-success mt-5">
                        KNOW ABOUT ELECTION RESULTS
                    </h6>
                    <h4>
                        See the Realtime Pakistan Election Result
                    </h4>
                    <h1 className="">
                        Election Results Situation!
                    </h1>
                    <p>
                        All the following election votes data is been mapped through the blockchain which ensure a pure and transparent election, The votes results are real, with the following diverse data of Campaign, Ballot wise and party wise
                    </p>
                </div>
                <div className="col-md-6 col-12" id="pakFlag">
                    <Pulses id="bolb1" />
                    <Pulses id="bolb2" />
                    <Pulses id="bolb3" />
                    <Pulses id="bolb4" />
                    <Pulses id="bolb5" />
                    <Pulses id="bolb6" />
                    <Pulses id="bolb7" />
                    <img src='https://covid.gov.pk/v2/img/header-b.png' width="100%" />
                </div>
            </div>
            <div className="row">
                <h1 className="text-start">
                    Total Number of Vote Counted
                </h1>
                <div className="row">
                    <div className="col-12 col-md-3">
                        <div className="card text-white bg-success">
                            <div className="card-body">
                                <CountUp
                                    start={0}
                                    end={totalVotes}
                                    duration={1}
                                    separator=','
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className="row">
            {compaigns?.length && compaigns?.map(compaign => (
            <div key={compaign._id} className="col-12 col-md-3">
                <div className="card">
                    <div className="card-header">
                        {compaign.campaignName}
                    </div>
                    <div className="card-body">
                        Winner 
                        {/* {console.log("compaign.ballotId=========" , compaign.ballotId)}
                        {console.log("compaign.ballotId.candidate=========" , compaign.ballotId.map(can => can.candidate))} */}
                    </div>
                </div>
            </div>            
            ))}
            </div>
        </div>
    )
}

export default AdminDashboard
