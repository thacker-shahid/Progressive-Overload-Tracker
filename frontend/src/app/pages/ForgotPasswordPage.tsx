import { useState } from "react";
import { Link } from "react-router";
import { Mail, ArrowLeft } from "lucide-react";
import { authApi } from "../services/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset code.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Mail size={24} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold uppercase text-foreground tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.1em" }}>
            Forgot <span className="text-primary">Password</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your email and we'll send you a reset code
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-foreground text-sm focus:border-primary focus:outline-none transition-colors" placeholder="you@example.com" />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <button type="submit" disabled={loading} className="w-full px-4 py-2.5 rounded-sm bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 disabled:opacity-50 transition-colors" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em" }}>
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="p-4 border border-primary/30 rounded-sm bg-primary/5">
              <p className="text-sm text-foreground">
                A 6-digit reset code has been sent to <span className="font-medium text-primary">{email}</span>
              </p>
            </div>
            <Link
              to="/reset-password"
              state={{ email }}
              className="inline-block w-full px-4 py-2.5 rounded-sm bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors text-center"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em" }}
            >
              Enter Reset Code
            </Link>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
