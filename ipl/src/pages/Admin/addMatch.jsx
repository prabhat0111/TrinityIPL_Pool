import React, { useState } from "react";

function AddMatch() {
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [matchTime, setMatchTime] = useState("");
  const [status, setStatus] = useState("upcoming");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:8000/admin/add-match", {
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
    <div style={{ padding: "20px" }}>
      <h2>Add Match</h2>

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
          value={matchTime}
          onChange={(e) => setMatchTime(e.target.value)}
          required
        />
        <br /><br />
        
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="upcoming">Upcoming</option>
        <option value="today">Today</option>
        <option value="live">Live</option>
        </select>
        <br /><br />

        <button type="submit">Add Match</button>
      </form>
    </div>
  );
}

export default AddMatch;