import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../api/AuthContext";

const PHASES = ["Backlog", "In Progress", "Review", "Done"];

export default function Home() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/tasks").then((res) => setTasks(res.data));
    api.get("/users").then((res) => setUsers(res.data));
  }, []);

  const myTasks = currentUser
    ? tasks.filter((t) => t.assignedTo?._id === currentUser._id)
    : [];

  return (
    <div>
      <div className="hero" style={{ paddingBottom: 20 }}>
        <h2>
          {currentUser ? `Welcome back, ${currentUser.name} 👋` : "Plan it. Track it. Deliver it."}
        </h2>
        <p>
          A simple project management utility to move tasks through SDLC phases — Backlog, In
          Progress, Review, and Done — with full history tracked for every task.
        </p>
        {!currentUser && (
          <Link to="/login" className="btn" style={{ textDecoration: "none", display: "inline-block", marginTop: 10 }}>
            Log In
          </Link>
        )}
      </div>

      <div className="card" style={{ display: "flex", gap: 30, justifyContent: "space-around", textAlign: "center" }}>
        <div>
          <h2 style={{ margin: 0 }}>{tasks.length}</h2>
          <p style={{ margin: 0, color: "#6b7280" }}>Total Tasks</p>
        </div>
        <div>
          <h2 style={{ margin: 0 }}>{users.length}</h2>
          <p style={{ margin: 0, color: "#6b7280" }}>Total Users</p>
        </div>
        <div>
          <h2 style={{ margin: 0 }}>{tasks.filter((t) => t.phase === "Done").length}</h2>
          <p style={{ margin: 0, color: "#6b7280" }}>Completed Tasks</p>
        </div>
        {currentUser && (
          <div>
            <h2 style={{ margin: 0 }}>{myTasks.length}</h2>
            <p style={{ margin: 0, color: "#6b7280" }}>My Tasks</p>
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h3>Tasks by Phase</h3>
        <div style={{ display: "flex", gap: 16 }}>
          {PHASES.map((phase) => (
            <div key={phase} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 600 }}>
                {tasks.filter((t) => t.phase === phase).length}
              </div>
              <div style={{ fontSize: 13, color: "#6b7280" }}>{phase}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <Link to="/tasks" className="btn btn-secondary" style={{ textDecoration: "none" }}>
            Go to Tasks Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
