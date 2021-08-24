// import { method } from 'bluebird';
import React from 'react';
import { useState } from 'react';
import {Link} from 'react-router-dom';
import M from 'materialize-css';
import { useHistory } from 'react-router';

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
            Name:"",
            CNIC:"",
            HouseNo:"",
            StreetNo:"",
            Age:"",
            Gender:"",
            Area:"",
            Province:"",
            Country:""})
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
            <input type="text" id="name" name="NaMe" placeholder="Name" 
            value={Name}
            onChange={(e)=>setName(e.target.value)}
           />
            <input type="number" id="cnic" name="cnic" placeholder="CNIC" 
            value={CNIC}
            onChange={(e)=>setCNIC(e.target.value)}
           />

            <input type="number" id="age" name="age" placeholder="Age"
            value={Age}
            onChange={(e)=>setAge(e.target.value)}
           />

            
            <input type="text" id="gender" name="gender" placeholder="Gender"
            value={Gender}
            onChange={(e)=>setGender(e.target.value)}
           />
{/* 
            <select id="Gender" name="Gender">
            <option value="Male">Male</option>
             <option value="Female">Female</option>
             </select>
            <input type="submit" id="gender" name="gender" placeholder ="Gender"
            value={Gender}
            onChange={(e)=>setGender(e.target.value)}
           /> */}

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