import React, { useEffect, useState } from "react";
import api from "../api/client";
import TaskHistoryModal from "./TaskHistoryModal";
import { useAuth } from "../api/AuthContext";

export default function MyTasks() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);

  useEffect(() => {
    api.get("/users").then((res) => setUsers(res.data));
  }, []);

  // If logged in, default the filter to "me" automatically
  useEffect(() => {
    if (currentUser) setSelectedUser(currentUser._id);
  }, [currentUser]);

  useEffect(() => {
    if (!selectedUser) {
      setTasks([]);
      return;
    }
    api.get(`/tasks?assignedTo=${selectedUser}`).then((res) => setTasks(res.data));
  }, [selectedUser]);

  const openHistory = async (id) => {
    const res = await api.get(`/tasks/${id}`);
    setActiveTask(res.data);
  };

  return (
    <div>
      <div className="card">
        <h3>View Tasks Assigned To</h3>
        {currentUser && (
          <p style={{ fontSize: 13, color: "#6b7280" }}>
            Showing your tasks by default — switch below to view someone else's.
          </p>
        )}
        <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
          <option value="">Select a user</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>{u.name}</option>
          ))}
        </select>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h3>Assigned Tasks</h3>
        {tasks.length === 0 && <p>No tasks to show.</p>}
        <table>
          <thead><tr><th>Title</th><th>Phase</th><th>Priority</th><th></th></tr></thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t._id}>
                <td>{t.title}</td>
                <td>{t.phase}</td>
                <td><span className={`badge ${t.priority}`}>{t.priority}</span></td>
                <td>
                  <button className="btn btn-secondary" onClick={() => openHistory(t._id)}>
                    View History
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TaskHistoryModal task={activeTask} onClose={() => setActiveTask(null)} />
    </div>
  );
}
