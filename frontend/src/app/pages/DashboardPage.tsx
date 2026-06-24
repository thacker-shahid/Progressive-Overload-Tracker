import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, ChevronUp, Play, Plus, Trash2, TrendingUp, BarChart3 } from "lucide-react";
import { clsx } from "clsx";
import { Link } from "react-router";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "../context/AuthContext";
import { exerciseApi } from "../services/api";

// ── Body Part SVG Icons ───────────────────────────────────────────────────────

function IconBack() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C10 2 8.5 3.5 8.5 5.5c0 1.5.8 2.8 2 3.5" /><path d="M12 2c2 0 3.5 1.5 3.5 3.5 0 1.5-.8 2.8-2 3.5" /><path d="M8.5 9c-1 .5-2 2-2 4v5c0 1 .5 2 1.5 2.5" /><path d="M15.5 9c1 .5 2 2 2 4v5c0 1-.5 2-1.5 2.5" /><path d="M12 9v8" /><path d="M9 13h6" /><path d="M9 16h6" /></svg>);
}
function IconBiceps() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17c1.5 2 4 3 6.5 2.5" /><path d="M4 11c0-2 1-4 3-5s4.5-1 6 .5c1 1 1.5 2.5 1 4" /><path d="M14 10.5c1.5-.5 3 0 4 1s1.5 3 .5 4.5" /><path d="M18.5 16c-.5 1.5-2 2.5-3.5 2.5" /><path d="M11.5 19.5c-2 .5-4-.5-5-2" /><path d="M7 8c-1-1.5-1-3.5 0-4.5" /></svg>);
}
function IconChest() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4c-4 0-7 2-8 5 0 2 1 4 3 5" /><path d="M12 4c4 0 7 2 8 5 0 2-1 4-3 5" /><path d="M12 4v10" /><path d="M7 14c1 2 3 3 5 3s4-1 5-3" /><ellipse cx="8" cy="10" rx="2" ry="1.5" /><ellipse cx="16" cy="10" rx="2" ry="1.5" /></svg>);
}
function IconTriceps() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4c1.5 1 2.5 3 2.5 5s-.5 3.5-1.5 4.5" /><path d="M17 13.5c-.5 2-2 3.5-3.5 4" /><path d="M13.5 17.5c-1.5.5-3 0-4-1" /><path d="M9.5 16.5c-1-1-1.5-3-1-4.5" /><path d="M8.5 12c0-2 .5-3.5 2-5" /><path d="M10.5 7c1-1 2-1.5 3.5-1.5" /><path d="M14 5.5c1-.5 2 0 2 0" /><line x1="15" y1="9" x2="11" y2="14" /></svg>);
}
function IconShoulders() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2.5" /><path d="M12 7.5v3" /><path d="M9.5 7.5C7 8.5 5 10.5 4 13" /><path d="M14.5 7.5C17 8.5 19 10.5 20 13" /><path d="M4 13c0 2 1 3.5 2.5 4" /><path d="M20 13c0 2-1 3.5-2.5 4" /><path d="M8 20v-4" /><path d="M16 20v-4" /></svg>);
}
function IconLegs() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3c-.5 3-1 6-1 9 0 2 .5 4 1 6l-.5 3" /><path d="M15 3c.5 3 1 6 1 9 0 2-.5 4-1 6l.5 3" /><path d="M8 12c0 1.5.5 3 1.5 4" /><path d="M16 12c0 1.5-.5 3-1.5 4" /><path d="M10 3h4" /><path d="M8.5 21H10" /><path d="M14 21h1.5" /></svg>);
}
function IconAbs() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 4c-1 0-2 1-2 2v12c0 2 1.5 3 3 3h6c1.5 0 3-1 3-3V6c0-1-1-2-2-2" /><line x1="12" y1="5" x2="12" y2="19" /><line x1="8" y1="8" x2="16" y2="8" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="8" y1="16" x2="16" y2="16" /></svg>);
}
function IconForearms() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4c1 2 1.5 5 1.5 8s-.5 5-1 7" /><path d="M10 4c1 2 1.5 5 1.5 8s-.5 5-1 7" /><path d="M6 4c1-1 3-1 4 0" /><path d="M6.5 19c1 1 2.5 1 4 0" /><path d="M7 10h3" /><path d="M7 14h3" /><path d="M14 8l3-3" /><path d="M14 8l2 1" /><path d="M14 8l1 2" /></svg>);
}

const BODY_PART_ICONS: Record<string, React.ReactNode> = {
  Back: <IconBack />, Biceps: <IconBiceps />, Chest: <IconChest />, Triceps: <IconTriceps />,
  Shoulders: <IconShoulders />, Legs: <IconLegs />, Abs: <IconAbs />, Forearms: <IconForearms />,
};

// ── Data ──────────────────────────────────────────────────────────────────────

type MuscleData = { tabs: string[]; exercises: Record<string, ExerciseItem[]> };
type ExerciseItem = { name: string; imageUrl?: string; videoUrl?: string };
type BodyPartsData = Record<string, MuscleData>;

// ── Types ─────────────────────────────────────────────────────────────────────

type WeekLog = { week: number; date: string; weight: string; repsSet1: string; repsSet2: string; repsSet3: string; notes: string };
type ExerciseLogs = Record<string, WeekLog[]>;

const STORAGE_KEY_PREFIX = "gym-tracker-logs-";
const DEFAULT_WEEKS = 4;

function initWeeks(count: number): WeekLog[] {
  return Array.from({ length: count }, (_, i) => ({
    week: i + 1, date: "", weight: "", repsSet1: "", repsSet2: "", repsSet3: "", notes: "",
  }));
}

// ── Exercise Accordion ────────────────────────────────────────────────────────

function ExerciseAccordion({
  name, bodyPart, muscle, imageUrl, videoUrl, logs, onUpdateLogs,
}: {
  name: string; bodyPart: string; muscle: string; imageUrl?: string; videoUrl?: string; logs: WeekLog[]; onUpdateLogs: (logs: WeekLog[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const key = `${bodyPart}__${muscle}__${name}`;
  const filledWeeks = logs.filter((w) => w.weight || w.repsSet1 || w.repsSet2 || w.repsSet3).length;

  function addWeek() {
    const next = logs.length + 1;
    onUpdateLogs([...logs, { week: next, date: "", weight: "", repsSet1: "", repsSet2: "", repsSet3: "", notes: "" }]);
  }

  function removeWeek(idx: number) {
    const updated = logs.filter((_, i) => i !== idx).map((w, i) => ({ ...w, week: i + 1 }));
    onUpdateLogs(updated);
  }

  function updateField(idx: number, field: keyof WeekLog, value: string) {
    const updated = logs.map((w, i) => i === idx ? { ...w, [field]: value } : w);
    onUpdateLogs(updated);
  }

  const hasProgress = filledWeeks >= 2 && (() => {
    const filled = logs.filter((w) => w.weight);
    if (filled.length < 2) return false;
    return parseFloat(filled[filled.length - 1].weight) > parseFloat(filled[0].weight);
  })();

  const chartData = logs.filter((w) => w.weight).map((w) => ({
    week: `W${w.week}`,
    weight: parseFloat(w.weight) || 0,
  }));

  return (
    <div className={clsx("border border-border rounded-sm overflow-hidden transition-all duration-200", open && "border-primary/30")}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-3 sm:px-4 py-3 bg-card hover:bg-secondary/50 transition-colors duration-150 group">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="font-display text-sm sm:text-base font-semibold tracking-wide text-foreground uppercase truncate" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em" }}>
            {name}
          </span>
          {hasProgress && (
            <span className="flex items-center gap-1 text-primary text-xs font-mono flex-shrink-0">
              <TrendingUp size={12} /> PR
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {filledWeeks > 0 && <span className="text-muted-foreground font-mono text-xs hidden sm:inline">{filledWeeks}W logged</span>}
          {open ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
        </div>
      </button>

      {open && (
        <div className="bg-card border-t border-border">
          {/* Media row */}
          {(imageUrl || videoUrl) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
            {/* Exercise image */}
            <div className="relative bg-muted aspect-video overflow-hidden group">
              {imageUrl ? (
                <img src={imageUrl} alt={`${name} exercise`} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><span className="text-muted-foreground/40 text-xs uppercase">No Image</span></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-3 left-3 text-white text-xs font-medium uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{name}</span>
            </div>
            {/* Video */}
            <div className="relative bg-muted aspect-video overflow-hidden group">
              {videoUrl ? (
                <iframe src={videoUrl} title={`${name} demo`} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              ) : (
                <div className="w-full h-full flex items-center justify-center cursor-pointer">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                  <div className="relative z-10 w-14 h-14 rounded-full border-2 border-white/80 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/20 transition-all duration-200">
                    <Play size={22} className="text-white ml-1 group-hover:text-primary transition-colors" />
                  </div>
                  <span className="absolute bottom-3 left-3 text-white/70 text-xs font-medium uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>No Video</span>
                </div>
              )}
            </div>
          </div>
          )}

          {/* Chart toggle */}
          {chartData.length >= 2 && (
            <div className="px-3 sm:px-4 pt-3">
              <button onClick={() => setShowChart(!showChart)} className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-mono transition-colors">
                <BarChart3 size={12} />
                {showChart ? "Hide Chart" : "Show Progress Chart"}
              </button>
              {showChart && (
                <div className="mt-3 h-40 sm:h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="week" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                      <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                      <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "2px", fontSize: "12px" }} />
                      <Line type="monotone" dataKey="weight" stroke="var(--primary)" strokeWidth={2} dot={{ fill: "var(--primary)", r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* Progressive overload table */}
          <div className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-muted-foreground text-xs font-medium uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.12em" }}>Progressive Overload Log</h4>
              <button onClick={addWeek} className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-mono transition-colors"><Plus size={12} /> Add Week</button>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden flex flex-col gap-3">
              {logs.map((log, idx) => {
                const prevWeight = idx > 0 ? parseFloat(logs[idx - 1].weight) : null;
                const currWeight = parseFloat(log.weight);
                const improved = prevWeight !== null && !isNaN(currWeight) && !isNaN(prevWeight) && currWeight > prevWeight;
                const regressed = prevWeight !== null && !isNaN(currWeight) && !isNaN(prevWeight) && currWeight < prevWeight;
                return (
                  <div key={`${key}-m${idx}`} className="border border-border/40 rounded-sm p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={clsx("inline-flex items-center justify-center px-2 h-5 text-xs font-semibold rounded-sm", improved ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground")}>Week {log.week}</span>
                      <div className="flex items-center gap-2">
                        {improved && <span className="text-primary text-xs">↑</span>}
                        {regressed && <span className="text-destructive text-xs">↓</span>}
                        {logs.length > 1 && <button onClick={() => removeWeek(idx)} className="text-muted-foreground hover:text-destructive transition-all"><Trash2 size={12} /></button>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      <div><label className="text-muted-foreground text-[10px] uppercase block mb-0.5">Date</label><input type="date" value={log.date} onChange={(e) => updateField(idx, "date", e.target.value)} className="w-full bg-transparent border-b border-border focus:border-primary outline-none text-foreground text-xs placeholder:text-muted-foreground/40 pb-0.5 transition-colors" /></div>
                      <div><label className="text-muted-foreground text-[10px] uppercase block mb-0.5">Weight (kg/lbs)</label><input type="number" value={log.weight} onChange={(e) => updateField(idx, "weight", e.target.value)} placeholder="—" className="w-full bg-transparent border-b border-border focus:border-primary outline-none text-foreground text-xs placeholder:text-muted-foreground/40 pb-0.5 transition-colors" /></div>
                      <div><label className="text-muted-foreground text-[10px] uppercase block mb-0.5">Reps (Set 1)</label><input type="number" value={log.repsSet1} onChange={(e) => updateField(idx, "repsSet1", e.target.value)} placeholder="—" className="w-full bg-transparent border-b border-border focus:border-primary outline-none text-foreground text-xs placeholder:text-muted-foreground/40 pb-0.5 transition-colors" /></div>
                      <div><label className="text-muted-foreground text-[10px] uppercase block mb-0.5">Reps (Set 2)</label><input type="number" value={log.repsSet2} onChange={(e) => updateField(idx, "repsSet2", e.target.value)} placeholder="—" className="w-full bg-transparent border-b border-border focus:border-primary outline-none text-foreground text-xs placeholder:text-muted-foreground/40 pb-0.5 transition-colors" /></div>
                      <div><label className="text-muted-foreground text-[10px] uppercase block mb-0.5">Reps (Set 3)</label><input type="number" value={log.repsSet3} onChange={(e) => updateField(idx, "repsSet3", e.target.value)} placeholder="—" className="w-full bg-transparent border-b border-border focus:border-primary outline-none text-foreground text-xs placeholder:text-muted-foreground/40 pb-0.5 transition-colors" /></div>
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace" }}><label className="text-muted-foreground text-[10px] uppercase block mb-0.5">Notes</label><input type="text" value={log.notes} onChange={(e) => updateField(idx, "notes", e.target.value)} placeholder="—" className="w-full bg-transparent border-b border-border focus:border-primary outline-none text-foreground text-xs placeholder:text-muted-foreground/40 pb-0.5 transition-colors" /></div>
                  </div>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                <thead><tr className="border-b border-border"><th className="text-left text-muted-foreground font-medium py-2 pr-3 w-14">WEEK</th><th className="text-left text-muted-foreground font-medium py-2 pr-3">DATE</th><th className="text-left text-muted-foreground font-medium py-2 pr-3">Weight (kg/lbs)</th><th className="text-left text-muted-foreground font-medium py-2 pr-3">REPS (Set 1)</th><th className="text-left text-muted-foreground font-medium py-2 pr-3">REPS (Set 2)</th><th className="text-left text-muted-foreground font-medium py-2 pr-3">REPS (Set 3)</th><th className="text-left text-muted-foreground font-medium py-2 pr-3">NOTES</th><th className="w-8" /></tr></thead>
                <tbody>
                  {logs.map((log, idx) => {
                    const prevWeight = idx > 0 ? parseFloat(logs[idx - 1].weight) : null;
                    const currWeight = parseFloat(log.weight);
                    const improved = prevWeight !== null && !isNaN(currWeight) && !isNaN(prevWeight) && currWeight > prevWeight;
                    const regressed = prevWeight !== null && !isNaN(currWeight) && !isNaN(prevWeight) && currWeight < prevWeight;
                    return (
                      <tr key={`${key}-w${idx}`} className="border-b border-border/40 hover:bg-secondary/30 transition-colors group/row">
                        <td className="py-2 pr-3"><span className={clsx("inline-flex items-center justify-center w-7 h-5 text-xs font-semibold rounded-sm", improved ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground")}>W{log.week}</span></td>
                        <td className="py-2 pr-3"><input type="date" value={log.date} onChange={(e) => updateField(idx, "date", e.target.value)} className="w-28 bg-transparent border-b border-border focus:border-primary outline-none text-foreground placeholder:text-muted-foreground/40 pb-0.5 transition-colors" /></td>
                        <td className="py-2 pr-3"><div className="flex items-center gap-1"><input type="number" value={log.weight} onChange={(e) => updateField(idx, "weight", e.target.value)} placeholder="—" className="w-16 bg-transparent border-b border-border focus:border-primary outline-none text-foreground placeholder:text-muted-foreground/40 pb-0.5 transition-colors" />{improved && <span className="text-primary text-xs">↑</span>}{regressed && <span className="text-destructive text-xs">↓</span>}</div></td>
                        <td className="py-2 pr-3"><input type="number" value={log.repsSet1} onChange={(e) => updateField(idx, "repsSet1", e.target.value)} placeholder="—" className="w-12 bg-transparent border-b border-border focus:border-primary outline-none text-foreground placeholder:text-muted-foreground/40 pb-0.5 transition-colors" /></td>
                        <td className="py-2 pr-3"><input type="number" value={log.repsSet2} onChange={(e) => updateField(idx, "repsSet2", e.target.value)} placeholder="—" className="w-12 bg-transparent border-b border-border focus:border-primary outline-none text-foreground placeholder:text-muted-foreground/40 pb-0.5 transition-colors" /></td>
                        <td className="py-2 pr-3"><input type="number" value={log.repsSet3} onChange={(e) => updateField(idx, "repsSet3", e.target.value)} placeholder="—" className="w-12 bg-transparent border-b border-border focus:border-primary outline-none text-foreground placeholder:text-muted-foreground/40 pb-0.5 transition-colors" /></td>
                        <td className="py-2 pr-3"><input type="text" value={log.notes} onChange={(e) => updateField(idx, "notes", e.target.value)} placeholder="—" className="w-full min-w-[60px] bg-transparent border-b border-border focus:border-primary outline-none text-foreground placeholder:text-muted-foreground/40 pb-0.5 transition-colors" /></td>
                        <td className="py-2">{logs.length > 1 && <button onClick={() => removeWeek(idx)} className="opacity-0 group-hover/row:opacity-100 text-muted-foreground hover:text-destructive transition-all"><Trash2 size={12} /></button>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bodyParts, setBodyParts] = useState<BodyPartsData>({});
  const [bodyPartOrder, setBodyPartOrder] = useState<string[]>([]);
  const [activeBodyPart, setActiveBodyPart] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("");
  const [logs, setLogs] = useState<ExerciseLogs>({});
  const [loadingExercises, setLoadingExercises] = useState(true);

  const userStorageKey = `gym-tracker-logs-${user?._id || "guest"}`;

  // Fetch exercises from API
  useEffect(() => {
    async function fetchExercises() {
      try {
        const data = await exerciseApi.getGrouped();
        if (data.bodyParts) {
          // Use bodyPartOrder from API to maintain correct order
          const orderedKeys: string[] = data.bodyPartOrder || Object.keys(data.bodyParts);

          // Convert API response: exercises contain {_id, name, imageUrl, videoUrl}
          const converted: BodyPartsData = {};
          for (const bp of orderedKeys) {
            const val = (data.bodyParts as Record<string, any>)[bp];
            if (!val) continue;
            converted[bp] = {
              tabs: val.tabs || [],
              exercises: {} as Record<string, ExerciseItem[]>,
            };
            for (const muscle of (val.tabs || [])) {
              const exList = val.exercises?.[muscle] || [];
              converted[bp].exercises[muscle] = exList.map((ex: any) => ({
                name: ex.name || ex,
                imageUrl: ex.imageUrl || "",
                videoUrl: ex.videoUrl || "",
              }));
            }
          }
          setBodyParts(converted);
          setBodyPartOrder(orderedKeys);
          const firstPart = orderedKeys[0];
          if (firstPart) {
            setActiveBodyPart(firstPart);
            setActiveTab(converted[firstPart]?.tabs[0] || "");
          }
        }
      } catch (err) {
        console.error("Failed to fetch exercises:", err);
      } finally {
        setLoadingExercises(false);
      }
    }
    fetchExercises();
  }, []);

  useEffect(() => { try { const saved = localStorage.getItem(userStorageKey); if (saved) setLogs(JSON.parse(saved)); } catch {} }, [userStorageKey]);
  useEffect(() => { if (user) localStorage.setItem(userStorageKey, JSON.stringify(logs)); }, [logs, userStorageKey]);
  useEffect(() => { const part = bodyParts[activeBodyPart]; if (part) setActiveTab(part.tabs[0] || ""); }, [activeBodyPart]);

  function getExerciseLogs(bodyPart: string, muscle: string, exercise: string): WeekLog[] {
    const key = `${bodyPart}__${muscle}__${exercise}`;
    if (!logs[key]) return initWeeks(DEFAULT_WEEKS);
    return logs[key];
  }

  function updateExerciseLogs(bodyPart: string, muscle: string, exercise: string, updated: WeekLog[]) {
    const key = `${bodyPart}__${muscle}__${exercise}`;
    setLogs((prev) => ({ ...prev, [key]: updated }));
  }

  const currentData = bodyParts[activeBodyPart];
  const exercises: ExerciseItem[] = currentData?.exercises[activeTab] ?? [];

  if (loadingExercises) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading exercises...</p>
      </div>
    );
  }

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
          {sidebarOpen && <span className="text-primary font-bold text-xs uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Body Parts</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className={clsx("text-muted-foreground hover:text-foreground transition-colors", !sidebarOpen && "md:mx-auto")}>
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
        <nav className="flex-1 py-2 overflow-y-auto">
          {bodyPartOrder.map((part) => {
            const isActive = activeBodyPart === part;
            return (
              <button key={part} onClick={() => { setActiveBodyPart(part); if (window.innerWidth < 768) setSidebarOpen(false); }} title={!sidebarOpen ? part : undefined}
                className={clsx("w-full flex items-center gap-3 px-4 py-2 text-left transition-all duration-150 relative", isActive ? "text-foreground bg-sidebar-accent" : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50")}>
                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-r-full" />}
                <span className={clsx("flex-shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground")}>
                  {BODY_PART_ICONS[part] || <span className="text-xs font-mono">●</span>}
                </span>
                {sidebarOpen && <span className="text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{part}</span>}
              </button>
            );
          })}
          <div className="border-t border-sidebar-border mt-2 pt-2">
            <Link to="/dashboard/profile" className="w-full flex items-center gap-3 px-4 py-2 text-left text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-all">
              <span className="text-xs font-mono flex-shrink-0">◉</span>
              {sidebarOpen && <span className="text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Profile</span>}
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex-shrink-0 h-12 border-b border-border flex items-center px-3 sm:px-6 gap-2 sm:gap-4">
          <button onClick={() => setSidebarOpen(true)} className="text-muted-foreground hover:text-foreground transition-colors md:hidden"><Menu size={18} /></button>
          <h1 className="text-lg font-bold uppercase text-foreground tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.15em" }}>{activeBodyPart}</h1>
          <span className="text-border text-lg hidden sm:inline">|</span>
          <span className="text-primary text-xs font-medium uppercase tracking-widest hidden sm:inline" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Progressive Overload Tracker</span>
          <div className="ml-auto"><span className="text-muted-foreground text-xs font-mono hidden sm:inline">{Object.keys(logs).filter((k) => k.startsWith(activeBodyPart)).length} exercises tracked</span></div>
        </header>

        {/* Tabs */}
        <div className="flex-shrink-0 border-b border-border bg-card overflow-x-auto">
          <div className="flex min-w-max px-3 sm:px-6 gap-0">
            {currentData?.tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={clsx("relative py-3 px-3 sm:px-4 text-xs uppercase tracking-wider transition-all duration-150 whitespace-nowrap", isActive ? "text-primary" : "text-muted-foreground hover:text-foreground/80")}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.1em", fontSize: "0.7rem" }}>
                  {tab}
                  {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Exercise list */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4 flex items-baseline gap-2 sm:gap-4">
              <h2 className="text-xl sm:text-2xl font-bold uppercase text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{activeTab}</h2>
              <p className="text-muted-foreground text-xs font-mono">{exercises.length} exercises</p>
            </div>
            <div className="flex flex-col gap-2">
              {exercises.map((exercise) => (
                <ExerciseAccordion key={exercise.name} name={exercise.name} bodyPart={activeBodyPart} muscle={activeTab} imageUrl={exercise.imageUrl} videoUrl={exercise.videoUrl} logs={getExerciseLogs(activeBodyPart, activeTab, exercise.name)} onUpdateLogs={(updated) => updateExerciseLogs(activeBodyPart, activeTab, exercise.name, updated)} />
              ))}
            </div>
            <div className="h-12" />
          </div>
        </div>
      </main>
    </div>
  );
}
