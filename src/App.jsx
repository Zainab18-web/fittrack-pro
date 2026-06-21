import { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";

const C = {
  bg: "#0D0F14", surface: "#161922", card: "#1E2330", border: "#2A3045",
  accent: "#00E5A0", water: "#38BDF8", workout: "#F472B6",
  calorie: "#FB923C", weight: "#A78BFA", sleep: "#60A5FA",
  meal: "#34D399", report: "#FBBF24", reminder: "#F87171", photo: "#E879F9",
  text: "#F0F4FF", muted: "#8891A8", danger: "#F87171",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 16px; }
  body { background: ${C.bg}; color: ${C.text}; font-family: 'Inter', sans-serif; min-height: 100vh; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${C.surface}; }
  ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }
  input, select, textarea { outline: none; }
  button { cursor: pointer; border: none; background: none; font-family: inherit; }
  input[type=range] { accent-color: ${C.accent}; width: 100%; }

  /* ── Responsive overrides ── */
  @media (max-width: 480px) {
    .nav-label { font-size: 7px !important; }
    .hero-num  { font-size: 56px !important; }
    .cal-num   { font-size: 40px !important; }
    .section-card { padding: 14px !important; }
    .dash-quick { grid-template-columns: 1fr 1fr !important; }
    .workout-grid { grid-template-columns: 1fr 1fr !important; }
    .report-stats { grid-template-columns: 1fr 1fr !important; }
    .meal-days  { gap: 4px !important; }
    .meal-types { grid-template-columns: repeat(2,1fr) !important; }
    .photo-grid { grid-template-columns: repeat(2,1fr) !important; }
    .reminder-types { grid-template-columns: repeat(2,1fr) !important; }
    .reminder-row { flex-wrap: wrap; gap: 8px !important; }
    .calorie-row input { min-width: 0; }
  }
  @media (max-width: 360px) {
    .dash-cards { grid-template-columns: 1fr 1fr !important; }
  }
`;

const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    water:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6 8 4 13 4 16a8 8 0 0016 0c0-3-2-8-8-14z"/></svg>,
    workout:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 6.5h11M3 12h18M6.5 17.5h11M3 6.5l3 0M18 6.5l3 0M3 17.5l3 0M18 17.5l3 0"/></svg>,
    calorie:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z"/><circle cx="12" cy="9" r="3"/></svg>,
    weight:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l3 7H3l3-7z"/><path d="M3 10v11h18V10"/><path d="M9 15h6"/></svg>,
    sleep:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
    dashboard:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    plus:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>,
    check:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    trash:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
    bell:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>,
    chart:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    meal:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>,
    camera:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  };
  return icons[name] || null;
};

// ─── STORAGE ──────────────────────────────────────────────────────────────────
const getData = (key, def) => { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(def)); } catch { return def; } };
const setData = (key, val) => localStorage.setItem(key, JSON.stringify(val));

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const inputSt = (extra = {}) => ({
  width: "100%", background: C.card, border: `1px solid ${C.border}`,
  borderRadius: "11px", padding: "12px 14px", color: C.text,
  fontSize: "14px", transition: "border-color 0.2s", minWidth: 0, ...extra
});

function Section({ title, color, desc, children }) {
  return (
    <div>
      <div style={{ marginBottom: "18px" }}>
        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(17px,4vw,20px)", fontWeight: "700", color }}>{title}</h2>
        {desc && <p style={{ color: C.muted, fontSize: "clamp(11px,3vw,13px)", marginTop: "4px" }}>{desc}</p>}
      </div>
      <div className="section-card" style={{ background: C.surface, borderRadius: "18px", padding: "20px", border: `1px solid ${C.border}` }}>{children}</div>
    </div>
  );
}
function Empty({ msg }) {
  return <div style={{ textAlign: "center", padding: "24px", color: C.muted, fontSize: "13px", background: C.card, borderRadius: "12px", border: `1px dashed ${C.border}` }}>{msg}</div>;
}
function Stat({ label, value, color }) {
  return (
    <div style={{ background: C.card, borderRadius: "12px", padding: "12px", border: `1px solid ${C.border}`, textAlign: "center" }}>
      <div style={{ fontSize: "clamp(18px,5vw,22px)", fontWeight: "800", fontFamily: "'Space Grotesk',sans-serif", color }}>{value}</div>
      <div style={{ fontSize: "clamp(10px,2.5vw,11px)", color: C.muted, marginTop: "4px" }}>{label}</div>
    </div>
  );
}
function ProgBar({ pct, color }) {
  return (
    <div style={{ height: "6px", background: C.border, borderRadius: "6px", overflow: "hidden", marginTop: "8px" }}>
      <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: color, borderRadius: "6px", transition: "width .4s" }} />
    </div>
  );
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "dashboard", label: "Home",     icon: "dashboard", color: C.accent },
  { id: "water",     label: "Water",    icon: "water",     color: C.water },
  { id: "workout",   label: "Workout",  icon: "workout",   color: C.workout },
  { id: "calorie",   label: "Calories", icon: "calorie",   color: C.calorie },
  { id: "weight",    label: "Weight",   icon: "weight",    color: C.weight },
  { id: "sleep",     label: "Sleep",    icon: "sleep",     color: C.sleep },
  { id: "meal",      label: "Meals",    icon: "meal",      color: C.meal },
  { id: "photo",     label: "Photos",   icon: "camera",    color: C.photo },
  { id: "reminder",  label: "Alerts",   icon: "bell",      color: C.reminder },
  { id: "report",    label: "Reports",  icon: "chart",     color: C.report },
];

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ data, setTab }) {
  const { water, workouts, calories, weights, sleepLogs } = data;
  const todayStr = new Date().toDateString();
  const totalCal = calories.items.filter(i => new Date(i.date).toDateString() === todayStr).reduce((a, b) => a + b.calories, 0);
  const lastSleep  = sleepLogs[sleepLogs.length - 1];
  const lastWeight = weights[weights.length - 1];
  const todayWorkouts = workouts.filter(w => new Date(w.date).toDateString() === todayStr);

  const cards = [
    { label: "Water",    value: `${water.glasses}/${water.goal}`, unit: "glasses",           color: C.water,   icon: "water",   pct: (water.glasses / water.goal) * 100,               tab: "water" },
    { label: "Workout",  value: todayWorkouts.length,             unit: "today",              color: C.workout, icon: "workout", pct: todayWorkouts.length > 0 ? 100 : 0,                tab: "workout" },
    { label: "Calories", value: totalCal,                         unit: `/ ${calories.goal}`, color: C.calorie, icon: "calorie", pct: (totalCal / calories.goal) * 100,                  tab: "calorie" },
    { label: "Weight",   value: lastWeight ? lastWeight.kg+"kg" : "—", unit: "last log",    color: C.weight,  icon: "weight",  pct: 50,                                                 tab: "weight" },
    { label: "Sleep",    value: lastSleep ? lastSleep.hours+"h" : "—", unit: "last night",  color: C.sleep,   icon: "sleep",   pct: lastSleep ? (lastSleep.hours / 9) * 100 : 0,       tab: "sleep" },
  ];

  const greeting = () => { const h = new Date().getHours(); return h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening"; };

  return (
    <div>
      <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(18px,5vw,22px)", fontWeight: "700", marginBottom: "4px" }}>{greeting()} 🌟</h2>
      <p style={{ color: C.muted, fontSize: "13px", marginBottom: "20px" }}>Here's your health overview for today</p>

      {/* Tracker cards — 3 col on md, 2 col on xs */}
      <div className="dash-cards" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px", marginBottom: "16px" }}>
        {cards.map(c => (
          <button key={c.tab} onClick={() => setTab(c.tab)}
            style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "14px", padding: "14px", textAlign: "left", transition: "all .2s", width: "100%" }}
            onMouseOver={e => { e.currentTarget.style.borderColor = c.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "none"; }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: `${c.color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={c.icon} size={16} color={c.color} />
              </div>
              {c.pct >= 100 && <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: c.color, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="check" size={10} color={C.bg} /></div>}
            </div>
            <div style={{ fontSize: "clamp(15px,4vw,19px)", fontWeight: "700", fontFamily: "'Space Grotesk',sans-serif", color: c.color }}>{c.value}</div>
            <div style={{ fontSize: "10px", color: C.muted, marginTop: "2px" }}>{c.unit}</div>
            <ProgBar pct={c.pct} color={c.color} />
            <div style={{ fontSize: "10px", color: C.muted, marginTop: "4px" }}>{c.label}</div>
          </button>
        ))}
      </div>

      {/* Quick links — always 2 col */}
      <div className="dash-quick" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
        {[
          { tab: "meal",     icon: "meal",   color: C.meal,     title: "Meal Planner",    desc: "Plan your weekly meals" },
          { tab: "photo",    icon: "camera", color: C.photo,    title: "Progress Photos", desc: "Track transformation" },
          { tab: "reminder", icon: "bell",   color: C.reminder, title: "Reminders",       desc: "Water, workout & sleep alerts" },
          { tab: "report",   icon: "chart",  color: C.report,   title: "Reports",         desc: "Weekly & monthly summaries" },
        ].map(f => (
          <button key={f.tab} onClick={() => setTab(f.tab)}
            style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "13px", padding: "13px", textAlign: "left", transition: "all .2s", width: "100%" }}
            onMouseOver={e => { e.currentTarget.style.borderColor = f.color; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = C.border; }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: `${f.color}20`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
              <Icon name={f.icon} size={15} color={f.color} />
            </div>
            <div style={{ fontSize: "clamp(11px,3vw,13px)", fontWeight: "600", color: f.color }}>{f.title}</div>
            <div style={{ fontSize: "clamp(10px,2.5vw,11px)", color: C.muted, marginTop: "3px" }}>{f.desc}</div>
          </button>
        ))}
      </div>

      <div style={{ padding: "14px", background: C.surface, borderRadius: "13px", border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: "12px", color: C.muted, marginBottom: "6px" }}>💡 Daily Tip</div>
        <p style={{ fontSize: "13px", lineHeight: "1.6" }}>Drinking 2 glasses of water right after waking up can boost your metabolism by up to 24% and keep your energy levels high throughout the day!</p>
      </div>
    </div>
  );
}

// ─── WATER ────────────────────────────────────────────────────────────────────
function WaterTracker({ water, save }) {
  const add = () => { if (water.glasses < water.goal * 2) save({ ...water, glasses: water.glasses + 1 }); };
  const rem = () => { if (water.glasses > 0) save({ ...water, glasses: water.glasses - 1 }); };
  const pct = Math.min((water.glasses / water.goal) * 100, 100);
  return (
    <Section title="💧 Water Tracker" color={C.water} desc="Drinking 8 glasses of water daily keeps you healthy and energized">
      <div style={{ textAlign: "center" }}>
        <div className="hero-num" style={{ fontSize: "clamp(56px,15vw,80px)", fontWeight: "800", fontFamily: "'Space Grotesk',sans-serif", color: C.water, lineHeight: 1 }}>{water.glasses}</div>
        <div style={{ color: C.muted, marginTop: "4px" }}>/ {water.goal} glasses</div>
        <div style={{ margin: "14px auto", maxWidth: "min(280px,85%)", height: "10px", background: C.border, borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${C.water},#0EA5E9)`, transition: "width .4s" }} />
        </div>
        {pct >= 100 && <div style={{ color: C.accent, fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>🎉 Goal Complete!</div>}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "14px", flexWrap: "wrap" }}>
          <button onClick={rem} style={{ width: "50px", height: "50px", borderRadius: "50%", background: C.card, border: `1px solid ${C.border}`, color: C.text, fontSize: "22px", flexShrink: 0 }}>−</button>
          <button onClick={add} style={{ height: "50px", padding: "0 24px", borderRadius: "25px", background: `linear-gradient(135deg,${C.water},#0EA5E9)`, color: "white", fontSize: "14px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
            <Icon name="plus" size={15} /> Add Glass
          </button>
        </div>
        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", justifyContent: "center", margin: "20px auto 0", maxWidth: "min(280px,90%)" }}>
          {Array.from({ length: water.goal }).map((_, i) => (
            <div key={i} style={{ width: "clamp(26px,8vw,34px)", height: "clamp(36px,10vw,46px)", borderRadius: "4px 4px 8px 8px", background: i < water.glasses ? `linear-gradient(180deg,${C.water}80,${C.water})` : C.card, border: `1px solid ${i < water.glasses ? C.water : C.border}`, transition: "all .3s", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {i < water.glasses ? "💧" : ""}
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: "18px" }}>
        <div style={{ fontSize: "13px", color: C.muted, marginBottom: "8px" }}>Daily Goal:</div>
        <div style={{ display: "flex", gap: "8px" }}>
          {[6, 8, 10, 12].map(g => (
            <button key={g} onClick={() => save({ ...water, goal: g })} style={{ flex: 1, padding: "8px 4px", borderRadius: "10px", background: water.goal === g ? C.water : C.card, color: water.goal === g ? C.bg : C.muted, border: `1px solid ${water.goal === g ? C.water : C.border}`, fontSize: "13px", fontWeight: "600" }}>{g}</button>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── WORKOUT ──────────────────────────────────────────────────────────────────
function WorkoutLogger({ workouts, save }) {
  const [form, setForm] = useState({ exercise: "", sets: "", reps: "", duration: "" });
  const add = () => {
    if (!form.exercise.trim()) return;
    save([{ ...form, date: new Date().toISOString(), id: Date.now() }, ...workouts]);
    setForm({ exercise: "", sets: "", reps: "", duration: "" });
  };
  return (
    <Section title="🏋️ Workout Logger" color={C.workout} desc="Log your exercises to track your fitness progress">
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "18px" }}>
        <input value={form.exercise} onChange={e => setForm(p => ({ ...p, exercise: e.target.value }))} placeholder="Exercise name (e.g. Push-ups)" style={inputSt()} onFocus={e => e.target.style.borderColor = C.workout} onBlur={e => e.target.style.borderColor = C.border} />
        {/* Sets/Reps/Mins — 3 col on md, 2 col on xs via CSS */}
        <div className="workout-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px" }}>
          {[["sets","Sets"],["reps","Reps"],["duration","Mins"]].map(([f, ph]) => (
            <input key={f} type="number" value={form[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))} placeholder={ph} style={inputSt()} onFocus={e => e.target.style.borderColor = C.workout} onBlur={e => e.target.style.borderColor = C.border} />
          ))}
        </div>
        <button onClick={add} style={{ padding: "12px", borderRadius: "11px", background: `linear-gradient(135deg,${C.workout},#EC4899)`, color: "white", fontWeight: "700", fontSize: "15px" }}>+ Add Workout</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
        {workouts.length === 0 && <Empty msg="No workouts logged yet. Add your first exercise!" />}
        {workouts.map(w => (
          <div key={w.id} style={{ background: C.card, borderRadius: "11px", padding: "13px 14px", border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: "600", fontSize: "14px", color: C.workout, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.exercise}</div>
              <div style={{ fontSize: "12px", color: C.muted, marginTop: "3px" }}>{w.sets && `${w.sets} sets`}{w.reps && ` × ${w.reps} reps`}{w.duration && ` • ${w.duration} min`}</div>
              <div style={{ fontSize: "10px", color: C.border, marginTop: "2px" }}>{new Date(w.date).toLocaleDateString("en-US", { day:"numeric", month:"short", year:"numeric" })}</div>
            </div>
            <button onClick={() => save(workouts.filter(x => x.id !== w.id))} style={{ color: C.muted, flexShrink: 0 }} onMouseOver={e => e.currentTarget.style.color = C.danger} onMouseOut={e => e.currentTarget.style.color = C.muted}><Icon name="trash" size={15} /></button>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── CALORIES ─────────────────────────────────────────────────────────────────
function CalorieTracker({ calories, save }) {
  const [form, setForm] = useState({ food: "", cal: "" });
  const todayStr = new Date().toDateString();
  const todayItems = calories.items.filter(i => new Date(i.date).toDateString() === todayStr);
  const total = todayItems.reduce((a, b) => a + b.calories, 0);
  const pct = Math.min((total / calories.goal) * 100, 100);
  const add = () => {
    if (!form.food || !form.cal) return;
    save({ ...calories, items: [{ food: form.food, calories: +form.cal, date: new Date().toISOString(), id: Date.now() }, ...calories.items] });
    setForm({ food: "", cal: "" });
  };
  return (
    <Section title="🍎 Calorie Tracker" color={C.calorie} desc="Track your daily food intake and calorie consumption">
      <div style={{ textAlign: "center", marginBottom: "18px" }}>
        <div className="cal-num" style={{ fontSize: "clamp(40px,12vw,56px)", fontWeight: "800", fontFamily: "'Space Grotesk',sans-serif", color: total > calories.goal ? C.danger : C.calorie }}>{total}</div>
        <div style={{ color: C.muted, fontSize: "13px" }}>/ {calories.goal} cal</div>
        <div style={{ margin: "12px auto", maxWidth: "min(300px,90%)", height: "10px", background: C.border, borderRadius: "8px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: total > calories.goal ? C.danger : `linear-gradient(90deg,${C.calorie},#F97316)`, transition: "width .4s" }} />
        </div>
        <div style={{ fontSize: "12px", color: C.muted }}>{calories.goal - total > 0 ? `${calories.goal - total} calories remaining` : "Daily goal reached! ✅"}</div>
      </div>
      {/* Food input row — wraps on very small screens */}
      <div className="calorie-row" style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
        <input value={form.food} onChange={e => setForm(p => ({ ...p, food: e.target.value }))} placeholder="Food name" style={{ ...inputSt(), flex: "2 1 120px" }} onFocus={e => e.target.style.borderColor = C.calorie} onBlur={e => e.target.style.borderColor = C.border} />
        <input type="number" value={form.cal} onChange={e => setForm(p => ({ ...p, cal: e.target.value }))} placeholder="Cal" style={{ ...inputSt(), flex: "1 1 60px" }} onFocus={e => e.target.style.borderColor = C.calorie} onBlur={e => e.target.style.borderColor = C.border} />
        <button onClick={add} style={{ padding: "0 16px", borderRadius: "11px", background: `linear-gradient(135deg,${C.calorie},#F97316)`, color: "white", fontWeight: "700", fontSize: "18px", height: "46px", flexShrink: 0 }}>+</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {todayItems.length === 0 && <Empty msg="No food logged today. Start tracking your meals!" />}
        {todayItems.map(i => (
          <div key={i.id} style={{ background: C.card, borderRadius: "10px", padding: "12px 14px", border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{i.food}</span>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexShrink: 0 }}>
              <span style={{ color: C.calorie, fontWeight: "700", whiteSpace: "nowrap" }}>{i.calories} cal</span>
              <button onClick={() => save({ ...calories, items: calories.items.filter(x => x.id !== i.id) })} style={{ color: C.muted }} onMouseOver={e => e.currentTarget.style.color = C.danger} onMouseOut={e => e.currentTarget.style.color = C.muted}><Icon name="trash" size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── WEIGHT ───────────────────────────────────────────────────────────────────
function WeightTracker({ weights, save }) {
  const [kg, setKg] = useState("");
  const add = () => { if (!kg) return; save([...weights, { kg: +kg, date: new Date().toISOString(), id: Date.now() }]); setKg(""); };
  const chartData = weights.slice(-10).map(w => ({ date: new Date(w.date).toLocaleDateString("en-US", { day:"numeric", month:"short" }), kg: w.kg }));
  return (
    <Section title="⚖️ Weight Tracker" color={C.weight} desc="Log your weight and visualize your progress over time">
      <div style={{ display: "flex", gap: "10px", marginBottom: "18px" }}>
        <input type="number" value={kg} onChange={e => setKg(e.target.value)} placeholder="Weight (kg)" style={{ ...inputSt(), flex: 1 }} onFocus={e => e.target.style.borderColor = C.weight} onBlur={e => e.target.style.borderColor = C.border} />
        <button onClick={add} style={{ padding: "12px 18px", borderRadius: "11px", background: `linear-gradient(135deg,${C.weight},#7C3AED)`, color: "white", fontWeight: "700", flexShrink: 0 }}>Log</button>
      </div>
      {chartData.length >= 2 && (
        <div style={{ background: C.card, borderRadius: "13px", padding: "14px", marginBottom: "14px", border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: "12px", color: C.muted, marginBottom: "10px" }}>📈 Progress Chart</div>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: C.muted }} />
              <YAxis tick={{ fontSize: 9, fill: C.muted }} domain={["auto","auto"]} width={35} />
              <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "10px", fontSize: "12px" }} />
              <Line type="monotone" dataKey="kg" stroke={C.weight} strokeWidth={2} dot={{ fill: C.weight, r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {weights.length === 0 && <Empty msg="No weight entries yet. Start logging today!" />}
        {[...weights].reverse().slice(0, 6).map(w => (
          <div key={w.id} style={{ background: C.card, borderRadius: "10px", padding: "11px 14px", border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13px", color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{new Date(w.date).toLocaleDateString("en-US", { day:"numeric", month:"short", year:"numeric" })}</span>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexShrink: 0 }}>
              <span style={{ color: C.weight, fontWeight: "700" }}>{w.kg} kg</span>
              <button onClick={() => save(weights.filter(x => x.id !== w.id))} style={{ color: C.muted }} onMouseOver={e => e.currentTarget.style.color = C.danger} onMouseOut={e => e.currentTarget.style.color = C.muted}><Icon name="trash" size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── SLEEP ────────────────────────────────────────────────────────────────────
function SleepTracker({ sleepLogs, save }) {
  const [form, setForm] = useState({ hours: "", quality: "3" });
  const add = () => { if (!form.hours) return; save([...sleepLogs, { hours: +form.hours, quality: +form.quality, date: new Date().toISOString(), id: Date.now() }]); setForm({ hours: "", quality: "3" }); };
  const qLabels = { 1: "😴 Very Poor", 2: "😕 Poor", 3: "😐 Okay", 4: "😊 Good", 5: "😄 Excellent" };
  const avg = sleepLogs.length ? (sleepLogs.reduce((a, b) => a + b.hours, 0) / sleepLogs.length).toFixed(1) : 0;
  return (
    <Section title="😴 Sleep Tracker" color={C.sleep} desc="7-9 hours of sleep is ideal for optimal health">
      {sleepLogs.length > 0 && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "18px" }}><Stat label="Average Sleep" value={`${avg}h`} color={C.sleep} /><Stat label="Total Logs" value={sleepLogs.length} color={C.sleep} /></div>}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "14px" }}>
        <input type="number" value={form.hours} onChange={e => setForm(p => ({ ...p, hours: e.target.value }))} placeholder="Hours slept (e.g. 7.5)" style={inputSt()} onFocus={e => e.target.style.borderColor = C.sleep} onBlur={e => e.target.style.borderColor = C.border} />
        <div style={{ background: C.card, padding: "13px", borderRadius: "11px", border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: "13px", color: C.muted, marginBottom: "8px" }}>Quality: <span style={{ color: C.text }}>{qLabels[form.quality]}</span></div>
          <input type="range" min="1" max="5" value={form.quality} onChange={e => setForm(p => ({ ...p, quality: e.target.value }))} />
        </div>
        <button onClick={add} style={{ padding: "12px", borderRadius: "11px", background: `linear-gradient(135deg,${C.sleep},#3B82F6)`, color: "white", fontWeight: "700" }}>+ Log Sleep</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {sleepLogs.length === 0 && <Empty msg="No sleep logged yet. Start tracking tonight!" />}
        {[...sleepLogs].reverse().slice(0, 7).map(s => (
          <div key={s.id} style={{ background: C.card, borderRadius: "10px", padding: "11px 14px", border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
            <div style={{ minWidth: 0 }}>
              <span style={{ color: C.sleep, fontWeight: "700" }}>{s.hours}h</span>
              <span style={{ fontSize: "12px", color: C.muted, marginLeft: "8px" }}>{qLabels[s.quality]}</span>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
              <span style={{ fontSize: "11px", color: C.muted, whiteSpace: "nowrap" }}>{new Date(s.date).toLocaleDateString("en-US", { day:"numeric", month:"short" })}</span>
              <button onClick={() => save(sleepLogs.filter(x => x.id !== s.id))} style={{ color: C.muted }} onMouseOver={e => e.currentTarget.style.color = C.danger} onMouseOut={e => e.currentTarget.style.color = C.muted}><Icon name="trash" size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── MEAL PLANNER ─────────────────────────────────────────────────────────────
const DAYS  = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const MEALS = ["Breakfast","Lunch","Snack","Dinner"];

function MealPlanner({ meals, save }) {
  const [selected, setSelected] = useState({ day: 0, meal: 0 });
  const [input, setInput] = useState("");
  const key = `${selected.day}_${selected.meal}`;
  const current = meals[key] || [];
  const addItem = () => { if (!input.trim()) return; save({ ...meals, [key]: [...current, { id: Date.now(), name: input.trim() }] }); setInput(""); };
  const delItem = (id) => save({ ...meals, [key]: current.filter(x => x.id !== id) });
  return (
    <Section title="🍽️ Meal Planner" color={C.meal} desc="Plan your weekly meals to stay on track with your nutrition goals">
      {/* Day pills — horizontal scroll */}
      <div className="meal-days" style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "8px", marginBottom: "14px" }}>
        {DAYS.map((d, i) => (
          <button key={i} onClick={() => setSelected(p => ({ ...p, day: i }))}
            style={{ flexShrink: 0, padding: "8px 11px", borderRadius: "10px", background: selected.day === i ? C.meal : C.card, color: selected.day === i ? C.bg : C.muted, border: `1px solid ${selected.day === i ? C.meal : C.border}`, fontSize: "12px", fontWeight: "600" }}>
            {d.slice(0, 3)}
          </button>
        ))}
      </div>
      {/* Meal type — 4 col on md, 2 col on xs */}
      <div className="meal-types" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "6px", marginBottom: "16px" }}>
        {MEALS.map((m, i) => (
          <button key={i} onClick={() => setSelected(p => ({ ...p, meal: i }))}
            style={{ padding: "9px 6px", borderRadius: "10px", background: selected.meal === i ? C.meal : C.card, color: selected.meal === i ? C.bg : C.muted, border: `1px solid ${selected.meal === i ? C.meal : C.border}`, fontSize: "12px", fontWeight: "600" }}>
            {m}
          </button>
        ))}
      </div>
      <div style={{ background: C.card, borderRadius: "13px", padding: "14px", border: `1px solid ${C.border}`, marginBottom: "14px" }}>
        <div style={{ fontSize: "13px", fontWeight: "600", color: C.meal, marginBottom: "10px" }}>{DAYS[selected.day]} — {MEALS[selected.meal]}</div>
        {current.length === 0 && <div style={{ fontSize: "12px", color: C.muted }}>No items yet. Add something below.</div>}
        {current.map(item => (
          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: `1px solid ${C.border}`, gap: "8px" }}>
            <span style={{ fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>🍴 {item.name}</span>
            <button onClick={() => delItem(item.id)} style={{ color: C.muted, flexShrink: 0 }} onMouseOver={e => e.currentTarget.style.color = C.danger} onMouseOut={e => e.currentTarget.style.color = C.muted}><Icon name="trash" size={13} /></button>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addItem()} placeholder="Enter a food item..." style={{ ...inputSt(), flex: 1 }} onFocus={e => e.target.style.borderColor = C.meal} onBlur={e => e.target.style.borderColor = C.border} />
        <button onClick={addItem} style={{ padding: "0 16px", borderRadius: "11px", background: `linear-gradient(135deg,${C.meal},#10B981)`, color: "white", fontWeight: "700", fontSize: "18px", height: "46px", flexShrink: 0 }}>+</button>
      </div>
      {/* Weekly overview grid */}
      <div style={{ marginTop: "18px" }}>
        <div style={{ fontSize: "13px", color: C.muted, marginBottom: "10px" }}>Weekly Overview:</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "4px" }}>
          {DAYS.map((d, di) => {
            const total = MEALS.reduce((acc, _, mi) => acc + (meals[`${di}_${mi}`]?.length || 0), 0);
            return (
              <button key={di} onClick={() => setSelected({ day: di, meal: 0 })}
                style={{ padding: "8px 2px", borderRadius: "8px", background: total > 0 ? `${C.meal}25` : C.card, border: `1px solid ${total > 0 ? C.meal : C.border}`, textAlign: "center" }}>
                <div style={{ fontSize: "8px", color: C.muted }}>{d.slice(0,2)}</div>
                <div style={{ fontSize: "12px", fontWeight: "700", color: total > 0 ? C.meal : C.muted, marginTop: "2px" }}>{total}</div>
              </button>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

// ─── PROGRESS PHOTOS ──────────────────────────────────────────────────────────
function ProgressPhotos({ photos, save }) {
  const fileRef = useRef();
  const [note, setNote] = useState("");
  const [preview, setPreview] = useState(null);
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };
  const addPhoto = () => {
    if (!preview) return;
    save([{ id: Date.now(), data: preview, note: note.trim(), date: new Date().toISOString() }, ...photos]);
    setPreview(null); setNote(""); fileRef.current.value = "";
  };
  return (
    <Section title="📸 Progress Photos" color={C.photo} desc="Visually track your body transformation over time">
      <div style={{ background: C.card, borderRadius: "13px", padding: "16px", border: `1px solid ${C.border}`, marginBottom: "16px" }}>
        <div style={{ fontSize: "13px", fontWeight: "600", color: C.photo, marginBottom: "12px" }}>Upload New Photo</div>
        <div onClick={() => fileRef.current.click()} style={{ border: `2px dashed ${preview ? C.photo : C.border}`, borderRadius: "12px", padding: "20px", textAlign: "center", cursor: "pointer", transition: "all .2s", marginBottom: "10px", overflow: "hidden" }}>
          {preview ? <img src={preview} style={{ maxHeight: "180px", borderRadius: "8px", maxWidth: "100%" }} alt="preview" /> : (
            <div><div style={{ fontSize: "32px", marginBottom: "8px" }}>📷</div><div style={{ fontSize: "13px", color: C.muted }}>Tap to choose a photo</div></div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
        <input value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note (e.g. Week 4, lost 2kg)" style={{ ...inputSt(), marginBottom: "10px" }} onFocus={e => e.target.style.borderColor = C.photo} onBlur={e => e.target.style.borderColor = C.border} />
        <button onClick={addPhoto} disabled={!preview} style={{ width: "100%", padding: "12px", borderRadius: "11px", background: preview ? `linear-gradient(135deg,${C.photo},#C026D3)` : C.border, color: "white", fontWeight: "700", opacity: preview ? 1 : 0.5 }}>
          Save Photo
        </button>
      </div>
      {photos.length === 0 && <Empty msg="No progress photos yet. Upload your first one!" />}
      <div className="photo-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px,1fr))", gap: "12px" }}>
        {photos.map(p => (
          <div key={p.id} style={{ background: C.card, borderRadius: "13px", overflow: "hidden", border: `1px solid ${C.border}` }}>
            <img src={p.data} style={{ width: "100%", height: "130px", objectFit: "cover", display: "block" }} alt="progress" />
            <div style={{ padding: "9px" }}>
              {p.note && <div style={{ fontSize: "11px", color: C.text, marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.note}</div>}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "10px", color: C.muted }}>{new Date(p.date).toLocaleDateString("en-US", { day:"numeric", month:"short", year:"numeric" })}</span>
                <button onClick={() => save(photos.filter(x => x.id !== p.id))} style={{ color: C.muted }} onMouseOver={e => e.currentTarget.style.color = C.danger} onMouseOut={e => e.currentTarget.style.color = C.muted}><Icon name="trash" size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── REMINDERS ────────────────────────────────────────────────────────────────
function Reminders({ reminders, save }) {
  const [form, setForm] = useState({ type: "water", time: "08:00", label: "" });
  const types = [
    { id: "water",   icon: "💧", label: "Water",   color: C.water },
    { id: "workout", icon: "🏋️", label: "Workout", color: C.workout },
    { id: "sleep",   icon: "😴", label: "Sleep",   color: C.sleep },
    { id: "meal",    icon: "🍽️", label: "Meal",    color: C.meal },
    { id: "weight",  icon: "⚖️", label: "Weight",  color: C.weight },
    { id: "custom",  icon: "🔔", label: "Custom",  color: C.reminder },
  ];
  const addReminder = () => {
    const t = types.find(x => x.id === form.type);
    save([...reminders, { ...form, id: Date.now(), enabled: true, label: form.label || t.label + " Reminder", icon: t.icon, color: t.color }]);
    setForm({ type: "water", time: "08:00", label: "" });
  };
  const toggle = (id) => save(reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  const testNotif = (r) => {
    if ("Notification" in window) {
      Notification.requestPermission().then(perm => {
        if (perm === "granted") new Notification("FitTrack Reminder 💪", { body: r.label });
        else alert(`Reminder: ${r.label} at ${r.time}\n\n(Enable browser notifications for real alerts)`);
      });
    } else alert(`Reminder: ${r.label} at ${r.time}`);
  };
  return (
    <Section title="🔔 Reminders" color={C.reminder} desc="Set alerts for water, workout, sleep and more">
      <div style={{ background: C.card, borderRadius: "13px", padding: "16px", border: `1px solid ${C.border}`, marginBottom: "16px" }}>
        <div style={{ fontSize: "13px", fontWeight: "600", color: C.reminder, marginBottom: "12px" }}>New Reminder</div>
        <div className="reminder-types" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "6px", marginBottom: "12px" }}>
          {types.map(t => (
            <button key={t.id} onClick={() => setForm(p => ({ ...p, type: t.id }))}
              style={{ padding: "9px 4px", borderRadius: "10px", background: form.type === t.id ? t.color+"30" : C.surface, border: `1px solid ${form.type === t.id ? t.color : C.border}`, fontSize: "11px", fontWeight: "600", color: form.type === t.id ? t.color : C.muted }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
          <input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} style={{ ...inputSt(), flex: "1 1 100px", colorScheme: "dark" }} onFocus={e => e.target.style.borderColor = C.reminder} onBlur={e => e.target.style.borderColor = C.border} />
          <input value={form.label} onChange={e => setForm(p => ({ ...p, label: e.target.value }))} placeholder="Label (optional)" style={{ ...inputSt(), flex: "2 1 140px" }} onFocus={e => e.target.style.borderColor = C.reminder} onBlur={e => e.target.style.borderColor = C.border} />
        </div>
        <button onClick={addReminder} style={{ width: "100%", padding: "12px", borderRadius: "11px", background: `linear-gradient(135deg,${C.reminder},#EF4444)`, color: "white", fontWeight: "700" }}>+ Add Reminder</button>
      </div>
      <div style={{ background: `${C.reminder}10`, border: `1px solid ${C.reminder}30`, borderRadius: "11px", padding: "12px", marginBottom: "14px", fontSize: "12px", color: C.muted }}>
        💡 Allow browser notifications for real-time alerts. Use "Test" to preview.
      </div>
      {reminders.length === 0 && <Empty msg="No reminders set yet. Add your first one!" />}
      <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
        {reminders.map(r => (
          <div className="reminder-row" key={r.id} style={{ background: C.card, borderRadius: "12px", padding: "12px 14px", border: `1px solid ${r.enabled ? r.color+"50" : C.border}`, display: "flex", alignItems: "center", gap: "10px", opacity: r.enabled ? 1 : 0.5 }}>
            <div style={{ fontSize: "20px", flexShrink: 0 }}>{r.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: "600", fontSize: "13px", color: r.color, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.label}</div>
              <div style={{ fontSize: "11px", color: C.muted, marginTop: "2px" }}>🕐 {r.time}</div>
            </div>
            <button onClick={() => testNotif(r)} style={{ padding: "5px 8px", borderRadius: "8px", background: `${r.color}20`, color: r.color, fontSize: "11px", fontWeight: "600", flexShrink: 0 }}>Test</button>
            <button onClick={() => toggle(r.id)} style={{ width: "38px", height: "22px", borderRadius: "11px", background: r.enabled ? r.color : C.border, position: "relative", transition: "all .3s", flexShrink: 0 }}>
              <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "white", position: "absolute", top: "3px", left: r.enabled ? "19px" : "3px", transition: "left .3s" }} />
            </button>
            <button onClick={() => save(reminders.filter(x => x.id !== r.id))} style={{ color: C.muted, flexShrink: 0 }} onMouseOver={e => e.currentTarget.style.color = C.danger} onMouseOut={e => e.currentTarget.style.color = C.muted}><Icon name="trash" size={14} /></button>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── REPORTS ──────────────────────────────────────────────────────────────────
function Reports({ data }) {
  const [period, setPeriod] = useState("weekly");
  const { water, workouts, calories, weights, sleepLogs } = data;
  const getDays = () => period === "weekly" ? 7 : 30;
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - getDays());
  const recentWorkouts = workouts.filter(w => new Date(w.date) > cutoff);
  const recentCals     = calories.items.filter(i => new Date(i.date) > cutoff);
  const recentSleep    = sleepLogs.filter(s => new Date(s.date) > cutoff);
  const recentWeights  = weights.filter(w => new Date(w.date) > cutoff);
  const avgSleep = recentSleep.length  ? (recentSleep.reduce((a, b) => a + b.hours, 0) / recentSleep.length).toFixed(1) : 0;
  const avgCal   = recentCals.length   ? Math.round(recentCals.reduce((a, b) => a + b.calories, 0) / getDays()) : 0;
  const calChart = (() => {
    const map = {};
    recentCals.forEach(i => { const d = new Date(i.date).toLocaleDateString("en-US",{day:"numeric",month:"short"}); map[d]=(map[d]||0)+i.calories; });
    return Object.entries(map).map(([date,cal])=>({date,cal})).slice(-7);
  })();
  const sleepChart  = recentSleep.slice(-7).map(s => ({ date: new Date(s.date).toLocaleDateString("en-US",{day:"numeric",month:"short"}), hours: s.hours }));
  const workoutDays = new Set(recentWorkouts.map(w => new Date(w.date).toDateString())).size;
  const pieData = [{ name:"Workout Days",value:workoutDays,color:C.workout },{ name:"Rest Days",value:getDays()-workoutDays,color:C.border }];
  const stats = [
    { label:"Avg Sleep",   value:`${avgSleep}h`,        color:C.sleep },
    { label:"Avg Calories",value:avgCal,                 color:C.calorie },
    { label:"Workouts",    value:recentWorkouts.length,  color:C.workout },
    { label:"Weight Logs", value:recentWeights.length,   color:C.weight },
  ];
  return (
    <Section title="📊 Reports" color={C.report} desc="View your health trends over the past week or month">
      <div style={{ display:"flex", background:C.card, borderRadius:"11px", padding:"4px", marginBottom:"18px" }}>
        {[["weekly","7 Days"],["monthly","30 Days"]].map(([v,l])=>(
          <button key={v} onClick={()=>setPeriod(v)} style={{ flex:1, padding:"9px", borderRadius:"8px", background:period===v?C.report:"transparent", color:period===v?C.bg:C.muted, fontWeight:"600", fontSize:"13px", transition:"all .2s" }}>{l}</button>
        ))}
      </div>
      <div className="report-stats" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"18px" }}>
        {stats.map(s=><Stat key={s.label} label={s.label} value={s.value} color={s.color} />)}
      </div>
      {calChart.length > 0 && (
        <div style={{ background:C.card, borderRadius:"13px", padding:"14px", border:`1px solid ${C.border}`, marginBottom:"14px" }}>
          <div style={{ fontSize:"12px", color:C.muted, marginBottom:"10px" }}>🍎 Daily Calories</div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={calChart}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="date" tick={{fontSize:9,fill:C.muted}} />
              <YAxis tick={{fontSize:9,fill:C.muted}} width={35} />
              <Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:"8px",fontSize:"12px"}} />
              <Bar dataKey="cal" fill={C.calorie} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      {sleepChart.length > 0 && (
        <div style={{ background:C.card, borderRadius:"13px", padding:"14px", border:`1px solid ${C.border}`, marginBottom:"14px" }}>
          <div style={{ fontSize:"12px", color:C.muted, marginBottom:"10px" }}>😴 Sleep Trend</div>
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={sleepChart}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="date" tick={{fontSize:9,fill:C.muted}} />
              <YAxis tick={{fontSize:9,fill:C.muted}} domain={[0,12]} width={28} />
              <Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:"8px",fontSize:"12px"}} />
              <Line type="monotone" dataKey="hours" stroke={C.sleep} strokeWidth={2} dot={{fill:C.sleep,r:3}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {workoutDays > 0 && (
        <div style={{ background:C.card, borderRadius:"13px", padding:"14px", border:`1px solid ${C.border}` }}>
          <div style={{ fontSize:"12px", color:C.muted, marginBottom:"10px" }}>🏋️ Workout vs Rest Days</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={55} dataKey="value" fontSize={10}>
                {pieData.map((entry,i)=><Cell key={i} fill={entry.color}/>)}
              </Pie>
              <Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:"8px",fontSize:"12px"}} />
              <Legend formatter={v=><span style={{color:C.muted,fontSize:"11px"}}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
      {calChart.length===0 && sleepChart.length===0 && workoutDays===0 && (
        <Empty msg={`No data in the last ${getDays()} days. Start logging to see your reports!`} />
      )}
    </Section>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [water,     setWater]     = useState(() => getData("water",     { glasses:0, goal:8 }));
  const [workouts,  setWorkouts]  = useState(() => getData("workouts",  []));
  const [calories,  setCalories]  = useState(() => getData("calories",  { items:[], goal:2000 }));
  const [weights,   setWeights]   = useState(() => getData("weights",   []));
  const [sleepLogs, setSleepLogs] = useState(() => getData("sleep",     []));
  const [meals,     setMeals]     = useState(() => getData("meals",     {}));
  const [photos,    setPhotos]    = useState(() => getData("photos",    []));
  const [reminders, setReminders] = useState(() => getData("reminders", []));
  const save = (key, val, setter) => { setter(val); setData(key, val); };
  const today   = new Date().toLocaleDateString("en-US", { weekday:"short", day:"numeric", month:"short" });
  const allData = { water, workouts, calories, weights, sleepLogs };

  return (
    <>
      <style>{css}</style>
      <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh" }}>

        {/* Header */}
        <header style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"10px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <div style={{ width:"34px", height:"34px", borderRadius:"9px", background:`linear-gradient(135deg,${C.accent},#0EA5E9)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px", flexShrink:0 }}>💪</div>
            <div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:"700", fontSize:"14px" }}>FitTrack Pro</div>
              <div style={{ color:C.muted, fontSize:"10px" }}>{today}</div>
            </div>
          </div>
          <div style={{ padding:"4px 10px", borderRadius:"20px", background:`${C.accent}20`, border:`1px solid ${C.accent}40`, fontSize:"11px", color:C.accent, fontWeight:"600", flexShrink:0 }}>
            ✦ No login needed
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex:1, padding:"16px", maxWidth:"860px", width:"100%", margin:"0 auto" }}>
          {tab==="dashboard" && <Dashboard data={allData} setTab={setTab} />}
          {tab==="water"     && <WaterTracker water={water} save={v=>save("water",v,setWater)} />}
          {tab==="workout"   && <WorkoutLogger workouts={workouts} save={v=>save("workouts",v,setWorkouts)} />}
          {tab==="calorie"   && <CalorieTracker calories={calories} save={v=>save("calories",v,setCalories)} />}
          {tab==="weight"    && <WeightTracker weights={weights} save={v=>save("weights",v,setWeights)} />}
          {tab==="sleep"     && <SleepTracker sleepLogs={sleepLogs} save={v=>save("sleep",v,setSleepLogs)} />}
          {tab==="meal"      && <MealPlanner meals={meals} save={v=>save("meals",v,setMeals)} />}
          {tab==="photo"     && <ProgressPhotos photos={photos} save={v=>save("photos",v,setPhotos)} />}
          {tab==="reminder"  && <Reminders reminders={reminders} save={v=>save("reminders",v,setReminders)} />}
          {tab==="report"    && <Reports data={allData} />}
        </main>

        {/* Bottom Nav — horizontal scroll on mobile */}
        <nav style={{ background:C.surface, borderTop:`1px solid ${C.border}`, display:"flex", overflowX:"auto", position:"sticky", bottom:0, zIndex:100, scrollbarWidth:"none" }}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{ flexShrink:0, minWidth:"58px", padding:"9px 4px 7px", display:"flex", flexDirection:"column", alignItems:"center", gap:"3px", color:tab===t.id?t.color:C.muted, transition:"color .2s", borderTop:tab===t.id?`2px solid ${t.color}`:"2px solid transparent" }}>
              <Icon name={t.icon} size={17} color={tab===t.id?t.color:C.muted} />
              <span className="nav-label" style={{ fontSize:"8px", fontWeight:"600" }}>{t.label}</span>
            </button>
          ))}
        </nav>

      </div>
    </>
  );
}
