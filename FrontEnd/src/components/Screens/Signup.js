// import { method } from 'bluebird';
import React from 'react';
import { useState } from 'react';
import {Link} from 'react-router-dom';
import M from 'materialize-css';
const Signup =()=>{
    const [FirstName ,setFirstName ] = useState ("")
    const [LastName ,setLastname ] = useState ("")
    const [CNIC ,setCnic ] = useState ("")
    const [phone, setPhone] = useState("")
    const [HouseNo , setHouseNo] = useState("")
    const [StreetNo, setStreetNo] = useState("")
    const [Area, setArea] = useState("")
    const [Province,setprovince] = useState ("")
    const [Country , setCountry] = useState("")

    const PostData =()=>{
        fetch("/signup",{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            FirstName:"",
            LastName:"",
            CNIC:"",
            phone:"",
            HouseNo:"",
            StreetNo:"",
            Area:"",
            Province:"",
            Country:""})
        }).then(res=>res.json())
        .then(data=>{
            if (data.error){
            M.toast({html: 'data.error'})
            }
        })
    }

    return (
        <div className="mycard">
       <div className= "card Signup-card">
           <h1>Sign Up </h1>
            <input type="text" id="fname" name="fname" placeholder="FirstName" 
            value={FirstName}
            onChange={(e)=>setFirstName(e.target.value)}
           />
            <input type="text" id="lname" name="lname" placeholder="LastName" 
            value={LastName}
            onChange={(e)=>setLastname(e.target.value)}
           />
            <input type="text" inputMode="numeric" id="cNIC" name="cNIC" placeholder="CNIC" 
            value={CNIC}
            onChange={(e)=>setCnic(e.target.value)}
           />
            <input type="tel" id="phone" name="phone" placeholder="Mobile Number" 
            value={phone}
            onChange={(e)=>setPhone(e.target.value)}
           />
           <input type= "text" inputMode="numeric" id= "hNO" name="hNo" placeholder="HouseNo"
           value={HouseNo}
           onChange={(e)=>setHouseNo(e.target.value)}
           />
           <input type= "text" inputMode="numeric" id= "SNO" name="SNo" placeholder="StreetNo"
           value={StreetNo}
           onChange={(e)=>setStreetNo(e.target.value)}
           />
           <input type= "text" id= "area" name="area" placeholder="Area"
           value={Area}
           onChange={(e)=>setArea(e.target.value)}
           />
           <input type="text" id="province" name="province" placeholder="Province"
           value={Province}
           onChange={(e)=>setprovince(e.target.value)}
           />
            <input type="text" id="country" name="country" placeholder="Country"
            value={Country}
            onChange={(e)=>setCountry(e.target.value)}
           />
           <button class ="btn waves-effect waves-light" onClick={()=>PostData()}> 
           Signup</button>
            <h5>
            Already have an Account? <Link to = '/Signin'>Click here</Link>
            </h5>
        </div>
       </div>
    )
}

export default Signup 