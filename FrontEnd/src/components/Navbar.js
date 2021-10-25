import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom'; //So we will be using the link instead of anchor tag in order to stop the refreshing of the pages
import {useHistory} from "react-router-dom"
const NavBar =() =>{
  const [user, setUser] = useState(null)
const history = useHistory()
  useEffect(() => {
    const userFromLS = JSON.parse(localStorage.getItem("userData"))
    console.log("user from localstorage", userFromLS)
    if(userFromLS){
      setUser(userFromLS)
    }
  }, [])

  const logoutTheUser = () => {
    localStorage.removeItem("userData")
    setUser(null)
    history.push("/")

  }
    return(
<nav id="home">
        <h1 className="nav logo">
        <Link to="/" style={{listStyle: "none", textDecoration: "none", color:"#fff"}}>
        <img src="/img/logos/logo.png" width="120px" height="80px" />
          </Link>
          </h1>
        <ul className="nav">
          <li><Link to="/" style={{listStyle: "none", textDecoration: "none"}}
          className="text-light">Home</Link></li>
          <li><Link className="text-light" to="/partyregisteration" style={{listStyle: "none", textDecoration: "none", color:"#fff"}}>Party Registeration</Link></li>

          {!user ? (
          <li><Link className="text-light" to="/signup" style={{listStyle: "none", textDecoration: "none", color:"#fff"}}>Voter Registeration</Link></li>
          ): null}

          {user ? (
            <li><Link className="text-light" to="/votingballot" style={{listStyle: "none", textDecoration: "none", color:"#fff"}}>Voting Ballot</Link></li>
          ): null}
          <li><Link className="text-light" to="/electioncreation" style={{listStyle: "none", textDecoration: "none", color:"#fff"}}>Election Creation</Link></li>

          <li><Link className="text-light" to="/admindashboard" style={{listStyle: "none", textDecoration: "none", color:"#fff"}}>Admin Dashboard</Link></li>
          {user ?
           <li><Link className="text-light" to="#"  onClick={logoutTheUser} style={{listStyle: "none", textDecoration: "none", color:"#fff"}}>Logout</Link></li> : null
          }
         

          
        </ul>
      </nav>
    );
}


export default NavBar;