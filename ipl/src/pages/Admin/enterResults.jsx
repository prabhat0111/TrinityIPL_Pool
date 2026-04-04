import React, { useState, useEffect } from "react";

function EnterResult() {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState("");
  const [result, setResult] = useState("");

  const fetchMatches = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8000/matches?status=live", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:8000/admin/enter-result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
    <div style={{ padding: "20px" }}>
      <h2>Enter Match Result</h2>

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
        <br /><br />

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
                <>
                  <option key={m.team1} value={m.team1}>
                    {m.team1}
                  </option>
                  <option key={m.team2} value={m.team2}>
                    {m.team2}
                  </option>
                </>
              ))}
        </select>
        <br /><br />

        <button type="submit">Enter Result</button>
      </form>
    </div>
  );
}

export default EnterResult;