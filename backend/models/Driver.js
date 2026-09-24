const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const verificationSchema = new mongoose.Schema(
  {
    profileCompleted: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    identityVerified: { type: Boolean, default: false },
    licenseVerified: { type: Boolean, default: false },
    vehicleVerified: { type: Boolean, default: false },
    documentsVerified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: [
        "incomplete",
        "pending",
        "under_review",
        "approved",
        "rejected",
        "suspended",
      ],
      default: "incomplete",
    },
  },
  { _id: false },
);

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    dateOfBirth: Date,
    profilePhotoKey: String,
    address: { line1: String, city: String, state: String, pincode: String },
    emergencyContact: { name: String, phone: String, relationship: String },
    // Identity values are intentionally select:false, so normal responses never disclose them.
    identity: {
      governmentIdNumber: { type: String, select: false },
      panNumber: { type: String, select: false },
    },
    status: {
      type: String,
      enum: ["pending", "active", "rejected", "suspended"],
      default: "pending",
    },
    availability: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    role: { type: String, enum: ["driver", "admin"], default: "driver" },
    verification: { type: verificationSchema, default: () => ({}) },
  },
  { timestamps: true },
);

driverSchema.pre("save", async function () {
  if (this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 12);
});
driverSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};
driverSchema.methods.toJSON = function () {
  const value = this.toObject();
  delete value.password;
  delete value.identity;
  return value;
};

module.exports =
  mongoose.models.Driver || mongoose.model("Driver", driverSchema);
