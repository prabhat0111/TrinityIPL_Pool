import "./matches.css";
import Sidebar from "../components/sidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "./config";


const TEAM_FULL_NAMES = {
  RCB: "Royal Challengers Bangalore",
  MI: "Mumbai Indians",
  CSK: "Chennai Super Kings",
  KKR: "Kolkata Knight Riders",
  DC: "Delhi Capitals",
  SRH: "Sunrisers Hyderabad",
  RR: "Rajasthan Royals",
  PBKS: "Punjab Kings",
  GT : "Gujarat Titans",
  LSG : "Lucknow Super Giants",
};

function Matches() {
  const [tab, setTab] = useState("today"); // upcoming / today / completed
  const [matches, setMatches] = useState([]);
  const token = localStorage.getItem("token");
  const [liveMatches, setLiveMatches] = useState([]);
  const [userPicks, setUserPicks] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        // const res = await fetch(`http://localhost:8000/matches?status=${tab}`, {
          const res = await fetch(`${BASE_URL}/matches?status=${tab}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setMatches(data);
      } catch (err) {
        console.error(err);
        alert("Error fetching matches");
      }
    };

    const fetchLiveMatches = async () => {
      try {
        // const res = await fetch(`http://localhost:8000/matches?status=live`, {
          const res = await fetch(`${BASE_URL}/matches?status=live`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setLiveMatches(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMatches();
    fetchLiveMatches(); // ✅ Call this to populate live matches
  }, [tab]);

  const renderMatch = (match) => (
    // <div className="match-card" key={match.id}>
    <div
      className="match-card"
      key={match.id}
      onClick={() => {
        if (match.status === "live" || match.status === "completed") {
          // if (match.status === "today" || match.status === "live" || match.status === "completed") {
          navigate(`/matches/${match.id}`);
        }
      }}
      style={{ cursor: (match.status === "live" || match.status === "completed") ? "pointer" : "default" }}
    >
      <div className="match-header">
        <span className={match.status === "live" ? "live" : ""}>
          {match.status.toUpperCase()}
        </span>
        <span>STADIUM</span>
      </div>

      <div className="time">
        <p>
          {new Date(match.match_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        {(match.status === "upcoming" || match.status === "completed") && (
          <p>
            {new Date(match.match_time).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="teams">
        <div className="team">
          <div className="team-logo">{match.team1}</div>
          <p className="team-name">
            {TEAM_FULL_NAMES[match.team1] || match.team1}
          </p>
        </div>

        <div className="vs">VS</div>

        <div className="team">
          <div className="team-logo">{match.team2}</div>
          <p className="team-name">
            {TEAM_FULL_NAMES[match.team2] || match.team2}
          </p>
        </div>
      </div>

      

      <div className="bets">
        {match.status === "today" ? (
          <>
            {/* <div className="bet" onClick={() => placePick(match.id, match.team1)}> */}
            <div
              className={`bet ${(userPicks[match.id] || match.user_pick) === match.team1 ? "active-bet" : ""}`}
              onClick={() => placePick(match.id, match.team1)}
            >
              {/* <p><h2>BET ON {match.team1}</h2></p> */}
              <h4 style={{ color: "white" }}>BET ON {match.team1}</h4>
              {/* <h2>1.9</h2> */}
            </div>

            {/* <div className="bet" onClick={() => placePick(match.id, match.team2)}> */}
            <div
              className={`bet ${(userPicks[match.id] || match.user_pick) === match.team2 ? "active-bet" : ""}`}
              onClick={() => placePick(match.id, match.team2)}
            >
              {/* <p><h2>BET ON {match.team2}</h2></p> */}
              <h4 style={{ color: "white" }}>BET ON {match.team2}</h4>
              {/* <h2>2.0</h2> */}
            </div>
          </>
        ) : match.status === "completed" ? (
          <div className="result">
            {match.result === "No Result"
              ? "Match Abandoned / No Result"
              : `${match.result} won the match`}
          </div>
        ) : match.status === "live" ? (
          <p>Match is live — betting closed</p>
        ) : (
          <p>Match not open for betting</p>
        )}
      </div>
    </div>
  );

  const placePick = async (matchId, team) => {
    const token = localStorage.getItem("token");

    try {
      // const res = await fetch("http://localhost:8000/pick", {
      const res = await fetch(`${BASE_URL}/pick`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          match_id: matchId,
          selected_team: team,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setUserPicks(prev => ({
          ...prev,
          [matchId]: team
        }));
      } else {
        alert(data.detail);
      }
    } catch (err) {
      console.error(err);
      alert("Error placing bet");
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="header-card">
          <p className="tag">REAL-TIME BETTING</p>
          <h1>MATCHES</h1>
        </div>

        {liveMatches.length > 0 && (
          <div className="live-section">
            <h2>LIVE NOW</h2>
            {liveMatches.map(renderMatch)}
          </div>
        )}

        <div className="tabs">
          <button onClick={() => setTab("upcoming")} className={tab==="upcoming" ? "active":""}>UPCOMING</button>
          <button onClick={() => setTab("today")} className={tab==="today" ? "active":""}>TODAY</button>
          <button onClick={() => setTab("completed")} className={tab==="completed" ? "active":""}>COMPLETED</button>
        </div>

        {/* {matches.map(renderMatch)} */}
        {
          (tab === "completed"
            ? [...matches].sort((a, b) => new Date(b.match_time) - new Date(a.match_time))
            : matches
          ).map(renderMatch)
        }
      </div>
    </div>
  );
}

export default Matches;