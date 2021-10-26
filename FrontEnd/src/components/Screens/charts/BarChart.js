import React, { useState } from 'react'
import { Bar, Pie, Line } from 'react-chartjs-2'

const BarChart = ({ mVotes, fVotes, allPartyOverallVotes, ballotWinners }) => {
    console.log('ballotWinnersballotWinners==========', ballotWinners)
    const [ballotIds, setBallotIds] = useState([])
    const [party, setParty] = useState([])
    const [votes, setVotes] = useState([])
    React.useEffect(() => {
        setBallotIds(ballotWinners.map(ballot => ballot.ballotid))
        setParty(ballotWinners.map(ballot => ballot.ballotname))
        setVotes(ballotWinners.map(ballot => ballot.candidate[0]?.voteCount || 0))

    }, [ballotWinners])
    console.log("ballotIds", ballotIds.length)
    console.log("party", party.length)
    console.log("votes", votes.length)
    const dataGender = {
        labels: [
            'Males', 'Females',
        ],
        datasets: [
            {
                label: 'Gender Vise Votes',
                data: [mVotes, fVotes],
                fill: true,          // Don't fill area under the line
                backgroundColor: ["green", "yellow"], // Line color
                borderWidth: 2,
                borderColor: "#00f",
                hoverBorderWidth: 3,
                hoverBorderColor: "#000"
            }
        ]
    }
    var colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
        '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
        '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
        '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
        '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
        '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
        '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
        '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
        '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
        '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];
    const dataAllParties = {
        labels: allPartyOverallVotes.map(party => party.partyName),
        datasets: [
            {
                label: 'Gender Vise Votes',
                data: allPartyOverallVotes.map(party => party.voteCount),
                fill: true,          // Don't fill area under the line
                backgroundColor: colorArray.splice(0, allPartyOverallVotes.length), // Line color
                borderWidth: 2,
                borderColor: "#00f",
                hoverBorderWidth: 3,
                hoverBorderColor: "#000"
            }
        ]
    }

    const singleBallotWinnersData = {
        labels: party,
        datasets: [
            {
                label: 'Votes',
                data: votes,
                labels: ballotIds,
                fill: false,          // Don't fill area under the line
                borderWidth: 2,
                borderColor: "#f00",
                hoverBorderWidth: 3,
                hoverBorderColor: "#000"
            },
            {
                label: 'Ballot Ids',
                data: votes,
                labels: ballotIds,
                fill: false,          // Don't fill area under the line
                borderWidth: 2,
                borderColor: "#f00",
                hoverBorderWidth: 3,
                hoverBorderColor: "#000"
            },
            
        ],
        options: {
            scales: {
              yAxes: [
                {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  ticks: {
                    beginAtZero: true,
                  },
                },
                {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          }
    }
    return (
        <div>
            <div className="row">
                <div className="col-md-6 col-12">
                    <h4>Gender Wise Votes Chart</h4>
                    <Bar
                        width={100} height={50}
                        style={{ position: 'relative', height: '40vh', width: '80vw' }}
                        data={dataGender}
                    />
                </div>
                {ballotIds && party && votes && (
                    <div className="col-md-6 col-12">
                        <h4>Single Ballot Winners</h4>
                        <Line
                            width={100} height={50}
                            style={{ position: 'relative', height: '40vh', width: '80vw' }}
                            data={singleBallotWinnersData}
                            options={singleBallotWinnersData.options}
                        />
                    </div>
                )}

            </div>
            <div className="row">
                <div className="offset-md-3 col-md-6 col-8">
                    <h4>Party Wise Votes Chart</h4>
                    <Pie
                        width={100} height={30}
                        style={{ position: 'relative', height: '40vh', width: '80vw' }}
                        data={dataAllParties}
                    />
                </div>
            </div>
        </div>

    )
}

export default BarChart
