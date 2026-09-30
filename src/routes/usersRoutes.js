const express = require("express");

const router = express.Router();

const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUserStatus,
} = require("../controllers/usersController");

router.get("/", authenticateToken, requireAdmin, getAllUsers);

router.get("/:id", authenticateToken, getUserById);

router.post("/", authenticateToken, requireAdmin, createUser);

router.patch("/:id/status", authenticateToken, requireAdmin, updateUserStatus);
module.exports = router;