import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./sidebar.css";
import logo from "../assets/logo.jpg";

function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 🔥 Hamburger button (mobile only) */}
      <div className="hamburger" onClick={() => setOpen(!open)}>
        ☰
      </div>

      <div className={`sidebar ${open ? "open" : ""}`}>
        <h2 className="logo-text">TRINITY IPL</h2>

        <ul className="menu">
          <NavLink to="/dashboard" onClick={() => setOpen(false)}>
            {({ isActive }) => (
              <li className={isActive ? "active" : ""}>🏠︎ Dashboard</li>
            )}
          </NavLink>

          <NavLink to="/matches" onClick={() => setOpen(false)}>
            {({ isActive }) => (
              <li className={isActive ? "active" : ""}>🏏 Matches</li>
            )}
          </NavLink>

          <NavLink to="/leaderboard" onClick={() => setOpen(false)}>
            {({ isActive }) => (
              <li className={isActive ? "active" : ""}>📊 Leaderboard</li>
            )}
          </NavLink>

          <NavLink to="/profile" onClick={() => setOpen(false)}>
            {({ isActive }) => (
              <li className={isActive ? "active" : ""}>👤 My Profile</li>
            )}
          </NavLink>
        </ul>

        <div className="bottom">
          <p
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
          >
            🚪 Logout
          </p>

          <img src={logo} alt="Trinity Logo" className="sidebar-logo" />
        </div>
      </div>
    </>
  );
}

export default Sidebar;