import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import "./dashboard.css";

function Dashboard() {
  const [pending, setPending] = useState([]);
  const [past, setPast] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);

  const [points, setPoints] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [rank, setRank] = useState("-");
  const [lastSync, setLastSync] = useState(null);


  const [userPicks, setUserPicks] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDashboard();
    
    // ✅ AUTO-REFRESH EVERY 30 SECONDS
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, []);


  const fetchDashboard = () => {
    fetch("http://localhost:8000/dashboard", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setPending(data.pending || []);
        setPast(data.past || []);
        setPoints(data.points || 0);
        setCorrect(data.correct || 0);
        setWrong(data.wrong || 0);
        setRank(data.rank || "-");
        setLastSync(data.last_sync);
      })

      .catch(() => {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/";
      });
  };

  // ✅ SAFE TIME FORMATTER
  const formatTime = (time) => {
    if (!time) return "TBA";
    const d = new Date(time);
    if (isNaN(d)) return "TBA";

    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ✅ PICK
  const handlePick = async (matchId, team) => {
    try {
      const res = await fetch("https://ipl.energeticitsolutions.com/pick", {
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

      if (res.ok) {
        setUserPicks(prev => ({
          ...prev,
          [matchId]: team
        }));

        setTimeout(() => {
          setPending(prev => prev.filter(m => m.id !== matchId));
        }, 300);
      }
    } catch {
      alert("Error placing pick");
    }
  };

  const handleLoadMore = () => {
    if (visibleCount === 5) setVisibleCount(15);
    else setVisibleCount(past.length);
  };

  // ✅ CLEAN MATCH CARD
  const renderMatch = (match) => (
  <div className="match-card" key={match.id}>

    {/* HEADER */}
    <div className="match-header">
      {match.status === 'live' ? (
        <span className="live-badge">
          <div className="live-dot"></div>
          LIVE
        </span>
      ) : (
        <span>TODAY</span>
      )}
      {/* <span>{match.venue || "STADIUM"}</span> */}
    </div>


    {/* TIME */}
    <div className="time">
      {formatTime(match.match_time)}
    </div>

    {/* TEAMS */}
    <div className="teams">
      <div className="team">
        <div className="team-logo">
          {match.team1}
        </div>
        {/* <p>{match.team1}</p> */}
      </div>

      <div className="vs">VS</div>

      <div className="team">
        <div className="team-logo">
          {match.team2}
        </div>
        {/* <p>{match.team2}</p> */}
      </div>
    </div>

    {/* BET BUTTONS */}
    <div className="bets">
      <button
        className={`bet ${
          userPicks[match.id] === match.team1 ? "active-bet" : ""
        }`}
        onClick={() => handlePick(match.id, match.team1)}
      >
        BET ON {match.team1}
      </button>

      <button
        className={`bet ${
          userPicks[match.id] === match.team2 ? "active-bet" : ""
        }`}
        onClick={() => handlePick(match.id, match.team2)}
      >
        BET ON {match.team2}
      </button>
    </div>

  </div>
);

  return (
    <div className="page dashboard-page">
      <Sidebar />

      <div className="main-content">

        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Track your performance</p>
          
          {lastSync && (
            <div className="sync-status">
              <div className="sync-dot"></div>
              SYSTEM UPDATED: {new Date(lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          )}
        </div>


        <div className="stats-row">
          <div className="mini-card">
            <p>Points</p>
            <h2>{points}</h2>
          </div>
          <div className="mini-card">
            <p>Rank</p>
            <h2>#{rank}</h2>
          </div>
          <div className="mini-card">
            <p>Correct</p>
            <h2>{correct}</h2>
          </div>
          <div className="mini-card">
            <p>Wrong</p>
            <h2>{wrong}</h2>
          </div>
        </div>

        {pending.length > 0 && (
          <>
            <h2 className="section-title">Today's Matches</h2>
            {pending.map(renderMatch)}
          </>
        )}

        {pending.length === 0 && (
          <p className="empty-text">No matches left to pick 🎉</p>
        )}
            <br />
        <div className="dashboard-card">
          <h3>Past Matches</h3>

          {past.slice(0, visibleCount).map((match, index) => (
            <div key={index} className="pick-row">
              <span>{match.team1} vs {match.team2}</span>

              {match.status === "win" && <span className="win-badge">Win</span>}
              {match.status === "lose" && <span className="lose-badge">Lose</span>}
              {match.status === "no_pick" && <span className="no-pick-badge">No Pick</span>}
              {match.status === "no_result" && <span className="no-pick-badge">No Result</span>}
            </div>
          ))}

          {visibleCount < past.length && (
            <button className="load-more-btn" onClick={handleLoadMore}>
              Load More
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;