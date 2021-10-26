import React , {useEffect, useState} from 'react'
import DatePicker from "react-datepicker"
import DateTimePicker from 'react-datetime-picker';
import axios from "axios"
import {url} from "../../constants"
import {toast} from "react-toastify"
const ElectionCreation = () => {
    const [startDate, setStartDate] = React.useState(new Date());
    const [endDate, setEndtDate] = React.useState(new Date());
    const [createElection, setCreateElection] = React.useState(false)
    const [boolean, setBoolean] = React.useState(true)
    const [poolName, setPoolName] = React.useState("")
    const [poolNameList, setPoolNameList] = React.useState([])
    console.log(poolNameList)
    const [electionName, setElectionName] = React.useState("")

    const [pendingParties, setPendingParties] = useState([])
    const [approvedParties, setApprovedParties] = useState([])
    const handleOnSubmit = () => {
        setCreateElection(false)
        setBoolean(true)
        setPoolName("")
        setPoolNameList([])
        console.log("done")
        setElectionName("")
    }
    const getPendingParties = async () => {
        const {data} = await axios.get(url + "/getpendingparties")
        //    console.log("getpendingpartiesgetpendingpartiesgetpendingparties", data)
           setPendingParties(data.message)
    }
    const getApprovedParties = async () => {
        const {data} = await axios.get(url + "/getapprovedparties")
        // console.log("getapprovedpartiesgetapprovedpartiesgetapprovedparties", data)
        setApprovedParties(data.message)
    }
    const callForApis = () => {
        getPendingParties()
        getApprovedParties()
    }
    useEffect(() => {
        callForApis()
    }, [])

    const approveParty = async (id) => {
        const {data} = await axios.put(url + "/approveparty" + "/" + id)
        if(data.message) {
            toast.success(data.message)
            callForApis()

        }
    }
    const rejectParty = async (id) => {
        const {data} = await axios.delete(url + "/rejectparty" + "/" + id)
        if(data.message) {
            toast.success(data.message)
        callForApis()

        }
    }
    console.log("pendingPartiespendingParties",pendingParties)
    console.log("approvedPartiesapprovedParties",approvedParties)
    return (
        <div className="container ">
            <div className="row">
                <div className="card">
                    <div className="card-header">
                        Pending Parties
                    </div>
                    <div className="card-body">
                        <ul>
                            {pendingParties?.map(party => (
                                <li key={party._id} className="list-group-item">
                                <div className="d-flex justify-content-between">
                                    <h6>Party Name : {party.partyName}</h6>
                                    <button 
                                    onClick={() => approveParty(party._id)}
                                    className="btn btn-primary">
                                        Approve
                                    </button>
                                    <button 
                                    onClick={() => rejectParty(party._id)}
                                    className="btn btn-danger">
                                        Reject
                                    </button>
                                </div>
                            </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="card">
                    <div className="card-header">
                        Approved Parties
                    </div>
                    <div className="card-body">
                        <ul>
                            {approvedParties.map(party => (
                                <li key={party._id} className="list-group-item">
                                <div className="d-flex justify-content-between">
                                    <h6>Party Name: {party.partyName}</h6>
                                    <button className="btn btn-success" disabled={true}>Approved </button>
                                </div>
                            </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
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

                        </div>
                    </div>
                    <div className="card mt-5">
                        <div className="card-header">
                            Previos Elections
                        </div>
                        <div className="card-body">

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
                                <label htmlFor="startTime">Start Date</label>
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
                                {poolNameList.map((val , index) => (
                                <li
                                key={index}
                                className="list-group-item" value={val}>{val}</li> 
                                ) )}
 
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
