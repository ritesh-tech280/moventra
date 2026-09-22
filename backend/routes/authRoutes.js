const express = require("express");
const router = express.Router();

const {
  register,
  login,
  syncFirebaseUser,
  getProfile,
  updateProfile,
} = require("../controllers/authController");

const {
  validateRegister,
  validateLogin,
} = require("../middlewares/validateMiddleware");

const { protect } = require("../middlewares/authMiddleware");

// Public authentication routes
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/sync", syncFirebaseUser);

// Protected rider profile routes
router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);

module.exports = router;

