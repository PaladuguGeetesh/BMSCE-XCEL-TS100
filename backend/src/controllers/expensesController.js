// ============================================================
// src/controllers/expensesController.js
// Expense operations logic (MySQL version)
// ============================================================

const pool = require("../config/db");

// ──────────────────────────────────────────────────────────
// GET /api/expenses
// Fetch all expenses for the logged-in user
// ──────────────────────────────────────────────────────────
async function getExpenses(req, res) {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `SELECT id, user_id, title, amount, category, date, created_at
       FROM expenses
       WHERE user_id = ?
       ORDER BY date DESC, created_at DESC`,
      [userId]
    );

    res.json({
      data: rows,
      count: rows.length,
    });
  } catch (err) {
    console.error("getExpenses error:", err);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
}

// ──────────────────────────────────────────────────────────
// POST /api/expenses
// Add a new expense
// ──────────────────────────────────────────────────────────
async function createExpense(req, res) {
  try {
    const userId = req.user.id;
    const { title, amount, category, date } = req.body;

    if (!title || !amount || !category || !date) {
      return res.status(400).json({
        error: "Validation failed",
        message: "title, amount, category, and date are required",
      });
    }

    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Amount must be a positive number",
      });
    }

    const validCategories = [
      "Food",
      "Travel",
      "Shopping",
      "Bills",
      "Entertainment",
      "Other",
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        error: "Validation failed",
        message: `Category must be one of: ${validCategories.join(", ")}`,
      });
    }

    const [result] = await pool.query(
      `INSERT INTO expenses (id, user_id, title, amount, category, date)
       VALUES (UUID(), ?, ?, ?, ?, ?)`,
      [userId, title.trim(), numericAmount, category, date]
    );

    res.status(201).json({
      message: "Expense created successfully",
      insertedId: result.insertId,
    });
  } catch (err) {
    console.error("createExpense error:", err);
    res.status(500).json({ error: "Failed to create expense" });
  }
}

// ──────────────────────────────────────────────────────────
// DELETE /api/expenses/:id
// Delete an expense
// ──────────────────────────────────────────────────────────
async function deleteExpense(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [result] = await pool.query(
      `DELETE FROM expenses
       WHERE id = ? AND user_id = ?`,
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Not found",
        message: "Expense not found or unauthorized",
      });
    }

    res.json({
      message: "Expense deleted successfully",
      deletedId: id,
    });
  } catch (err) {
    console.error("deleteExpense error:", err);
    res.status(500).json({ error: "Failed to delete expense" });
  }
}

// ──────────────────────────────────────────────────────────
// GET /api/expenses/summary
// Returns analytics data
// ──────────────────────────────────────────────────────────
async function getExpenseSummary(req, res) {
  try {
    const userId = req.user.id;

    const [totalsRows] = await pool.query(
      `SELECT
         COALESCE(SUM(amount),0) AS total_spending,
         COUNT(*) AS transaction_count
       FROM expenses
       WHERE user_id = ?`,
      [userId]
    );

    const [categoryRows] = await pool.query(
      `SELECT
         category,
         SUM(amount) AS total,
         COUNT(*) AS count
       FROM expenses
       WHERE user_id = ?
       GROUP BY category
       ORDER BY total DESC`,
      [userId]
    );

    const { total_spending, transaction_count } = totalsRows[0];

    const highestCategory = categoryRows[0]?.category ?? "N/A";

    res.json({
      totalSpending: parseFloat(total_spending),
      transactionCount: parseInt(transaction_count),
      highestCategory,
      categoryBreakdown: categoryRows.map((row) => ({
        category: row.category,
        total: parseFloat(row.total),
        count: parseInt(row.count),
      })),
    });
  } catch (err) {
    console.error("getExpenseSummary error:", err);
    res.status(500).json({ error: "Failed to fetch expense summary" });
  }
}

module.exports = {
  getExpenses,
  createExpense,
  deleteExpense,
  getExpenseSummary,
};