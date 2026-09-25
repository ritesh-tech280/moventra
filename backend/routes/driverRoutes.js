const router = require("express").Router();
const c = require("../controllers/driverController");
const { protectDriver, requireDriver } = require("../middlewares/driverAuthMiddleware");
const documents = require("../controllers/documentController");
router.post("/register", c.register); router.post("/login", c.login);
router.get("/me", protectDriver, c.me); router.patch("/me/status", protectDriver, c.updateAvailability); router.patch("/profile", protectDriver, c.updateProfile); router.put("/vehicle", protectDriver, c.upsertVehicle);
router.post("/documents", protectDriver, requireDriver, documents.upload); router.get("/documents", protectDriver, requireDriver, documents.listMine); router.delete("/documents/:documentId", protectDriver, requireDriver, documents.removeMine); router.post("/verification/submit", protectDriver, requireDriver, documents.submit);
router.post("/rides/:rideId/accept", protectDriver, c.acceptRideGuard);
module.exports = router;
