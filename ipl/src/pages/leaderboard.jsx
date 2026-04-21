import "./leaderboard.css";
import Sidebar from "../components/sidebar";
import { useEffect, useState } from "react";
import { apiFetch } from "../api";

function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);


  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await apiFetch("/leaderboard");
        setPlayers(data);
      } catch (err) {
        if (err.message !== "Session expired") {
          console.error(err);
          alert("Error fetching leaderboard");
        }
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="layout">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="main-content">
        {/* HEADER */}
        <div className="header-card">

          {/* LOGO + TITLE */}
          <div className="header-top">

            <div>
              <p className="season">SEASON 2026</p>
              <h1>IPL LEADERBOARD</h1>
            </div>

          </div>

          <p className="subtitle">
            Track the elite performers of the Digital Arena. Every wicket, every
            boundary, and every tactical pick counts toward the ultimate crown.
          </p>
        </div>

        {/* PODIUM TOP 3 */}
        <div className="podium">
          {[...players].sort((a, b) => a.rank - b.rank).slice(0, 3).map((p, index) => {
            const order = ["first", "second", "third"];

            return (
              <div
                  className={`podium-col ${order[index]} ${
                    index === 0 ? "winner-glow" : ""
                  }`}
                  key={p.name}
                >
                
                {/* Trophy */}
                <div className="trophy">
                  {index === 0 ? "👑" : index === 1 ? "🥈" : "🥉"}
                </div>

                {/* Name */}
                <p className="podium-name">{p.name}</p>

                {/* Block */}
                <div className="podium-box">
                  
                </div>

              </div>
            );
          })}
        </div>

        {/* TABLE */}
        <div className="table-card">
          <div className="table-header">
            <span>USER RANK</span>
            <span>NAME</span>
            <span className="points">TOTAL POINTS</span>
          </div>

          {players.slice(0, visibleCount).map((p, index) => (
              <div className="row" key={p.name}>
              <div className="rank">
                {p.rank < 10 ? `0${p.rank}` : p.rank}
              </div>

              <div className="user">
                <div className="avatar">
                  {p.name ? p.name[0].toUpperCase() : "U"}
                </div>
                <div>
                  <p className="name">{p.name}</p>
                  <p className="tier">PLAYER</p>
                </div>
              </div>

              <div className="points">{p.points}</div>
            </div>
          ))}

          {players.length > 5 && visibleCount < players.length && (
            <button
              className="load-btn"
              onClick={() => setVisibleCount(players.length)}
            >
              LOAD MORE PLAYERS
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;