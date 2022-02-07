import React, { useState, useEffect } from 'react'
import { url } from "../../constants";
import { toast } from "react-toastify"
import axios from "axios"
const PollResult = ({ match }) => {
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
            toast.error("There is some error in getting poll")
        }
    };
    useEffect(() => {
        getSinglePoll()
    }, [])
    return (
        <div className='mx-3'>
            {onePoll && <>
                <div className='card'>
                    <div className='card-header'>Poll Result</div>
                    <div className='card-body row'>
                        <p className='col-12 float-left'>
                            <span className='' style={{ fontSize: "20px" }}> Poll Name :
                            </span>

                            {onePoll.pollname}
                        </p>

                        <p className='col-12 float-left'>
                            <span className='' style={{ fontSize: "20px" }}> Poll Type :
                            </span>

                            {onePoll.type}
                        </p>
                        <p className='col-12 float-left'>
                            <span className='' style={{ fontSize: "20px" }}> Poll Description :
                            </span>

                            {onePoll.description}
                        </p>

                        <p className='col-12 float-left'>
                            <span className='' style={{ fontSize: "20px" }}> Total Vote Count :
                            </span>

                            {onePoll?.voters?.length}
                        </p>

                        <p className='col-12 float-left'>
                            <span className='' style={{ fontSize: "20px" }}> Poll Start Time :
                            </span>

                            {new Date(onePoll.startTime).toString()}
                        </p>
                        <p className='col-12 float-left'>
                            <span className='' style={{ fontSize: "20px" }}> Poll End Time :
                            </span>

                            {new Date(onePoll.endTime).toString()}
                        </p>

                        <h1>Poll Items</h1>
                       {onePoll?.items?.length && onePoll.items.map((item, index) => 
                         <div key={item._id} className={`card bg-${index === 0 ? "success" : "primary"} text-light mx-3`} style={{width: "20%"}}>
                         <div className='card-header'>Poll Item</div>
                         <div className='card-body'>
                             {index === 0 && 
                                 <p className='col-12 float-left'>
                                 <span className='' style={{ fontSize: "30px" }}> Winner Candidate
                                 </span>
                             </p>
                             }
                             <p className='col-12 float-left'>
                                 <span className='' style={{ fontSize: "20px" }}> Name :
                                 </span>

                                 {item.item.name}
                             </p>

                             <p className='col-12 float-left'>
                                 <span className='' style={{ fontSize: "20px" }}> Vote Count :
                                 </span>

                                 {item.item.voteCount}
                             </p>
                         </div>
                     </div>
                        )}
                    </div>
                </div>
            </>}
        </div>
    )
}

export default PollResult
