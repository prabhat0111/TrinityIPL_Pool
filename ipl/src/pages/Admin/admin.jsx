import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");

    // 🔒 Protect route
    if (role !== "admin") {
      alert("Access denied");
      navigate("/leaderboard");
    }
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => navigate("/admin/add-match")}>
          ➕ Add Match
        </button>

        <br /><br />

        <button onClick={() => navigate("/admin/enter-results")}>
          🏆 Enter Results
        </button>

        <br /><br />

        <button onClick={() => navigate("/admin/add-user")}>
          👥 Manage Users
        </button>
      </div>
    </div>
  );
}

export default Admin;