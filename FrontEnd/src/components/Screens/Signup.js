// import { method } from 'bluebird';
import React from 'react';
import { useState } from 'react';
import {Link} from 'react-router-dom';
import M from 'materialize-css';
import { useHistory } from 'react-router';
import NavBar from '../Navbar';
import axios from "axios"
import {url} from "../../constants"
const Signup =()=>{
    const [password ,setPassword ] = useState ("")
    const [CNIC ,setCNIC ] = useState ("")

    const handleSignup = async()=>{
        if(!password, !CNIC){
            alert("enter password and cnic")
            return
        }
        // post data 
        const res = await fetch({
            url: "http://localhost:1970/signup",
            method: "post",
            data: {
                password: password , cnic: CNIC
            }
        })
        console.log("res" , res)
        // const res = await axios.post("/signup"  , {password: password , cnic: CNIC})
        // console.log("signup user", res)
    }

    return (
        <div className="mycard">
             <div className= "card Signup-card">
           <h1>Sign Up </h1>
            
            <input type="number" id="cnic" name="cnic" placeholder="CNIC" 
            value={CNIC}
            onChange={(e)=>setCNIC(e.target.value)}
           />
            <input type="password" id="cnic" name="cnic" placeholder="Password" 
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
           />

           <button className ="btn waves-effect waves-light" onClick={handleSignup}> 
           Signup</button>
            <h5>
            Already have an Account? <Link to = '/Signin'>Click here</Link>
            </h5>
        </div>
       </div>
    )
}

export default Signup 