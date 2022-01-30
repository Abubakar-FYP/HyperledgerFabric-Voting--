import React from 'react';
import { useHistory } from 'react-router';
import {useState} from 'react';
import {Link} from 'react-router-dom';
import M from 'materialize-css';

const Signin =()=>{
    const  [CNIC, setCNIC] = useState ("")
    const  [MobileNumber , setMobilenumber] = useState ("")


const PostData =() =>{
    let history = useHistory
    fetch("/Signin",{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            CNIC:"",
            MobileNumber:""
        })
    })
    .then(res=>res.json())
    .then(data=>{
        if (data.error){
            M.toast({html: data.error,classes:"#c62828 red darken-3"})
            }
            else{
            M.toast({html: "Signed In Sucessfull ",classes:"#43a047 green darken-1"})
            history.push('/')    
        }
    }).catch(err =>{
        console.log(err)
    })
}
const router =()=>{
    let path = `FrontEnd\src\components\Screens\OTP.js`;
    let history = useHistory;
    history.push(path);
}

    return (
       <div className="mycard">
       <div className = "card auth-card">
           <h1>Sign in </h1>
            <input type="number" id="cnic" placeholder="CNIC"
            value={CNIC}
            onChange={(e)=> setCNIC (e.target.value)}
            />
            <input type="tel" id="phone" name="phone" placeholder="MobileNumber" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" 
             value={MobileNumber} 
            onChange={(e)=>setMobilenumber(e.target.value)} 
           />
           <button className ="btn waves-effect waves-light" onClick={router}> 
           Next</button>
        </div>
       </div>
    )
}

export default Signin 