const mongoose = require("mongoose");

const setLogSchema = new mongoose.Schema(
  {
    reps: { type: String, default: "" },
    weight: { type: String, default: "" },
  },
  { _id: false }
);

const dayLogSchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    date: { type: String, default: "" },
    sets: { type: [setLogSchema], default: () => [{ reps: "", weight: "" }, { reps: "", weight: "" }, { reps: "", weight: "" }] },
    open: { type: Boolean, default: false },
  },
  { _id: false }
);

const weekLogSchema = new mongoose.Schema(
  {
    week: { type: Number, required: true },
    days: { type: [dayLogSchema], default: [] },
    open: { type: Boolean, default: false },
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

workoutSchema.index({ user: 1, exercise: 1 }, { unique: true });

module.exports = mongoose.model("Workout", workoutSchema);
