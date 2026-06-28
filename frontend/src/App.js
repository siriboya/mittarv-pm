import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import Users from "./components/Users";
import TasksDashboard from "./components/TasksDashboard";
import MyTasks from "./components/MyTasks";
import Login from "./components/Login";
import { AuthProvider, useAuth } from "./api/AuthContext";

function NavBar() {
  const { currentUser, logout } = useAuth();
  return (
    <div className="navbar">
      <h1>Mitt Arv — Project Management Utility</h1>
      <div>
        <Link to="/">Home</Link>
        <Link to="/users">Users</Link>
        <Link to="/tasks">Tasks Dashboard</Link>
        <Link to="/my-tasks">My Tasks</Link>
        {currentUser ? (
          <>
            <span style={{ marginLeft: 18, opacity: 0.85, fontSize: 14 }}>
              {currentUser.name}
            </span>
            <button
              className="btn btn-secondary"
              style={{ marginLeft: 12, padding: "4px 10px" }}
              onClick={logout}
            >
              Log Out
            </button>
          </>
        ) : (
          <Link to="/login">Log In</Link>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/users" element={<Users />} />
            <Route path="/tasks" element={<TasksDashboard />} />
            <Route path="/my-tasks" element={<MyTasks />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
