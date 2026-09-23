const mongoose = require("mongoose");
module.exports =
  mongoose.models.VerificationAuditLog ||
  mongoose.model(
    "VerificationAuditLog",
    new mongoose.Schema(
      {
        driverId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Driver",
          required: true,
        },
        actorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Driver",
          required: true,
        },
        action: { type: String, required: true },
        targetType: String,
        targetId: mongoose.Schema.Types.ObjectId,
        reason: String,
      },
      { timestamps: true },
    ),
  );
