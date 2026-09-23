const mongoose = require("mongoose");
const documentSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
      index: true,
    },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
    documentType: {
      type: String,
      enum: [
        "DRIVING_LICENSE",
        "IDENTITY_PROOF",
        "VEHICLE_RC",
        "VEHICLE_INSURANCE",
        "POLLUTION_CERTIFICATE",
        "VEHICLE_PERMIT",
        "FITNESS_CERTIFICATE",
      ],
      required: true,
    },
    documentNumber: { type: String, required: true, trim: true },
    storageKey: { type: String, required: true },
    originalFileName: { type: String, required: true },
    mimeType: {
      type: String,
      enum: ["application/pdf", "image/jpeg", "image/png", "image/webp"],
      required: true,
    },
    issueDate: Date,
    expiryDate: Date,
    // Type-specific fields (for example licence holderName or insurance provider) stay private with the document record.
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: { type: String, default: null },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },
    verifiedAt: { type: Date, default: null },
  },
  { timestamps: true },
);
documentSchema.index(
  { driverId: 1, documentType: 1, documentNumber: 1 },
  { unique: true },
);
module.exports =
  mongoose.models.DriverDocument ||
  mongoose.model("DriverDocument", documentSchema);
