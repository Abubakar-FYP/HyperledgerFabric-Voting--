import React, { useContext, useEffect, createContext, useReducer } from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import { BrowserRouter, Route, useHistory } from "react-router-dom";
//Route Allows us to use Routing and use virtual dom
//All Routes for different screens
import Home from "./components/Screens/Home";
import AboutUs from "./components/Screens/AboutUs";
import Contact from "./components/Screens/Contact";
import ElectionResultPortal from "./components/Screens/ElectionResultPortal";
import Signin from "./components/Screens/Signin";
import Signup from "./components/Screens/Signup";
import OTP from "./components/Screens/OTP";
import { reducer, intialState } from "./reducers/userReducer";
import Hero from "./components/Hero";
import { SliderData } from "./data/SliderData";
import GlobalStyle from "./globalStyle";
import DropDown from "./components/Dropdown"; //change name if not working
import { useState } from "react";
import InfoSection from "./components/InfoSection";
import { InfoData } from "./data/InfoData";
import { FooterContainer } from "./container/footer";
import Footer from "./components/footer"; //change name if not working

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
      history.push("/ElectionResultPortal");
    } else {
      history.push("/");
    }
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <switch>
      <GlobalStyle />
      <Navbar toggle={toggle} />
      <DropDown isOpen={isOpen} toggle={toggle} />
      <Hero slides={SliderData} />
      <InfoSection {...InfoData} />
      <FooterContainer />
    </switch>
  );
};
function App() {
  const [state, dispatch] = useReducer(reducer, intialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
