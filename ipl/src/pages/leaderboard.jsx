import "./leaderboard.css";
import Sidebar from "../components/sidebar"; // adjust path if needed

function Leaderboard() {
  const players = [
    { rank: "01", name: "CricketKing_01", initials: "CK", tier: "PLATINUM TIER", points: "16,240" },
    { rank: "02", name: "Arjun_99", initials: "A9", tier: "GOLD TIER", points: "14,820" },
    { rank: "03", name: "Vicky_Pro", initials: "VP", tier: "GOLD TIER", points: "13,100" },
    { rank: "04", name: "Sharma_Master", initials: "SM", tier: "SILVER TIER", points: "12,500" },
    { rank: "05", name: "Dhoni_Biggest_Fan", initials: "DB", tier: "SILVER TIER", points: "11,920" },
  ];

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
            <div className="row" key={index}>
              <div className="rank">{p.rank}</div>

              <div className="user">
                <div className="avatar">{p.initials}</div>
                <div>
                  <p className="name">{p.name}</p>
                  <p className="tier">{p.tier}</p>
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