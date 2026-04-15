import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import { apiFetch, verifySession } from "../api";
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

  useEffect(() => {
    // Verify session on mount before doing anything
    verifySession().then((user) => {
      if (user) fetchDashboard();
    });

    // ✅ AUTO-REFRESH EVERY 30 SECONDS
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, []);


  const fetchDashboard = async () => {
    try {
      const data = await apiFetch("/dashboard");
      setPending(data.pending || []);
      setPast(data.past || []);
      setPoints(data.points || 0);
      setCorrect(data.correct || 0);
      setWrong(data.wrong || 0);
      setRank(data.rank || "-");
      setLastSync(data.last_sync);
    } catch (err) {
      // apiFetch already handles 401 → redirect
      // Only log non-auth errors (e.g. network blips)
      if (err.message !== "Session expired") {
        console.error("Dashboard fetch error:", err);
      }
    }
  };

  // ✅ SAFE TIME FORMATTER
  const formatTime = (time) => {
    if (!time) return "TBA";
    const d = new Date(time);
    if (isNaN(d)) return "TBA";

    // return d.toLocaleTimeString("en-CA", {
    //   timeZone: "America/Toronto",
    //   hour: "2-digit",
    //   minute: "2-digit",
    // });



    // local timezone 
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };




  // ✅ PICK
  const handlePick = async (matchId, team) => {
    try {
      await apiFetch("/pick", {
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

      setTimeout(() => {
        setPending(prev => prev.filter(m => m.id !== matchId));
      }, 300);
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
      </div>

      <div className="vs">VS</div>

      <div className="team">
        <div className="team-logo">
          {match.team2}
        </div>
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
              SYSTEM UPDATED: {
              // new Date(lastSync).toLocaleTimeString("en-CA", {timeZone:'America/Toronto', hour: '2-digit', minute: '2-digit', second: '2-digit' })
              
              
              // local timezone 
              new Date(lastSync).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })



              }
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