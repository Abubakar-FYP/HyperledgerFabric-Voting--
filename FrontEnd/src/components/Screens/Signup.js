// import { method } from 'bluebird';
import React, {useEffect} from 'react';
import { useState } from 'react';
import {Link} from 'react-router-dom';
import axios from "axios"
import {url} from "../../constants"
import { toast } from 'react-toastify';
import {useHistory} from "react-router-dom"
const Signup =()=>{

    const [password ,setPassword ] = useState ("")
    const [CNIC ,setCNIC ] = useState ("")
    const [email ,setEmail ] = useState ("")
    const history = useHistory()
    useEffect(() => {
        const user = localStorage.getItem("userData")
        if(user){
            history.push("/")
        }
    }, [])
    const handleSignup = async()=>{
        if(!password || !CNIC || !email){
            alert("Please fill all fields")
            return
        }
        try {
            const res = await axios.post(url + "/signup"  , {password: password , cnic: CNIC, email: email})
            console.log("signup user", res.data)
            if(res){
                toast.success("You Have Successfully Signup")
            history.push("/signin")

            }    
        } catch (error) {
            console.log(error)
            toast.error("There is some error in signup, same email may be registered aalready")
        }
        
    }


    return (
        <div className="mycard">
             <div className= "card Signup-card">
           <h1>Sign Up </h1>

            <input type="number" id="cnic" name="cnic" placeholder="CNIC" 
            value={CNIC}
            onChange={(e)=>setCNIC(e.target.value)}
           />
           <input type="text" id="email" name="email" placeholder="Email" 
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
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