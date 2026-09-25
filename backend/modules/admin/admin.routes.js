const router = require("express").Router();
const mongoose = require("mongoose");
const c = require("./admin.controller");
const { authenticateAdmin } = require("../../middlewares/admin.middleware");
const Driver = require("../../models/Driver");
const Vehicle = require("../../models/Vehicle");
const Rider = require("../../models/Rider");
const driverReview = require("../../controllers/driverController");
const documentReview = require("../../controllers/documentController");
const validId = (key) => (req, res, next) => mongoose.isValidObjectId(req.params[key]) ? next() : res.status(404).json({ success: false, message: "Record not found." });

const attempts = new Map();
router.post("/login", async (req, res, next) => {
  const key = req.ip;
  const now = Date.now();
  const state = attempts.get(key);
  if (state && state.until > now && state.count >= 10) return res.status(429).json({ success: false, message: "Too many login attempts. Try again later." });
  try {
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode >= 400) { const prior = attempts.get(key); attempts.set(key, { count: (prior?.until > now ? prior.count : 0) + 1, until: now + 15 * 60 * 1000 }); }
      else attempts.delete(key);
      return originalJson(body);
    };
    await c.login(req, res);
  } catch (error) { next(error); }
});
router.use(authenticateAdmin);
router.get("/me", c.me);
router.post("/logout", c.logout);
router.get("/dashboard/stats", c.stats);
router.get("/dashboard/rides-chart", c.ridesChart);
router.get("/dashboard/revenue-chart", c.revenueChart);
router.get("/dashboard/activity", c.activity);
router.get("/drivers/pending", c.pending);
router.get("/drivers", c.drivers);
router.get("/drivers/:driverId", c.driver);
router.get("/drivers/:driverId/documents", validId("driverId"), documentReview.adminDocuments);
router.get("/documents/:documentId/view", validId("documentId"), documentReview.view);
router.patch("/documents/:documentId/approve", validId("documentId"), (req, res, next) => { req.params.decision = "approve"; return documentReview.review(req, res, next); });
router.patch("/documents/:documentId/reject", validId("documentId"), (req, res, next) => { req.params.decision = "reject"; return documentReview.review(req, res, next); });
router.patch("/drivers/:driverId/verification", validId("driverId"), documentReview.setVerification);
router.patch("/drivers/:driverId/approve", validId("driverId"), (req, res, next) => { req.params.decision = "approve"; return driverReview.finalDecision(req, res, next); });
router.patch("/drivers/:driverId/reject", validId("driverId"), (req, res, next) => { req.params.decision = "reject"; return driverReview.finalDecision(req, res, next); });
router.patch("/drivers/:driverId/suspend", validId("driverId"), driverReview.suspend);
router.patch("/drivers/:driverId/phone/verify", validId("driverId"), driverReview.verifyPhone);
router.patch("/drivers/:driverId/status", validId("driverId"), (req, res, next) => { const { status } = req.body; if (!["active", "pending", "rejected", "suspended"].includes(status)) return res.status(400).json({ success: false, message: "Invalid status." }); if (status === "active" || status === "rejected") { req.params.decision = status === "active" ? "approve" : "reject"; return driverReview.finalDecision(req, res, next); } if (status === "suspended") return driverReview.suspend(req, res, next); return Driver.findOneAndUpdate({ _id: req.params.driverId, role: "driver" }, { status }, { new: true, runValidators: true }).then((driver) => driver ? res.json({ success: true, driver }) : res.status(404).json({ success: false, message: "Driver not found." })).catch(next); });
router.patch("/drivers/:driverId/documents/:documentId/approve", validId("driverId"), validId("documentId"), (req, res, next) => { req.params.decision = "approve"; return driverReview.reviewDocument(req, res, next); });
router.patch("/drivers/:driverId/documents/:documentId/reject", validId("driverId"), validId("documentId"), (req, res, next) => { req.params.decision = "reject"; return driverReview.reviewDocument(req, res, next); });
router.patch("/drivers/:driverId/vehicles/:vehicleId/approve", validId("driverId"), validId("vehicleId"), (req, res, next) => { req.params.decision = "approve"; return driverReview.reviewVehicle(req, res, next); });
router.patch("/drivers/:driverId/vehicles/:vehicleId/reject", validId("driverId"), validId("vehicleId"), (req, res, next) => { req.params.decision = "reject"; return driverReview.reviewVehicle(req, res, next); });
router.get("/vehicles", c.vehicles);
router.get("/vehicles/:vehicleId", validId("vehicleId"), async (req, res) => { const vehicle = await Vehicle.findById(req.params.vehicleId).populate("driverId", "name email phone status"); return vehicle ? res.json({ success: true, vehicle }) : res.status(404).json({ success: false, message: "Vehicle not found." }); });
router.patch("/vehicles/:vehicleId/status", validId("vehicleId"), async (req, res, next) => { if (!(["pending", "approved", "rejected"].includes(req.body.status))) return res.status(400).json({ success: false, message: "Invalid verification status." }); const vehicle = await Vehicle.findById(req.params.vehicleId); if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found." }); req.params.driverId = vehicle.driverId; req.params.vehicleId = String(vehicle._id); req.params.decision = req.body.status === "approved" ? "approve" : "reject"; if (req.body.status === "pending") { vehicle.verificationStatus = "pending"; await vehicle.save(); return res.json({ success: true, vehicle }); } return driverReview.reviewVehicle(req, res, next); });
router.get("/riders", c.riders);
router.get("/riders/:riderId", validId("riderId"), async (req, res) => { const rider = await Rider.findOne({ _id: req.params.riderId, role: "rider" }).select("name email phone status createdAt"); return rider ? res.json({ success: true, rider }) : res.status(404).json({ success: false, message: "Rider not found." }); });
router.patch("/riders/:riderId/status", validId("riderId"), async (req, res) => { if (!(["active", "inactive", "suspended"].includes(req.body.status))) return res.status(400).json({ success: false, message: "Invalid status." }); const rider = await Rider.findOneAndUpdate({ _id: req.params.riderId, role: "rider" }, { status: req.body.status }, { new: true, runValidators: true }).select("name email phone status createdAt"); return rider ? res.json({ success: true, rider }) : res.status(404).json({ success: false, message: "Rider not found." }); });
router.get("/rides", c.rides);
router.get("/rides/:rideId", c.ride);
router.get("/documents", async (req, res) => { const { page = 1, limit = 20 } = req.query; const p = Math.max(1, parseInt(page, 10) || 1), l = Math.min(100, Math.max(1, parseInt(limit, 10) || 20)); const [documents, total] = await Promise.all([require("../../models/DriverDocument").find().select("driverId documentType verificationStatus createdAt expiryDate rejectionReason").sort({ createdAt: -1 }).skip((p - 1) * l).limit(l).populate("driverId", "name email"), require("../../models/DriverDocument").countDocuments()]); res.json({ success: true, documents, pagination: { page: p, limit: l, total, pages: Math.ceil(total / l) } }); });
router.patch("/documents/:documentId/approve", validId("documentId"), async (req, res) => { const doc = await require("../../models/DriverDocument").findById(req.params.documentId); if (!doc) return res.status(404).json({ success: false, message: "Document not found." }); req.params.driverId = doc.driverId; req.params.decision = "approve"; return driverReview.reviewDocument(req, res); });
router.patch("/documents/:documentId/reject", validId("documentId"), async (req, res) => { const doc = await require("../../models/DriverDocument").findById(req.params.documentId); if (!doc) return res.status(404).json({ success: false, message: "Document not found." }); req.params.driverId = doc.driverId; req.params.decision = "reject"; return driverReview.reviewDocument(req, res); });
module.exports = router;
