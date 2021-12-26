import React, {useState, useEffect} from 'react'
import { url } from "../../constants";
import {toast} from "react-toastify"
import axios from "axios"
const PollResult = ({match}) => {
    const [onePoll, setOnePoll] = useState(null)

    const getSinglePoll = async () => {
        try {
          const { data } = await axios.get(
            url + "/getonepoll" + `/${match.params.id}`
          );
    
          console.log("data from single polls", data);
          setOnePoll(data.message);
        } catch (error) {
          console.log("error from single polls", error.message);
          toast.error(error.message);
        }
      };
      useEffect(() => {
          getSinglePoll()
      }, [])
    return (
        <div className='display-4 mt-4'>
            poll result page
        </div>
    )
}

export default PollResult
