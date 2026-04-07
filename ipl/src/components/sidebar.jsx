import React from "react";
import { NavLink } from "react-router-dom";
import "./sidebar.css";
import logo from "../assets/logo.jpg";


function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo-text">TRINITY IPL</h2>

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

        <NavLink to="/profile">
          {({ isActive }) => (
            <li className={isActive ? "active" : ""}>
              👤 My Profile
            </li>
          )}
        </NavLink>
      </ul>

      {/* Bottom Section */}
      <div className="bottom">
        {/* <NavLink to="/resetpass">
          {({ isActive }) => (
            <p className={isActive ? "active-bottom" : ""}>
              🔐 Reset Password
            </p>
          )}
        </NavLink> */}

        <p onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}>
          🚪 Logout
        </p>

         <img src={logo} alt="Trinity Logo" className="sidebar-logo" />

      </div>
    </div>
  );
}

export default Sidebar;