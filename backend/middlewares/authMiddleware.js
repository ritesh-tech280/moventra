const jwt = require("jsonwebtoken");
const Rider = require("../models/Rider");

/**
 * Protect routes: verifies JWT or Firebase ID token and attaches req.rider
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route. Missing token.",
    });
  }

  try {
    const secret = process.env.JWT_SECRET || "moventra_super_secure_jwt_secret_key_2026";
    
    // First try standard JWT verification
    try {
      const decoded = jwt.verify(token, secret);
      const rider = await Rider.findById(decoded.id);

      if (!rider) {
        return res.status(401).json({
          success: false,
          message: "User account no longer exists in database.",
        });
      }

      req.rider = rider;
      return next();
    } catch (jwtErr) {
      // If token is a Firebase ID Token, decode payload
      const parts = token.split(".");
      if (parts.length === 3) {
        const payloadJson = Buffer.from(parts[1], "base64").toString("utf-8");
        const fbPayload = JSON.parse(payloadJson);
        const uid = fbPayload.user_id || fbPayload.sub;

        if (uid) {
          const rider = await Rider.findOne({ firebaseUid: uid });
          if (rider) {
            req.rider = rider;
            return next();
          }
        }
      }

      throw new Error("Invalid token authentication");
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Token verification failed.",
      error: error.message,
    });
  }
};

module.exports = {
  protect,
};

