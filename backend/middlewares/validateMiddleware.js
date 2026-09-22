/**
 * Validation middlewares for Rider authentication requests
 */

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;

/**
 * Validate registration request body
 * Required fields: Name, Email, Phone, Password
 */
const validateRegister = (req, res, next) => {
  const { name, email, phone, password } = req.body;
  const errors = [];

  // Name check
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    errors.push("Name is required and must be at least 2 characters long.");
  }

  // Email check
  if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
    errors.push("A valid email address is required.");
  }

  // Phone check
  if (!phone || typeof phone !== "string" || !phoneRegex.test(phone.trim())) {
    errors.push("A valid phone number is required (e.g. +1234567890 or 10-digit number).");
  }

  // Password check
  if (!password || typeof password !== "string" || password.length < 6) {
    errors.push("Password is required and must be at least 6 characters long.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors[0],
      errors,
    });
  }

  next();
};

/**
 * Validate login request body
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide both email and password.",
    });
  }

  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address.",
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
};

