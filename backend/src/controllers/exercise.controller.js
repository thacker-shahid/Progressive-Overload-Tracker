const Exercise = require("../models/Exercise");

// GET /api/exercises
exports.getAllExercises = async (req, res) => {
  try {
    const { bodyPart, muscle, page, limit: limitParam } = req.query;
    const filter = {};
    if (bodyPart) filter.bodyPart = bodyPart;
    if (muscle) filter.muscle = muscle;

    // If pagination params provided, paginate; otherwise return all
    if (page) {
      const pageNum = parseInt(page) || 1;
      const limit = parseInt(limitParam) || 20;
      const skip = (pageNum - 1) * limit;

      const total = await Exercise.countDocuments(filter);
      const exercises = await Exercise.find(filter).sort({ createdAt: 1 }).skip(skip).limit(limit);
      res.json({ exercises, total, page: pageNum, totalPages: Math.ceil(total / limit) });
    } else {
      const exercises = await Exercise.find(filter).sort({ createdAt: 1 });
      res.json({ exercises });
    }
  } catch (err) {
    console.error("Get exercises error:", err);
    res.status(500).json({ error: "Failed to fetch exercises." });
  }
};

// GET /api/exercises/grouped
exports.getGroupedExercises = async (req, res) => {
  try {
    // Sort purely by createdAt so new items always appear at the end
    const exercises = await Exercise.find().sort({ createdAt: 1 });

    // Build ordered structure using arrays to preserve insertion order
    const bodyPartOrder = [];
    const grouped = {};

    for (const ex of exercises) {
      if (!grouped[ex.bodyPart]) {
        bodyPartOrder.push(ex.bodyPart);
        grouped[ex.bodyPart] = { muscleOrder: [], exercises: {} };
      }
      if (!grouped[ex.bodyPart].exercises[ex.muscle]) {
        grouped[ex.bodyPart].muscleOrder.push(ex.muscle);
        grouped[ex.bodyPart].exercises[ex.muscle] = [];
      }
      grouped[ex.bodyPart].exercises[ex.muscle].push({
        _id: ex._id,
        name: ex.name,
        imageUrl: ex.imageUrl,
        videoUrl: ex.videoUrl,
      });
    }

    // Convert to final format with tabs in the order they were first seen
    const result = {};
    for (const bp of bodyPartOrder) {
      result[bp] = {
        tabs: grouped[bp].muscleOrder,
        exercises: grouped[bp].exercises,
      };
    }

    // Return both the ordered keys array and the grouped data
    res.json({ bodyParts: result, bodyPartOrder });
  } catch (err) {
    console.error("Get grouped exercises error:", err);
    res.status(500).json({ error: "Failed to fetch exercises." });
  }
};

// GET /api/exercises/:id
exports.getExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) return res.status(404).json({ error: "Exercise not found." });
    res.json({ exercise });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch exercise." });
  }
};
