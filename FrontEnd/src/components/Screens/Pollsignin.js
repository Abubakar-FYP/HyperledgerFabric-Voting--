import React, {useEffect} from 'react';
import {useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';
import { useContext } from 'react';
import { UserContext } from '../../App';
import LoginPic from "../../assets/1.jpg";
import NavBar from '../Navbar';
import axios from "axios"
import { url } from "../../constants";
import {toast} from "react-toastify"
// import {OTPredirect} from './OTP';

const PollsSignin =(props)=>{
    const history = useHistory()
    const  [CNIC, setCNIC] = useState ("")
    const  [email, setEmail] = useState ("")
    const  [password , setPassword] = useState ("")
    useEffect(() => {
        const user = localStorage.getItem("userData")
        if(user){
            history.push("/")
        }
    }, [])

const handleSignin =async () =>{
    if(!email || !password){
        toast.error("Fill All Fields")
        return
    }
    try {
    const {data} = await axios.post(url + "/signin/poller" , {email , password});
    console.log("data==============>", data)
    if(data){
        localStorage.setItem("userData" , JSON.stringify(data))
        toast.success("You have signin Successfully")
        if(data?.poller?.role =="Poller"){
        history.push("/polls")
        }else{
        history.push("/")
        }
        setTimeout(() => {
        window.location.reload()

        }, 2000)

    }
    } catch (error) {
        console.log("eeror",error)
        console.log("eeeeerrrrrrrrrrrroooooooooooorrrrrrrrrrrrr=============",error.message)
        toast.error("Incorrect email or password")
    }

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
            <input type="text" id="email" placeholder="Email"
            value={email}
            onChange={(e)=> setEmail (e.target.value)}
            />

            <input type="password" id="cnic" placeholder="Password"
            value={password}
            onChange={(e)=> setPassword (e.target.value)}
            />

           <button className ="btn waves-effect waves-light" onClick={handleSignin}> 
           Next</button>
           <Link to="/polls/forgotpassword" className="my-3">Forgot Password?</Link>

            <h5>
            Don't have an Account? <Link to = '/polls/signup'>Click here</Link>
            </h5>
        </div>
       </div>
       </div>
    )

}

export default PollsSignin 