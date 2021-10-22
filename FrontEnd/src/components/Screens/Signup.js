// import { method } from 'bluebird';
import React from 'react';
import { useState } from 'react';
import {Link} from 'react-router-dom';
import M from 'materialize-css';
import { useHistory } from 'react-router';
import NavBar from '../Navbar';

const Signup =()=>{
    const [Name ,setName ] = useState ("")
    const [CNIC ,setCNIC ] = useState ("")
    const [HouseNo , setHouseNo] = useState("")
    const [StreetNo, setStreetNo] = useState("")
    const [Age , setAge] = useState("")
    const [Gender , setGender] = useState("")
    const [Area, setArea] = useState("")
    const [Province,setprovince] = useState ("")
    const [Country , setCountry] = useState("")

    const PostData =()=>{
        let history = useHistory
        fetch("/Signup",{
        method:"post", 
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            CNIC:""
        })
        })
        .then(res=>res.json())
        .then(data=>{
            if (data.error){
            M.toast({html: data.error,classes:"#c62828 red darken-3"})
            }
            else{
            M.toast({html: data.message,classes:"#43a047 green darken-1"})
            history.push('/Signin')    
        }
        }).catch(err =>{
            console.log(err)
        })
    }

    return (
        <div className="mycard">
             <div className= "card Signup-card">
           <h1>Sign Up </h1>
            
            <input type="number" id="cnic" name="cnic" placeholder="CNIC" 
            value={CNIC}
            onChange={(e)=>setCNIC(e.target.value)}
           />

            
           <button className ="btn waves-effect waves-light" onClick={()=>PostData()}> 
           Signup</button>
            <h5>
            Already have an Account? <Link to = '/Signin'>Click here</Link>
            </h5>
        </div>
       </div>
    )
}

export default Signup 