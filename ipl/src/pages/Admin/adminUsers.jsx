import "../matches.css";
import Admin_Sidebar from "../../components/admin_sidebar";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const token = localStorage.getItem("token");

  // Fetch users
  const fetchUsers = async () => {
    // const res = await fetch("http://localhost:8000/admin/get-users", {
    const res = await fetch(`${BASE_URL}/admin/get-users`, {

      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add user
  const handleAddUser = async (e) => {
    e.preventDefault();
    // const res = await fetch("http://localhost:8000/admin/add-user", {
    const res = await fetch(`${BASE_URL}/admin/add-user`, {

      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("User added ✅");
      setName(""); setEmail(""); setPassword(""); setRole("user");
      fetchUsers();
    } else {
      alert(data.detail);
    }
  };

  // Remove user
  const handleRemoveUser = async (userId) => {
    if (!window.confirm("Are you sure?")) return;
    // const res = await fetch("http://localhost:8000/admin/remove-user", {
    const res = await fetch(`${BASE_URL}/admin/remove-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ user_id: userId }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("User removed ✅");
      fetchUsers();
    } else {
      alert(data.detail);
    }
  };

  return (
    <div className="layout">
      <Admin_Sidebar />

      <div className="main-content">
        <div className="header-card">
          <p className="tag">ADMIN PANEL</p>
          <h1>MANAGE USERS</h1>
        </div>

        {/* Add User */}
        <div className="match-card" style={{ maxWidth: "500px", marginBottom: "20px" }}>
          <form onSubmit={handleAddUser}>
            <input
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />

            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <button type="submit">Add User</button>
          </form>
        </div>

        {/* User List */}
        <div className="match-card1">
          <h3>Existing Users</h3>

          {users.map(u => (
            <div
              key={u.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
                padding: "10px",
                borderBottom: "1px solid #eee"
              }}
            >
              <span>
                {u.name} ({u.email}, {u.role})
              </span>

              <button
                onClick={() => handleRemoveUser(u.id)}
                className="remove-user-btn"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;