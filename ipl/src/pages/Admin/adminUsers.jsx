import React, { useEffect, useState } from "react";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const token = localStorage.getItem("token");

  // Fetch users
  const fetchUsers = async () => {
    const res = await fetch("http://localhost:8000/admin/get-users", {
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
    const res = await fetch("http://localhost:8000/admin/add-user", {
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
    const res = await fetch("http://localhost:8000/admin/remove-user", {
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
    <div style={{ padding: "20px" }}>
      <h2>Manage Users</h2>

      <form onSubmit={handleAddUser}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Add User</button>
      </form>

      <h3>Existing Users</h3>
      <ul>
        {users.map(u => (
          <li key={u.id}>
            {u.name} ({u.email}, {u.role})
            <button onClick={() => handleRemoveUser(u.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminUsers;