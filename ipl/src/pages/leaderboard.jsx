import "./leaderboard.css";
import Sidebar from "../components/sidebar";
import { useEffect, useState } from "react";
// import logo from "../assets/logo.jpg";

function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);


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

          {/* LOGO + TITLE */}
          <div className="header-top">

            <div>
              <p className="season">SEASON 2026</p>
              <h1>IPL LEADERBOARD</h1>
            </div>
              {/* <img src={logo} alt="Trinity Logo" className="logo" /> */}

          </div>

          <p className="subtitle">
            Track the elite performers of the Digital Arena. Every wicket, every
            boundary, and every tactical bet counts toward the ultimate crown.
          </p>
        </div>

        {/* PODIUM TOP 3 */}
        <div className="podium">
          {[...players].sort((a, b) => a.rank - b.rank).slice(0, 3).map((p, index) => {
            const order = ["first", "second", "third"];

            return (
              // <div className={`podium-col ${order[index]}`} key={p.name}>
              <div
                  className={`podium-col ${order[index]} ${
                    index === 0 ? "winner-glow" : ""
                  }`}
                  key={p.name}
                >
                
                {/* Trophy */}
                <div className="trophy">
                  {/* {index === 1 ? "👑" : index === 0 ? "🥈" : "🥉"} */}
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

          {/* {players.map((p, index) => ( */}
          {players.slice(0, visibleCount).map((p, index) => (
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

          {/* <button className="load-btn">LOAD MORE PLAYERS</button> */}
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