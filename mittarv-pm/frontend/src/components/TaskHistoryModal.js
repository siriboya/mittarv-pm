import React from "react";

export default function TaskHistoryModal({ task, onClose }) {
  if (!task) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{task.title}</h3>
        <p style={{ fontSize: 13, color: "#555" }}>{task.description}</p>
        <h4>History</h4>
        {task.history?.length ? (
          task.history
            .slice()
            .reverse()
            .map((h, i) => (
              <div className="history-item" key={i}>
                <strong>{h.fromPhase ? `${h.fromPhase} → ${h.toPhase}` : `Created in ${h.toPhase}`}</strong>
                <div>{new Date(h.changedAt).toLocaleString()}</div>
                {h.note && <div>Note: {h.note}</div>}
              </div>
            ))
        ) : (
          <p>No history yet.</p>
        )}
        <button className="btn btn-secondary" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
