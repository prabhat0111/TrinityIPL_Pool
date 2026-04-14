import "../matches.css";
import Admin_Sidebar from "../../components/admin_sidebar";
import React, { useEffect, useState } from "react";
import { apiFetch } from "../../api";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  // Fetch users
  const fetchUsers = async () => {
    try {
      const data = await apiFetch("/admin/get-users");
      setUsers(data);
    } catch (err) {
      if (err.message !== "Session expired") {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add user
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await apiFetch("/admin/add-user", {
        method: "POST",
        body: JSON.stringify({ name, email, password, role }),
      });
      alert("User added ✅");
      setName(""); setEmail(""); setPassword(""); setRole("user");
      fetchUsers();
    } catch (err) {
      if (err.message !== "Session expired") {
        alert(err.data?.detail || "Error adding user");
      }
    }
  };

  // Remove user
  const handleRemoveUser = async (userId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await apiFetch("/admin/remove-user", {
        method: "POST",
        body: JSON.stringify({ user_id: userId }),
      });
      alert("User removed ✅");
      fetchUsers();
    } catch (err) {
      if (err.message !== "Session expired") {
        alert(err.data?.detail || "Error removing user");
      }
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