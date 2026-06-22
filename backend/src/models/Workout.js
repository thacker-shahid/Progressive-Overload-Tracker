const mongoose = require("mongoose");

const weekLogSchema = new mongoose.Schema(
  {
    week: { type: Number, required: true },
    date: { type: String, default: "" },
    weight: { type: String, default: "" },
    repsSet1: { type: String, default: "" },
    repsSet2: { type: String, default: "" },
    repsSet3: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { _id: false }
);

const workoutSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    exercise: { type: mongoose.Schema.Types.ObjectId, ref: "Exercise", required: true },
    bodyPart: { type: String, required: true },
    muscle: { type: String, required: true },
    exerciseName: { type: String, required: true },
    logs: [weekLogSchema],
  },
  { timestamps: true }
);

// One workout log per user per exercise
workoutSchema.index({ user: 1, exercise: 1 }, { unique: true });

module.exports = mongoose.model("Workout", workoutSchema);
