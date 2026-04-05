import React from "react";
import { NavLink } from "react-router-dom";
import "./sidebar.css";

function Admin_Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">HELLO ADMIN</h2>

      <ul className="menu">
        <NavLink to="/admin">
          {({ isActive }) => (
            <li className={isActive ? "active" : ""}>
              📊 ALL MATCHES
            </li>
          )}
        </NavLink>
        <NavLink to="/admin/add-match">
          {({ isActive }) => (
            <li className={isActive ? "active" : ""}>
              📊 ADD MATCH
            </li>
          )}
        </NavLink>

        <NavLink to="/admin/enter-results">
          {({ isActive }) => (
            <li className={isActive ? "active" : ""}>
              🏏 ENTER RESULT
            </li>
          )}
        </NavLink>

        <NavLink to="/admin/add-user">
          {({ isActive }) => (
            <li className={isActive ? "active" : ""}>
              👥 ADD USER
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

export default Admin_Sidebar;