// import { method } from 'bluebird';
import React, {useEffect} from 'react';
import { useState } from 'react';
import {Link} from 'react-router-dom';
import axios from "axios"
import {url} from "../../constants"
import { toast } from 'react-toastify';
import {useHistory} from "react-router-dom"
const PollsRegisteration =()=>{

    const [password ,setPassword ] = useState ("")
    const [email ,setEmail ] = useState ("")
    const history = useHistory()
    useEffect(() => {
        const user = localStorage.getItem("userData")
        if(user){
            history.push("/")
        }
    }, [])
    const handleSignup = async()=>{
        if(!password || !email){
            alert("Please fill all fields")
            return
        }
        try {
        console.log("clicked", password, email)

            const res = await axios.post(url + "/signup/poller"  , {password: password , email: email})
            console.log("signup user", res.data)
            if(res){
                toast.success("You Have Successfully Signup")
            history.push("/polls/signin")

            }    
        } catch (error) {
            console.log(error)
            toast.error("There is some error in signup, email is registered already")
        }
        
    }


    return (
        <div className="mycard">
             <div className= "card Signup-card">
           <h1>Sign Up </h1>
           <input type="text" id="email" name="email" placeholder="Email" 
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
           />
            <input type="password" id="password" name="password" placeholder="Password" 
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
           />

           <button className ="btn waves-effect waves-light" onClick={handleSignup}> 
           Signup</button>
            <h5>
            Already have an Account? <Link to = '/polls/signin'>Click here</Link>
            </h5>
        </div>
       </div>
    )
}

export default PollsRegisteration 