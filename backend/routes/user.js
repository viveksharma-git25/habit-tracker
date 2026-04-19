const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { getProfile, updateProfile, changePassword } = require("../controllers/userController");

router.route("/profile").get(protect, getProfile).put(protect, updateProfile);
router.put("/change-password", protect, changePassword);

module.exports = router;
