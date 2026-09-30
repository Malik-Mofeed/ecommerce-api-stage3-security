const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deactivateProduct,
} = require("../controllers/productsController");

const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

// Customer + Admin
router.get("/", authenticateToken, getAllProducts);
router.get("/:id", authenticateToken, getProductById);

// Admin only
router.post("/", authenticateToken, requireAdmin, createProduct);
router.put("/:id", authenticateToken, requireAdmin, updateProduct);
router.patch(
  "/:id/deactivate",
  authenticateToken,
  requireAdmin,
  deactivateProduct
);

module.exports = router;