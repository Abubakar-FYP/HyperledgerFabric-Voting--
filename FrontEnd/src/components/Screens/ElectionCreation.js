import React from 'react'
import DatePicker from "react-datepicker"
import DateTimePicker from 'react-datetime-picker';

const ElectionCreation = () => {
    const [startDate, setStartDate] = React.useState(new Date());
    const [endDate, setEndtDate] = React.useState(new Date());
    const [createElection, setCreateElection] = React.useState(false)
    const [boolean, setBoolean] = React.useState(true)
    const [poolName, setPoolName] = React.useState("")
    const [poolNameList, setPoolNameList] = React.useState([])
    console.log(poolNameList)
    const [electionName, setElectionName] = React.useState("")

    const handleOnSubmit = () => {
        setCreateElection(false)
        setBoolean(true)
        setPoolName("")
        setPoolNameList([])
        console.log("done")
        setElectionName("")
    }
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
                            Election 2020
                        </div>
                        <div className="card-body">

                        </div>
                    </div>
                    <div className="card mt-5">
                        <div className="card-header">
                            Election 2019
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
