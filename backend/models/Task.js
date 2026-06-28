const mongoose = require("mongoose");

// Each entry records a phase change so full history is visible on demand
const historyEntrySchema = new mongoose.Schema(
  {
    fromPhase: { type: String, default: null },
    toPhase: { type: String, required: true },
    changedAt: { type: Date, default: Date.now },
    note: { type: String, default: "" },
  },
  { _id: false }
);

const PHASES = ["Backlog", "In Progress", "Review", "Done"];

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    phase: { type: String, enum: PHASES, default: "Backlog" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    history: { type: [historyEntrySchema], default: [] },
  },
  { timestamps: true }
);

// Auto-log the very first phase on creation
taskSchema.pre("save", function (next) {
  if (this.isNew) {
    this.history.push({ fromPhase: null, toPhase: this.phase, note: "Task created" });
  }
  next();
});

module.exports = mongoose.model("Task", taskSchema);
module.exports.PHASES = PHASES;
