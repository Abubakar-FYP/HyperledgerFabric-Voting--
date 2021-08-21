import React, { useContext } from 'react';
import {Link} from 'react-router-dom'; //So we will be using the link instead of anchor tag in order to stop the refreshing of the pages
import {UserContext} from '../App';
const NavBar =() =>{
  const {state,dispatch} = useContext(UserContext)
  const renderlist=()=>{
    if(state){
      return[
        <li><Link to="/ElectionResultPortal">Election Result Portal</Link></li>
      ]
    }else{
      return [
        <li><Link to="/Signin">Sign In</Link></li>
      ]
    }
  }
    return(
        <nav>
        <div className="nav-wrapper white">{/*Add logo image,src */}
          <Link to= {state?"/" :"/Signin"}className="brand-logo left"/> <img className="responsive-img" alt = "Company Logo" /* src="cool_pic.jpg" *//>
          <ul id="nav-mobile" className="right " >
            <li><Link to="/Home">Home</Link></li>
            <li><Link to="/AboutUs">About Us</Link></li>
            <li><Link to="/Contact">Contact</Link></li>
            {renderlist()}
            {/* <li><Link to="/ElectionResultPortal">Election Result Portal</Link></li>
            <li><Link to="/Signin">Sign In</Link></li> */}
          </ul>
        </div>
      </nav>
    );
}


export default NavBar;