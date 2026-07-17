require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Exercise = require("./models/Exercise");

// Image base URL from free-exercise-db (public domain)
const IMG = "https://ik.imagekit.io/yuhonas";

const EXERCISES = [
  // ── Abs ─────────────────────────────────────────────────────────────────────
  { bodyPart: "Abs", muscle: "Upper Abs (Transverse Abdominis)", name: "Cable Crunch", imageUrl: `${IMG}/Cable_Crunch/0.jpg` },
  { bodyPart: "Abs", muscle: "Obliques", name: "Side Plank", imageUrl: `${IMG}/Side_Bridge/0.jpg` },
  { bodyPart: "Abs", muscle: "Obliques", name: "Woodchop Cable.", imageUrl: `${IMG}/Standing_Cable_Wood_Chop/0.jpg` },
  { bodyPart: "Abs", muscle: "Lower Abs (Rectus)", name: "Dragon Flag", imageUrl: `${IMG}/Flat_Bench_Lying_Leg_Raise/0.jpg` },
  { bodyPart: "Abs", muscle: "Lower Abs (Rectus)", name: "Hanging Leg Raise", imageUrl: `${IMG}/Hanging_Leg_Raise/0.jpg` },

  // ── Back ────────────────────────────────────────────────────────────────────
  { bodyPart: "Back", muscle: "Upper Trapezius", name: "Dumbbell Shrugs", imageUrl: `${IMG}/Dumbbell_Shrug/0.jpg` },
  { bodyPart: "Back", muscle: "Upper Trapezius", name: "Barbell Shrugs", imageUrl: `${IMG}/Barbell_Shrug/0.jpg` },
  { bodyPart: "Back", muscle: "Middle and Lower Trapezius", name: "Wide Grip Cable Rows", imageUrl: `${IMG}/Seated_Cable_Rows/0.jpg` },
  { bodyPart: "Back", muscle: "Middle and Lower Trapezius", name: "Chest Supported Row", imageUrl: `${IMG}/Dumbbell_Incline_Row/0.jpg` },
  { bodyPart: "Back", muscle: "Middle and Lower Trapezius", name: "Face Pulls", imageUrl: `${IMG}/Face_Pull/0.jpg` },
  { bodyPart: "Back", muscle: "Latissimus Dorsi", name: "Wide Grip Lat Pulldown", imageUrl: `${IMG}/Wide-Grip_Lat_Pulldown/0.jpg` },
  { bodyPart: "Back", muscle: "Latissimus Dorsi", name: "Neutral Grip Lat Pulldown", imageUrl: `${IMG}/Close-Grip_Front_Lat_Pulldown/0.jpg` },
  { bodyPart: "Back", muscle: "Latissimus Dorsi", name: "Seated Cable Row", imageUrl: `${IMG}/Seated_Cable_Rows/0.jpg` },
  { bodyPart: "Back", muscle: "Latissimus Dorsi", name: "Cross Body Lat Pull Around", imageUrl: `${IMG}/One_Arm_Lat_Pulldown/0.jpg` },
  { bodyPart: "Back", muscle: "Erector Spinae", name: "Back Extensions", imageUrl: `${IMG}/Hyperextensions__Back_Extensions_/0.jpg` },
  { bodyPart: "Back", muscle: "Erector Spinae", name: "Romanian Deadlift", imageUrl: `${IMG}/Romanian_Deadlift/0.jpg` },

  // ── Biceps ──────────────────────────────────────────────────────────────────
  { bodyPart: "Biceps", muscle: "Long Head", name: "Incline Dumbbell Curl", imageUrl: `${IMG}/Incline_Dumbbell_Curl/0.jpg` },
  { bodyPart: "Biceps", muscle: "Long Head", name: "Behind the back cable curls or Bayesian curls", imageUrl: `${IMG}/Cable_Hammer_Curls_-_Rope_Attachment/0.jpg` },
  { bodyPart: "Biceps", muscle: "Long Head", name: "Close grip EZ bar curls", imageUrl: `${IMG}/Close-Grip_EZ-Bar_Curl/0.jpg` },
  { bodyPart: "Biceps", muscle: "Short Head", name: "Wide grip EZ bar curls", imageUrl: `${IMG}/Wide-Grip_Standing_Barbell_Curl/0.jpg` },
  { bodyPart: "Biceps", muscle: "Short Head", name: "Preacher Curl", imageUrl: `${IMG}/Preacher_Curl/0.jpg` },
  { bodyPart: "Biceps", muscle: "Short Head", name: "Cable Curl", imageUrl: `${IMG}/Cable_Hammer_Curls_-_Rope_Attachment/0.jpg` },
  { bodyPart: "Biceps", muscle: "Brachialis", name: "Rope Hammer Curl", imageUrl: `${IMG}/Cable_Hammer_Curls_-_Rope_Attachment/0.jpg` },
  { bodyPart: "Biceps", muscle: "Brachialis", name: "Hammer grip preacher curls", imageUrl: `${IMG}/Preacher_Hammer_Dumbbell_Curl/0.jpg` },
  { bodyPart: "Biceps", muscle: "Brachialis", name: "Reverse grip - EZ bar curls", imageUrl: `${IMG}/Reverse_Barbell_Curl/0.jpg` },

  // ── Chest ───────────────────────────────────────────────────────────────────
  { bodyPart: "Chest", muscle: "Upper Chest", name: "Cable Crossover Low-to-High", imageUrl: `${IMG}/Cable_Crossover/0.jpg` },
  { bodyPart: "Chest", muscle: "Upper Chest", name: "Incline Dumbbell Press", imageUrl: `${IMG}/Incline_Dumbbell_Bench_With_Palms_Facing_In/0.jpg` },
  { bodyPart: "Chest", muscle: "Upper Chest", name: "Inclined Machine Bench Press", imageUrl: `${IMG}/Machine_Bench_Press/0.jpg` },
  { bodyPart: "Chest", muscle: "Middle Chest", name: "Seated Flat Machine Chest Press.", imageUrl: `${IMG}/Machine_Bench_Press/0.jpg` },
  { bodyPart: "Chest", muscle: "Middle Chest", name: "Pec Deck Chest Fly Machine", imageUrl: `${IMG}/Butterfly/0.jpg` },
  { bodyPart: "Chest", muscle: "Middle Chest", name: "Flat Bench Press", imageUrl: `${IMG}/Barbell_Bench_Press_-_Medium_Grip/0.jpg` },
  { bodyPart: "Chest", muscle: "Middle Chest", name: "Mid Cable Chest Fly", imageUrl: `${IMG}/Cable_Crossover/0.jpg` },
  { bodyPart: "Chest", muscle: "Lower Chest", name: "Straight Bar Dips", imageUrl: `${IMG}/Dips_-_Chest_Version/0.jpg` },
  { bodyPart: "Chest", muscle: "Lower Chest", name: "Decline Dumbbell Press", imageUrl: `${IMG}/Decline_Dumbbell_Bench_Press/0.jpg` },
  { bodyPart: "Chest", muscle: "Lower Chest", name: "Cable Crossover High-to-Low", imageUrl: `${IMG}/Cable_Crossover/0.jpg` },
  { bodyPart: "Chest", muscle: "Side Chest", name: "Machine Side Chest", imageUrl: `${IMG}/Machine_Bench_Press/0.jpg` },

  // ── Forearms ────────────────────────────────────────────────────────────────
  { bodyPart: "Forearms", muscle: "Brachioradialis (Outer/Top)", name: "Hammer Curl", imageUrl: `${IMG}/Hammer_Curls/0.jpg` },
  { bodyPart: "Forearms", muscle: "Brachioradialis (Outer/Top)", name: "Reverse Straight Bar Curl", imageUrl: `${IMG}/Reverse_Barbell_Curl/0.jpg` },
  { bodyPart: "Forearms", muscle: "Anterior Flexor Muscles", name: "Barbell Wrist Curl", imageUrl: `${IMG}/Palms-Up_Barbell_Wrist_Curl_Over_A_Bench/0.jpg` },
  { bodyPart: "Forearms", muscle: "Posterior Extensor Muscles", name: "Reverse Wrist Curl", imageUrl: `${IMG}/Palms-Down_Wrist_Curl_Over_A_Bench/0.jpg` },

  // ── Legs ────────────────────────────────────────────────────────────────────
  { bodyPart: "Legs", muscle: "Quads", name: "Hack Squat", imageUrl: `${IMG}/Hack_Squat/0.jpg` },
  { bodyPart: "Legs", muscle: "Quads", name: "45 Degree Leg Press Machine", imageUrl: `${IMG}/Leg_Press/0.jpg` },
  { bodyPart: "Legs", muscle: "Quads", name: "Smith Machine Barbbell Squat", imageUrl: `${IMG}/Smith_Machine_Squat/0.jpg` },
  { bodyPart: "Legs", muscle: "Quads", name: "Seated Machine Leg Extension", imageUrl: `${IMG}/Leg_Extensions/0.jpg` },
  { bodyPart: "Legs", muscle: "Hamstrings", name: "Romanian Deadlift", imageUrl: `${IMG}/Romanian_Deadlift/0.jpg` },
  { bodyPart: "Legs", muscle: "Hamstrings", name: "Lying Leg Curl", imageUrl: `${IMG}/Lying_Leg_Curls/0.jpg` },
  { bodyPart: "Legs", muscle: "Hamstrings", name: "Seated Leg Curl", imageUrl: `${IMG}/Seated_Leg_Curl/0.jpg` },
  { bodyPart: "Legs", muscle: "Hamstrings", name: "Nordic Curl", imageUrl: `${IMG}/Floor_Glute-Ham_Raise/0.jpg` },
  { bodyPart: "Legs", muscle: "Glutes", name: "45 Degree Back Extention", imageUrl: `${IMG}/Hyperextensions__Back_Extensions_/0.jpg` },
  { bodyPart: "Legs", muscle: "Glutes", name: "Walking Lunge", imageUrl: `${IMG}/Dumbbell_Lunges/0.jpg` },
  { bodyPart: "Legs", muscle: "Calves", name: "Standing Calf Raise", imageUrl: `${IMG}/Standing_Calf_Raises/0.jpg` },
  { bodyPart: "Legs", muscle: "Calves", name: "Seated Calf Raise", imageUrl: `${IMG}/Seated_Calf_Raise/0.jpg` },

  // ── Shoulders ───────────────────────────────────────────────────────────────
  { bodyPart: "Shoulders", muscle: "Anterior Head (Front Delt)", name: "Arnold Press", imageUrl: `${IMG}/Arnold_Dumbbell_Press/0.jpg` },
  { bodyPart: "Shoulders", muscle: "Anterior Head (Front Delt)", name: "Overhead Machine Shoulder Press", imageUrl: `${IMG}/Machine_Shoulder__Military__Press/0.jpg` },
  { bodyPart: "Shoulders", muscle: "Lateral Head (Middle Delt)", name: "Lying Dumbbell Lateral", imageUrl: `${IMG}/Side_Lateral_Raise/0.jpg` },
  { bodyPart: "Shoulders", muscle: "Lateral Head (Middle Delt)", name: "Behind the Back Cuffed Lateral Raise", imageUrl: `${IMG}/Side_Lateral_Raise/0.jpg` },
  { bodyPart: "Shoulders", muscle: "Lateral Head (Middle Delt)", name: "Cable Side Lateral Raise", imageUrl: `${IMG}/Cable_Lateral_Raise/0.jpg` },
  { bodyPart: "Shoulders", muscle: "Posterior Head (Rear Delt)", name: "Face Pulls", imageUrl: `${IMG}/Face_Pull/0.jpg` },
  { bodyPart: "Shoulders", muscle: "Posterior Head (Rear Delt)", name: "Super-Rom Reverse Cable Fly", imageUrl: `${IMG}/Cable_Rear_Delt_Fly/0.jpg` },
  { bodyPart: "Shoulders", muscle: "Posterior Head (Rear Delt)", name: "Reverse Pec Deck", imageUrl: `${IMG}/Butterfly/0.jpg` },

  // ── Triceps ─────────────────────────────────────────────────────────────────
  { bodyPart: "Triceps", muscle: "Long Head", name: "Overhead Cable Tricep Extension", imageUrl: `${IMG}/Cable_Lying_Triceps_Extension/0.jpg` },
  { bodyPart: "Triceps", muscle: "Long Head", name: "Skull Crushers", imageUrl: `${IMG}/Lying_Triceps_Press/0.jpg` },
  { bodyPart: "Triceps", muscle: "Long Head", name: "Katana Cable Triceps Extension", imageUrl: `${IMG}/Cable_One_Arm_Tricep_Extension/0.jpg` },
  { bodyPart: "Triceps", muscle: "Lateral Head", name: "Rope Pushdown", imageUrl: `${IMG}/Triceps_Pushdown_-_Rope_Attachment/0.jpg` },
  { bodyPart: "Triceps", muscle: "Lateral Head", name: "Single-Arm Cable Triceps Extention Kickback", imageUrl: `${IMG}/Cable_One_Arm_Tricep_Extension/0.jpg` },
  { bodyPart: "Triceps", muscle: "Lateral Head", name: "Double-Arm Cable Cross Triceps Extension", imageUrl: `${IMG}/Cable_Lying_Triceps_Extension/0.jpg` },
  { bodyPart: "Triceps", muscle: "Medial Head", name: "Reverse-Grip Pushdown", imageUrl: `${IMG}/Reverse_Grip_Triceps_Pushdown/0.jpg` },
  { bodyPart: "Triceps", muscle: "Medial Head", name: "Smith Machine JM Press", imageUrl: `${IMG}/Close-Grip_Barbell_Bench_Press/0.jpg` },
  { bodyPart: "Triceps", muscle: "Medial Head", name: "Tricep Dips", imageUrl: `${IMG}/Dips_-_Triceps_Version/0.jpg` },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Seed exercises
    console.log("Seeding exercises...");
    let created = 0;
    let updated = 0;
    for (const ex of EXERCISES) {
      try {
        // Try to update existing exercise with imageUrl, or create new
        const existing = await Exercise.findOne({
          bodyPart: ex.bodyPart,
          muscle: ex.muscle,
          name: ex.name,
        });
        if (existing) {
          if (ex.imageUrl && !existing.imageUrl) {
            existing.imageUrl = ex.imageUrl;
            await existing.save();
            updated++;
          }
        } else {
          await Exercise.create(ex);
          created++;
        }
      } catch (err) {
        if (err.code === 11000) {
          // Already exists, skip
        } else {
          console.error(`Failed to create ${ex.name}:`, err.message);
        }
      }
    }
    console.log(`✓ ${created} exercises created, ${updated} exercises updated with images (${EXERCISES.length - created - updated} unchanged)`);

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
