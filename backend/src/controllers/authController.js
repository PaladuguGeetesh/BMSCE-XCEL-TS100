const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const pool     = require("../config/db");
require("dotenv").config();

// POST /api/auth/signup
async function signup(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Validation failed", message: "Email and password are required" });
    if (password.length < 6)
      return res.status(400).json({ error: "Validation failed", message: "Password must be at least 6 characters" });

    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email.toLowerCase()]);
    if (existing.length > 0)
      return res.status(409).json({ error: "Conflict", message: "An account with this email already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const userId = uuidv4();

    await pool.query(
      "INSERT INTO users (id, email, password) VALUES (?, ?, ?)",
      [userId, email.toLowerCase(), hashedPassword]
    );

    const token = jwt.sign(
      { id: userId, email: email.toLowerCase() },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: { id: userId, email: email.toLowerCase() },
    });
  } catch (err) {
    console.error("signup error:", err);
    res.status(500).json({ error: "Failed to create account" });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Validation failed", message: "Email and password are required" });

    const [rows] = await pool.query(
      "SELECT id, email, password FROM users WHERE email = ?",
      [email.toLowerCase()]
    );
    if (rows.length === 0)
      return res.status(401).json({ error: "Unauthorized", message: "Invalid email or password" });

    const user = rows[0];
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(401).json({ error: "Unauthorized", message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.json({ message: "Login successful", token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ error: "Failed to log in" });
  }
}

// GET /api/auth/me
async function getMe(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT id, email, created_at FROM users WHERE id = ?",
      [req.user.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "User not found" });
    res.json({ user: rows[0] });
  } catch (err) {
    console.error("getMe error:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
}

module.exports = { signup, login, getMe };
