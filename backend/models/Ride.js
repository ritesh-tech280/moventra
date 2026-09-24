const mongoose = require("mongoose");

// Ride data is owned by the existing ride service. This schema maps the shared
// rides collection for read-only admin reporting without creating ride records.
const rideSchema = new mongoose.Schema({
  riderId: { type: mongoose.Schema.Types.ObjectId, ref: "Rider", index: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", index: true },
  status: { type: String, index: true },
  paymentStatus: String,
  paymentMethod: String,
  transactionId: String,
  pickup: mongoose.Schema.Types.Mixed,
  destination: mongoose.Schema.Types.Mixed,
  distance: Number,
  estimatedFare: Number,
  finalFare: Number,
  timestamps: mongoose.Schema.Types.Mixed,
}, { timestamps: true, strict: false, collection: "rides" });

module.exports = mongoose.models.Ride || mongoose.model("Ride", rideSchema);
