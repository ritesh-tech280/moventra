const jwt = require("jsonwebtoken");
const Driver = require("../../models/Driver");
const Admin = require("../../models/Admin");
const service = require("./admin.service");

exports.login = async (req, res) => {
  const email = String(req.body.email || "")
    .toLowerCase()
    .trim();
  const password = req.body.password;
  if (!email || typeof password !== "string" || !password)
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required." });
  if (!process.env.JWT_SECRET)
    return res
      .status(503)
      .json({ success: false, message: "Authentication is not configured." });
  const admin = await Admin.findOne({ email, role: "admin" }).select("+password")
    || await Driver.findOne({ email, role: "admin" }).select("+password");
  if (!admin || !(await admin.comparePassword(password)))
    return res
      .status(401)
      .json({ success: false, message: "Invalid email or password." });
  const token = jwt.sign(
    { id: admin._id, role: "admin", source: admin.constructor.modelName === "Admin" ? "admin" : "driver" },
    process.env.JWT_SECRET,
    { expiresIn: "8h" },
  );
  res.json({
    success: true,
    token,
    admin: { id: admin._id, name: admin.name, email: admin.email },
  });
};
exports.me = (req, res) =>
  res.json({
    success: true,
    admin: { id: req.admin._id, name: req.admin.name, email: req.admin.email },
  });
exports.logout = (_req, res) =>
  res.json({ success: true, message: "Signed out." });
exports.stats = async (_req, res) =>
  res.json({ success: true, ...(await service.dashboardStats()) });
exports.ridesChart = async (req, res) =>
  res.json({ success: true, data: await service.ridesChart(req.query) });
exports.revenueChart = async (req, res) =>
  res.json({ success: true, data: await service.revenueChart(req.query) });
exports.activity = async (_req, res) =>
  res.json({ success: true, activities: await service.activity() });
exports.drivers = async (req, res) =>
  res.json({ success: true, ...(await service.listDrivers(req.query)) });
exports.driver = async (req, res) => {
  const result = await service.driverDetail(req.params.driverId);
  return result
    ? res.json({ success: true, ...result })
    : res.status(404).json({ success: false, message: "Driver not found." });
};
exports.pending = async (req, res) =>
  res.json({ success: true, ...(await service.pendingDrivers(req.query)) });
exports.vehicles = async (req, res) =>
  res.json({ success: true, ...(await service.listVehicles(req.query)) });
exports.riders = async (req, res) =>
  res.json({ success: true, ...(await service.listRiders(req.query)) });
exports.rides = async (req, res) =>
  res.json({ success: true, ...(await service.listRides(req.query)) });
exports.ride = async (req, res) => {
  const Ride = require("../../models/Ride");
  if (!require("mongoose").isValidObjectId(req.params.rideId))
    return res.status(404).json({ success: false, message: "Ride not found." });
  const ride = await Ride.findById(req.params.rideId)
    .select(
      "riderId driverId status paymentStatus paymentMethod transactionId pickup destination distance estimatedFare finalFare createdAt updatedAt timestamps",
    )
    .populate("riderId", "name phone")
    .populate("driverId", "name phone");
  return ride
    ? res.json({ success: true, ride })
    : res.status(404).json({ success: false, message: "Ride not found." });
};
exports.status = (model, field, allowed) => async (req, res) => {
  const value = req.body.status;
  if (!allowed.includes(value))
    return res.status(400).json({ success: false, message: "Invalid status." });
  const item = await model.findByIdAndUpdate(
    req.params.id,
    { [field]: value },
    { new: true, runValidators: true },
  );
  return item
    ? res.json({ success: true, item })
    : res.status(404).json({ success: false, message: "Record not found." });
};
