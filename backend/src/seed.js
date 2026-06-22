require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Exercise = require("./models/Exercise");

const EXERCISES = [
  // Back
  { bodyPart: "Back", muscle: "Upper Trapezius", name: "Barbell Shrugs" },
  { bodyPart: "Back", muscle: "Upper Trapezius", name: "Dumbbell Shrugs" },
  { bodyPart: "Back", muscle: "Upper Trapezius", name: "Upright Rows" },
  { bodyPart: "Back", muscle: "Middle Trapezius", name: "Face Pulls" },
  { bodyPart: "Back", muscle: "Middle Trapezius", name: "Bent-Over Row" },
  { bodyPart: "Back", muscle: "Middle Trapezius", name: "Seated Cable Row" },
  { bodyPart: "Back", muscle: "Lower Trapezius", name: "Prone Y-Raise" },
  { bodyPart: "Back", muscle: "Lower Trapezius", name: "Cable Pull-Through" },
  { bodyPart: "Back", muscle: "Lower Trapezius", name: "Reverse Fly" },
  { bodyPart: "Back", muscle: "Rear Deltoid", name: "Rear Delt Fly" },
  { bodyPart: "Back", muscle: "Rear Deltoid", name: "Reverse Pec Deck" },
  { bodyPart: "Back", muscle: "Latissimus Dorsi", name: "Lat Pulldown" },
  { bodyPart: "Back", muscle: "Latissimus Dorsi", name: "Pull-Ups" },
  { bodyPart: "Back", muscle: "Latissimus Dorsi", name: "Straight-Arm Pulldown" },
  { bodyPart: "Back", muscle: "Latissimus Dorsi", name: "Single-Arm Dumbbell Row" },
  { bodyPart: "Back", muscle: "Erector Spinae", name: "Deadlift" },
  { bodyPart: "Back", muscle: "Erector Spinae", name: "Back Extensions" },
  { bodyPart: "Back", muscle: "Erector Spinae", name: "Good Mornings" },
  // Biceps
  { bodyPart: "Biceps", muscle: "Long Head", name: "Incline Dumbbell Curl" },
  { bodyPart: "Biceps", muscle: "Long Head", name: "Hammer Curl" },
  { bodyPart: "Biceps", muscle: "Long Head", name: "Barbell Curl" },
  { bodyPart: "Biceps", muscle: "Short Head", name: "Concentration Curl" },
  { bodyPart: "Biceps", muscle: "Short Head", name: "Preacher Curl" },
  { bodyPart: "Biceps", muscle: "Short Head", name: "Cable Curl" },
  { bodyPart: "Biceps", muscle: "Brachialis", name: "Reverse Curl" },
  { bodyPart: "Biceps", muscle: "Brachialis", name: "Cross-Body Hammer Curl" },
  // Chest
  { bodyPart: "Chest", muscle: "Upper Chest", name: "Incline Barbell Press" },
  { bodyPart: "Chest", muscle: "Upper Chest", name: "Incline Dumbbell Fly" },
  { bodyPart: "Chest", muscle: "Upper Chest", name: "Cable Crossover High-to-Low" },
  { bodyPart: "Chest", muscle: "Lower Chest", name: "Decline Barbell Press" },
  { bodyPart: "Chest", muscle: "Lower Chest", name: "Dips" },
  { bodyPart: "Chest", muscle: "Lower Chest", name: "Cable Crossover Low-to-High" },
  { bodyPart: "Chest", muscle: "Middle Chest", name: "Flat Bench Press" },
  { bodyPart: "Chest", muscle: "Middle Chest", name: "Dumbbell Fly" },
  { bodyPart: "Chest", muscle: "Middle Chest", name: "Machine Chest Press" },
  // Triceps
  { bodyPart: "Triceps", muscle: "Long Head", name: "Overhead Tricep Extension" },
  { bodyPart: "Triceps", muscle: "Long Head", name: "Skull Crushers" },
  { bodyPart: "Triceps", muscle: "Long Head", name: "Close-Grip Bench Press" },
  { bodyPart: "Triceps", muscle: "Lateral Head", name: "Tricep Pushdown" },
  { bodyPart: "Triceps", muscle: "Lateral Head", name: "Diamond Push-Ups" },
  { bodyPart: "Triceps", muscle: "Lateral Head", name: "Cable Kickback" },
  { bodyPart: "Triceps", muscle: "Medial Head", name: "Reverse-Grip Pushdown" },
  { bodyPart: "Triceps", muscle: "Medial Head", name: "Bench Dips" },
  { bodyPart: "Triceps", muscle: "Medial Head", name: "Tricep Dips" },
  // Shoulders
  { bodyPart: "Shoulders", muscle: "Anterior Head (Front Delt)", name: "Overhead Press" },
  { bodyPart: "Shoulders", muscle: "Anterior Head (Front Delt)", name: "Front Raise" },
  { bodyPart: "Shoulders", muscle: "Anterior Head (Front Delt)", name: "Arnold Press" },
  { bodyPart: "Shoulders", muscle: "Lateral Head (Middle Delt)", name: "Lateral Raise" },
  { bodyPart: "Shoulders", muscle: "Lateral Head (Middle Delt)", name: "Upright Row" },
  { bodyPart: "Shoulders", muscle: "Lateral Head (Middle Delt)", name: "Cable Side Raise" },
  { bodyPart: "Shoulders", muscle: "Posterior Head (Rear Delt)", name: "Reverse Pec Deck" },
  { bodyPart: "Shoulders", muscle: "Posterior Head (Rear Delt)", name: "Bent-Over Rear Delt Fly" },
  { bodyPart: "Shoulders", muscle: "Posterior Head (Rear Delt)", name: "Face Pulls" },
  // Legs
  { bodyPart: "Legs", muscle: "Quads", name: "Barbell Squat" },
  { bodyPart: "Legs", muscle: "Quads", name: "Leg Press" },
  { bodyPart: "Legs", muscle: "Quads", name: "Leg Extension" },
  { bodyPart: "Legs", muscle: "Quads", name: "Hack Squat" },
  { bodyPart: "Legs", muscle: "Hamstrings", name: "Romanian Deadlift" },
  { bodyPart: "Legs", muscle: "Hamstrings", name: "Lying Leg Curl" },
  { bodyPart: "Legs", muscle: "Hamstrings", name: "Seated Leg Curl" },
  { bodyPart: "Legs", muscle: "Hamstrings", name: "Nordic Curl" },
  { bodyPart: "Legs", muscle: "Glutes", name: "Hip Thrust" },
  { bodyPart: "Legs", muscle: "Glutes", name: "Bulgarian Split Squat" },
  { bodyPart: "Legs", muscle: "Glutes", name: "Cable Kickback" },
  { bodyPart: "Legs", muscle: "Glutes", name: "Sumo Deadlift" },
  { bodyPart: "Legs", muscle: "Calves", name: "Standing Calf Raise" },
  { bodyPart: "Legs", muscle: "Calves", name: "Seated Calf Raise" },
  { bodyPart: "Legs", muscle: "Calves", name: "Donkey Calf Raise" },
  // Abs
  { bodyPart: "Abs", muscle: "Lower Abs (Rectus)", name: "Hanging Leg Raise" },
  { bodyPart: "Abs", muscle: "Lower Abs (Rectus)", name: "Reverse Crunch" },
  { bodyPart: "Abs", muscle: "Lower Abs (Rectus)", name: "Dragon Flag" },
  { bodyPart: "Abs", muscle: "Obliques", name: "Russian Twist" },
  { bodyPart: "Abs", muscle: "Obliques", name: "Side Plank" },
  { bodyPart: "Abs", muscle: "Obliques", name: "Woodchop Cable" },
  { bodyPart: "Abs", muscle: "Upper Abs (Transverse Abdominis)", name: "Cable Crunch" },
  { bodyPart: "Abs", muscle: "Upper Abs (Transverse Abdominis)", name: "Crunch" },
  { bodyPart: "Abs", muscle: "Upper Abs (Transverse Abdominis)", name: "Ab Wheel Rollout" },
  // Forearms
  { bodyPart: "Forearms", muscle: "Brachioradialis (Outer/Top)", name: "Reverse Curl" },
  { bodyPart: "Forearms", muscle: "Brachioradialis (Outer/Top)", name: "Hammer Curl" },
  { bodyPart: "Forearms", muscle: "Brachioradialis (Outer/Top)", name: "Zottman Curl" },
  { bodyPart: "Forearms", muscle: "Anterior Flexor Muscles", name: "Wrist Curl" },
  { bodyPart: "Forearms", muscle: "Anterior Flexor Muscles", name: "Barbell Wrist Curl" },
  { bodyPart: "Forearms", muscle: "Anterior Flexor Muscles", name: "Finger Curl" },
  { bodyPart: "Forearms", muscle: "Posterior Extensor Muscles", name: "Reverse Wrist Curl" },
  { bodyPart: "Forearms", muscle: "Posterior Extensor Muscles", name: "Wrist Roller" },
  { bodyPart: "Forearms", muscle: "Posterior Extensor Muscles", name: "Farmer's Carry" },
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
