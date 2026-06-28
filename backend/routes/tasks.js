const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { PHASES } = require("../models/Task");

// CREATE
router.post("/", async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ all (optionally filter by ?assignedTo=<userId> or ?phase=<phase>)
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;
    if (req.query.phase) filter.phase = req.query.phase;

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ one — includes full history (the "on demand" history view)
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("assignedTo", "name email role");
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE — if "phase" changes, push a history entry automatically
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const { phase, note, ...rest } = req.body;

    if (phase && phase !== task.phase) {
      if (!PHASES.includes(phase)) {
        return res.status(400).json({ message: `Invalid phase. Allowed: ${PHASES.join(", ")}` });
      }
      task.history.push({ fromPhase: task.phase, toPhase: phase, note: note || "" });
      task.phase = phase;
    }

    Object.assign(task, rest);
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
