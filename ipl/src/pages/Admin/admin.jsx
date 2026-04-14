import "../matches.css";
import Admin_Sidebar from "../../components/admin_sidebar";
import { useState, useEffect } from "react";
import { apiFetch } from "../../api";

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

function Admin() {
  const [tab, setTab] = useState("today");
  const [matches, setMatches] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);

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
    fetchLiveMatches();
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
          <div className="team-logo">
            {match.team1}
          </div>
            <p className="team-name">
            {TEAM_FULL_NAMES[match.team1] || match.team1}
            </p>

        </div>

        <div className="vs">VS</div>

        <div className="team">
          <div className="team-logo">
            {match.team2}
          </div>
            <p className="team-name">
            {TEAM_FULL_NAMES[match.team2] || match.team2}
            </p>
        </div>
      </div>

      {/* ✅ NO BETTING HERE */}
      <div className="bets">
        {match.status === "completed" ? (
          <div className="result">
            {!match.result
            ? "Result: TBD"
            : match.result === "No Result"
            ? "Match Abandoned / No Result"
            : `${match.result} won the match`}
          </div>
        ) : match.status === "live" ? (
          <p>Match is live</p>
        ) : match.status === "today" ? (
          <p>Betting open (User side)</p>
        ) : (
          <p>Upcoming match</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="layout">
      <Admin_Sidebar />

      <div className="main-content">
        <div className="header-card">
          <p className="tag">ADMIN PANEL</p>
          <h1>ALL MATCHES</h1>
        </div>

        {/* LIVE */}
        {liveMatches.length > 0 && (
          <div className="live-section">
            <h2>LIVE NOW</h2>
            {liveMatches.map(renderMatch)}
          </div>
        )}

        {/* TABS */}
        <div className="tabs">
          <button
            onClick={() => setTab("upcoming")}
            className={tab === "upcoming" ? "active" : ""}
          >
            UPCOMING
          </button>

          <button
            onClick={() => setTab("today")}
            className={tab === "today" ? "active" : ""}
          >
            TODAY
          </button>

          <button
            onClick={() => setTab("completed")}
            className={tab === "completed" ? "active" : ""}
          >
            COMPLETED
          </button>
        </div>

        {/* MATCH LIST */}
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

export default Admin;