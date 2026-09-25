const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const riderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    firebaseUid: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    authProvider: {
      type: String,
      enum: ["email", "google", "phone"],
      default: "email",
    },
    photoURL: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "rider",
    },
    status: { type: String, enum: ["active", "inactive", "suspended"], default: "active" },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    addresses: [{
      label: { type: String, enum: ["Home", "Work", "Other"], required: true },
      address: { type: String, required: true, trim: true },
      latitude: { type: Number, required: true, min: -90, max: 90 },
      longitude: { type: Number, required: true, min: -180, max: 180 },
      isDefault: { type: Boolean, default: false },
    }],
    notificationPreferences: {
      rideUpdates: { type: Boolean, default: true },
      paymentUpdates: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password whenever it is created or modified
riderSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
  } catch (err) {
     console.log(err)
  }
});

// Instance method to compare candidate password with hashed password
riderSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON representation for security
riderSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const Rider = mongoose.models.Rider || mongoose.model("Rider", riderSchema);

module.exports = Rider;
