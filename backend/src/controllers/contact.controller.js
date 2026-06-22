const Contact = require("../models/Contact");

// POST /api/contact - Submit contact form (public)
exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const contact = await Contact.create({ name, email, subject, message });
    res.status(201).json({ message: "Message sent successfully. We'll get back to you soon." });
  } catch (err) {
    console.error("Contact submit error:", err);
    res.status(500).json({ error: "Failed to send message." });
  }
};
