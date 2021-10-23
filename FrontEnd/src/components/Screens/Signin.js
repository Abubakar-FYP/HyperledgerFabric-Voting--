import React from 'react';
import {useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';
import { useContext } from 'react';
import { UserContext } from '../../App';
import LoginPic from "../../assets/1.jpg";
import NavBar from '../Navbar';
import axios from "axios"
import { url } from "../../constants";

// import {OTPredirect} from './OTP';

const Signin =()=>{
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()
    const  [CNIC, setCNIC] = useState ("")
    const  [MobileNumber , setMobilenumber] = useState ("")


const PostData =async () =>{
    console.log("clicked")
try {
    if(CNIC){
        const data = await axios.post(url + "/signin" , {  headers:{
            "Content-Type":"application/json"
        }}, {cnic: CNIC})
        console.log("data from api =============" ,data)
    }
} catch (error) {
    console.log("error==================", error)
    
}
    //     localStorage.setItem("jwt", data.token)
    //     localStorage.setItem("user",JSON.stringify(data.user))
    //     dispatch({type:"USER",payload:data.user})
    // M.toast({html: "Signed In Sucessfull ",classes:"#43a047 green darken-1"})
}

const router =()=>{
    // history.push("/OTP");
}
<section className ="Signin">
<div className= "container mt-5">
    <div className= "Signin-content">

    </div>
</div>
</section>

    return (
        <div>
       <div className="mycard">
       <div className = "card auth-card">
           <h1>Sign in </h1>
            <input type="number" id="cnic" placeholder="CNIC"
            value={CNIC}
            onChange={(e)=> setCNIC (e.target.value)}
            />
            {/* <input type="tel" id="phone" name="phone" placeholder="MobileNumber" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" 
             value={MobileNumber} 
            onChange={(e)=>setMobilenumber(e.target.value)} 
           /> */}
           <button className ="btn waves-effect waves-light" onClick={PostData}> 
           Next</button>
            <h5>
            Don't have an Account? <Link to = '/Signup'>Click here</Link>
            </h5>
        </div>
       </div>
       </div>
    )

}

export default Signin 