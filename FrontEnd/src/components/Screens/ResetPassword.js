import React,{useState} from 'react'
import {toast} from "react-toastify"
import {url} from "../../constants"
import {useHistory} from "react-router-dom"
import axios from "axios"
const ResetPassword = ({match}) => {
    const history = useHistory()
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    console.log("token =============", match.params.token)
    const handleOnSubmit = async () => {
        if(!newPassword || !confirmPassword){
            toast.error("Some Fields are empty")
            return null;
        }

        if(newPassword !== confirmPassword){
            toast.error("Both Passwords Should be Same")
            return null;
        }

        try {
            const {data} = await axios.post(url + "/reset/password" , {newPassword: newPassword, confirmPassword: confirmPassword, token: match.params.token})
            console.log("data ============", data)
            if(data){
                toast.success(data)
                history.push("/signin")
            }
        } catch (error) {
            toast.error("There is some error in resetting password")
            
        }
    }
    return (
        <div className="container">
            <div className="form-group">
                <input value={newPassword} onChange={e => setNewPassword(e.target.value)} type="password" className="form-control" placeholder="New Password" />
                <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} type="password" className="form-control" placeholder="Confoirm Password" />
                <input type="submit" className="btn btn-secondary" value="Submit" onClick={handleOnSubmit}/>
            </div>
        </div>
    )
}

export default ResetPassword
