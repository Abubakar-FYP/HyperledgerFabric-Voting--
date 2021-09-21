import React, { useContext } from "react";
import { Link } from "react-router-dom"; //So we will be using the link instead of anchor tag in order to stop the refreshing of the pages
import { UserContext } from "../App";
import styled, { css } from "styled-components/macro";
import logo from "../../src/logo.png";
import { NavItem } from "react-bootstrap";
import { menuData } from "../data/MenuData";
import { MenuItem } from "@material-ui/core";
import { Button } from "./Button";
import { FaBars } from "react-icons/fa";

const Nav = styled.nav` #navbar
  height: 60px;
  display: flex;

  justify-content: space-between;
  padding: 3rem 2rem;
  z-index: 100;
  position: fixed;
  width: 100%;
  box-shadow: none;
  background-color:transparent;
`;

const NavLink = css` #links
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;
  text-decoration: none;
`;

const Logo = styled(Link)`
  ${NavLink}
  font-style:italic;
`;

const MenuBars = styled(FaBars)`
  display: none;
  @media screen and (max-width: 768px) {
    display: block;
    color: white;
    background-size: contain;
    height: 35px;
    width: 35px;
    curson: pointer;
    position: absolute;
    top: 41px;
    right: 65px;
    transform: translate(-50%, 35%);
  }
`;

const NavMenu = styled.div`
  display: flex;
  align-items: center;
  margin-right: -48px;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const NavMenuLinks = styled(Link)`
  ${NavLink}
`;

const NavBtn = styled.div`
  display: flex;
  align-items: center;
  margin-right: 24px;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const Navbar = ({ toggle }) => {
  return (
    <Nav>
      <Logo to='/'>ELIXR</Logo>
      <MenuBars onClick={toggle} />
      <NavMenu>
        {menuData.map((item, index) => (
          <NavMenuLinks to={item.link} key={index}>
            {item.title}
          </NavMenuLinks>
        ))}
      </NavMenu>
      <NavBtn>
        <Button to='/PartyRegistration' primary='true'>
          PartyRegistration
        </Button>
      </NavBtn>
    </Nav>
  );
};

export default Navbar;