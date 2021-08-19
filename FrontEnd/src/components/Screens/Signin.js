import React from 'react';
import { useHistory } from 'react-router';
import {Link} from 'react-router-dom';

/* 
const Signin()=>{
    const 
} */


const router =()=>{
    let path = `FrontEnd\src\components\Screens\OTP.js`
    let history = useHistory;
    history.push(path);
}

const Signin = () =>{
    return (
       <div className="mycard">
       <div className = "card auth-card">
           <h1>Sign in </h1>
            <input type="number" id="cnic" placeholder="CNIC"/>
            
            <input type="tel" id="phone" name="phone" placeholder="Mobile Number" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" 
            /* value={MobileNumber} *//* 
            onChange={(e)=>setMobilenumber(e.target.value)} */
           />
           <button className ="btn waves-effect waves-light" onClick={router}> 
           Next</button>
            <h5>
            Don't have an Account? <Link to = '/Signup'>Click here</Link>
            </h5>
        </div>
       </div>
    )
}

export default Signin 