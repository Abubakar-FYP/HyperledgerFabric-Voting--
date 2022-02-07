import React, { useState, useEffect } from 'react'
import axios from "axios"
import { url } from "../../constants"
import {toast} from "react-toastify"
import {useHistory} from "react-router-dom"
const VotingBallot = () => {
    const history = useHistory()
    const [user, setUser] = useState(null)
    const [ballots, setBallots] = useState(null)
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userData"))
console.log("user data=========", userData)
        if (userData) {
            setUser(userData)
        }else{
            history.push("/")
        }
    }, [])
    useEffect(() => {
        if (user?.doc?.ballotId) {
            (async () => {
                try {
                    const { data } = await axios.get(url + "/findballot" + "/" + user?.doc?.ballotId)
                    console.log("users ballots=============", data)
                    console.log("user ballot id=============>",user)
                    setBallots(data?.ballot?.candidate)
    
                } catch (error) {
                    toast.error("There is some error in getting ballot")
                }
           
            })();
        }

    }, [user])
    console.log("user in local state", user)

    const castAVote = async (id) => {
        try {
        console.log("clicked=", url + `/vote/${user?.doc?._id}/${id}`)
        const {data} = await axios.post(url + `/vote/${user?.doc?._id}/${id}`)
        console.log("casting vote response ==============", data)  
        toast.success(data.message) 
        setTimeout(async () => {
            const userData = JSON.parse(localStorage.getItem("userData"))
            if(userData){
              console.log("userData============", userData)
              const {data} = await axios.post(url + "/profile" , {cnic: userData?.user?.cnic})
              console.log("dataaaaa=aaaaaaaa======",data)
              setUser(data)
              localStorage.setItem("userData" , JSON.stringify(data))
            }
        }, 2000);
      
        } catch (error) {
            console.log("errror===========", error.message)
        }
    }
    return (
        <div className="container text-start">
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <div className="">
                                <div className="text-center">
                                    <i className="fas fa-user-tie fa-7x"></i>
                                </div>
                                <div className="mt-4">
                                    <strong>Name : </strong>
                                    <span>
                                        {user?.user?.name}
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <strong>Mobile : </strong>
                                    <span>
                                        {user?.user?.phone}
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <strong>Address : </strong>
                                    <span>
                                        {user?.user?.area}
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <strong>Status : </strong>
                                    <span className={`text-${user?.doc?.voteflag ? "success" : "danger"}`}>
                                        {user?.doc?.voteflag ? "Voted" : "Not Voted"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <div className="">
                                {typeof ballots === "object" && ballots?.length ? ballots?.map(ballot => (
                                    <div>
                                        <div className="mt-4">
                                            <strong>Candidate Name :  </strong>
                                            {ballot.name}
                                        </div>
                                        <div className="mt-4">
                                            <strong>Position :  </strong>
                                            {ballot.position}
                                        </div>
                                        <div className="mt-4">
                                            <button 
                                            disabled={user?.doc?.voteflag}
                                            onClick={() => castAVote(ballot._id)}
                                            className="btn btn-success">Vote</button>
                                        </div>
                                        <hr />
                                    </div>
                                )):
                                <div className='card'>
                                    <div className='card-body'>
                                        There is no election active right now
                                    </div>
                                </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VotingBallot
