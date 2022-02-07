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

const Signin =(props)=>{
    const history = useHistory()
    const  [CNIC, setCNIC] = useState ("")
    const  [password , setPassword] = useState ("")
    useEffect(() => {
        const user = localStorage.getItem("userData")
        if(user){
            history.push("/")
        }
    }, [])

const handleSignin =async () =>{
    if(!CNIC || !password){
        toast.error("Fill All Fields")
        return
    }
    try {
    const {data} = await axios.post(url + "/signin" , {cnic: CNIC , password: password});
    console.log("data==============>", data)
    if(data){
        localStorage.setItem("userData" , JSON.stringify(data))
        toast.success("You have signin Successfully")
        if(data?.doc?.role =="Voter"){
        history.push("/votingballot")
        }else{
        history.push("/")
        }
        setTimeout(() => {
        window.location.reload()

        }, 2000)

    }
    } catch (error) {
        console.log(error.status)
        console.log(error.message)
        toast.error("Incorrect CNIC or Password")
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
            <input type="number" id="cnic" placeholder="CNIC"
            value={CNIC}
            onChange={(e)=> setCNIC (e.target.value)}
            />

            <input type="password" id="cnic" placeholder="Password"
            value={password}
            onChange={(e)=> setPassword (e.target.value)}
            />

           <button className ="btn waves-effect waves-light" onClick={handleSignin}> 
           Next</button>
           <Link to="/forgotpassword" className="my-3">Forgot Password?</Link>

            <h5>
            Don't have an Account? <Link to = '/Signup'>Click here</Link>
            </h5>
        </div>
       </div>
       </div>
    )

}

export default Signin 