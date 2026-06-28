import React, { useEffect, useState } from "react";
import api from "../api/client";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", role: "Developer" });
  const [error, setError] = useState("");

  const loadUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/users", form);
      setForm({ name: "", email: "", role: "Developer" });
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user");
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/users/${id}`);
    loadUsers();
  };

  return (
    <div>
      <div className="card">
        <h3>Add User</h3>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option>Developer</option>
            <option>Manager</option>
            <option>Tester</option>
            <option>Admin</option>
          </select>
          <button className="btn" type="submit">Add User</button>
        </form>
        {error && <p style={{ color: "red", fontSize: 13 }}>{error}</p>}
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h3>All Users</h3>
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th></th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(u._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
