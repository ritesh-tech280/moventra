const mongoose = require("mongoose");
const vehicleSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
      index: true,
    },
    vehicleType: {
      type: String,
      enum: ["Mini", "Sedan", "SUV", "Auto", "Electric"],
      required: true,
    },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    manufacturingYear: { type: Number, required: true, min: 1980 },
    color: { type: String, required: true },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    seats: { type: Number, required: true, min: 1, max: 12 },
    fuelType: { type: String, required: true },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);
module.exports =
  mongoose.models.Vehicle || mongoose.model("Vehicle", vehicleSchema);
