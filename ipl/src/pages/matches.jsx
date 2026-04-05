import "./matches.css";
import Sidebar from "../components/sidebar";
import { useState, useEffect } from "react";

function Matches() {
  const [tab, setTab] = useState("today"); // upcoming / today / completed
  const [matches, setMatches] = useState([]);
  const token = localStorage.getItem("token");
  const [liveMatches, setLiveMatches] = useState([]);
  const [userPicks, setUserPicks] = useState({});

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch(`http://localhost:8000/matches?status=${tab}`, {
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
        const res = await fetch(`http://localhost:8000/matches?status=live`, {
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
    <div className="match-card" key={match.id}>
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
          <div className="team-logo">{match.team1.slice(0,3).toUpperCase()}</div>
          <p>{match.team1}</p>
        </div>

        <div className="vs">VS</div>

        <div className="team">
          <div className="team-logo">{match.team2.slice(0,3).toUpperCase()}</div>
          <p>{match.team2}</p>
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
              <p>BET ON {match.team1}</p>
              <h2>1.9</h2>
            </div>

            {/* <div className="bet" onClick={() => placePick(match.id, match.team2)}> */}
            <div
              className={`bet ${(userPicks[match.id] || match.user_pick) === match.team2 ? "active-bet" : ""}`}
              onClick={() => placePick(match.id, match.team2)}
            >
              <p>BET ON {match.team2}</p>
              <h2>2.0</h2>
            </div>
          </>
        ) : match.status === "completed" ? (
          <div className="result">
            {/* Result: {match.result || "TBD"} */}
            {match.result ? `${match.result} won the match` : "Result: TBD"}
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
      const res = await fetch("http://localhost:8000/pick", {
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

        {matches.map(renderMatch)}
      </div>
    </div>
  );
}

export default Matches;