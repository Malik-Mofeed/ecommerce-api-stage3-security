const bcrypt = require("bcrypt");
const pool = require("../config/database");

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, phone, role, is_active, created_at
       FROM users
       ORDER BY id DESC`
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get users error:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id) || Number(id) <= 0) {
    return res.status(400).json({
      message: "Invalid user ID",
    });
  }

  try {
    // Prevent IDOR:
    // Customer can access only their own data.
    // Admin can access any user.
    if (req.user.role !== "admin" && Number(id) !== Number(req.user.id)) {
      return res.status(403).json({
        message: "You can only access your own data",
      });
    }

    const result = await pool.query(
      `SELECT id, full_name, email, phone, role, is_active, created_at
       FROM users
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Get user error:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const createUser = async (req, res) => {
  const {
    full_name,
    email,
    phone,
    password,
    role,
  } = req.body;

  if (!full_name || !full_name.trim()) {
    return res.status(400).json({
      message: "Full name is required",
    });
  }

  if (!email || !email.trim()) {
    return res.status(400).json({
      message: "Email is required",
    });
  }

  if (!password || !password.trim()) {
    return res.status(400).json({
      message: "Password is required",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters",
    });
  }

  try {
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email.trim()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users
       (full_name, email, phone, hash_password, role, is_active)
       VALUES ($1, $2, $3, $4, $5, true)
       RETURNING id, full_name, email, phone, role, is_active, created_at`,
      [
        full_name.trim(),
        email.trim(),
        phone || null,
        hashedPassword,
        role || "customer",
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create user error:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  if (!/^\d+$/.test(id) || Number(id) <= 0) {
    return res.status(400).json({
      message: "Invalid user ID",
    });
  }

  if (typeof is_active !== "boolean") {
    return res.status(400).json({
      message: "is_active must be true or false",
    });
  }

  try {
    const result = await pool.query(
      `UPDATE users
       SET is_active = $1
       WHERE id = $2
       RETURNING id, full_name, email, phone, role, is_active, created_at`,
      [is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Update user status error:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserStatus,
};