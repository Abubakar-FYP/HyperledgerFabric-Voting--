import React, { useState, useEffect } from 'react'
import axios from "axios"
import { url } from "../../constants"
import { toast } from "react-toastify"
import {useHistory} from "react-router-dom"
const PendingParties = ({ match }) => {
    const history = useHistory("")
    const [user, setUser] = useState(null)
    const [selectedParty, setSelectedParty] = useState(null)
    const getPendingParties = async () => {
        const { data } = await axios.get(url + "/findparty" + `/${match.params.id}`)
        console.log("getpendingpartiesgetpendingpartiesgetpendingparties", data)
        setSelectedParty(data.message[0])

    }

    const callForApis = () => {
        getPendingParties()
    }
    useEffect(() => {
        callForApis()
        return () => {
            setSelectedParty(null)
        }
    }, [])

    const approveParty = async (id) => {
        const { data } = await axios.put(url + "/approveparty" + "/" + id)
        if (data.message) {
            toast.success(data.message)
            history.push("/partiesstatus")
        }
    }
    const rejectParty = async (id) => {
        const { data } = await axios.delete(url + "/rejectparty" + "/" + id)
        if (data.message) {
            toast.success(data.message)
            history.push("/partiesstatus")
        }
    }
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userData"))
        if (userData) {
            setUser(userData)
        }
    }, [])
    console.log("selected party ==============", selectedParty)
    return (
        <div className="container">
            {selectedParty && (
                <div className="card">
                    <div className="card-header">
                        {selectedParty?.partyName}
                    </div>
                    <div className="card-body">
                        <div className="h3">Candidates List</div>
                        <ul>
                            {selectedParty?.candidate.map(candidate => (
                                <li key={candidate._id} className="list-item row">
                                    <div className="col-4"><strong>CNIC:</strong> {candidate?.cnic}</div>
                                    <div className="col-4"><strong>Position:</strong> {candidate?.position}</div>
                                    <div className="col-4"><strong>Name:</strong> {candidate?.name}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button
                        onClick={() => approveParty(match.params.id)}
                        className="btn btn-primary">
                        Approve
                    </button>
                    <button
                        onClick={() => rejectParty(match.params.id)}
                        className="btn btn-danger">
                        Reject
                    </button>
                </div>
            )}
        </div>
    )
}

export default PendingParties
