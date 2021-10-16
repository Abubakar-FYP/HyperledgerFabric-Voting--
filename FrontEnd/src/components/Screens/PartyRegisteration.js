import React, { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../../constants";
const PartyRegisteration = () => {
  // ===============================================================================
  //                               Local States
  // ===============================================================================
  const initialState = {
    leaderName: "",
    cnic: "",
    partyName: "",
    partySymbol: "",
  };
  const initialState2 = {
    canName: "",
    canCnic: "",
  };
  const [party, setParty] = useState(initialState);
  const [candidate, setCandidate] = useState(initialState2);
  const [partyLogo, setPartyLogo] = useState(null);
  const [compaigns, setCompaigns] = useState(null);
  const showCandidate = useState(false);

  const [selectedCompaign, setSelectedCompaign] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [areas, setAreas] = useState(null);
  const [ballotId, setBallotId] = useState("")
  const [wholeData, setWholeData] = useState([])
  const [disableBtn, setDisableBtn] = useState(true)
  // ===============================================================================
  //                              Local Functions
  // ===============================================================================

  const handlePartyRegisteration = (e) => {
    const newData = { ...party };
    newData[e.target.name] = e.target.value;
    setParty(newData);
  };
  const handleCandidateRegisteration = (e) => {
    const newData = { ...candidate };
    newData[e.target.name] = e.currentTarget.value;
    setCandidate(newData);
  };
  const handlePartyLogo = (e) => {
    const files = Array.from(e.target.files)
    setPartyLogo(null)
    files.forEach(file => {
        if (file) {
            if (file.type.includes("png") || file.type.includes("jpeg") || file.type.includes("jpg")) {

                const reader = new FileReader()
                reader.onload = () => {
                    if (reader.readyState === 2) {
                        setPartyLogo(reader.result)
                    }
                }
                reader.readAsDataURL(file)
            }
        }
    })
  };
  const addCandidate = () => {
    showCandidate[1](true);
    console.log("clicked");
  };

  const selectCompaign = (e, id) => {
    console.log(e.target.innerText);
    setSelectedCompaign(e.target.innerText);
    console.log(id);

    // get this specific compaign from state compaigns
    const compaign = compaigns.find((comp) => comp._id.toString() === id);
    console.log(compaign);
    setAreas(compaign.ballotId);
    setSelectedArea("")
    setBallotId("")
  };

  const selectArea = (e, id) => {
    console.log(e.target.innerText)
    setSelectedArea(e.target.innerText)
    console.log(id)

    // get the specific AREA
    const area = areas.find(ar => ar._id.toString() === id)
    console.log("selected area", area)
    setBallotId(area.ballotid)
  }

  const saveDataInLS = () => {
    const data = {
      leaderName: party.leaderName,
      partyName: party.partyName,
      leaderCnic: party.cnic,
      partySymbol: party.partySymbol,
      partyLogo: partyLogo,
      candidateCnic: candidate.canCnic,
      candidateName: candidate.canName,
      area: selectedArea,
      compaign: selectedCompaign,
      ballotId: ballotId
    }
    const newData = [...wholeData , data]
    setWholeData(newData)
    console.table(newData)
    localStorage.removeItem("data")
    localStorage.setItem("data", JSON.stringify(newData))
    setPartyLogo(null)
    setParty(initialState)
    setCandidate(initialState2)
    setSelectedArea("")
    setSelectedCompaign("")
    setBallotId("")
  }

  // ================================================================================
  //                  Console.logs
  // ================================================================================
//   console.log("Compaigns", compaigns);
//   console.log("Areas", areas);
// console.table(wholeData)
// console.log(wholeData)
  // =================================================================================
  //                                      UseEffects
  // =================================================================================
  React.useEffect(() => {
    if (
      !party.leaderName ||
      !party.partyName ||
      !party.cnic ||
      !party.partySymbol ||
      !partyLogo
    ) {
      showCandidate[1](false);
    }
  }, [
    party.leaderName,
    party.partyName,
    party.cnic,
    party.partySymbol,
    partyLogo,
  ]);

  useEffect(() => {
    (async function apiCall() {
      const { data } = await axios.get(url + "/findallcampaigns");
      setCompaigns(data.message);
    })();
  }, []);

  // disable Add Candidate Button
  useEffect(() => {
    if(
      !party.leaderName ||
      !party.partyName ||
      !party.cnic ||
      !party.partySymbol ||
      !partyLogo ||
      !candidate.canCnic ||
      !candidate.canName ||
      !selectedArea ||
      !selectedCompaign ||
      !ballotId){
        setDisableBtn(true)
      }else{
        setDisableBtn(false)
      }
  }, [
    party.leaderName,
    party.partyName,
    party.cnic,
    party.partySymbol,
    partyLogo,
    candidate.canCnic,
    candidate.canName,
    selectedArea,
    selectedCompaign,
    ballotId
  ])
  useEffect(() => {
    const data = localStorage.getItem("data")
    console.log("data from LS",JSON.parse(data))
    if(data) {setWholeData(JSON.parse(data))}
  }, [])
  // ===============================================================================
  //                                  JSX
  // ===============================================================================
  return (
    <div className="conatiner">
      <div className="card" style={{ maxWidth: "1500px", margin: "20px auto" }}>
        <div className="card-header">Party Registeration</div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="leader_name">Leader Name</label>
                <input
                  value={party.leaderName}
                  onChange={handlePartyRegisteration}
                  id="leader_name"
                  className="form-control"
                  type="text"
                  name="leaderName"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="cnic">CNIC</label>
                <input
                  value={party.cnic}
                  onChange={handlePartyRegisteration}
                  id="cnic"
                  className="form-control"
                  type="number"
                  name="cnic"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="party_name">Party Name </label>
                <input
                  value={party.partyName}
                  onChange={handlePartyRegisteration}
                  id="party_name"
                  className="form-control"
                  type="text"
                  name="partyName"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="party_symbol">Party Symbol</label>
                <input
                  value={party.partySymbol}
                  onChange={handlePartyRegisteration}
                  id="party_symbol"
                  className="form-control"
                  type="text"
                  name="partySymbol"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <input
                  //   value={partyLogo}
                  onChange={handlePartyLogo}
                  className="form-control form-control-sm"
                  id="formFileSm"
                  type="file"
                  placeholder="Party Logo"
                />
              </div>
            </div>
            <div className=" offset-md-4 col-md-2 ">
              <div className="form-group">
                <input
                  id="add_candidate"
                  className={`btn btn-secondary  ${
                    party.leaderName &&
                    party.partyName &&
                    party.cnic &&
                    party.partySymbol &&
                    partyLogo
                      ? ""
                      : "disabled"
                  }`}
                  type="submit"
                  value="Add Candidate"
                  onClick={addCandidate}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`card ${!showCandidate[0] && "d-none"}`}
        style={{ maxWidth: "1500px", margin: "20px auto" }}
      >
        <div className="card-header">Add Candidate</div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  value={candidate.canName}
                  onChange={handleCandidateRegisteration}
                  id="name"
                  className="form-control"
                  type="text"
                  name="canName"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="canCnic">CNIC</label>
                <input
                  value={candidate.canCnic}
                  onChange={handleCandidateRegisteration}
                  id="canCnic"
                  className="form-control"
                  type="number"
                  name="canCnic"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3">
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {selectedCompaign ? selectedCompaign : "compaign"}
                </button>
                <div
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  {compaigns &&
                    compaigns.map((compaign) => (
                      <p
                        className="dropdown-item"
                        key={compaign._id}
                        onClick={(e) => selectCompaign(e, compaign._id)}
                      >
                        {compaign.campaignName}
                      </p>
                    ))}
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {selectedArea ? selectedArea : "Area"}
                </button>
                <div
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  {areas?.length ?
                    areas.map((area) => (
                      <p 
                      key={area?._id}
                      onClick={e => selectArea(e, area?._id)}
                      className="dropdown-item">{area?.ballotname }</p>
                    )):
                      <p 
                      className="dropdown-item">No Area Is Present</p>
                    }
                </div>
              </div>
            </div>

            <div className="col-md-3">
                <button
                  className="btn btn-secondary disabled"
                  type="button"
              >
                  {ballotId ? ballotId : "Ballot ID"}
                </button>
            
            </div>

            <div className="col-md-3">
                <button
                  className="btn btn-secondary"
                  type="button"
                  disabled={disableBtn}
                  onClick={saveDataInLS}
              >
                Add Candidate
                </button>
            
            </div>

          </div>
        </div>
        
      </div>
      <table className="table table-striped" 
      style={{maxWidth: "1500px", margin: "10px auto", display: wholeData?.length ? "block": "none"}}>
  <thead>
    <tr>
      <th scope="col">Candidate Name</th>
      <th scope="col">Candidate CNIC</th>
      <th scope="col">Compaign </th>
      <th scope="col">Area </th>
      <th scope="col">Ballod ID</th>
      <th scope="col">Leader Name</th>
      <th scope="col">Leader CNIC</th>
      <th scope="col">Party Name</th>
      <th scope="col">Party Symbol</th>
      <th scope="col">Party Logo</th>
    </tr>
  </thead>
  <tbody>
    {wholeData?.map(party => (
   <tr key={Math.random()*2342342342342}>
   <td>{party.candidateName}</td>
   <td>{party.candidateCnic}</td>
   <td>{party.compaign}</td>
   <td>{party.area}</td>
   <td>{party.ballotId}</td>
   <td>{party.leaderName}</td>
   <td>{party.leaderCnic}</td>
   <td>{party.partyName}</td>
   <td>{party.partySymbol}</td>
   <td>
     <img style={{borderRadius: "50%"}} src={party.partyLogo} width="100px" height="100px"/>
   </td>

 </tr>
    ))}
  </tbody>
</table>
    </div>
  );
};

export default PartyRegisteration;
