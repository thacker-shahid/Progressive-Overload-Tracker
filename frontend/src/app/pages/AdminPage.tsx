import { useState, useEffect } from "react";
import { Users, Dumbbell, Trash2, Edit, Plus, Save, X, Image, Video, Mail, CheckCircle, ChevronRight, ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import { adminApi, exerciseApi } from "../services/api";

interface UserEntry { _id: string; name: string; email: string; role: string; createdAt: string; }
interface ExerciseEntry { _id: string; bodyPart: string; muscle: string; name: string; imageUrl: string; videoUrl: string; }
interface ContactEntry { _id: string; name: string; email: string; subject: string; message: string; isRead: boolean; createdAt: string; }

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"users" | "exercises" | "contacts">("users");
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);
  const [contacts, setContacts] = useState<ContactEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [usersSearch, setUsersSearch] = useState("");
  const [contactsPage, setContactsPage] = useState(1);
  const [contactsTotalPages, setContactsTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [expandedBodyPart, setExpandedBodyPart] = useState<string | null>(null);
  const [expandedMuscle, setExpandedMuscle] = useState<string | null>(null);
  const [editingExercise, setEditingExercise] = useState<ExerciseEntry | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExercise, setNewExercise] = useState({ bodyPart: "", muscle: "", name: "", imageUrl: "", videoUrl: "" });

  useEffect(() => { loadData(); }, [activeTab, usersPage, usersSearch, contactsPage]);

  async function loadData() {
    setLoading(true); setError("");
    try {
      if (activeTab === "users") { const data = await adminApi.getUsers({ page: usersPage, limit: ITEMS_PER_PAGE, search: usersSearch }); setUsers(data.users); setUsersTotalPages(data.totalPages || 1); }
      else if (activeTab === "exercises") { const data = await exerciseApi.getAll(); setExercises(data.exercises || []); }
      else if (activeTab === "contacts") { const data = await adminApi.getContacts({ page: contactsPage, limit: ITEMS_PER_PAGE }); setContacts(data.contacts); setContactsTotalPages(data.totalPages || 1); }
    } catch (err: any) { setError(err.message || "Failed to load data."); }
    finally { setLoading(false); }
  }

  function getGrouped() {
    const grouped: Record<string, Record<string, ExerciseEntry[]>> = {};
    for (const ex of exercises) {
      if (!grouped[ex.bodyPart]) grouped[ex.bodyPart] = {};
      if (!grouped[ex.bodyPart][ex.muscle]) grouped[ex.bodyPart][ex.muscle] = [];
      grouped[ex.bodyPart][ex.muscle].push(ex);
    }
    return grouped;
  }

  async function deleteUser(id: string) { if (!confirm("Delete this user and all their data?")) return; try { await adminApi.deleteUser(id); setUsers(users.filter((u) => u._id !== id)); } catch (err: any) { setError(err.message); } }
  async function deleteExercise(id: string) { if (!confirm("Delete this exercise?")) return; try { await adminApi.deleteExercise(id); setExercises(exercises.filter((e) => e._id !== id)); } catch (err: any) { setError(err.message); } }

  async function addExercise() {
    if (!newExercise.bodyPart || !newExercise.muscle || !newExercise.name) { setError("Body Part, Muscle Group, and Exercise Name are required."); return; }
    try {
      const data = await adminApi.createExercise(newExercise);
      setExercises([...exercises, data.exercise]);
      setNewExercise({ bodyPart: "", muscle: "", name: "", imageUrl: "", videoUrl: "" });
      setShowAddForm(false);
      setExpandedBodyPart(data.exercise.bodyPart);
      setExpandedMuscle(`${data.exercise.bodyPart}__${data.exercise.muscle}`);
    } catch (err: any) { setError(err.message); }
  }

  async function saveEditExercise() { if (!editingExercise) return; try { const data = await adminApi.updateExercise(editingExercise._id, editingExercise); setExercises(exercises.map((e) => e._id === editingExercise._id ? data.exercise : e)); setEditingExercise(null); } catch (err: any) { setError(err.message); } }
  async function markRead(id: string) { try { await adminApi.markContactRead(id); setContacts(contacts.map((c) => c._id === id ? { ...c, isRead: true } : c)); } catch (err: any) { setError(err.message); } }
  async function deleteContact(id: string) { try { await adminApi.deleteContact(id); setContacts(contacts.filter((c) => c._id !== id)); } catch (err: any) { setError(err.message); } }
  async function deleteMuscleGroup(bodyPart: string, muscle: string) { if (!confirm(`Delete all exercises under "${bodyPart} → ${muscle}"?`)) return; const toDelete = exercises.filter((e) => e.bodyPart === bodyPart && e.muscle === muscle); try { for (const ex of toDelete) { await adminApi.deleteExercise(ex._id); } setExercises(exercises.filter((e) => !(e.bodyPart === bodyPart && e.muscle === muscle))); } catch (err: any) { setError(err.message); } }
  function startAddForMuscle(bodyPart: string, muscle: string) { setNewExercise({ bodyPart, muscle, name: "", imageUrl: "", videoUrl: "" }); setShowAddForm(true); }
  function startAddForBodyPart(bodyPart: string) { setNewExercise({ bodyPart, muscle: "", name: "", imageUrl: "", videoUrl: "" }); setShowAddForm(true); }

  const grouped = getGrouped();
  const bodyPartKeys = Object.keys(grouped);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold uppercase text-foreground tracking-wider mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.1em" }}>Admin <span className="text-primary">Panel</span></h1>
      <p className="text-sm text-muted-foreground mb-8">Manage users, exercises, and messages</p>
      {error && <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-sm text-sm text-destructive flex items-center justify-between">{error}<button onClick={() => setError("")} className="text-xs ml-2 hover:text-foreground">✕</button></div>}
      <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto">
        {([["users", Users, "Users"], ["exercises", Dumbbell, "Exercises"], ["contacts", Mail, "Messages"]] as const).map(([key, Icon, label]) => (
          <button key={key} onClick={() => setActiveTab(key as any)} className={clsx("flex items-center gap-2 px-4 py-2.5 text-sm font-medium uppercase tracking-wider transition-colors relative whitespace-nowrap", activeTab === key ? "text-primary" : "text-muted-foreground hover:text-foreground")} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            <Icon size={16} /> {label}
            {key === "contacts" && contacts.filter((c) => !c.isRead).length > 0 && (<span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">{contacts.filter((c) => !c.isRead).length}</span>)}
            {activeTab === key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
        ))}
      </div>
      {loading && <p className="text-muted-foreground text-sm py-8 text-center">Loading...</p>}

      {/* Users Tab */}
      {!loading && activeTab === "users" && (<div>
        <div className="mb-4"><input type="text" placeholder="Search by name or email..." value={usersSearch} onChange={(e) => { setUsersSearch(e.target.value); setUsersPage(1); }} className="w-full sm:w-64 px-3 py-2 bg-input-background border border-border rounded-sm text-foreground text-sm focus:border-primary focus:outline-none transition-colors" /></div>
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border"><th className="text-left py-3 pr-4 text-xs uppercase tracking-wider text-muted-foreground font-medium" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Name</th><th className="text-left py-3 pr-4 text-xs uppercase tracking-wider text-muted-foreground font-medium hidden sm:table-cell" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Email</th><th className="text-left py-3 pr-4 text-xs uppercase tracking-wider text-muted-foreground font-medium hidden md:table-cell" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Role</th><th className="text-left py-3 pr-4 text-xs uppercase tracking-wider text-muted-foreground font-medium hidden md:table-cell" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Joined</th><th className="text-right py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Actions</th></tr></thead>
        <tbody>{users.map((u) => (<tr key={u._id} className="border-b border-border/40 hover:bg-secondary/30 transition-colors"><td className="py-3 pr-4 text-foreground font-medium">{u.name}</td><td className="py-3 pr-4 text-muted-foreground hidden sm:table-cell">{u.email}</td><td className="py-3 pr-4 hidden md:table-cell"><span className="px-2 py-0.5 text-xs rounded-sm bg-secondary text-secondary-foreground uppercase">{u.role}</span></td><td className="py-3 pr-4 text-muted-foreground text-xs font-mono hidden md:table-cell">{new Date(u.createdAt).toLocaleDateString()}</td><td className="py-3 text-right"><button onClick={() => deleteUser(u._id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors" title="Delete"><Trash2 size={14} /></button></td></tr>))}</tbody></table>
        {users.length === 0 && <p className="text-center text-muted-foreground py-8">No users found.</p>}</div>
        {usersTotalPages > 1 && (<div className="flex items-center justify-between mt-4 pt-4 border-t border-border"><span className="text-xs text-muted-foreground font-mono">Page {usersPage} of {usersTotalPages}</span><div className="flex gap-2"><button onClick={() => setUsersPage(Math.max(1, usersPage - 1))} disabled={usersPage === 1} className="px-3 py-1.5 text-xs rounded-sm border border-border text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Prev</button><button onClick={() => setUsersPage(Math.min(usersTotalPages, usersPage + 1))} disabled={usersPage === usersTotalPages} className="px-3 py-1.5 text-xs rounded-sm border border-border text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Next</button></div></div>)}
      </div>)}

      {/* Exercises Tab */}
      {!loading && activeTab === "exercises" && (<div>
        <div className="flex flex-wrap gap-2 mb-6"><button onClick={() => { setNewExercise({ bodyPart: "", muscle: "", name: "", imageUrl: "", videoUrl: "" }); setShowAddForm(true); }} className="flex items-center gap-2 px-4 py-2 rounded-sm bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}><Plus size={14} /> Add Exercise</button></div>
        {showAddForm && (<div className="mb-6 p-4 border border-primary/30 rounded-sm bg-card space-y-3"><div className="flex items-center justify-between"><h3 className="text-sm font-bold uppercase text-foreground tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Add New Exercise</h3><button onClick={() => setShowAddForm(false)} className="text-muted-foreground hover:text-foreground"><X size={16} /></button></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3"><div><label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Body Part</label><input type="text" placeholder="e.g. Biceps" value={newExercise.bodyPart} onChange={(e) => setNewExercise({ ...newExercise, bodyPart: e.target.value })} className="w-full px-3 py-2 bg-input-background border border-border rounded-sm text-foreground text-sm focus:border-primary focus:outline-none" /></div><div><label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Muscle Group</label><input type="text" placeholder="e.g. Long Head" value={newExercise.muscle} onChange={(e) => setNewExercise({ ...newExercise, muscle: e.target.value })} className="w-full px-3 py-2 bg-input-background border border-border rounded-sm text-foreground text-sm focus:border-primary focus:outline-none" /></div><div><label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Exercise Name</label><input type="text" placeholder="e.g. Hammer Curl" value={newExercise.name} onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })} className="w-full px-3 py-2 bg-input-background border border-border rounded-sm text-foreground text-sm focus:border-primary focus:outline-none" /></div></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><div className="flex items-center gap-2"><Image size={14} className="text-muted-foreground flex-shrink-0" /><input type="url" placeholder="Image URL (optional)" value={newExercise.imageUrl} onChange={(e) => setNewExercise({ ...newExercise, imageUrl: e.target.value })} className="flex-1 px-3 py-2 bg-input-background border border-border rounded-sm text-foreground text-sm focus:border-primary focus:outline-none" /></div><div className="flex items-center gap-2"><Video size={14} className="text-muted-foreground flex-shrink-0" /><input type="url" placeholder="Video URL (optional)" value={newExercise.videoUrl} onChange={(e) => setNewExercise({ ...newExercise, videoUrl: e.target.value })} className="flex-1 px-3 py-2 bg-input-background border border-border rounded-sm text-foreground text-sm focus:border-primary focus:outline-none" /></div></div>
          <button onClick={addExercise} className="flex items-center gap-2 px-4 py-2 rounded-sm bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}><Save size={14} /> Save Exercise</button></div>)}

        <div className="space-y-2">
          {bodyPartKeys.map((bodyPart) => { const isExpanded = expandedBodyPart === bodyPart; const muscleCount = Object.keys(grouped[bodyPart]).length; const exerciseCount = Object.values(grouped[bodyPart]).flat().length; return (
            <div key={bodyPart} className="border border-border rounded-sm overflow-hidden">
              <button onClick={() => setExpandedBodyPart(isExpanded ? null : bodyPart)} className="w-full flex items-center justify-between px-4 py-3 bg-card hover:bg-secondary/30 transition-colors"><div className="flex items-center gap-3">{isExpanded ? <ChevronDown size={16} className="text-primary" /> : <ChevronRight size={16} className="text-muted-foreground" />}<span className="text-sm font-bold uppercase text-foreground tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{bodyPart}</span></div><div className="flex items-center gap-3"><span className="text-xs text-muted-foreground font-mono">{muscleCount} muscles · {exerciseCount} exercises</span><button onClick={(e) => { e.stopPropagation(); startAddForBodyPart(bodyPart); }} className="p-1 text-muted-foreground hover:text-primary transition-colors" title="Add"><Plus size={14} /></button></div></button>
              {isExpanded && (<div className="border-t border-border">{Object.keys(grouped[bodyPart]).map((muscle) => { const isMuscleExpanded = expandedMuscle === `${bodyPart}__${muscle}`; const muscleExercises = grouped[bodyPart][muscle]; return (
                <div key={muscle} className="border-b border-border/40 last:border-b-0">
                  <button onClick={() => setExpandedMuscle(isMuscleExpanded ? null : `${bodyPart}__${muscle}`)} className="w-full flex items-center justify-between px-4 sm:px-6 py-2.5 hover:bg-secondary/20 transition-colors"><div className="flex items-center gap-2">{isMuscleExpanded ? <ChevronDown size={14} className="text-primary" /> : <ChevronRight size={14} className="text-muted-foreground" />}<span className="text-xs font-semibold uppercase text-foreground tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{muscle}</span></div><div className="flex items-center gap-2"><span className="text-[10px] text-muted-foreground font-mono">{muscleExercises.length}</span><button onClick={(e) => { e.stopPropagation(); startAddForMuscle(bodyPart, muscle); }} className="p-1 text-muted-foreground hover:text-primary transition-colors"><Plus size={12} /></button><button onClick={(e) => { e.stopPropagation(); deleteMuscleGroup(bodyPart, muscle); }} className="p-1 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={12} /></button></div></button>
                  {isMuscleExpanded && (<div className="px-4 sm:px-8 pb-3 space-y-1.5">{muscleExercises.map((ex) => (
                    <div key={ex._id} className="flex flex-col sm:flex-row sm:items-center gap-2 p-2 sm:p-2.5 border border-border/40 rounded-sm bg-background hover:border-primary/20 transition-colors">
                      {editingExercise?._id === ex._id ? (<div className="flex-1 space-y-2"><div className="grid grid-cols-1 sm:grid-cols-3 gap-2"><input type="text" value={editingExercise.bodyPart} onChange={(e) => setEditingExercise({ ...editingExercise, bodyPart: e.target.value })} className="px-2 py-1.5 bg-input-background border border-border rounded-sm text-foreground text-xs focus:border-primary focus:outline-none" /><input type="text" value={editingExercise.muscle} onChange={(e) => setEditingExercise({ ...editingExercise, muscle: e.target.value })} className="px-2 py-1.5 bg-input-background border border-border rounded-sm text-foreground text-xs focus:border-primary focus:outline-none" /><input type="text" value={editingExercise.name} onChange={(e) => setEditingExercise({ ...editingExercise, name: e.target.value })} className="px-2 py-1.5 bg-input-background border border-border rounded-sm text-foreground text-xs focus:border-primary focus:outline-none" /></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><input type="url" value={editingExercise.imageUrl} onChange={(e) => setEditingExercise({ ...editingExercise, imageUrl: e.target.value })} placeholder="Image URL" className="px-2 py-1.5 bg-input-background border border-border rounded-sm text-foreground text-xs focus:border-primary focus:outline-none" /><input type="url" value={editingExercise.videoUrl} onChange={(e) => setEditingExercise({ ...editingExercise, videoUrl: e.target.value })} placeholder="Video URL" className="px-2 py-1.5 bg-input-background border border-border rounded-sm text-foreground text-xs focus:border-primary focus:outline-none" /></div><div className="flex gap-2"><button onClick={saveEditExercise} className="flex items-center gap-1 px-3 py-1.5 rounded-sm bg-primary text-primary-foreground text-xs hover:bg-primary/90"><Save size={11} /> Save</button><button onClick={() => setEditingExercise(null)} className="flex items-center gap-1 px-3 py-1.5 rounded-sm border border-border text-muted-foreground text-xs hover:text-foreground"><X size={11} /> Cancel</button></div></div>
                      ) : (<><div className="flex-1 min-w-0"><p className="text-xs sm:text-sm font-medium text-foreground truncate">{ex.name}</p>{(ex.imageUrl || ex.videoUrl) && (<div className="flex gap-2 mt-0.5">{ex.imageUrl && <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><Image size={9} /> img</span>}{ex.videoUrl && <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><Video size={9} /> vid</span>}</div>)}</div><div className="flex items-center gap-1 flex-shrink-0"><button onClick={() => setEditingExercise(ex)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors"><Edit size={13} /></button><button onClick={() => deleteExercise(ex._id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={13} /></button></div></>)}
                    </div>
                  ))}</div>)}
                </div>); })}</div>)}
            </div>); })}
        </div>
        {exercises.length === 0 && <p className="text-center text-muted-foreground py-8">No exercises found. Run the seed script to populate.</p>}
      </div>)}

      {/* Contacts Tab */}
      {!loading && activeTab === "contacts" && (<div className="space-y-3">
        {contacts.map((c) => (<div key={c._id} className={clsx("p-4 border rounded-sm transition-colors", c.isRead ? "border-border bg-card" : "border-primary/30 bg-primary/5")}><div className="flex items-start justify-between gap-3"><div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-1"><p className="text-sm font-semibold text-foreground">{c.name}</p>{!c.isRead && <span className="px-1.5 py-0.5 text-[10px] rounded-sm bg-primary text-primary-foreground uppercase">New</span>}</div><p className="text-xs text-muted-foreground mb-1">{c.email} · {new Date(c.createdAt).toLocaleDateString()}</p><p className="text-sm font-medium text-foreground mb-1">{c.subject}</p><p className="text-sm text-muted-foreground">{c.message}</p></div><div className="flex items-center gap-1 flex-shrink-0">{!c.isRead && <button onClick={() => markRead(c._id)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors"><CheckCircle size={14} /></button>}<button onClick={() => deleteContact(c._id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button></div></div></div>))}
        {contacts.length === 0 && <p className="text-center text-muted-foreground py-8">No messages yet.</p>}
        {contactsTotalPages > 1 && (<div className="flex items-center justify-between mt-4 pt-4 border-t border-border"><span className="text-xs text-muted-foreground font-mono">Page {contactsPage} of {contactsTotalPages}</span><div className="flex gap-2"><button onClick={() => setContactsPage(Math.max(1, contactsPage - 1))} disabled={contactsPage === 1} className="px-3 py-1.5 text-xs rounded-sm border border-border text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Prev</button><button onClick={() => setContactsPage(Math.min(contactsTotalPages, contactsPage + 1))} disabled={contactsPage === contactsTotalPages} className="px-3 py-1.5 text-xs rounded-sm border border-border text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Next</button></div></div>)}
      </div>)}
    </div>
  );
}
