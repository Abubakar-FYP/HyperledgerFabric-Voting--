import React, { useEffect, useState } from 'react'
import DateTimePicker from 'react-datetime-picker';
import axios from "axios"
import { url } from "../../constants"
import { toast } from "react-toastify"
const ElectionCreation = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndtDate] = useState(new Date());
    const [createElection, setCreateElection] = useState(false)
    const [boolean, setBoolean] = useState(true)
    const [poolName, setPoolName] = useState("")
    const [poolNameList, setPoolNameList] = useState([])
    console.log(poolNameList)
    const [electionName, setElectionName] = useState("")
    const [elections, setElections] = useState([])
    const handleOnSubmit = async () => {
        const dataToSend = {
            electionName: electionName,
            startTime: new Date(startDate).getTime(),
            endTime: new Date(endDate).getTime(),
            electionType: boolean ? "country" : "poal",
            candidates: !boolean ? poolNameList : undefined
        }
        try {
            console.log("clicked", dataToSend)

            const { data } = await axios.post(url + "/create/election", dataToSend)
            console.log("res.data=======", data.election)
            if (data.election) {
                toast.success("Election is Created Successfully")
                setCreateElection(false)
                setBoolean(true)
                setPoolName("")
                setPoolNameList([])
                console.log("done")
                setElectionName("")
            }
        } catch (error) {
            console.log(error.message)
            toast.error(error.message)
        }

    }

    // console.log("pendingPartiespendingParties",pendingParties)
    // console.log("approvedPartiesapprovedParties",approvedParties)
    // console.log("start timeeee", startDate)
    // console.log("end Dateeee", endDate)
    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(url + "/get/election")
                console.log("data=============", data)
                setElections(data)
            } catch (error) {
                toast.error(error.message)
            }
        })();
    }, [])
    return (
        <div className="container ">

            <div className="d-flex justify-content-end">
                <button className={`btn ${!createElection ? "btn-secondary" : "btn-danger"}`}
                    onClick={() => setCreateElection(!createElection)}
                >
                    {createElection ? "Deny" : "Create"}

                </button>
            </div>
            <div className="card">
                <div className="card-header">Elections</div>
                <div className="card-body">
                    <div className="card mt-5">
                        <div className="card-header">
                            Active Elections
                        </div>
                        <div className="card-body">
                            <div className="row">
                                {elections?.map(el =>  
                                new Date(Number(el.startTime)) < Date.now() && 
                                new Date(Number(el.endTime)) > Date.now() ? (
                                    <div className="card bg-success text-light col-md-4">
                                        <div className="card-header">
                                            Election Type : {el.electionType}
                                        </div>
                                        <div className="card-body">
                                            <strong>Election Name</strong> : {el.electionName}
                                        </div>
                                    </div>
                                ): null
                                 )}

                            </div>
                        </div>
                    </div>
                    <div className="card mt-5">
                        <div className="card-header">
                            Previos Elections
                        </div>
                        <div className="card-body">
                        <div className="row">
                                {elections?.map(el =>  
                                Date.now() > new Date(Number(el.startTime))&& 
                               Date.now() > new Date(Number(el.endTime)) ? (
                                    <div className="card bg-danger text-light col-md-4">
                                        <div className="card-header">
                                            Election Type : {el.electionType}
                                        </div>
                                        <div className="card-body">
                                            <strong>Election Name</strong> : {el.electionName}
                                        </div>
                                    </div>
                                ): null
                                 )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`card mt-5 ${createElection ? "d-block" : "d-none"}`}>
                <div className="card-header">Election Data</div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="startTime">Start Time</label>
                                <DateTimePicker
                                    onChange={setStartDate}
                                    value={startDate}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="startTime">End Time</label>
                                <DateTimePicker
                                    onChange={setEndtDate}
                                    value={endDate}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="electionName">Election Name</label>
                                <input
                                    value={electionName}
                                    onChange={e => setElectionName(e.target.value)}
                                    type="text" id="electionName" className="form-control" placeholder="Election Name" />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <button
                                    onClick={() => setBoolean(true)}
                                    className={`btn btn-${boolean ? "primary" : "light"} mx-2`}>
                                    Country</button>
                                <button
                                    onClick={() => setBoolean(false)}
                                    className={`btn btn-${!boolean ? "primary" : "light"} active`}>
                                    Poal</button>
                            </div>

                        </div>
                        <div className={`my-5 ${!boolean ? "d-block" : "d-none"}`}>
                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-8">
                                        <input type="text"
                                            value={poolName}
                                            onChange={e => setPoolName(e.target.value)}
                                            className="form-control" />
                                    </div>
                                    <div className="col-md-4">
                                        <button
                                            onClick={() => {
                                                setPoolNameList([...poolNameList, poolName])
                                                setPoolName("")
                                            }}
                                            className="btn btn-primary pb-5">
                                            Pool Name  <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>

                            </div>

                            {poolNameList.length ?
                                <ul className="list-group">
                                    {poolNameList.map((val, index) => (
                                        <li
                                            key={index}
                                            className="list-group-item" value={val}>{val}</li>
                                    ))}

                                </ul> : null
                            }
                        </div>
                        <div className="d-flex justify-content-end">
                            <button
                                onClick={handleOnSubmit}
                                className="btn btn-secondary">
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ElectionCreation
