require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Exercise = require("./models/Exercise");

const EXERCISES = [
  // Abs
  { bodyPart: "Abs", muscle: "Upper Abs (Transverse Abdominis)", name: "Cable Crunch" },
  { bodyPart: "Abs", muscle: "Obliques", name: "Side Plank" },
  { bodyPart: "Abs", muscle: "Obliques", name: "Woodchop Cable." },
  { bodyPart: "Abs", muscle: "Lower Abs (Rectus)", name: "Dragon Flag" },
  { bodyPart: "Abs", muscle: "Lower Abs (Rectus)", name: "Hanging Leg Raise" },
  // Back
  { bodyPart: "Back", muscle: "Upper Trapezius", name: "Dumbbell Shrugs" },
  { bodyPart: "Back", muscle: "Upper Trapezius", name: "Barbell Shrugs" },
  { bodyPart: "Back", muscle: "Middle and Lower Trapezius", name: "Wide Grip Cable Rows" },
  { bodyPart: "Back", muscle: "Middle and Lower Trapezius", name: "Chest Supported Row" },
  { bodyPart: "Back", muscle: "Middle and Lower Trapezius", name: "Face Pulls" },
  { bodyPart: "Back", muscle: "Latissimus Dorsi", name: "Wide Grip Lat Pulldown" },
  { bodyPart: "Back", muscle: "Latissimus Dorsi", name: "Neutral Grip Lat Pulldown" },
  { bodyPart: "Back", muscle: "Latissimus Dorsi", name: "Seated Cable Row" },
  { bodyPart: "Back", muscle: "Latissimus Dorsi", name: "Cross Body Lat Pull Around" },
  { bodyPart: "Back", muscle: "Erector Spinae", name: "Back Extensions" },
  { bodyPart: "Back", muscle: "Erector Spinae", name: "Romanian Deadlift" },
  // Biceps
  { bodyPart: "Biceps", muscle: "Long Head", name: "Incline Dumbbell Curl" },
  { bodyPart: "Biceps", muscle: "Long Head", name: "Behind the back cable curls or Bayesian curls" },
  { bodyPart: "Biceps", muscle: "Long Head", name: "Close grip EZ bar curls" },
  { bodyPart: "Biceps", muscle: "Short Head", name: "Wide grip EZ bar curls" },
  { bodyPart: "Biceps", muscle: "Short Head", name: "Preacher Curl" },
  { bodyPart: "Biceps", muscle: "Short Head", name: "Cable Curl" },
  { bodyPart: "Biceps", muscle: "Brachialis", name: "Rope Hammer Curl" },
  { bodyPart: "Biceps", muscle: "Brachialis", name: "Hammer grip preacher curls" },
  { bodyPart: "Biceps", muscle: "Brachialis", name: "Reverse grip - EZ bar curls" },
  // Chest
  { bodyPart: "Chest", muscle: "Upper Chest", name: "Cable Crossover Low-to-High" },
  { bodyPart: "Chest", muscle: "Upper Chest", name: "Incline Dumbbell Press" },
  { bodyPart: "Chest", muscle: "Upper Chest", name: "Inclined Machine Bench Press" },
  { bodyPart: "Chest", muscle: "Middle Chest", name: "Seated Flat Machine Chest Press." },
  { bodyPart: "Chest", muscle: "Middle Chest", name: "Pec Deck Chest Fly Machine" },
  { bodyPart: "Chest", muscle: "Middle Chest", name: "Flat Bench Press" },
  { bodyPart: "Chest", muscle: "Middle Chest", name: "Mid Cable Chest Fly" },
  { bodyPart: "Chest", muscle: "Lower Chest", name: "Straight Bar Dips" },
  { bodyPart: "Chest", muscle: "Lower Chest", name: "Decline Dumbbell Press" },
  { bodyPart: "Chest", muscle: "Lower Chest", name: "Cable Crossover High-to-Low" },
  { bodyPart: "Chest", muscle: "Side Chest", name: "Machine Side Chest" },
  // Forearms
  { bodyPart: "Forearms", muscle: "Brachioradialis (Outer/Top)", name: "Hammer Curl" },
  { bodyPart: "Forearms", muscle: "Brachioradialis (Outer/Top)", name: "Reverse Straight Bar Curl" },
  { bodyPart: "Forearms", muscle: "Anterior Flexor Muscles", name: "Barbell Wrist Curl" },
  { bodyPart: "Forearms", muscle: "Posterior Extensor Muscles", name: "Reverse Wrist Curl" },
  // Legs
  { bodyPart: "Legs", muscle: "Quads", name: "Hack Squat" },
  { bodyPart: "Legs", muscle: "Quads", name: "45 Degree Leg Press Machine" },
  { bodyPart: "Legs", muscle: "Quads", name: "Smith Machine Barbbell Squat" },
  { bodyPart: "Legs", muscle: "Quads", name: "Seated Machine Leg Extension" },
  { bodyPart: "Legs", muscle: "Hamstrings", name: "Romanian Deadlift" },
  { bodyPart: "Legs", muscle: "Hamstrings", name: "Lying Leg Curl" },
  { bodyPart: "Legs", muscle: "Hamstrings", name: "Seated Leg Curl" },
  { bodyPart: "Legs", muscle: "Hamstrings", name: "Nordic Curl" },
  { bodyPart: "Legs", muscle: "Glutes", name: "45 Degree Back Extention" },
  { bodyPart: "Legs", muscle: "Glutes", name: "Walking Lunge" },
  { bodyPart: "Legs", muscle: "Calves", name: "Standing Calf Raise" },
  { bodyPart: "Legs", muscle: "Calves", name: "Seated Calf Raise" },
  // Shoulders
  { bodyPart: "Shoulders", muscle: "Anterior Head (Front Delt)", name: "Arnold Press" },
  { bodyPart: "Shoulders", muscle: "Anterior Head (Front Delt)", name: "Overhead Machine Shoulder Press" },
  { bodyPart: "Shoulders", muscle: "Lateral Head (Middle Delt)", name: "Lying Dumbbell Lateral" },
  { bodyPart: "Shoulders", muscle: "Lateral Head (Middle Delt)", name: "Behind the Back Cuffed Lateral Raise" },
  { bodyPart: "Shoulders", muscle: "Lateral Head (Middle Delt)", name: "Cable Side Lateral Raise" },
  { bodyPart: "Shoulders", muscle: "Posterior Head (Rear Delt)", name: "Face Pulls" },
  { bodyPart: "Shoulders", muscle: "Posterior Head (Rear Delt)", name: "Super-Rom Reverse Cable Fly" },
  { bodyPart: "Shoulders", muscle: "Posterior Head (Rear Delt)", name: "Reverse Pec Deck" },
  // Triceps
  { bodyPart: "Triceps", muscle: "Long Head", name: "Overhead Cable Tricep Extension" },
  { bodyPart: "Triceps", muscle: "Long Head", name: "Skull Crushers" },
  { bodyPart: "Triceps", muscle: "Long Head", name: "Katana Cable Triceps Extension" },
  { bodyPart: "Triceps", muscle: "Lateral Head", name: "Rope Pushdown" },
  { bodyPart: "Triceps", muscle: "Lateral Head", name: "Single-Arm Cable Triceps Extention Kickback" },
  { bodyPart: "Triceps", muscle: "Lateral Head", name: "Double-Arm Cable Cross Triceps Extension" },
  { bodyPart: "Triceps", muscle: "Medial Head", name: "Reverse-Grip Pushdown" },
  { bodyPart: "Triceps", muscle: "Medial Head", name: "Smith Machine JM Press" },
  { bodyPart: "Triceps", muscle: "Medial Head", name: "Tricep Dips" },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Seed exercises
    console.log("Seeding exercises...");
    let created = 0;
    for (const ex of EXERCISES) {
      try {
        await Exercise.create(ex);
        created++;
      } catch (err) {
        if (err.code === 11000) {
          // Already exists, skip
        } else {
          console.error(`Failed to create ${ex.name}:`, err.message);
        }
      }
    }
    console.log(`✓ ${created} exercises seeded (${EXERCISES.length - created} already existed)`);

    // Create admin user if not exists
    const adminEmail = "admin@gymlog.com";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: "Admin",
        email: adminEmail,
        password: "admin123",
        role: "admin",
        isVerified: true,
      });
      console.log(`✓ Admin user created (email: ${adminEmail}, password: admin123)`);
    } else {
      console.log("✓ Admin user already exists");
    }

    await mongoose.connection.close();
    console.log("Done!");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
