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
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import PartiesStatus from './components/Screens/PartiesStatus';
import ForgotPassword from './components/Screens/ForgotPassword';
import ResetPassword from './components/Screens/ResetPassword';
import axios from "axios"
import {url} from "./constants"
import PendingParties from './components/Screens/PendingParties';
import Polls from './components/Screens/Polls';
import Poll from './components/Screens/Poll';
import PollsRegisteration from './components/Screens/PollsRegisteration';
import PollsSignin from './components/Screens/Pollsignin';
import PollsForgotPassword from './components/Screens/PollsForgotPassword';
import PollResult from './components/Screens/PollResult';
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
  useEffect(() => {
    (async() => {
      const userData = JSON.parse(localStorage.getItem("userData"))
      if(userData){
        console.log("userData============", userData)
        const {data} = await axios.post(url + "/profile" , {cnic: userData?.user?.cnic})
        console.log("dataaaaa=aaaaaaaa======",data)
        localStorage.setItem("userData" , JSON.stringify(data))
      }
    })()
  }, [])
  const [state, dispatch] = useReducer(reducer, intialState)
  return (
    <UserContext.Provider value={{ state, dispatch }} >
      <BrowserRouter>
        {/* <Navbar/>
    <Routing/> */}
<ToastContainer />
    <div>
      <NavBar />
    </div>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/partyregisteration" component={PartyRegisteration} />
          <Route exact path="/signin" component={Signin} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/polls/signup" component={PollsRegisteration} />
          <Route exact path="/polls/signin" component={PollsSignin} />
          <Route exact path="/votingballot" component={VotingBallot} />
          <Route exact path="/electioncreation" component={ElectionCreation} />
          <Route exact path="/admindashboard" component={AdminDashboard} />
          <Route exact path="/partiesstatus" component={PartiesStatus} />
          <Route exact path="/forgotpassword" component={ForgotPassword} />
          <Route exact path="/polls/forgotpassword" component={PollsForgotPassword} />
          <Route exact path="/reset/password/:token" component={ResetPassword} />
          <Route exact path="/pending-parties/:id" component={PendingParties} />
          <Route exact path="/polls" component={Polls} />
          <Route exact path="/poll/:id" component={Poll} />
          <Route exact path="/poll/result/:id" component={PollResult} />
        </Switch>
      </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App;