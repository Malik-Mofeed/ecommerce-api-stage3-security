const express = require("express");
const router = express.Router();

const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
} = require("../controllers/categoriesController");

const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

// Customer + Admin
router.get("/", authenticateToken, getAllCategories);
router.get("/:id", authenticateToken, getCategoryById);

// Admin only
router.post("/", authenticateToken, requireAdmin, createCategory);
router.put("/:id", authenticateToken, requireAdmin, updateCategory);

module.exports = router;