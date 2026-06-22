import { Dumbbell, Target, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1
        className="text-3xl sm:text-4xl font-bold uppercase text-foreground tracking-wider mb-6"
        style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.1em" }}
      >
        About <span className="text-primary">GymLog</span>
      </h1>

      <p className="text-muted-foreground text-base leading-relaxed mb-8">
        GymLog was built by fitness enthusiasts who got tired of scribbling workout logs on paper or juggling
        spreadsheets. We believe that tracking progressive overload should be simple, visual, and motivating.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {[
          { icon: <Dumbbell size={28} />, title: "Our Mission", desc: "Make strength tracking accessible to every gym-goer, from beginners to advanced lifters." },
          { icon: <Target size={28} />, title: "Our Vision", desc: "Become the go-to platform for structured workout logging and progressive overload tracking." },
          { icon: <Heart size={28} />, title: "Our Values", desc: "Simplicity, honesty in data, and a genuine passion for helping people get stronger." },
        ].map((item, i) => (
          <div key={i} className="p-6 border border-border rounded-sm bg-card">
            <div className="text-primary mb-3">{item.icon}</div>
            <h3
              className="text-sm font-bold uppercase text-foreground tracking-wider mb-2"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em" }}
            >
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>

      <h2
        className="text-xl font-bold uppercase text-foreground tracking-wider mb-4"
        style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em" }}
      >
        How It Works
      </h2>
      <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
        <p>
          GymLog organizes exercises by body part and muscle group. Each exercise has a progressive overload log
          where you record your weight, sets, and reps week over week. The app tracks your progress and highlights
          when you've hit a new personal record.
        </p>
        <p>
          Your data is stored securely and accessible from any device once you create an account. Admins can manage
          the exercise library, add new movements, and attach demonstration images and videos for proper form guidance.
        </p>
        <p>
          Whether you're running a push/pull/legs split, an upper/lower routine, or full-body sessions, GymLog adapts
          to your training style by letting you track exactly the exercises you perform.
        </p>
      </div>
    </div>
  );
}
