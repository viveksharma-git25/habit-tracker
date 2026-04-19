const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleCompletion,
} = require("../controllers/habitController");

router.route("/").get(protect, getHabits).post(protect, createHabit);
router.route("/:id").put(protect, updateHabit).delete(protect, deleteHabit);
router.route("/:id/toggle").post(protect, toggleCompletion);

module.exports = router;
