import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Eye, EyeOff, KeyRound, ArrowLeft } from "lucide-react";
import { authApi } from "../services/api";

export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState((location.state as { email?: string })?.email || "");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleCodeChange(index: number, value: string) {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`reset-otp-${index + 1}`);
      nextInput?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`reset-otp-${index - 1}`);
      prevInput?.focus();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const codeStr = code.join("");
    if (codeStr.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }
    if (!email) {
      setError("Email is required.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(email, codeStr, newPassword);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <KeyRound size={24} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold uppercase text-foreground tracking-wider mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.1em" }}>
            Password <span className="text-primary">Reset</span>
          </h1>
          <p className="text-sm text-muted-foreground mb-6">Your password has been reset successfully.</p>
          <Link
            to="/login"
            className="inline-block w-full px-4 py-2.5 rounded-sm bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors text-center"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em" }}
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <KeyRound size={24} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold uppercase text-foreground tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.1em" }}>
            Reset <span className="text-primary">Password</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Enter the code sent to your email and set a new password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-foreground text-sm focus:border-primary focus:outline-none transition-colors" placeholder="you@example.com" />
          </div>

          {/* OTP Code */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Reset Code</label>
            <div className="flex justify-center gap-2">
              {code.map((digit, index) => (
                <input key={index} id={`reset-otp-${index}`} type="text" inputMode="numeric" maxLength={1} value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-9 h-11 text-center text-base font-mono font-bold bg-input-background border border-border rounded-sm text-foreground focus:border-primary focus:outline-none transition-colors" />
              ))}
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>New Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-foreground text-sm focus:border-primary focus:outline-none transition-colors pr-10" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Confirm New Password</label>
            <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-foreground text-sm focus:border-primary focus:outline-none transition-colors" placeholder="••••••••" />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button type="submit" disabled={loading} className="w-full px-4 py-2.5 rounded-sm bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 disabled:opacity-50 transition-colors" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em" }}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
