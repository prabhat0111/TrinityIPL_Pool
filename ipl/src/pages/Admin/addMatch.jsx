import "../matches.css";
import Admin_Sidebar from "../../components/admin_sidebar";
import { useState } from "react";
import { BASE_URL } from "../config";

function AddMatch() {
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [matchTime, setMatchTime] = useState("");
  const [status, setStatus] = useState("upcoming");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // const res = await fetch("http://localhost:8000/admin/add-match", {
      const res = await fetch(`${BASE_URL}/admin/add-match`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          team1,
          team2,
          match_time: matchTime,
          status,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Match added ✅");
        setTeam1("");
        setTeam2("");
        setMatchTime("");
      } else {
        alert(data.detail);
      }
    } catch (err) {
      console.error(err);
      alert("Error adding match");
    }
  };

  return (
    <div className="layout">
      <Admin_Sidebar />

      <div className="main-content">
        <div className="header-card">
          <p className="tag">ADMIN PANEL</p>
          <h1>ADD MATCH</h1>
        </div>

        <div className="match-card" style={{ maxWidth: "500px" }}>
          <form onSubmit={handleSubmit}>

            <input
              type="text"
              placeholder="Team 1"
              value={team1}
              onChange={(e) => setTeam1(e.target.value)}
              required
            />

            <br /><br />

            <input
              type="text"
              placeholder="Team 2"
              value={team2}
              onChange={(e) => setTeam2(e.target.value)}
              required
            />

            <br /><br />

            <input
              type="datetime-local"
              className="data-input"
              value={matchTime}
              onChange={(e) => setMatchTime(e.target.value)}
              required
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '14px',
              }}
            />

            {/* Force calendar icon to white */}
            <style>
              {`
                .data-input::-webkit-calendar-picker-indicator {
                  filter: invert(100%) !important;
                }
              `}
            </style>

            <br /><br />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="upcoming">Upcoming</option>
              <option value="today">Today</option>
              <option value="live">Live</option>
            </select>

            <br /><br />

            <button type="submit">Add Match</button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AddMatch;