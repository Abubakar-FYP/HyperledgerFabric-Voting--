import React from 'react'
import Pulses from '../../Pulses'

const AdminDashboard = () => {
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
                    <Pulses id="bolb1"/>
                    <Pulses id="bolb2"/>
                    <Pulses id="bolb3"/>
                    <Pulses id="bolb4"/>
                    <Pulses id="bolb5"/>
                    <Pulses id="bolb6"/>
                    <Pulses id="bolb7"/>
                    {/* <Pulses id="bolb8"/>
                    <Pulses id="bolb9"/>
                    <Pulses id="bolb10"/> */}
                    <img src='https://covid.gov.pk/v2/img/header-b.png' width="100%" />
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
