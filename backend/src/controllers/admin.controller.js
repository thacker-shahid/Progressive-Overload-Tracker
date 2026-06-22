const User = require("../models/User");
const Exercise = require("../models/Exercise");
const Contact = require("../models/Contact");
const Workout = require("../models/Workout");

// ── User Management ───────────────────────────────────────────────────────────

// GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const filter = search
      ? { $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }] }
      : {};

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select("-password -verificationCode -verificationCodeExpires")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ users, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users." });
  }
};

// PUT /api/admin/users/:id
exports.updateUser = async (req, res) => {
  try {
    const allowedFields = ["name", "email", "role", "age", "height", "weight", "gender", "mobile"];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ error: "User not found." });

    res.json({ message: "User updated.", user: user.toJSON() });
  } catch (err) {
    console.error("Admin update user error:", err);
    res.status(500).json({ error: "Failed to update user." });
  }
};

// DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found." });

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: "Cannot delete your own account from admin panel." });
    }

    // Delete user's workouts too
    await Workout.deleteMany({ user: user._id });
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User and associated data deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user." });
  }
};

// ── Exercise Management ───────────────────────────────────────────────────────

// POST /api/admin/exercises
exports.createExercise = async (req, res) => {
  try {
    const { bodyPart, muscle, name, imageUrl, videoUrl } = req.body;

    if (!bodyPart || !muscle || !name) {
      return res.status(400).json({ error: "bodyPart, muscle, and name are required." });
    }

    const exercise = await Exercise.create({
      bodyPart,
      muscle,
      name,
      imageUrl: imageUrl || "",
      videoUrl: videoUrl || "",
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Exercise created.", exercise });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Exercise already exists for this body part and muscle." });
    }
    console.error("Create exercise error:", err);
    res.status(500).json({ error: "Failed to create exercise." });
  }
};

// PUT /api/admin/exercises/:id
exports.updateExercise = async (req, res) => {
  try {
    const allowedFields = ["bodyPart", "muscle", "name", "imageUrl", "videoUrl"];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const exercise = await Exercise.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!exercise) return res.status(404).json({ error: "Exercise not found." });

    res.json({ message: "Exercise updated.", exercise });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Duplicate exercise name for this body part and muscle." });
    }
    res.status(500).json({ error: "Failed to update exercise." });
  }
};

// DELETE /api/admin/exercises/:id
exports.deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndDelete(req.params.id);
    if (!exercise) return res.status(404).json({ error: "Exercise not found." });

    // Also delete related workout logs
    await Workout.deleteMany({ exercise: req.params.id });

    res.json({ message: "Exercise and related workout data deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete exercise." });
  }
};

// PUT /api/admin/exercises-reorder/body-parts
// Body: { order: ["Chest", "Back", "Legs", ...] }
exports.reorderBodyParts = async (req, res) => {
  try {
    const { order } = req.body;
    if (!Array.isArray(order)) return res.status(400).json({ error: "order array is required." });

    const updates = order.map((bodyPart, index) =>
      Exercise.updateMany({ bodyPart }, { bodyPartOrder: index })
    );
    await Promise.all(updates);

    res.json({ message: "Body parts reordered." });
  } catch (err) {
    console.error("Reorder body parts error:", err);
    res.status(500).json({ error: "Failed to reorder." });
  }
};

// PUT /api/admin/exercises-reorder/muscles
// Body: { bodyPart: "Biceps", order: ["Long Head", "Short Head", "Brachialis"] }
exports.reorderMuscles = async (req, res) => {
  try {
    const { bodyPart, order } = req.body;
    if (!bodyPart || !Array.isArray(order)) return res.status(400).json({ error: "bodyPart and order array are required." });

    const updates = order.map((muscle, index) =>
      Exercise.updateMany({ bodyPart, muscle }, { muscleOrder: index })
    );
    await Promise.all(updates);

    res.json({ message: "Muscles reordered." });
  } catch (err) {
    console.error("Reorder muscles error:", err);
    res.status(500).json({ error: "Failed to reorder." });
  }
};

// PUT /api/admin/exercises-reorder/exercises
// Body: { bodyPart: "Biceps", muscle: "Long Head", order: ["exerciseId1", "exerciseId2", ...] }
exports.reorderExercises = async (req, res) => {
  try {
    const { order } = req.body;
    if (!Array.isArray(order)) return res.status(400).json({ error: "order array is required." });

    const updates = order.map((id, index) =>
      Exercise.findByIdAndUpdate(id, { order: index })
    );
    await Promise.all(updates);

    res.json({ message: "Exercises reordered." });
  } catch (err) {
    console.error("Reorder exercises error:", err);
    res.status(500).json({ error: "Failed to reorder." });
  }
};

// ── Contact Management ────────────────────────────────────────────────────────

// GET /api/admin/contacts
exports.getContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Contact.countDocuments();
    const contacts = await Contact.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

    res.json({ contacts, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch contacts." });
  }
};

// PUT /api/admin/contacts/:id/read
exports.markContactRead = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!contact) return res.status(404).json({ error: "Contact not found." });
    res.json({ message: "Marked as read.", contact });
  } catch (err) {
    res.status(500).json({ error: "Failed to update contact." });
  }
};

// DELETE /api/admin/contacts/:id
exports.deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Contact deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete contact." });
  }
};
