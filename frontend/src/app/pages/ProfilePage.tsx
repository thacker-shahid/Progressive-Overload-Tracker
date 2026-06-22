import React, { useState, useEffect } from "react";
import { Save, User, Menu, X, BarChart3 } from "lucide-react";
import { clsx } from "clsx";
import { useAuth } from "../context/AuthContext";
import { userApi, exerciseApi } from "../services/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// ── Body Part SVG Icons ───────────────────────────────────────────────────────
function IconBack() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C10 2 8.5 3.5 8.5 5.5c0 1.5.8 2.8 2 3.5" /><path d="M12 2c2 0 3.5 1.5 3.5 3.5 0 1.5-.8 2.8-2 3.5" /><path d="M8.5 9c-1 .5-2 2-2 4v5c0 1 .5 2 1.5 2.5" /><path d="M15.5 9c1 .5 2 2 2 4v5c0 1-.5 2-1.5 2.5" /><path d="M12 9v8" /><path d="M9 13h6" /><path d="M9 16h6" /></svg>); }
function IconBiceps() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17c1.5 2 4 3 6.5 2.5" /><path d="M4 11c0-2 1-4 3-5s4.5-1 6 .5c1 1 1.5 2.5 1 4" /><path d="M14 10.5c1.5-.5 3 0 4 1s1.5 3 .5 4.5" /><path d="M18.5 16c-.5 1.5-2 2.5-3.5 2.5" /><path d="M11.5 19.5c-2 .5-4-.5-5-2" /><path d="M7 8c-1-1.5-1-3.5 0-4.5" /></svg>); }
function IconChest() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4c-4 0-7 2-8 5 0 2 1 4 3 5" /><path d="M12 4c4 0 7 2 8 5 0 2-1 4-3 5" /><path d="M12 4v10" /><path d="M7 14c1 2 3 3 5 3s4-1 5-3" /><ellipse cx="8" cy="10" rx="2" ry="1.5" /><ellipse cx="16" cy="10" rx="2" ry="1.5" /></svg>); }
function IconTriceps() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4c1.5 1 2.5 3 2.5 5s-.5 3.5-1.5 4.5" /><path d="M17 13.5c-.5 2-2 3.5-3.5 4" /><path d="M13.5 17.5c-1.5.5-3 0-4-1" /><path d="M9.5 16.5c-1-1-1.5-3-1-4.5" /><path d="M8.5 12c0-2 .5-3.5 2-5" /><path d="M10.5 7c1-1 2-1.5 3.5-1.5" /><path d="M14 5.5c1-.5 2 0 2 0" /><line x1="15" y1="9" x2="11" y2="14" /></svg>); }
function IconShoulders() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2.5" /><path d="M12 7.5v3" /><path d="M9.5 7.5C7 8.5 5 10.5 4 13" /><path d="M14.5 7.5C17 8.5 19 10.5 20 13" /><path d="M4 13c0 2 1 3.5 2.5 4" /><path d="M20 13c0 2-1 3.5-2.5 4" /><path d="M8 20v-4" /><path d="M16 20v-4" /></svg>); }
function IconLegs() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3c-.5 3-1 6-1 9 0 2 .5 4 1 6l-.5 3" /><path d="M15 3c.5 3 1 6 1 9 0 2-.5 4-1 6l.5 3" /><path d="M8 12c0 1.5.5 3 1.5 4" /><path d="M16 12c0 1.5-.5 3-1.5 4" /><path d="M10 3h4" /><path d="M8.5 21H10" /><path d="M14 21h1.5" /></svg>); }
function IconAbs() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 4c-1 0-2 1-2 2v12c0 2 1.5 3 3 3h6c1.5 0 3-1 3-3V6c0-1-1-2-2-2" /><line x1="12" y1="5" x2="12" y2="19" /><line x1="8" y1="8" x2="16" y2="8" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="8" y1="16" x2="16" y2="16" /></svg>); }
function IconForearms() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4c1 2 1.5 5 1.5 8s-.5 5-1 7" /><path d="M10 4c1 2 1.5 5 1.5 8s-.5 5-1 7" /><path d="M6 4c1-1 3-1 4 0" /><path d="M6.5 19c1 1 2.5 1 4 0" /><path d="M7 10h3" /><path d="M7 14h3" /><path d="M14 8l3-3" /><path d="M14 8l2 1" /><path d="M14 8l1 2" /></svg>); }

const BODY_PART_ICONS: Record<string, React.ReactNode> = {
  Back: <IconBack />, Biceps: <IconBiceps />, Chest: <IconChest />, Triceps: <IconTriceps />,
  Shoulders: <IconShoulders />, Legs: <IconLegs />, Abs: <IconAbs />, Forearms: <IconForearms />,
};

// ── Types ─────────────────────────────────────────────────────────────────────
type WeekLog = { week: number; date: string; weight: string; repsSet1: string; repsSet2: string; repsSet3: string; notes: string };
type ExerciseLogs = Record<string, WeekLog[]>;

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bodyPartOrder, setBodyPartOrder] = useState<string[]>([]);
  const [activeBodyPart, setActiveBodyPart] = useState("");
  const [activeView, setActiveView] = useState<"profile" | "progress">("profile");
  const [logs, setLogs] = useState<ExerciseLogs>({});

  const userStorageKey = `gym-tracker-logs-${user?._id || "guest"}`;

  const [form, setForm] = useState({
    name: user?.name || "",
    age: user?.age?.toString() || "",
    height: user?.height?.toString() || "",
    weight: user?.weight?.toString() || "",
    gender: user?.gender || "",
    mobile: user?.mobile || "",
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load workout logs from localStorage (user-scoped)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(userStorageKey);
      if (saved) setLogs(JSON.parse(saved));
    } catch {}
  }, [userStorageKey]);

  // Fetch body parts from API
  useEffect(() => {
    async function fetchBodyParts() {
      try {
        const data = await exerciseApi.getGrouped();
        const order: string[] = data.bodyPartOrder || Object.keys(data.bodyParts || {});
        setBodyPartOrder(order);
        if (order.length > 0 && !activeBodyPart) setActiveBodyPart(order[0]);
      } catch {}
    }
    fetchBodyParts();
  }, []);

  const bmi = form.height && form.weight
    ? (parseFloat(form.weight) / Math.pow(parseFloat(form.height) / 100, 2)).toFixed(1)
    : null;

  function getBmiCategory(bmi: number): string {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload: Record<string, any> = { name: form.name };
      if (form.age) payload.age = parseInt(form.age);
      if (form.height) payload.height = parseFloat(form.height);
      if (form.weight) payload.weight = parseFloat(form.weight);
      if (form.gender) payload.gender = form.gender;
      if (form.mobile) payload.mobile = form.mobile;

      const data = await userApi.updateProfile(payload);
      updateUser(data.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  }

  // Get all exercise logs for the active body part
  function getBodyPartLogs() {
    const entries: { exerciseName: string; chartData: { week: string; weight: number }[] }[] = [];
    for (const key of Object.keys(logs)) {
      if (key.startsWith(activeBodyPart + "__")) {
        const parts = key.split("__");
        const exerciseName = parts[2] || parts[1];
        const weekLogs = logs[key];
        const chartData = weekLogs
          .filter((w) => w.weight)
          .map((w) => ({ week: `W${w.week}`, weight: parseFloat(w.weight) || 0 }));
        if (chartData.length >= 1) {
          entries.push({ exerciseName, chartData });
        }
      }
    }
    return entries;
  }

  const progressData = getBodyPartLogs();

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden relative">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={clsx(
        "flex-shrink-0 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out z-50",
        "fixed inset-y-0 left-0 md:relative top-14 md:top-0",
        sidebarOpen ? "w-56 translate-x-0" : "w-56 -translate-x-full md:w-14 md:translate-x-0"
      )}>
        <div className="flex items-center justify-between h-12 px-4 border-b border-sidebar-border">
          {sidebarOpen && <span className="text-primary font-bold text-xs uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Progress</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className={clsx("text-muted-foreground hover:text-foreground transition-colors", !sidebarOpen && "md:mx-auto")}>
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        <nav className="flex-1 py-2 overflow-y-auto">
          {/* Profile link */}
          <button
            onClick={() => { setActiveView("profile"); if (window.innerWidth < 768) setSidebarOpen(false); }}
            className={clsx(
              "w-full flex items-center gap-3 px-4 py-2 text-left transition-all duration-150 relative",
              activeView === "profile" ? "text-foreground bg-sidebar-accent" : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
            )}
          >
            {activeView === "profile" && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-r-full" />}
            <span className={clsx("flex-shrink-0 transition-colors", activeView === "profile" ? "text-primary" : "text-muted-foreground")}>
              <User size={16} />
            </span>
            {sidebarOpen && <span className="text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>My Details</span>}
          </button>

          <div className="border-t border-sidebar-border my-2" />

          {/* Body parts for progress graphs */}
          {bodyPartOrder.map((part) => {
            const isActive = activeView === "progress" && activeBodyPart === part;
            return (
              <button
                key={part}
                onClick={() => { setActiveView("progress"); setActiveBodyPart(part); if (window.innerWidth < 768) setSidebarOpen(false); }}
                title={!sidebarOpen ? part : undefined}
                className={clsx(
                  "w-full flex items-center gap-3 px-4 py-2 text-left transition-all duration-150 relative",
                  isActive ? "text-foreground bg-sidebar-accent" : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                )}
              >
                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-r-full" />}
                <span className={clsx("flex-shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground")}>
                  {BODY_PART_ICONS[part] || <span className="text-xs font-mono">●</span>}
                </span>
                {sidebarOpen && <span className="text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{part}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 h-12 border-b border-border flex items-center px-3 sm:px-6 gap-2 sm:gap-4">
          <button onClick={() => setSidebarOpen(true)} className="text-muted-foreground hover:text-foreground transition-colors md:hidden"><Menu size={18} /></button>
          <h1 className="text-lg font-bold uppercase text-foreground tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.15em" }}>
            {activeView === "profile" ? "Profile" : `${activeBodyPart} Progress`}
          </h1>
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeView === "profile" ? (
            /* ── Profile Form ─────────────────────────── */
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={24} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold uppercase text-foreground tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>My Details</h2>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Full Name</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-foreground text-sm focus:border-primary focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Age</label>
                    <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-foreground text-sm focus:border-primary focus:outline-none transition-colors" placeholder="25" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Height (cm)</label>
                    <input type="number" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-foreground text-sm focus:border-primary focus:outline-none transition-colors" placeholder="175" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Weight (kg)</label>
                    <input type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-foreground text-sm focus:border-primary focus:outline-none transition-colors" placeholder="75" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Gender</label>
                    <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-foreground text-sm focus:border-primary focus:outline-none transition-colors">
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Mobile Number</label>
                    <input type="tel" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-foreground text-sm focus:border-primary focus:outline-none transition-colors" placeholder="+1 555-123-4567" />
                  </div>
                </div>

                {bmi && (
                  <div className="p-4 border border-border rounded-sm bg-card">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Your BMI</span>
                      <span className="text-xs text-muted-foreground font-mono">{getBmiCategory(parseFloat(bmi))}</span>
                    </div>
                    <p className="text-2xl font-bold text-primary mt-1 font-mono">{bmi}</p>
                  </div>
                )}

                <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 rounded-sm bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 disabled:opacity-50 transition-colors" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em" }}>
                  <Save size={14} />
                  {loading ? "Saving..." : "Save Profile"}
                </button>
                {saved && <p className="text-sm text-primary font-medium">Profile saved successfully!</p>}
                {error && <p className="text-sm text-destructive">{error}</p>}
              </form>
            </div>
          ) : (
            /* ── Progress Charts ──────────────────────── */
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 size={20} className="text-primary" />
                <h2 className="text-lg font-bold uppercase text-foreground tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {activeBodyPart} — Progressive Overload
                </h2>
              </div>

              {progressData.length === 0 ? (
                <div className="text-center py-16 border border-border rounded-sm bg-card">
                  <BarChart3 size={40} className="text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground text-sm">No workout data logged for {activeBodyPart} yet.</p>
                  <p className="text-muted-foreground/60 text-xs mt-1">Log weights in the Dashboard to see progress charts here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {progressData.map((entry) => (
                    <div key={entry.exerciseName} className="border border-border rounded-sm bg-card p-4">
                      <h3 className="text-sm font-semibold uppercase text-foreground tracking-wider mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em" }}>
                        {entry.exerciseName}
                      </h3>
                      {entry.chartData.length >= 2 ? (
                        <div className="h-40">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={entry.chartData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                              <XAxis dataKey="week" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                              <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} unit="kg" />
                              <Tooltip
                                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "2px", fontSize: "12px" }}
                                labelStyle={{ color: "var(--foreground)" }}
                              />
                              <Line type="monotone" dataKey="weight" stroke="var(--primary)" strokeWidth={2} dot={{ fill: "var(--primary)", r: 3 }} activeDot={{ r: 5 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="h-40 flex items-center justify-center">
                          <p className="text-xs text-muted-foreground">Need at least 2 weeks of data to show a chart.</p>
                        </div>
                      )}
                      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground font-mono">
                        <span>{entry.chartData.length} weeks logged</span>
                        {entry.chartData.length >= 2 && (
                          <span className={entry.chartData[entry.chartData.length - 1].weight > entry.chartData[0].weight ? "text-primary" : "text-destructive"}>
                            {entry.chartData[entry.chartData.length - 1].weight > entry.chartData[0].weight ? "↑" : "↓"}{" "}
                            {Math.abs(entry.chartData[entry.chartData.length - 1].weight - entry.chartData[0].weight).toFixed(1)}kg
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
