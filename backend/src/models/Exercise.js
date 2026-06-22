const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    bodyPart: { type: String, required: true, trim: true },
    muscle: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    order: { type: Number, default: 0 },
    bodyPartOrder: { type: Number, default: 0 },
    muscleOrder: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate exercises
exerciseSchema.index({ bodyPart: 1, muscle: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Exercise", exerciseSchema);
