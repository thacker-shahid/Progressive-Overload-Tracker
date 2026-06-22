import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const result = await signup(name, email, password);
    if (result.success) {
      navigate("/verify-email", { state: { email } });
    } else {
      setError(result.error || "Signup failed. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold uppercase text-foreground tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.1em" }}>
            Create <span className="text-primary">Account</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Start tracking your progressive overload</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Full Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-foreground text-sm focus:border-primary focus:outline-none transition-colors" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-foreground text-sm focus:border-primary focus:outline-none transition-colors" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-foreground text-sm focus:border-primary focus:outline-none transition-colors pr-10" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Confirm Password</label>
            <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-foreground text-sm focus:border-primary focus:outline-none transition-colors" placeholder="••••••••" />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 disabled:opacity-50 transition-colors" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em" }}>
            <UserPlus size={16} />
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
