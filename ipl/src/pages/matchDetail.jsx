import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import "./matchDetail.css";

function MatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [match, setMatch] = useState(null);
  const [picks, setPicks] = useState([]);
  const [noPickUsers, setNoPickUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("URL PARAM ID:", id);

        // Fetch match
        const matchRes = await fetch(`http://localhost:8000/matches/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const matchData = await matchRes.json();

        console.log("MATCH DATA:", matchData);
        console.log("STATUS RAW:", matchData.status);

        setMatch(matchData);

        // Fetch picks
        const picksRes = await fetch(`http://localhost:8000/matches/${id}/picks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const picksData = await picksRes.json();

        console.log("PICKS DATA:", picksData);

        setPicks(picksData.picks || []);
        setNoPickUsers(picksData.no_pick_users || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="layout">
        <Sidebar />
        <p style={{ padding: "20px" }}>Loading...</p>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="layout">
        <Sidebar />
        <p style={{ padding: "20px" }}>Match not found.</p>
      </div>
    );
  }

  // ✅ FIX: Normalize status
  const status = match?.status?.toLowerCase().trim();

  console.log("MATCH:", match);
  console.log("STATUS RAW:", match?.status);
  console.log("NORMALIZED STATUS:", status);

  // ✅ FIX: Allow today, live, completed
  if (!["today", "live", "completed"].includes(status)) {
    return (
      <div className="layout">
        <Sidebar />
        <p style={{ padding: "20px" }}>This match is not viewable yet.</p>
      </div>
    );
  }

  const team1Picks = picks.filter(p => p.selected_team === match.team1);
  const team2Picks = picks.filter(p => p.selected_team === match.team2);

  const total = picks.length || 1;

  return (
    <div className="layout">
      <Sidebar />

      <div className="main-content">
        {/* Back Button */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {/* Header */}
        <div className="header-card">
          <p className="tag">{status.toUpperCase()}</p>
          <h1>{match.team1} vs {match.team2}</h1>
          <p>{new Date(match.match_time).toLocaleString()}</p>
        </div>

        {/* Picks Summary */}
        <div className="picks-summary">
          <div className="picks-bar-container">
            <div
              className="picks-bar team1-bar"
              style={{
                width: `${(team1Picks.length / total) * 100}%`
              }}
            />
            <div
              className="picks-bar team2-bar"
              style={{
                width: `${(team2Picks.length / total) * 100}%`
              }}
            />
          </div>

          <div className="picks-count">
            <span>
              {team1Picks.length} picks — {match.team1}
            </span>
            <span>
              {match.team2} — {team2Picks.length} picks
            </span>
          </div>
        </div>

        {/* Picks Columns */}
        <div className="picks-columns">
          {/* Team 1 */}
          <div className="picks-col">
            <h3>{match.team1}</h3>
            {team1Picks.length === 0 ? (
              <p>No picks yet</p>
            ) : (
              team1Picks.map((p, i) => (
                <div className="pick-row" key={i}>
                  <span className="avatar">
                    {p.username?.[0]?.toUpperCase() || "?"}
                  </span>
                  <span>{p.username}</span>
                </div>
              ))
            )}
          </div>

          {/* Team 2 */}
          <div className="picks-col">
            <h3>{match.team2}</h3>
            {team2Picks.length === 0 ? (
              <p>No picks yet</p>
            ) : (
              team2Picks.map((p, i) => (
                <div className="pick-row" key={i}>
                  <span className="avatar">
                    {p.username?.[0]?.toUpperCase() || "?"}
                  </span>
                  <span>{p.username}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* No Picks Section */}
        <div className="no-picks-section">
            <h3>Users Who Haven't Picked</h3>
            {noPickUsers.length === 0 ? (
                <p>None ✅ - Everyone has placed a bet!</p>
            ) : (
                noPickUsers.map((user, i) => (
                <div className="pick-row" key={i}>
                    <span className="avatar">{user?.[0]?.toUpperCase() || "?"}</span>
                    <span>{user}</span>
                </div>
                ))
            )}
            </div>
      </div>
    </div>
  );
}

export default MatchDetail;