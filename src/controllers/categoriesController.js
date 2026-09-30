const pool = require("../config/database");

const getAllCategories = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, description, is_active, created_at
       FROM categories
       ORDER BY id DESC`
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get categories error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCategoryById = async (req, res) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id) || Number(id) <= 0) {
    return res.status(400).json({ message: "Invalid category ID" });
  }

  try {
    const result = await pool.query(
      `SELECT id, name, description, is_active, created_at
       FROM categories
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Get category error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createCategory = async (req, res) => {
  const { name, description } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Category name is required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO categories (name, description, is_active)
       VALUES ($1, $2, true)
       RETURNING id, name, description, is_active, created_at`,
      [name.trim(), description || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "Category name already exists" });
    }

    console.error("Create category error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description, is_active } = req.body;

  if (!/^\d+$/.test(id) || Number(id) <= 0) {
    return res.status(400).json({ message: "Invalid category ID" });
  }

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Category name is required" });
  }

  try {
    const result = await pool.query(
      `UPDATE categories
       SET name = $1,
           description = $2,
           is_active = $3
       WHERE id = $4
       RETURNING id, name, description, is_active, created_at`,
      [
        name.trim(),
        description || null,
        is_active !== undefined ? is_active : true,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "Category name already exists" });
    }

    console.error("Update category error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
};