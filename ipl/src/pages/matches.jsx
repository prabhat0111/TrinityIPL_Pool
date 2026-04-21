import "./matches.css";
import Sidebar from "../components/sidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

const TEAM_FULL_NAMES = {
  RCB: "Royal Challengers Bangalore",
  MI: "Mumbai Indians",
  CSK: "Chennai Super Kings",
  KKR: "Kolkata Knight Riders",
  DC: "Delhi Capitals",
  SRH: "Sunrisers Hyderabad",
  RR: "Rajasthan Royals",
  PBKS: "Punjab Kings",
  GT : "Gujrat Titans",
  LSG : "Lukhnow Super Giants",
};

function Matches() {
  const [tab, setTab] = useState("today"); // upcoming / today / completed
  const [matches, setMatches] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [userPicks, setUserPicks] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await apiFetch(`/matches?status=${tab}`);
        setMatches(data);
      } catch (err) {
        if (err.message !== "Session expired") {
          console.error(err);
          alert("Error fetching matches");
        }
      }
    };

    const fetchLiveMatches = async () => {
      try {
        const data = await apiFetch(`/matches?status=live`);
        setLiveMatches(data);
      } catch (err) {
        if (err.message !== "Session expired") {
          console.error(err);
        }
      }
    };

    fetchMatches();
    fetchLiveMatches(); // ✅ Call this to populate live matches
  }, [tab]);

  const renderMatch = (match) => (
    <div
      className="match-card"
      key={match.id}
      onClick={() => {
        if (match.status === "live" || match.status === "completed") {
          navigate(`/matches/${match.id}`);
        }
      }}
      style={{ cursor: (match.status === "live" || match.status === "completed") ? "pointer" : "default" }}
    >
      <div className="match-header">
        <span className={match.status === "live" ? "live-badge" : ""}>
          {match.status === "live" && <div className="live-dot"></div>}
          {match.status.toUpperCase()}
        </span>

        <span>STADIUM</span>
      </div>

      <div className="time">
        <p>


          {/* local timezone  */}
          {
          
          // new Date(match.match_time).toLocaleTimeString([], {
          //   hour: "2-digit",
          //   minute: "2-digit",
          // })
          new Date(match.match_time).toLocaleTimeString("en-CA", {
            timeZone: "America/Toronto",
            hour: "2-digit",
            minute: "2-digit",
          })
          
          }


          
        </p>

        {(match.status === "upcoming" || match.status === "completed") && (
          <p>
            {
            
            // new Date(match.match_time).toLocaleDateString()
            new Date(match.match_time).toLocaleDateString("en-CA", {
              timeZone: "America/Toronto"
            })
            
            }
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
            <div
              className={`bet ${(userPicks[match.id] || match.user_pick) === match.team1 ? "active-bet" : ""}`}
              onClick={() => placePick(match.id, match.team1)}
            >
              <h4 style={{ color: "white" }}>PICK {match.team1}</h4>
            </div>

            <div
              className={`bet ${(userPicks[match.id] || match.user_pick) === match.team2 ? "active-bet" : ""}`}
              onClick={() => placePick(match.id, match.team2)}
            >
              <h4 style={{ color: "white" }}>PICK {match.team2}</h4>
            </div>
          </>
        ) : match.status === "completed" ? (
          <div className="result">
            {match.result === "No Result"
              ? "Match Abandoned / No Result"
              : `${match.result} won the match`}
          </div>
        ) : match.status === "live" ? (
          <p>Match is live — picks locked</p>
        ) : (
          <p>Match not open for picks</p>
        )}
      </div>
    </div>
  );

  const placePick = async (matchId, team) => {
    try {
      const data = await apiFetch("/pick", {
        method: "POST",
        body: JSON.stringify({
          match_id: matchId,
          selected_team: team,
        }),
      });

      setUserPicks(prev => ({
        ...prev,
        [matchId]: team
      }));
    } catch (err) {
      if (err.message !== "Session expired") {
        alert(err.data?.detail || "Error placing bet");
      }
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="header-card">
          <p className="tag">REAL-TIME PICKS</p>
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