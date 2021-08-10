import React from 'react'; 
import Navbar from './components/Navbar';
import './App.css';
import {BrowserRouter,Route} from 'react-router-dom';
import Home from './components/Screens/Home';
import AboutUs from './components/Screens/AboutUs';
import Contact from './components/Screens/Contact';
import ElectionResultPortal from './components/Screens/ElectionResultPortal';
import Signin from './components/Screens/Signin';
import Signup from './components/Screens/Signup';
import OTP from './components/Screens/OTP';

function App() {
  return (
    <div className="App">
    <BrowserRouter>
    <Navbar/>
    <Route exact path="/Home">
      <Home/>
    </Route>
    <Route exact path ="/Signin">
      <Signin/>
    </Route>
    <Route exact path ="/Signup">
      <Signup/>
    </Route>
    <Route exact path ="/AboutUs">
      <AboutUs/>
    </Route>
    <Route exact path ="/Contact">
      <Contact/>
    </Route>
    <Route exact path ="/ElectionResultPortal">
      <ElectionResultPortal/>
    </Route>
    <Route exact path ="/OTP">
      <OTP/>
    </Route>
    </BrowserRouter>
    </div>
  )
}

export default App;
