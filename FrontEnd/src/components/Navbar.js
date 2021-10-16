import React, { useContext } from 'react';
import {Link} from 'react-router-dom'; //So we will be using the link instead of anchor tag in order to stop the refreshing of the pages
import {UserContext} from '../App';
import styled from 'styled-components';
import logo from "../../src/logo.png";
import { NavItem } from 'react-bootstrap';
import { menuData } from '../data/MenuData';

// const Nav = styled.nav`
// height: 100px;
// background:transparent;

// justify-content: space-between;
// padding: 1rem 2rem;
// z-index:100;
// position:fixed;
// width:100;
// `;

// // const NavLink = css`

// // `;

// const Logo = styled(Link)`
// height: 60px;
// padding: 0px;

// `;

// const MenuBars = styled.i`


// `;

// const NavMenu = styled.div `


// `;

// const styles = styled.div `
// height: 60px;
// padding: 0px;
// `;


// const NavMenuLinks = styled(Link) `

// `;
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

      // <Nav>
      //   <Link to= {state?"/" :"/Signin"} />
      //    <Logo to = '/'> <img src= {logo} width={90} /></Logo>
      //   <MenuBars />
      //   <NavMenu>
      //   {menuData.map((item,index)=>(
      //     <NavMenuLinks to ={item,Link} key= {index}>
      //         {item.title}
      //     </NavMenuLinks>
      //   ))}
      //   </NavMenu>
      // </Nav>




        <nav >
        <div className="nav-wrapper no-color">
          <Link to= {state?"/" :"/Signin"}className="brand-logo left"/> <img className="responsive-img" alt = "Company Logo" src={logo} width= {70}/>
          <ul id="nav-mobile" className="right" >
            <li><Link to="/partregisteration">Party Registeration</Link></li>
          </ul>
          <ul id="nav-mobile" className="right container" >
            <li><Link to="/">Home</Link></li>
            <li><Link to="/AboutUs">About Us</Link></li>
            <li><Link to="/Contact">Contact</Link></li>
            {renderlist()}
          </ul>
       
        </div>
      </nav>
    );
}


export default NavBar;