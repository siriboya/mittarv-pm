import React, { useEffect, useState } from "react";
import api from "../api/client";
import TaskHistoryModal from "./TaskHistoryModal";

const PHASES = ["Backlog", "In Progress", "Review", "Done"];

export default function TasksDashboard() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", priority: "Medium", assignedTo: "" });
  const [activeTask, setActiveTask] = useState(null);

  const loadData = async () => {
    const [taskRes, userRes] = await Promise.all([api.get("/tasks"), api.get("/users")]);
    setTasks(taskRes.data);
    setUsers(userRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const payload = { ...form, assignedTo: form.assignedTo || null };
    await api.post("/tasks", payload);
    setForm({ title: "", description: "", priority: "Medium", assignedTo: "" });
    loadData();
  };

  const moveTask = async (task, newPhase) => {
    await api.put(`/tasks/${task._id}`, { phase: newPhase, note: `Moved to ${newPhase}` });
    loadData();
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    loadData();
  };

  const openHistory = async (id) => {
    const res = await api.get(`/tasks/${id}`);
    setActiveTask(res.data);
  };

  return (
    <div>
      <div className="card">
        <h3>Create Task</h3>
        <form onSubmit={handleCreate}>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <select value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>{u.name}</option>
            ))}
          </select>
          <button className="btn" type="submit">Add Task</button>
        </form>
      </div>

      <div className="board">
        {PHASES.map((phase) => (
          <div className="column" key={phase}>
            <h3>{phase} ({tasks.filter((t) => t.phase === phase).length})</h3>
            {tasks
              .filter((t) => t.phase === phase)
              .map((t) => (
                <div className="task-card" key={t._id} onClick={() => openHistory(t._id)}>
                  <div className="title">{t.title}</div>
                  <div className="meta">
                    <span className={`badge ${t.priority}`}>{t.priority}</span>
                    {" "}
                    {t.assignedTo?.name || "Unassigned"}
                  </div>
                  <div style={{ marginTop: 8, display: "flex", gap: 6 }} onClick={(e) => e.stopPropagation()}>
                    <select
                      defaultValue=""
                      onChange={(e) => e.target.value && moveTask(t, e.target.value)}
                    >
                      <option value="">Move to...</option>
                      {PHASES.filter((p) => p !== phase).map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    <button className="btn btn-danger" onClick={() => deleteTask(t._id)}>✕</button>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>

      <TaskHistoryModal task={activeTask} onClose={() => setActiveTask(null)} />
    </div>
  );
}
