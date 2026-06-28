import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../api/AuthContext";

export default function Login() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/users").then((res) => setUsers(res.data));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find((u) => u._id === selected);
    if (user) {
      login(user);
      navigate("/");
    }
  };

  return (
    <div className="hero">
      <h2>Welcome to Mitt Arv PM</h2>
      <p>Select your profile to continue.</p>
      <div className="card" style={{ maxWidth: 360, margin: "20px auto", textAlign: "left" }}>
        {users.length === 0 ? (
          <p>
            No users yet. Go to the <strong>Users</strong> page first and create one, then come
            back here to log in.
          </p>
        ) : (
          <form onSubmit={handleLogin} style={{ flexDirection: "column", alignItems: "stretch" }}>
            <select value={selected} onChange={(e) => setSelected(e.target.value)} required>
              <option value="">-- Select your name --</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
            <button className="btn" type="submit">Log In</button>
          </form>
        )}
      </div>
    </div>
  );
}
