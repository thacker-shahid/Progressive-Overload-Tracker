import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, resendCode } = useAuth();

  const email = (location.state as { email?: string })?.email || "";

  // Redirect if no email in state
  if (!email) {
    navigate("/login", { replace: true });
    return null;
  }

  function handleChange(index: number, value: string) {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    setError("");
    setLoading(true);

    const result = await verifyOtp(email, code);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error || "Invalid verification code.");
    }
    setLoading(false);
  }

  async function handleResend() {
    setResending(true);
    setError("");
    const result = await resendCode(email);
    if (!result.success) {
      setError(result.error || "Failed to resend code.");
    }
    setResending(false);
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <ShieldCheck size={28} className="text-primary" />
        </div>

        <h1 className="text-2xl font-bold uppercase text-foreground tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.1em" }}>
          Verify Your <span className="text-primary">Email</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-2 mb-8">
          We've sent a 6-digit verification code to<br />
          <span className="text-foreground font-medium">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input key={index} id={`otp-${index}`} type="text" inputMode="numeric" maxLength={1} value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg font-mono font-bold bg-input-background border border-border rounded-sm text-foreground focus:border-primary focus:outline-none transition-colors" />
            ))}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button type="submit" disabled={loading} className="w-full px-4 py-2.5 rounded-sm bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 disabled:opacity-50 transition-colors" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em" }}>
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>

        <p className="text-sm text-muted-foreground mt-6">
          Didn't receive the code?{" "}
          <button onClick={handleResend} disabled={resending} className="text-primary hover:underline disabled:opacity-50">
            {resending ? "Sending..." : "Resend"}
          </button>
        </p>
      </div>
    </div>
  );
}
