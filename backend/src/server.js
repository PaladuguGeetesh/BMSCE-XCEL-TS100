require("dotenv").config();

const express = require("express");
const cors    = require("cors");

const authMiddleware  = require("./middleware/auth");
const authRouter      = require("./routes/auth");
const expensesRouter  = require("./routes/expenses");
const budgetRouter    = require("./routes/budget");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:8080",
  credentials: true,
}));
app.use(express.json());

// ── Public Routes (no login needed) ─────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Smart Expense Tracker API is running 🚀", timestamp: new Date().toISOString() });
});

// Auth: signup + login are public
app.use("/api/auth", authRouter);

// ── Protected Routes (JWT required) ─────────────────────
app.use("/api/expenses", authMiddleware, expensesRouter);
app.use("/api/budget",   authMiddleware, budgetRouter);

// ── 404 Handler ──────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.path} does not exist`,
    availableRoutes: [
      "GET    /health",
      "POST   /api/auth/signup",
      "POST   /api/auth/login",
      "GET    /api/auth/me",
      "GET    /api/expenses",
      "POST   /api/expenses",
      "DELETE /api/expenses/:id",
      "GET    /api/expenses/summary",
      "GET    /api/budget",
      "POST   /api/budget",
      "PUT    /api/budget/:id",
      "GET    /api/budget/summary",
    ],
  });
});

// ── Global Error Handler ──────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

// ── Start ────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth API:     http://localhost:${PORT}/api/auth`);
  console.log(`📦 Expenses API: http://localhost:${PORT}/api/expenses`);
  console.log(`💰 Budget API:   http://localhost:${PORT}/api/budget\n`);
});
