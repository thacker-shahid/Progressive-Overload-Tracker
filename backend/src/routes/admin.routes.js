const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { authenticate, requireAdmin } = require("../middleware/auth");

// All admin routes require authentication + admin role
router.use(authenticate, requireAdmin);

// Users
router.get("/users", adminController.getAllUsers);
router.put("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);

// Exercises
router.post("/exercises", adminController.createExercise);
router.put("/exercises/:id", adminController.updateExercise);
router.delete("/exercises/:id", adminController.deleteExercise);
router.put("/exercises-reorder/body-parts", adminController.reorderBodyParts);
router.put("/exercises-reorder/muscles", adminController.reorderMuscles);
router.put("/exercises-reorder/exercises", adminController.reorderExercises);

// Contacts
router.get("/contacts", adminController.getContacts);
router.put("/contacts/:id/read", adminController.markContactRead);
router.delete("/contacts/:id", adminController.deleteContact);

module.exports = router;
