import React from 'react'

const Polls = () => {
    return (
        <div className="container">
            <div className="card">
                <div className="card-header">Polls</div>
                <div className="card-body">
                    <div className="card mt-5">
                        <div className="card-header">
                            Active Polls
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="card bg-warning text-light col-md-4">
                                    <div className="card-body">
                                        <strong>Election Name</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Polls
