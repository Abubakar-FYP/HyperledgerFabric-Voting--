import React, {useState} from 'react'
import {url} from "../../constants"
import axios from "axios"
import {toast} from "react-toastify"
const ForgotPassword = () => {
    const [email,setEmail] = useState("")
    const handleOnSubmit = async () => {
        if(!email) return null;

        try {
            const {data } = await axios.post(url + "/get/reset/password/token" , {email: email})
            console.log("data =================", data)
            if(data){
                toast.success(data)
            }
        } catch (error) {
            console.log("error message============", error.message)
            toast.error("There is some error in sending Reset Password Token")
        }
    }
    return (
        <div className="container">
            <div className="form-group">
                <label htmlFor="email">Enter Valid Email Address</label>
            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="form-control" placeholder="email"/>
            <button type="submit" onClick={handleOnSubmit} className="btn btn-secondary">Submit</button>
            </div>
        </div>
    )
}

export default ForgotPassword
