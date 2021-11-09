import React,{useState, useEffect} from 'react'
import axios from "axios"
import { url } from "../../constants"
import {Link} from "react-router-dom"
const PartiesStatus = () => {
    const [user, setUser] = useState(null)
    const [pendingParties, setPendingParties] = useState([])
    const [approvedParties, setApprovedParties] = useState([])
    const getPendingParties = async () => {
        const { data } = await axios.get(url + "/getpendingparties")
           console.log("getpendingpartiesgetpendingpartiesgetpendingparties", data)
        setPendingParties(data.message)
    }
    const getApprovedParties = async () => {
        const { data } = await axios.get(url + "/getapprovedparties")
        console.log("getapprovedpartiesgetapprovedpartiesgetapprovedparties", data)
        setApprovedParties(data.message)
    }
    const callForApis = () => {
        getPendingParties()
        getApprovedParties()
    }
    useEffect(() => {
        callForApis()
    }, [])

    useEffect(() => {
        const userData =JSON.parse( localStorage.getItem("userData"))
        if(userData){
            setUser(userData)
        }
    }, [])
    console.log("pending parties",pendingParties)
    console.log("User============",user)
    return (
        <div className="container">
            {user && user?.doc?.role === "admin" ? (
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
                                                    <Link to={`/pending-parties/${party._id}`}
                                                        // onClick={() => approveParty(party._id)}
                                                        className="btn btn-primary text-light">
                                                        View
                                                    </Link>
                                                   
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
            ) : null}
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
        </div>
    )
}

export default PartiesStatus
