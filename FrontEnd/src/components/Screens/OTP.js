import React from 'react';
const OTP =()=>{
    return (
       <div className="mycard">
       <div className = "card auth-card">
           
           <h1>Sign in </h1>
           <input type="number" id="OTP" name="OTP" placeholder="Enter the OTP"/>

           <button className ="btn waves-effect waves-light" >Next</button>

       </div>
       </div>
    )
}

export default OTP;