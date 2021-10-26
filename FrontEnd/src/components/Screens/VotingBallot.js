import React, {useState, useEffect} from 'react'

const VotingBallot = () => {
    const [user, setUser] = useState(null)
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userDate"))
        if(userData){
            setUser(userData)
        }
    }, [])
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
                                        Lorem, ipsum dolor.
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <strong>Mobile : </strong>
                                    <span>
                                        789845521565848
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <strong>Address : </strong>
                                    <span>
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
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
                                <div className="mt-4">
                                    <strong>Group Name : </strong>
                                    <span>
                                        Lorem ipsum dolor sit amet
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <strong>Vote : </strong>
                                    <span>
                                        1
                                    </span>
                                </div>
                                <div className="mt-4">
                                   <button className="btn btn-success">Voted</button>
                                </div>
                                <hr />
                                <div className="mt-4">
                                    <strong>Group Name : </strong>
                                    <span>
                                        Lorem ipsum dolor sit amet
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <strong>Vote : </strong>
                                    <span>
                                        2
                                    </span>
                                </div>
                                <div className="mt-4">
                                   <button className="btn btn-success">Voted</button>
                                </div>
                                <hr />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VotingBallot
