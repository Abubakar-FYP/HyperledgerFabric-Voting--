import React, { useContext, useEffect, createContext, useReducer } from 'react';
import Navbar from './components/Navbar';
import './App.css';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
//Route Allows us to use Routing and use virtual dom
//All Routes for different screens
import Home from './components/Screens/Home';
import AboutUs from './components/Screens/AboutUs';
import Contact from './components/Screens/Contact';
import ElectionResultPortal from './components/Screens/ElectionResultPortal';
import Signin from './components/Screens/Signin';
import Signup from './components/Screens/Signup';
import OTP from './components/Screens/OTP';
import { reducer, intialState } from './reducers/userReducer';
import PartyRegisteration from './components/Screens/PartyRegisteration';
import LandingPage from './LandingPage';
import NavBar from './components/Navbar';
import VotingBallot from './components/Screens/VotingBallot';
import ElectionCreation from './components/Screens/ElectionCreation';
import AdminDashboard from './components/Screens/AdminDashboard';
import Pulses from './Pulses';

export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const { state, dispatch } = useContext(UserContext)
  useEffect(() => {
    let user = localStorage.getItem("user");
    user = JSON.parse(user && user)
    if (user) {
      dispatch({ type: "USER", payload: user })
      history.push("/ElectionResultPortal")
    }
    else {
      history.push("/")
    }
  }, [])
  return (
    <switch>
      <Route exact path="/">
        <Home />
      </Route>

      <Route path="/Signin">
        <Signin />
      </Route>

      <Route path="/Signup">
        <Signup />
      </Route>

      <Route exact path="/AboutUs">
        <AboutUs />
      </Route>

      <Route exact path="/Contact">
        <Contact />
      </Route>

      <Route exact path="/ElectionResultPortal">
        <ElectionResultPortal />
      </Route>

      <Route exact path="/OTP">
        <OTP />
      </Route>
      <Route exact path="/partregisteration" component={PartyRegisteration} />

    </switch>
  )
}
function App() {
  const [state, dispatch] = useReducer(reducer, intialState)
  return (
    <UserContext.Provider value={{ state, dispatch }} >
      <BrowserRouter>
        {/* <Navbar/>
    <Routing/> */}

    <div>
      <NavBar />
    </div>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/partyregisteration" component={PartyRegisteration} />
          <Route exact path="/signin" component={Signin} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/votingballot" component={VotingBallot} />
          <Route exact path="/electioncreation" component={ElectionCreation} />
          <Route exact path="/admindashboard" component={AdminDashboard} />
        </Switch>
      </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App;