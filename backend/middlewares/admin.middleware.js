const jwt = require("jsonwebtoken");
const Driver = require("../models/Driver");
const Admin = require("../models/Admin");

async function authenticateAdmin(req, res, next) {
  const token = req.headers.authorization?.startsWith("Bearer ") && req.headers.authorization.slice(7);
  if (!token) return res.status(401).json({ success: false, message: "Authentication required." });
  if (!process.env.JWT_SECRET) return res.status(503).json({ success: false, message: "Authentication is not configured." });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") return res.status(403).json({ success: false, message: "Administrator access is required." });
    const admin = decoded.source === "admin"
      ? await Admin.findOne({ _id: decoded.id, role: "admin" })
      : await Driver.findOne({ _id: decoded.id, role: "admin" });
    if (!admin) return res.status(401).json({ success: false, message: "Administrator account not found." });
    req.admin = admin;
    // Existing verification controllers read the authenticated actor from req.driver.
    req.driver = admin;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired administrator session." });
  }
}

module.exports = { authenticateAdmin };
