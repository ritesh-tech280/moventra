const mongoose = require("mongoose");
const Driver = require("../../models/Driver");
const Vehicle = require("../../models/Vehicle");
const Rider = require("../../models/Rider");
const DriverDocument = require("../../models/DriverDocument");
const Ride = require("../../models/Ride");
const Audit = require("../../models/VerificationAuditLog");

const pageArgs = (query) => ({ page: Math.max(1, Number.parseInt(query.page, 10) || 1), limit: Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 20)) });
const paginated = async (model, filter, query, populate) => {
  const { page, limit } = pageArgs(query);
  let find = model.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
  if (model === Ride) find = find.select("riderId driverId status paymentStatus paymentMethod transactionId pickup destination distance estimatedFare finalFare createdAt updatedAt timestamps");
  if (populate) find = find.populate(populate);
  const [items, total] = await Promise.all([find, model.countDocuments(filter)]);
  return { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
};
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

exports.dashboardStats = async () => {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [driverAgg, vehicleAgg, riderCount, rideAgg, revenueAgg] = await Promise.all([
    Driver.aggregate([{ $match: { role: "driver" } }, { $group: { _id: null, total: { $sum: 1 }, active: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } }, pending: { $sum: { $cond: [{ $in: ["$verification.status", ["pending", "under_review"]] }, 1, 0] } }, approved: { $sum: { $cond: [{ $eq: ["$verification.status", "approved"] }, 1, 0] } }, rejected: { $sum: { $cond: [{ $eq: ["$verification.status", "rejected"] }, 1, 0] } } } }]),
    Vehicle.aggregate([{ $lookup: { from: "drivers", localField: "driverId", foreignField: "_id", as: "driver" } }, { $match: { "driver.role": "driver" } }, { $group: { _id: null, total: { $sum: 1 }, active: { $sum: { $cond: [{ $and: [{ $eq: [{ $arrayElemAt: ["$driver.status", 0] }, "active"] }, { $eq: ["$verificationStatus", "approved"] }] }, 1, 0] } }, pending: { $sum: { $cond: [{ $eq: ["$verificationStatus", "pending"] }, 1, 0] } } } }]),
    Rider.countDocuments({ role: "rider" }),
    Ride.aggregate([{ $group: { _id: null, total: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] } }, pending: { $sum: { $cond: [{ $in: ["$status", ["REQUESTED", "ACCEPTED"]] }, 1, 0] } }, ongoing: { $sum: { $cond: [{ $in: ["$status", ["DRIVER_ARRIVED", "STARTED"]] }, 1, 0] } }, cancelled: { $sum: { $cond: [{ $eq: ["$status", "CANCELLED"] }, 1, 0] } } } }]),
    Ride.aggregate([
      { $match: { status: "COMPLETED", paymentStatus: "PAID" } },
      { $facet: {
        total: [{ $group: { _id: null, amount: { $sum: { $ifNull: ["$finalFare", 0] } } } }],
        today: [
          { $match: { $expr: { $gte: [{ $ifNull: ["$completedAt", "$timestamps.completedAt"] }, today] } } },
          { $group: { _id: null, amount: { $sum: { $ifNull: ["$finalFare", 0] } } } },
        ],
      } },
    ]),
  ]);
  const zero = {};
  const one = (a) => a[0] || zero;
  return { drivers: Object.fromEntries(["total", "active", "pending", "approved", "rejected"].map((key) => [key, one(driverAgg)[key] || 0])), vehicles: Object.fromEntries(["total", "active", "pending"].map((key) => [key, one(vehicleAgg)[key] || 0])), riders: { total: riderCount }, rides: Object.fromEntries(["total", "completed", "pending", "ongoing", "cancelled"].map((key) => [key, one(rideAgg)[key] || 0])), revenue: { total: revenueAgg[0]?.total[0]?.amount || 0, today: revenueAgg[0]?.today[0]?.amount || 0 } };
};

exports.listDrivers = async (query) => {
  const filter = { role: "driver" };
  if (query.status) { if (!["pending", "active", "rejected", "suspended"].includes(query.status)) throw Object.assign(new Error("Invalid account status."), { status: 400 }); filter.status = query.status; }
  if (query.verification) { if (!["incomplete", "pending", "under_review", "approved", "rejected", "suspended"].includes(query.verification)) throw Object.assign(new Error("Invalid verification status."), { status: 400 }); filter["verification.status"] = query.verification; }
  if (query.search) { const rx = new RegExp(escapeRegex(String(query.search).slice(0, 100)), "i"); filter.$or = [{ name: rx }, { email: rx }, { phone: rx }]; }
  const result = await paginated(Driver, filter, query);
  const ids = result.items.map((d) => d._id);
  const vehicles = await Vehicle.find({ driverId: { $in: ids } }).select("driverId brand model registrationNumber vehicleType").lean();
  return { drivers: result.items.map((d) => ({ ...d.toJSON(), vehicle: vehicles.find((v) => String(v.driverId) === String(d._id)) || null })), pagination: result.pagination };
};
exports.driverDetail = async (id) => {
  if (!mongoose.isValidObjectId(id)) return null;
  const [driver, vehicle, documents] = await Promise.all([Driver.findOne({ _id: id, role: "driver" }), Vehicle.findOne({ driverId: id }), DriverDocument.find({ driverId: id }).select("documentType verificationStatus createdAt expiryDate rejectionReason")]);
  return driver ? { driver, vehicle, documents } : null;
};
exports.listVehicles = async (query) => {
  const filter = {};
  if (query.status && ["pending", "approved", "rejected"].includes(query.status)) filter.verificationStatus = query.status;
  if (query.search) { const rx = new RegExp(escapeRegex(String(query.search).slice(0, 100)), "i"); filter.$or = [{ brand: rx }, { model: rx }, { registrationNumber: rx }, { vehicleType: rx }]; }
  const result = await paginated(Vehicle, filter, query, { path: "driverId", select: "name email phone status role" });
  const vehicles = result.items.filter((v) => v.driverId?.role === "driver");
  return { vehicles, pagination: result.pagination };
};
exports.listRiders = async (query) => {
  const filter = { role: "rider" };
  if (query.search) { const rx = new RegExp(escapeRegex(String(query.search).slice(0, 100)), "i"); filter.$or = [{ name: rx }, { email: rx }, { phone: rx }]; }
  const result = await paginated(Rider, filter, query);
  const stats = await Ride.aggregate([{ $match: { riderId: { $in: result.items.map((r) => r._id) } } }, { $group: { _id: "$riderId", totalRides: { $sum: 1 }, completedRides: { $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] } }, cancelledRides: { $sum: { $cond: [{ $eq: ["$status", "CANCELLED"] }, 1, 0] } } } }]);
  return { riders: result.items.map((r) => ({ _id: r._id, name: r.name, email: r.email, phone: r.phone, status: r.status || "active", createdAt: r.createdAt, ...(stats.find((s) => String(s._id) === String(r._id)) || { totalRides: 0, completedRides: 0, cancelledRides: 0 }) })), pagination: result.pagination };
};
exports.listRides = async (query) => {
  const filter = {};
  if (query.status) { if (!["REQUESTED", "ACCEPTED", "DRIVER_ARRIVED", "STARTED", "COMPLETED", "CANCELLED"].includes(query.status)) throw Object.assign(new Error("Invalid ride status."), { status: 400 }); filter.status = query.status; }
  if (query.paymentStatus) { if (!["PENDING", "PAID", "FAILED", "REFUNDED"].includes(query.paymentStatus)) throw Object.assign(new Error("Invalid payment status."), { status: 400 }); filter.paymentStatus = query.paymentStatus; }
  if (query.driver) { if (!mongoose.isValidObjectId(query.driver)) throw Object.assign(new Error("Invalid driver ID."), { status: 400 }); filter.driverId = query.driver; }
  if (query.rider) { if (!mongoose.isValidObjectId(query.rider)) throw Object.assign(new Error("Invalid rider ID."), { status: 400 }); filter.riderId = query.rider; }
  if (query.date) { if (Number.isNaN(Date.parse(query.date))) throw Object.assign(new Error("Invalid date filter."), { status: 400 }); const start = new Date(query.date); start.setHours(0,0,0,0); const end = new Date(start); end.setDate(end.getDate()+1); filter.createdAt = { $gte: start, $lt: end }; }
  return paginated(Ride, filter, query, [{ path: "driverId", select: "name phone" }, { path: "riderId", select: "name phone" }]).then(({ items, pagination }) => ({ rides: items, pagination }));
};
exports.pendingDrivers = async (query) => {
  const pending = await paginated(Driver, { role: "driver", "verification.status": { $in: ["pending", "under_review"] } }, query);
  const ids = pending.items.map((d) => d._id);
  const vehicles = await Vehicle.find({ driverId: { $in: ids } }).select("driverId brand model registrationNumber vehicleType").lean();
  return { drivers: pending.items.map((d) => ({ ...d.toJSON(), vehicle: vehicles.find((v) => String(v.driverId) === String(d._id)) || null })), pagination: pending.pagination };
};

exports.ridesChart = async (query) => {
  const days = Math.min(90, Math.max(7, Number.parseInt(query.days, 10) || 14));
  const since = new Date(); since.setDate(since.getDate() - days + 1); since.setHours(0,0,0,0);
  return Ride.aggregate([{ $match: { createdAt: { $gte: since } } }, { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, rides: { $sum: 1 } } }, { $sort: { _id: 1 } }]);
};
exports.revenueChart = async (query) => {
  const days = Math.min(90, Math.max(7, Number.parseInt(query.days, 10) || 14));
  const since = new Date(); since.setDate(since.getDate() - days + 1); since.setHours(0,0,0,0);
  return Ride.aggregate([{ $match: { status: "COMPLETED", paymentStatus: "PAID", $expr: { $gte: [{ $ifNull: ["$completedAt", "$timestamps.completedAt"] }, since] } } }, { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: { $ifNull: ["$completedAt", "$timestamps.completedAt"] } } }, revenue: { $sum: { $ifNull: ["$finalFare", 0] } } } }, { $sort: { _id: 1 } }]);
};
exports.activity = async () => {
  const [logs, drivers, riders, rides] = await Promise.all([
    Audit.find().sort({ createdAt: -1 }).limit(12).populate("driverId", "name").lean(),
    Driver.find({ role: "driver" }).sort({ createdAt: -1 }).limit(8).select("name createdAt").lean(),
    Rider.find({ role: "rider" }).sort({ createdAt: -1 }).limit(8).select("name createdAt").lean(),
    Ride.find({ status: { $in: ["COMPLETED", "CANCELLED"] } }).sort({ createdAt: -1 }).limit(8).select("status createdAt").populate("riderId", "name").lean(),
  ]);
  return [
    ...logs.map((log) => ({ id: String(log._id), action: log.action, subject: log.driverId?.name || "Driver", createdAt: log.createdAt, reason: log.reason })),
    ...drivers.map((driver) => ({ id: `driver-${driver._id}`, action: "NEW_DRIVER_REGISTERED", subject: driver.name, createdAt: driver.createdAt })),
    ...riders.map((rider) => ({ id: `rider-${rider._id}`, action: "NEW_RIDER_REGISTERED", subject: rider.name, createdAt: rider.createdAt })),
    ...rides.map((ride) => ({ id: `ride-${ride._id}`, action: `RIDE_${ride.status}`, subject: ride.riderId?.name || "Rider", createdAt: ride.createdAt })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 12);
};
