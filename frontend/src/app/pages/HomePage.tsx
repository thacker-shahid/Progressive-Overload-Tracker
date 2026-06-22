import { Link } from "react-router";
import { TrendingUp, Dumbbell, BarChart3, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1
            className="text-4xl sm:text-6xl font-bold uppercase text-foreground tracking-wider"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.1em" }}
          >
            Track Your <span className="text-primary">Progress</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Log your workouts, track progressive overload, and visualize your gains over time. Built for serious lifters.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-8 py-3 rounded-sm bg-primary text-primary-foreground font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors text-sm"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.1em" }}
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="px-8 py-3 rounded-sm bg-primary text-primary-foreground font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors text-sm"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.1em" }}
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 rounded-sm border border-border text-foreground font-semibold uppercase tracking-wider hover:bg-secondary transition-colors text-sm"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.1em" }}
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-card border-y border-border">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-2xl sm:text-3xl font-bold uppercase text-center text-foreground tracking-wider mb-12"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em" }}
          >
            Why GymLog?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Dumbbell size={24} />, title: "Exercise Library", desc: "Comprehensive exercises organized by muscle group and target area." },
              { icon: <TrendingUp size={24} />, title: "Progressive Overload", desc: "Track weight, sets, and reps weekly to ensure consistent progress." },
              { icon: <BarChart3 size={24} />, title: "Visual Analytics", desc: "Charts and graphs showing your strength progression over time." },
              { icon: <Users size={24} />, title: "Personal Profile", desc: "Track your body stats, BMI, and overall fitness journey." },
            ].map((feature, i) => (
              <div key={i} className="p-6 border border-border rounded-sm bg-background hover:border-primary/30 transition-colors">
                <div className="text-primary mb-3">{feature.icon}</div>
                <h3
                  className="text-sm font-bold uppercase text-foreground tracking-wider mb-2"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em" }}
                >
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Guide Video */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2
              className="text-2xl sm:text-3xl font-bold uppercase text-foreground tracking-wider mb-3"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em" }}
            >
              How to <span className="text-primary">Use GymLog</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Watch this quick guide to learn how to track your workouts, log progressive overload, and visualize your gains.
            </p>
          </div>
          <div className="relative w-full aspect-video rounded-sm overflow-hidden border border-border bg-muted">
            {/* Replace the URL below with your YouTube embed link or Google Drive video embed link */}
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="GymLog User Guide"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-2xl sm:text-3xl font-bold uppercase text-foreground tracking-wider mb-4"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em" }}
          >
            Ready to level up?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of lifters who track their progress with GymLog. Free to start, no credit card required.
          </p>
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-block px-8 py-3 rounded-sm bg-primary text-primary-foreground font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors text-sm"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.1em" }}
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              to="/signup"
              className="inline-block px-8 py-3 rounded-sm bg-primary text-primary-foreground font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors text-sm"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.1em" }}
            >
              Create Account
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
