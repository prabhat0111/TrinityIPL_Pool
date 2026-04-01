import React from "react";
import { NavLink } from "react-router-dom";
import "./sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">ARENA PRO</h2>

      <ul className="menu">
        <NavLink to="/leaderboard">
          {({ isActive }) => (
            <li className={isActive ? "active" : ""}>
              📊 Leaderboard
            </li>
          )}
        </NavLink>

        <NavLink to="/matches">
          {({ isActive }) => (
            <li className={isActive ? "active" : ""}>
              🏏 Matches
            </li>
          )}
        </NavLink>

        <NavLink to="/users">
          {({ isActive }) => (
            <li className={isActive ? "active" : ""}>
              👥 Users
            </li>
          )}
        </NavLink>
      </ul>

      {/* Bottom Section */}
      <div className="bottom">
        <NavLink to="/resetpass">
          {({ isActive }) => (
            <p className={isActive ? "active-bottom" : ""}>
              🔐 Reset Password
            </p>
          )}
        </NavLink>

        <p>❓ Support</p>
      </div>
    </div>
  );
}

export default Sidebar;