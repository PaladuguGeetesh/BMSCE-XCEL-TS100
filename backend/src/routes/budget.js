// ============================================================
// src/routes/budget.js
// Defines routes for budget management.
// All routes here are protected by authMiddleware (set in server.js).
// ============================================================

const express = require("express");
const router = express.Router();
const {
  getBudget,
  setBudget,
  updateBudget,
  getBudgetSummary,
} = require("../controllers/budgetController");

// GET  /api/budget/summary    → monthly budget + total spent + remaining balance
// ⚠️  Must come before /:id routes
router.get("/summary", getBudgetSummary);

// GET  /api/budget            → get current month's budget
router.get("/", getBudget);

// POST /api/budget            → set/create budget for current month
router.post("/", setBudget);

// PUT  /api/budget/:id        → update an existing budget record
router.put("/:id", updateBudget);

module.exports = router;
