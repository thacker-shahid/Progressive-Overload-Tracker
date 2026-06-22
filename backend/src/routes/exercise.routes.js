const express = require("express");
const router = express.Router();
const exerciseController = require("../controllers/exercise.controller");

// Public routes - anyone can view exercises
router.get("/", exerciseController.getAllExercises);
router.get("/grouped", exerciseController.getGroupedExercises);
router.get("/:id", exerciseController.getExercise);

module.exports = router;
