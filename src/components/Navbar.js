import React from 'react';
import {Link} from 'react-router-dom'; //So we will be using the link instead of anchor tag in order to stop the refreshing of the pages
const NavBar =() =>{
    return(
        <nav>
        <div className="nav-wrapper white">
          <Link to="/" className="brand-logo left">Logo</Link>
          <ul id="nav-mobile" className="right ">
            <li><Link to="/Home">Home</Link></li>
            <li><Link to="/AboutUs">AboutUs</Link></li>
            <li><Link to="/Contact">Contact</Link></li>
            <li><Link to="/ElectionResultPortal">ElectionResultPortal</Link></li>
            <li><Link to="/Signup">Signup</Link></li>
          </ul>
        </div>
      </nav>
    );
}


export default NavBar;