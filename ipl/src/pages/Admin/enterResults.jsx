import React, { useState, useEffect } from "react";
import "../matches.css";
import Admin_Sidebar from "../../components/admin_sidebar";
import { BASE_URL } from "../config";
import { fetchWithAuth } from "../../utils/fetchWithAuth";

function EnterResult() {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState("");
  const [result, setResult] = useState("");

  const fetchMatches = async () => {
    // const token = localStorage.getItem("token");
    try {
      // const res = await fetch("http://localhost:8000/matches?status=live", {
      // const res = await fetch(`${BASE_URL}/matches?status=live`, {

      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      const res = await fetchWithAuth("/matches?status=live");

      const data = await res.json();
      if (res.ok) {
        setMatches(data);
      } else {
        alert(data.detail || "Error fetching matches");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching matches");
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMatch || !result) {
      alert("Select a match and result");
      return;
    }

    // const token = localStorage.getItem("token");

    try {
      // const res = await fetch("http://localhost:8000/admin/enter-result", {
      // const res = await fetch(`${BASE_URL}/admin/enter-result`, {

      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({
      //     match_id: selectedMatch,
      //     result: result,
      //   }),
      // });
      
      // token 
      const res = await fetchWithAuth("/admin/enter-result", {
        method: "POST",
        body: JSON.stringify({
          match_id: selectedMatch,
          result: result,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Result entered ✅");
        setSelectedMatch("");
        setResult("");
        fetchMatches(); // refresh match list
      } else {
        alert(data.detail);
      }
    } catch (err) {
      console.error(err);
      alert("Error entering result");
    }
  };

  return (
    <div className="layout">
      <Admin_Sidebar />

      <div className="main-content">
        <div className="header-card">
          <p className="tag">ADMIN PANEL</p>
          <h1>ENTER RESULT</h1>
        </div>

        <div className="match-card" style={{ maxWidth: "500px" }}>
          <form onSubmit={handleSubmit}>

            <select
              value={selectedMatch}
              onChange={(e) => setSelectedMatch(e.target.value)}
              required
            >
              <option value="">Select Live Match</option>
              {matches.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.team1} vs {m.team2} ({new Date(m.match_time).toLocaleString()})
                </option>
              ))}
            </select>

            <select
              value={result}
              onChange={(e) => setResult(e.target.value)}
              required
            >
              <option value="">Select Result</option>

              {selectedMatch &&
                matches
                  .filter((m) => m.id === parseInt(selectedMatch))
                  .map((m) => (
                    <React.Fragment key={m.id}>
                      <option value={m.team1}>{m.team1}</option>
                      <option value={m.team2}>{m.team2}</option>
                      <option value="No Result">No Result / Abandoned</option>
                    </React.Fragment>
                  ))}
            </select>

            <button type="submit">Enter Result</button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default EnterResult;