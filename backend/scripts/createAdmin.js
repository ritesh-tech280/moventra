const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || email?.split("@")[0];
  if (!email || !password || !name) throw new Error("Set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD in the root .env file.");
  if (!process.env.JWT_SECRET) throw new Error("Set JWT_SECRET in the root .env file.");

  await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/moventra", { serverSelectionTimeoutMS: 10000 });
  const existing = await Admin.findOne({ email });
  if (existing) throw new Error(`An admin account already exists for ${email}; no changes were made.`);

  await Admin.create({ name, email, password, role: "admin" });
  console.log(`Admin account created for ${email}. Sign in at /admin/login.`);
}

main()
  .catch((error) => {
    console.error(`Admin setup failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  });
