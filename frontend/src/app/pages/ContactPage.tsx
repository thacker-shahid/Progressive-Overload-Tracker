import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { contactApi } from "../services/api";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await contactApi.submit(formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err: any) {
      setError(err.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold uppercase text-foreground tracking-wider mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.1em" }}>
        Contact <span className="text-primary">Us</span>
      </h1>

      <p className="text-muted-foreground mb-8">Have questions, feedback, or need support? Reach out to us and we'll get back to you as soon as possible.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: <Mail size={20} />, label: "Email", value: "fitwithtauheed@gmail.com" },
          { icon: <Phone size={20} />, label: "Phone", value: "+1 (415) 1234567930" },
          { icon: <MapPin size={20} />, label: "Location", value: "Mumbai, India" },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3 p-4 border border-border rounded-sm bg-card">
            <div className="text-primary mt-0.5">{item.icon}</div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{item.label}</p>
              <p className="text-sm text-foreground mt-0.5">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Name</label>
          <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 bg-input-background border border-border rounded-sm text-foreground text-sm focus:border-primary focus:outline-none transition-colors" placeholder="Your name" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Email</label>
          <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 bg-input-background border border-border rounded-sm text-foreground text-sm focus:border-primary focus:outline-none transition-colors" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Subject</label>
          <input type="text" required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full px-3 py-2 bg-input-background border border-border rounded-sm text-foreground text-sm focus:border-primary focus:outline-none transition-colors" placeholder="How can we help?" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Message</label>
          <textarea required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-3 py-2 bg-input-background border border-border rounded-sm text-foreground text-sm focus:border-primary focus:outline-none transition-colors resize-none" placeholder="Tell us more..." />
        </div>
        <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 rounded-sm bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 disabled:opacity-50 transition-colors" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em" }}>
          <Send size={14} />
          {loading ? "Sending..." : "Send Message"}
        </button>
        {submitted && <p className="text-sm text-primary font-medium">Message sent successfully! We'll get back to you soon.</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </form>
    </div>
  );
}
