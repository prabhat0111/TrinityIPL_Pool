import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { logout } from "../api";
import "./sidebar.css";
import logo from "../assets/logo.jpg";

function Admin_Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 🔥 Hamburger (mobile) */}
      <div className="hamburger" onClick={() => setOpen(!open)}>
        ☰
      </div>

      <div className={`sidebar ${open ? "open" : ""}`}>
        
        {/* ===== LOGO ===== */}
        <h2 className="logo-text">Welcome Admin!</h2>

        {/* ===== MENU ===== */}
        <ul className="menu">
          
          <NavLink to="/admin" end onClick={() => setOpen(false)}>
            {({ isActive }) => (
              <li className={isActive ? "active" : ""}>
                📊 All Matches
              </li>
            )}
          </NavLink>

          <NavLink to="/admin/add-match" onClick={() => setOpen(false)}>
            {({ isActive }) => (
              <li className={isActive ? "active" : ""}>
                ➕ Add Match
              </li>
            )}
          </NavLink>

          <NavLink to="/admin/enter-results" onClick={() => setOpen(false)}>
            {({ isActive }) => (
              <li className={isActive ? "active" : ""}>
                🏏 Enter Result
              </li>
            )}
          </NavLink>

          <NavLink to="/admin/add-user" onClick={() => setOpen(false)}>
            {({ isActive }) => (
              <li className={isActive ? "active" : ""}>
                👤 Add User
              </li>
            )}
          </NavLink>

        </ul>

        {/* ===== BOTTOM ===== */}
        <div className="bottom">
          <p onClick={logout}>
            🚪 Logout
          </p>

          <img src={logo} alt="Trinity Logo" className="sidebar-logo" />
        </div>
      </div>
    </>
  );
}

export default Admin_Sidebar;