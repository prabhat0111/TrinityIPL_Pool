import React from "react";
import "./sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">ARENA PRO</h2>

      <ul className="menu">
        <li className="active">📊 Leaderboard</li>
        <li >Matches</li>
        <li>👥 Users</li>
      </ul>

      <div className="bottom">
        <p>❓ Support</p>
      </div>
    </div>
  );
}

export default Sidebar;