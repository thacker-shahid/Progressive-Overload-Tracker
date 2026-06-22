const Workout = require("../models/Workout");

// GET /api/workouts - Get all user's workout logs
exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id }).populate("exercise", "name imageUrl videoUrl");
    res.json({ workouts });
  } catch (err) {
    console.error("Get workouts error:", err);
    res.status(500).json({ error: "Failed to fetch workouts." });
  }
};

// GET /api/workouts/:exerciseId - Get log for specific exercise
exports.getWorkoutByExercise = async (req, res) => {
  try {
    const workout = await Workout.findOne({ user: req.user._id, exercise: req.params.exerciseId });
    if (!workout) {
      return res.json({ workout: null });
    }
    res.json({ workout });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch workout." });
  }
};

// PUT /api/workouts/:exerciseId - Create or update workout log for an exercise
exports.upsertWorkout = async (req, res) => {
  try {
    const { bodyPart, muscle, exerciseName, logs } = req.body;
    const exerciseId = req.params.exerciseId;

    if (!bodyPart || !muscle || !exerciseName || !logs) {
      return res.status(400).json({ error: "bodyPart, muscle, exerciseName, and logs are required." });
    }

    const workout = await Workout.findOneAndUpdate(
      { user: req.user._id, exercise: exerciseId },
      {
        user: req.user._id,
        exercise: exerciseId,
        bodyPart,
        muscle,
        exerciseName,
        logs,
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.json({ message: "Workout saved.", workout });
  } catch (err) {
    console.error("Upsert workout error:", err);
    res.status(500).json({ error: "Failed to save workout." });
  }
};

// DELETE /api/workouts/:exerciseId - Delete workout log
exports.deleteWorkout = async (req, res) => {
  try {
    await Workout.findOneAndDelete({ user: req.user._id, exercise: req.params.exerciseId });
    res.json({ message: "Workout deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete workout." });
  }
};
