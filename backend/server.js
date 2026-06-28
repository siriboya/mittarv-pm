require("dns").setServers(["8.8.8.8", "8.8.4.4"]);
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const apiKeyAuth = require("./middleware/apiKeyAuth");
const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");

const app = express();

app.use(cors());
app.use(express.json());

// Health check (no key needed)
app.get("/", (req, res) => {
  res.json({ message: "Mitt Arv PM API is running" });
});

// All data routes require the API key header: x-api-key
app.use("/api/users", apiKeyAuth, userRoutes);
app.use("/api/tasks", apiKeyAuth, taskRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
