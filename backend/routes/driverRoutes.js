const router = require("express").Router();
const c = require("../controllers/driverController");
const { protectDriver } = require("../middlewares/driverAuthMiddleware");
router.post("/register", c.register); router.post("/login", c.login);
router.get("/me", protectDriver, c.me); router.patch("/me/status", protectDriver, c.updateAvailability); router.patch("/profile", protectDriver, c.updateProfile); router.put("/vehicle", protectDriver, c.upsertVehicle); router.post("/documents", protectDriver, c.addDocument); router.post("/verification/submit", protectDriver, c.submit); router.post("/rides/:rideId/accept", protectDriver, c.acceptRideGuard);
module.exports = router;
