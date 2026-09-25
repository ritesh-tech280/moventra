const mongoose = require("mongoose");
const Rider = require("../models/Rider");
const Ride = require("../models/Ride");
const Vehicle = require("../models/Vehicle");

const addressInput = (body) => {
  const { label, address, latitude, longitude } = body;
  if (!["Home", "Work", "Other"].includes(label) || typeof address !== "string" || !address.trim()) return null;
  const lat = Number(latitude); const lng = Number(longitude);
  if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lng) || lng < -180 || lng > 180) return null;
  return { label, address: address.trim(), latitude: lat, longitude: lng };
};
const place = (value) => typeof value === "string" ? value : value?.address || value?.name || "";

exports.profile = async (req, res, next) => {
  try {
    const rider = await Rider.findById(req.rider._id).select("name email phone photoURL role status isPhoneVerified isEmailVerified createdAt authProvider notificationPreferences");
    return rider ? res.json({ success: true, rider }) : res.status(404).json({ success: false, message: "Rider account not found." });
  } catch (error) { next(error); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const rider = await Rider.findById(req.rider._id);
    if (!rider) return res.status(404).json({ success: false, message: "Rider account not found." });
    const { name, photoURL } = req.body;
    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length < 2) return res.status(400).json({ success: false, message: "Name must be at least 2 characters." });
      rider.name = name.trim();
    }
    if (photoURL !== undefined) {
      if (typeof photoURL !== "string" || photoURL.length > 2048) return res.status(400).json({ success: false, message: "Enter a valid profile photo URL." });
      rider.photoURL = photoURL.trim();
    }
    await rider.save();
    return res.json({ success: true, rider });
  } catch (error) { next(error); }
};

exports.listAddresses = (req, res) => res.json({ success: true, addresses: req.rider.addresses || [] });
exports.createAddress = async (req, res, next) => {
  try {
    const input = addressInput(req.body);
    if (!input) return res.status(400).json({ success: false, message: "Provide a valid label, address, latitude, and longitude." });
    const rider = await Rider.findById(req.rider._id);
    const address = rider.addresses.create(input);
    rider.addresses.push(address);
    if (req.body.isDefault || rider.addresses.length === 1) {
      rider.addresses.forEach((item) => { item.isDefault = String(item._id) === String(address._id); });
    }
    await rider.save();
    return res.status(201).json({ success: true, address });
  } catch (error) { next(error); }
};
exports.updateAddress = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ success: false, message: "Address not found." });
    const rider = await Rider.findById(req.rider._id);
    const address = rider.addresses.id(req.params.id);
    if (!address) return res.status(404).json({ success: false, message: "Address not found." });
    const input = addressInput({ ...address.toObject(), ...req.body });
    if (!input) return res.status(400).json({ success: false, message: "Provide a valid label, address, latitude, and longitude." });
    Object.assign(address, input);
    if (req.body.isDefault === true) rider.addresses.forEach((item) => { item.isDefault = String(item._id) === String(address._id); });
    if (req.body.isDefault === false) address.isDefault = false;
    await rider.save();
    return res.json({ success: true, address });
  } catch (error) { next(error); }
};
exports.deleteAddress = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ success: false, message: "Address not found." });
    const rider = await Rider.findById(req.rider._id);
    const address = rider.addresses.id(req.params.id);
    if (!address) return res.status(404).json({ success: false, message: "Address not found." });
    const wasDefault = address.isDefault;
    address.deleteOne();
    if (wasDefault && rider.addresses.length) rider.addresses[0].isDefault = true;
    await rider.save();
    return res.json({ success: true });
  } catch (error) { next(error); }
};

const populateRide = [{ path: "driverId", select: "name phone" }];
exports.listRides = async (req, res, next) => {
  try {
    const rides = await Ride.find({ riderId: req.rider._id }).sort({ createdAt: -1 }).populate(populateRide).lean();
    const driverIds = [...new Set(rides.map((ride) => ride.driverId?._id).filter(Boolean).map(String))];
    const vehicles = await Vehicle.find({ driverId: { $in: driverIds } }).select("driverId brand model registrationNumber vehicleType").lean();
    const byDriver = new Map(vehicles.map((vehicle) => [String(vehicle.driverId), vehicle]));
    return res.json({ success: true, rides: rides.map((ride) => ({ ...ride, pickup: place(ride.pickup), destination: place(ride.destination), vehicle: ride.driverId ? byDriver.get(String(ride.driverId._id)) || null : null })) });
  } catch (error) { next(error); }
};
exports.rideDetail = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.rideId)) return res.status(404).json({ success: false, message: "Ride not found." });
    const ride = await Ride.findOne({ _id: req.params.rideId, riderId: req.rider._id }).populate(populateRide).lean();
    if (!ride) return res.status(404).json({ success: false, message: "Ride not found." });
    const vehicle = ride.driverId ? await Vehicle.findOne({ driverId: ride.driverId._id }).select("brand model registrationNumber vehicleType").lean() : null;
    return res.json({ success: true, ride: { ...ride, pickup: place(ride.pickup), destination: place(ride.destination), vehicle } });
  } catch (error) { next(error); }
};
exports.notifications = async (req, res, next) => {
  try {
    const [rides, rider] = await Promise.all([
      Ride.find({ riderId: req.rider._id }).sort({ createdAt: -1 }).select("_id status paymentStatus createdAt updatedAt timestamps").lean(),
      Rider.findById(req.rider._id).select("notificationPreferences").lean(),
    ]);
    const prefs = rider?.notificationPreferences || {};
    const items = [];
    for (const ride of rides) {
      const ts = ride.timestamps || {};
      const events = [
        ["accepted", "Ride accepted", "Your driver accepted the ride.", ts.acceptedAt],
        ["arrived", "Driver arrived", "Your driver arrived at the pickup location.", ts.arrivedAt || ts.driverArrivedAt],
        ["completed", "Ride completed", "Your ride has been completed.", ts.completedAt],
        ["cancelled", "Ride cancelled", "This ride was cancelled.", ts.cancelledAt],
      ];
      for (const [key, title, message, date] of events) {
        const currentEvent = !date && ride.status === ({ accepted: "ACCEPTED", arrived: "DRIVER_ARRIVED", completed: "COMPLETED", cancelled: "CANCELLED" })[key];
        if ((prefs.rideUpdates !== false) && (date || currentEvent)) items.push({ id: `${ride._id}-${key}`, rideId: ride._id, type: key, title, message, createdAt: date || ride.updatedAt || ride.createdAt });
      }
      if (prefs.paymentUpdates !== false && ride.paymentStatus) items.push({ id: `${ride._id}-payment`, rideId: ride._id, type: "payment", title: "Payment update", message: `Payment status: ${String(ride.paymentStatus).toLowerCase()}.`, createdAt: ride.updatedAt || ride.createdAt });
    }
    return res.json({ success: true, notifications: items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) });
  } catch (error) { next(error); }
};
exports.updatePreferences = async (req, res, next) => {
  try {
    const { rideUpdates, paymentUpdates } = req.body;
    if (typeof rideUpdates !== "boolean" || typeof paymentUpdates !== "boolean") return res.status(400).json({ success: false, message: "Both notification preferences must be boolean values." });
    const rider = await Rider.findByIdAndUpdate(req.rider._id, { notificationPreferences: { rideUpdates, paymentUpdates } }, { new: true, runValidators: true }).select("notificationPreferences");
    return res.json({ success: true, notificationPreferences: rider.notificationPreferences });
  } catch (error) { next(error); }
};
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (typeof newPassword !== "string" || newPassword.length < 8) return res.status(400).json({ success: false, message: "New password must be at least 8 characters." });
    const rider = await Rider.findById(req.rider._id);
    if (!rider || !(await rider.comparePassword(currentPassword || ""))) return res.status(400).json({ success: false, message: "Current password is incorrect." });
    rider.password = newPassword;
    await rider.save();
    return res.json({ success: true, message: "Password updated." });
  } catch (error) { next(error); }
};
exports.deleteAccount = async (req, res, next) => {
  try {
    const rider = await Rider.findById(req.rider._id);
    if (!rider) return res.status(404).json({ success: false, message: "Rider account not found." });
    await rider.deleteOne();
    return res.json({ success: true, message: "Account deleted." });
  } catch (error) { next(error); }
};
