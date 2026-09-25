const router = require("express").Router();
const { protect } = require("../middlewares/authMiddleware");
const rider = require("../controllers/riderController");

router.use(protect);
router.get("/profile", rider.profile);
router.patch("/profile", rider.updateProfile);
router.get("/addresses", rider.listAddresses);
router.post("/addresses", rider.createAddress);
router.patch("/addresses/:id", rider.updateAddress);
router.delete("/addresses/:id", rider.deleteAddress);
router.get("/rides", rider.listRides);
router.get("/rides/:rideId", rider.rideDetail);
router.get("/notifications", rider.notifications);
router.patch("/settings/notifications", rider.updatePreferences);
router.patch("/settings/password", rider.changePassword);
router.delete("/account", rider.deleteAccount);

module.exports = router;
