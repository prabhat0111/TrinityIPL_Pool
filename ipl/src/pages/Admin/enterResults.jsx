import React, { useState, useEffect } from "react";
import "../matches.css";
import Admin_Sidebar from "../../components/admin_sidebar";
import { apiFetch } from "../../api";

function EnterResult() {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState("");
  const [result, setResult] = useState("");

  const fetchMatches = async () => {
    try {
      const data = await apiFetch("/matches?status=live");
      setMatches(data);
    } catch (err) {
      if (err.message !== "Session expired") {
        console.error(err);
        alert("Error fetching matches");
      }
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

    try {
      await apiFetch("/admin/enter-result", {
        method: "POST",
        body: JSON.stringify({
          match_id: selectedMatch,
          result: result,
        }),
      });

      alert("Result entered ✅");
      setSelectedMatch("");
      setResult("");
      fetchMatches(); // refresh match list
    } catch (err) {
      if (err.message !== "Session expired") {
        console.error(err);
        alert(err.data?.detail || "Error entering result");
      }
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