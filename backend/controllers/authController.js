const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Rider = require("../models/Rider");

/**
 * Generate a JWT token for a rider
 */
const generateToken = (riderId, email) => {
  const secret = process.env.JWT_SECRET || "moventra_super_secure_jwt_secret_key_2026";
  return jwt.sign({ id: riderId, email }, secret, {
    expiresIn: "30d",
  });
};

/**
 * @desc    Register a new Rider and store in MongoDB with hashed password
 * @route   POST /api/auth/register 
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { name, email, phone, password, firebaseUid, photoURL } = req.body;

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPhone = phone.trim();

    // Check if email is already in use
    const emailExists = await Rider.findOne({ email: normalizedEmail });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "An account with this email address already exists. Please log in.",
      });
    }

    // Check if phone number is already registered
    const phoneExists = await Rider.findOne({ phone: normalizedPhone });
    if (phoneExists) {
      return res.status(400).json({
        success: false,
        message: "An account with this phone number is already registered.",
      });
    }

    // Create the Rider document (password is hashed securely by pre-save hook)
    const newRider = new Rider({
      name: name.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      password: password, // Will be hashed via bcrypt in Rider.pre('save')
      firebaseUid: firebaseUid || null,
      photoURL: photoURL || "",
      authProvider: "email",
    });

    const savedRider = await newRider.save();
    const token = generateToken(savedRider._id, savedRider.email);

    return res.status(201).json({
      success: true,
      message: "Rider registered successfully.",
      token,
      rider: savedRider,
    });
  } catch (error) {
    console.error("[Register Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed due to server error.",
      error: error.message,
    });
  }
};

/**
 * @desc    Authenticate Rider via Email & Password
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password, firebaseUid } = req.body;

    const normalizedEmail = email.toLowerCase().trim();
    const rider = await Rider.findOne({ email: normalizedEmail });

    if (!rider) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password. Please check your credentials.",
      });
    }

    // Compare candidate password with stored bcrypt hash
    const isMatch = await rider.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password. Please check your credentials.",
      });
    }

    // If Firebase UID is provided and not yet associated with the rider, link it
    if (firebaseUid && !rider.firebaseUid) {
      rider.firebaseUid = firebaseUid;
      await rider.save();
    }

    const token = generateToken(rider._id, rider.email);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      rider,
    });
  } catch (error) {
    console.error("[Login Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed due to server error.",
      error: error.message,
    });
  }
};

/**
 * @desc    Synchronize Firebase user (Google Sign-In, Phone, or Firebase Auth) with MongoDB
 * @route   POST /api/auth/sync
 * @access  Public
 */
const syncFirebaseUser = async (req, res) => {
  try {
    const { firebaseUid, email, name, phone, photoURL, authProvider, password } = req.body;

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: "firebaseUid is required for account synchronization.",
      });
    }

    const normalizedEmail = email ? email.toLowerCase().trim() : null;

    // Search for existing rider by firebaseUid or by email
    let rider = null;
    if (firebaseUid) {
      rider = await Rider.findOne({ firebaseUid });
    }
    if (!rider && normalizedEmail) {
      rider = await Rider.findOne({ email: normalizedEmail });
    }

    // If Rider exists in MongoDB: update details and synchronize
    if (rider) {
      let updated = false;

      if (!rider.firebaseUid) {
        rider.firebaseUid = firebaseUid;
        updated = true;
      }
      if (photoURL && !rider.photoURL) {
        rider.photoURL = photoURL;
        updated = true;
      }
      if (phone && (!rider.phone || rider.phone.startsWith("PENDING_"))) {
        rider.phone = phone.trim();
        updated = true;
      }
      if (name && !rider.name) {
        rider.name = name.trim();
        updated = true;
      }

      if (updated) {
        await rider.save();
      }

      const token = generateToken(rider._id, rider.email);
      return res.status(200).json({
        success: true,
        message: "Rider synchronized successfully with MongoDB.",
        isNew: false,
        token,
        rider,
      });
    }

    // Rider does not exist yet: create new record in MongoDB
    // Ensure email exists or fallback to dummy identifier
    const riderEmail = normalizedEmail || `${firebaseUid}@firebase.moventra.internal`;
    const riderName = name ? name.trim() : "Moventra Traveler";
    const riderPhone = phone ? phone.trim() : `PENDING_${firebaseUid.substring(0, 8)}`;
    // Always assign a secure hashed password (user requirement: store password as hashpassword)
    const riderPassword = password || crypto.randomBytes(24).toString("hex");

    const newRider = new Rider({
      name: riderName,
      email: riderEmail,
      phone: riderPhone,
      password: riderPassword, // Will be hashed via pre-save hook
      firebaseUid,
      photoURL: photoURL || "",
      authProvider: authProvider || "google",
      isEmailVerified: !!normalizedEmail,
    });

    const savedRider = await newRider.save();
    const token = generateToken(savedRider._id, savedRider.email);

    return res.status(201).json({
      success: true,
      message: "New rider account created and synchronized in MongoDB.",
      isNew: true,
      token,
      rider: savedRider,
    });
  } catch (error) {
    console.error("[Sync Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to synchronize Firebase user with MongoDB.",
      error: error.message,
    });
  }
};

/**
 * @desc    Get current authenticated Rider's profile
 * @route   GET /api/auth/me
 * @access  Private (Protected by authMiddleware)
 */
const getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      rider: req.rider,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not fetch profile.",
      error: error.message,
    });
  }
};

/**
 * @desc    Update authenticated Rider's profile details
 * @route   PUT /api/auth/me
 * @access  Private (Protected by authMiddleware)
 */
const updateProfile = async (req, res) => {
  try {
    const { name, phone, photoURL } = req.body;
    const rider = req.rider;

    if (name) rider.name = name.trim();
    if (phone) {
      if (rider.isPhoneVerified) {
        return res.status(403).json({
          success: false,
          message: "Verified phone numbers cannot be changed directly.",
        });
      }
      const phoneTaken = await Rider.findOne({ phone: phone.trim(), _id: { $ne: rider._id } });
      if (phoneTaken) {
        return res.status(400).json({
          success: false,
          message: "This phone number is already registered to another account.",
        });
      }
      rider.phone = phone.trim();
    }
    if (photoURL) rider.photoURL = photoURL;

    const updatedRider = await rider.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      rider: updatedRider,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  syncFirebaseUser,
  getProfile,
  updateProfile,
};

