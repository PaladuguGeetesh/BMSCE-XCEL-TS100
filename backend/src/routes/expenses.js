// ============================================================
// src/routes/expenses.js
// Defines which HTTP methods + URLs map to which controller functions.
// All routes here are protected by authMiddleware (set in server.js).
// ============================================================

const express = require("express");
const router = express.Router();
const {
  getExpenses,
  createExpense,
  deleteExpense,
  getExpenseSummary,
} = require("../controllers/expensesController");

// GET  /api/expenses/summary  → analytics (total, categories, count)
// ⚠️  This MUST come before /:id routes or Express will treat "summary" as an id
router.get("/summary", getExpenseSummary);

// GET  /api/expenses          → fetch all expenses for logged-in user
router.get("/", getExpenses);

// POST /api/expenses          → create a new expense
router.post("/", createExpense);

// DELETE /api/expenses/:id    → delete a specific expense
router.delete("/:id", deleteExpense);

module.exports = router;
