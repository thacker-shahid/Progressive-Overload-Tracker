const express = require("express");
const router = express.Router();
const workoutController = require("../controllers/workout.controller");
const { authenticate } = require("../middleware/auth");

router.get("/", authenticate, workoutController.getWorkouts);
router.get("/:exerciseId", authenticate, workoutController.getWorkoutByExercise);
router.put("/:exerciseId", authenticate, workoutController.upsertWorkout);
router.delete("/:exerciseId", authenticate, workoutController.deleteWorkout);

module.exports = router;
