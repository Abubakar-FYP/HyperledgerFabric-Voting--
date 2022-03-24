import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; //So we will be using the link instead of anchor tag in order to stop the refreshing of the pages
import { useHistory } from "react-router-dom"
import axios from "axios"
import { url } from "../constants"
const NavBar = () => {
  const [user, setUser] = useState(null)
  const [election, setElection] = useState(null)
  useEffect(() => {
    (async () => {
      const { data } = await axios.get(url + "/get/first/election")
      console.log("dataaaaaaaaa==========", data)
      setElection(data)
    })();
  }, [])
  const history = useHistory()
  useEffect(() => {
    const userFromLS = JSON.parse(localStorage.getItem("userData"))
    console.log("user from localstorage", userFromLS)
    if (userFromLS) {
      setUser(userFromLS)
    }
  }, [])

  const logoutTheUser = () => {
    localStorage.removeItem("userData")
    setUser(null)
    history.push("/")

  }
  console.log("electionelectionelection", election)
  return (
    <nav id="home">
      <h1 className="nav logo">
        <Link to="/" style={{ listStyle: "none", textDecoration: "none", color: "#fff" }}>
          <img src="/img/logos/logo.png" width="120px" height="80px" />
        </Link>
      </h1>
      <ul className="nav">
        <li><Link to="/" style={{ listStyle: "none", textDecoration: "none" }}
          className="text-light">Home</Link></li>

        {user && user?.doc?.role === "admin" ? (
          <>
          <li><Link to="/partiesstatus" style={{ listStyle: "none", textDecoration: "none" }}
            className="text-light">Parties Status</Link></li>
           <li><Link className="text-light" to="/admindashboard" style={{ listStyle: "none", textDecoration: "none", color: "#fff" }}>Dashboard</Link></li>
          </>
        ) : null}

        {user && user?.doc?.role === "admin" ? (
          <>
            <li><Link className="text-light" to="/partyregisteration" style={{ listStyle: "none", textDecoration: "none", color: "#fff" }}>Party Registeration</Link></li>
            <li><Link className="text-light" to="/electioncreation" style={{ listStyle: "none", textDecoration: "none", color: "#fff" }}>Election Creation</Link></li>

            <li><Link className="text-light" to="/admindashboard" style={{ listStyle: "none", textDecoration: "none", color: "#fff" }}>Dashboard</Link></li>
          </>
        ) : null}
        {/* {user && election && Date.now() > new Date(election?.endTime) ? (
          <li><Link className="text-light" to="/admindashboard" style={{ listStyle: "none", textDecoration: "none", color: "#fff" }}>Admin Dashboard</Link></li>
        ) : null} */}
           
        {!user ? (
          <li><Link className="text-light" to="/signup" style={{ listStyle: "none", textDecoration: "none", color: "#fff" }}>Voter Registeration</Link></li>
        ) : null}

        {!user ? (
          <li><Link className="text-light" to="/polls/signup" style={{ listStyle: "none", textDecoration: "none", color: "#fff" }}>Polls Registeration</Link></li>
        ) : null}

        {user && user?.doc?.role === "Voter" ? (
          <li><Link className="text-light" to="/votingballot" style={{ listStyle: "none", textDecoration: "none", color: "#fff" }}>Voting Ballot</Link></li>
        ) : null}

        {user && user?.poller?.role === "Poller" || user?.doc?.role === "admin"? (
          <li><Link className="text-light" to="/polls" style={{ listStyle: "none", textDecoration: "none", color: "#fff" }}>Polls</Link></li>
        ) : null}

        {user ?
          <li><Link className="text-light" to="#" onClick={logoutTheUser} style={{ listStyle: "none", textDecoration: "none", color: "#fff" }}>Logout</Link></li> : null
        }



      </ul>
    </nav>
  );
}


export default NavBar;