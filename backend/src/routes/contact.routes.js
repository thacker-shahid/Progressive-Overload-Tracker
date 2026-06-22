const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contact.controller");

// Public - anyone can submit a contact form
router.post("/", contactController.submitContact);

module.exports = router;
