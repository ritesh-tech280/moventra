const jwt = require("jsonwebtoken");
const Driver = require("../models/Driver");
const protectDriver = async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith("Bearer ") &&
    req.headers.authorization.slice(7);
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Not authorized. Missing token." });
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "moventra_super_secure_jwt_secret_key_2026",
    );
    req.driver = await Driver.findById(decoded.id).select("+password");
    if (!req.driver) throw new Error("Account not found");
    next();
  } catch (_) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Not authorized. Token verification failed.",
      });
  }
};
const requireAdmin = (req, res, next) =>
  req.driver?.role === "admin"
    ? next()
    : res
        .status(403)
        .json({ success: false, message: "Administrator access is required." });
const requireDriver = (req, res, next) =>
  req.driver?.role === "driver"
    ? next()
    : res.status(403).json({ success: false, message: "Driver access is required." });
module.exports = { protectDriver, requireAdmin, requireDriver };
