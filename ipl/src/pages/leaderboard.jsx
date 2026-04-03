import "./leaderboard.css";
import Sidebar from "../components/sidebar";
import { useEffect, useState } from "react";

function Leaderboard() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("http://localhost:8000/leaderboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setPlayers(data);
        } else {
          alert("Session expired. Please login again.");
          window.location.href = "/";
        }
      } catch (err) {
        console.error(err);
        alert("Error fetching leaderboard");
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
          <p className="season">SEASON 2024</p>
          <h1>IPL LEADERBOARD</h1>
          <p className="subtitle">
            Track the elite performers of the Digital Arena. Every wicket, every
            boundary, and every tactical bet counts toward the ultimate crown.
          </p>
        </div>

        {/* TABLE */}
        <div className="table-card">
          <div className="table-header">
            <span>USER RANK</span>
            <span>NAME</span>
            <span className="points">TOTAL POINTS</span>
          </div>

          {players.map((p, index) => (
            // <div className="row" key={index}>
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

          <button className="load-btn">LOAD MORE PLAYERS</button>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;