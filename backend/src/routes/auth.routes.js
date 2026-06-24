const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth");

// ── Per-user rate limiting on auth routes to prevent brute force ────────────
// Strict limiter for login: 5 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => `${req.ip}__${(req.body.email || "").toLowerCase()}`,
  message: { error: "Too many login attempts. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for signup/resend/forgot-password: 5 attempts per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => `${req.ip}__${(req.body.email || "").toLowerCase()}`,
  message: { error: "Too many requests. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/signup", authLimiter, authController.signup);
router.post("/login", loginLimiter, authController.login);
router.post("/verify", authLimiter, authController.verify);
router.post("/resend-code", authLimiter, authController.resendCode);
router.post("/forgot-password", authLimiter, authController.forgotPassword);
router.post("/reset-password", authLimiter, authController.resetPassword);
router.post("/refresh", authController.refresh);
router.get("/me", authenticate, authController.getMe);
router.post("/logout", authenticate, authController.logout);

module.exports = router;
