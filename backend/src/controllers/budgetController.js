// ============================================================
// src/controllers/budgetController.js
// Budget operations (MySQL version)
// ============================================================

const pool = require("../config/db");

// ──────────────────────────────────────────────────────────
// GET /api/budget
// Fetch the user's budget for the current month
// ──────────────────────────────────────────────────────────
async function getBudget(req, res) {
  try {
    const userId = req.user.id;

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const [rows] = await pool.query(
      `SELECT id, user_id, monthly_budget, month, year, created_at
       FROM budgets
       WHERE user_id = ? AND month = ? AND year = ?`,
      [userId, month, year]
    );

    if (rows.length === 0) {
      return res.json({
        data: null,
        message: "No budget set for this month",
        currentMonth: month,
        currentYear: year,
      });
    }

    res.json({
      data: rows[0],
      currentMonth: month,
      currentYear: year,
    });
  } catch (err) {
    console.error("getBudget error:", err);
    res.status(500).json({ error: "Failed to fetch budget" });
  }
}

// ──────────────────────────────────────────────────────────
// POST /api/budget
// Set or update monthly budget
// ──────────────────────────────────────────────────────────
async function setBudget(req, res) {
  try {
    const userId = req.user.id;
    const { monthly_budget } = req.body;

    const amount = parseFloat(monthly_budget);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        error: "Validation failed",
        message: "monthly_budget must be a positive number",
      });
    }

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const [result] = await pool.query(
      `INSERT INTO budgets (id, user_id, monthly_budget, month, year)
       VALUES (UUID(), ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE monthly_budget = VALUES(monthly_budget)`,
      [userId, amount, month, year]
    );

    res.status(201).json({
      message: "Budget saved successfully",
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    console.error("setBudget error:", err);
    res.status(500).json({ error: "Failed to set budget" });
  }
}

// ──────────────────────────────────────────────────────────
// PUT /api/budget/:id
// Update an existing budget
// ──────────────────────────────────────────────────────────
async function updateBudget(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { monthly_budget } = req.body;

    const amount = parseFloat(monthly_budget);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        error: "Validation failed",
        message: "monthly_budget must be a positive number",
      });
    }

    const [result] = await pool.query(
      `UPDATE budgets
       SET monthly_budget = ?
       WHERE id = ? AND user_id = ?`,
      [amount, id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Not found",
        message: "Budget not found or unauthorized",
      });
    }

    res.json({
      message: "Budget updated successfully",
    });
  } catch (err) {
    console.error("updateBudget error:", err);
    res.status(500).json({ error: "Failed to update budget" });
  }
}

// ──────────────────────────────────────────────────────────
// GET /api/budget/summary
// Returns dashboard data
// ──────────────────────────────────────────────────────────
async function getBudgetSummary(req, res) {
  try {
    const userId = req.user.id;

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const [budgetRows] = await pool.query(
      `SELECT monthly_budget
       FROM budgets
       WHERE user_id = ? AND month = ? AND year = ?`,
      [userId, month, year]
    );

    const [expenseRows] = await pool.query(
      `SELECT COALESCE(SUM(amount),0) AS total_expenses
       FROM expenses
       WHERE user_id = ?
       AND MONTH(date) = ?
       AND YEAR(date) = ?`,
      [userId, month, year]
    );

    const monthlyBudget = budgetRows[0]
      ? parseFloat(budgetRows[0].monthly_budget)
      : 0;

    const totalExpenses = parseFloat(expenseRows[0].total_expenses);

    const remainingBalance = monthlyBudget - totalExpenses;

    res.json({
      monthlyBudget,
      totalExpenses,
      remainingBalance,
      isOverBudget: remainingBalance < 0,
      month,
      year,
    });
  } catch (err) {
    console.error("getBudgetSummary error:", err);
    res.status(500).json({ error: "Failed to fetch budget summary" });
  }
}

module.exports = {
  getBudget,
  setBudget,
  updateBudget,
  getBudgetSummary,
};