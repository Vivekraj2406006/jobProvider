"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Camera,
  Check,
  ChevronRight,
  Eye,
  Globe,
  LayoutGrid,
  MapPin,
  Moon,
  Plus,
  Save,
  Shield,
  Sparkles,
  SunMedium,
  User,
  Wallet,
  Bell,
  Edit3,
  X,
  type LucideIcon,
} from "lucide-react";

import { useWorkerProfile } from "@/hooks/useWorkerProfile";
import type { WorkerProfile } from "@/types/workerProfile";

type SectionKey =
  | "profile"
  | "work"
  | "availability"
  | "bank"
  | "notifications"
  | "security"
  | "preferences";

type EditableKey =
  | "name"
  | "phone"
  | "email"
  | "bio"
  | "experience"
  | "area"
  | "city"
  | "state"
  | "pincode";

type SettingsState = {
  name: string;
  phone: string;
  email: string;
  bio: string;
  experience: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  skills: string[];
  available: boolean;
  workingDays: boolean[];
  workingHours: string;
  distanceUnit: "km" | "mi";
  theme: "light" | "dark" | "system";
  language: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  newJobAlerts: boolean;
  paymentUpdates: boolean;
  smsReminders: boolean;
  weeklySummary: boolean;
  promotions: boolean;
  twoFactor: boolean;
  loginAlerts: boolean;
  lastMinuteJobs: boolean;
};

const SECTIONS: Array<{ key: SectionKey; label: string; icon: LucideIcon }> = [
  { key: "profile", label: "Profile", icon: User },
  { key: "work", label: "Work & skills", icon: LayoutGrid },
  { key: "availability", label: "Availability", icon: MapPin },
  { key: "bank", label: "Bank & payouts", icon: Wallet },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "security", label: "Security", icon: Shield },
  { key: "preferences", label: "Preferences", icon: Sparkles },
];

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DEFAULT_SETTINGS: SettingsState = {
  name: "",
  phone: "",
  email: "",
  bio: "",
  experience: "0",
  area: "",
  city: "",
  state: "",
  pincode: "",
  skills: [],
  available: true,
  workingDays: [true, true, true, true, true, true, false],
  workingHours: "9:00 AM – 7:00 PM",
  distanceUnit: "km",
  theme: "light",
  language: "English",
  bankName: "",
  accountNumber: "",
  ifscCode: "",
  upiId: "",
  newJobAlerts: true,
  paymentUpdates: true,
  smsReminders: true,
  weeklySummary: false,
  promotions: false,
  twoFactor: true,
  loginAlerts: true,
  lastMinuteJobs: true,
};

function formatLocation(profile: WorkerProfile | null) {
  if (!profile) return "Not configured";
  const parts = [profile.area, profile.city, profile.state].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Not configured";
}

function CountUp({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 1100;
    const start = performance.now();
    let raf = 0;

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Number((value * eased).toFixed(decimals)));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, decimals]);

  return <>{display.toFixed(decimals)}</>;
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#e5ede8] py-4 last:border-b-0">
      <div>
        <p className="font-medium text-[#10201b]">{label}</p>
        <p className="mt-1 text-sm text-[#5c6d66]">{description}</p>
      </div>
      <label className="relative h-[22px] w-[40px] shrink-0 cursor-pointer">
        <input className="absolute h-0 w-0 opacity-0" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
        <span className={`absolute inset-0 rounded-full transition ${checked ? "bg-[#1e8f7a]" : "bg-[rgba(16,32,27,0.18)]"}`} />
        <span className={`absolute left-[3px] top-[3px] h-4 w-4 rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.2)] transition-transform duration-300 ${checked ? "translate-x-[18px]" : "translate-x-0"}`} />
      </label>
    </div>
  );
}

function EditableRow({
  label,
  value,
  onChange,
  editing,
  setEditing,
  type = "text",
  description,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  editing: boolean;
  setEditing: (next: boolean) => void;
  type?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-[#e5ede8] py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.04em] text-[#93a39c]">{label}</p>
        {!editing ? <p className="mt-1 text-[0.98rem] font-medium text-[#10201b]">{value || "Not set"}</p> : null}
        {description ? <p className="mt-1 text-sm text-[#5c6d66]">{description}</p> : null}
        {editing ? (
          <input
            autoFocus
            className="mt-2 w-full max-w-[360px] rounded-[10px] border border-[#1e8f7a] bg-white px-3 py-2 text-[0.95rem] text-[#10201b] outline-none shadow-[0_0_0_4px_rgba(220,236,230,0.75)]"
            type={type}
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
        {!editing ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#dfe8e3] bg-[#edf3ef] text-[#5c6d66] transition hover:-translate-y-0.5 hover:border-[#1e8f7a] hover:text-[#146356]"
            aria-label={`Edit ${label}`}
          >
            <Edit3 size={15} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#dfe8e3] bg-[#edf3ef] text-[#1e8f7a] transition hover:-translate-y-0.5 hover:border-[#1e8f7a]"
            aria-label={`Done editing ${label}`}
          >
            <Check size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

function SectionCard({
  id,
  title,
  description,
  children,
}: {
  id: SectionKey;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={`section-${id}`} className="rounded-[28px] border border-[#dfe8e3] bg-white/95 p-5 shadow-[0_20px_50px_rgba(16,32,27,0.05)] sm:p-6">
      <div className="mb-5">
        <h2 className="font-['Space_Grotesk'] text-[1.15rem] font-bold tracking-[-0.02em] text-[#10201b]">{title}</h2>
        <p className="mt-1 text-sm text-[#5c6d66]">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function SettingsPage() {
  const { profile, loading, error, refresh } = useWorkerProfile();
  const [activeSection, setActiveSection] = useState<SectionKey>("profile");
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [editing, setEditing] = useState<Record<EditableKey, boolean>>({
    name: false,
    phone: false,
    email: false,
    bio: false,
    experience: false,
    area: false,
    city: false,
    state: false,
    pincode: false,
  });
  const [draftSkill, setDraftSkill] = useState("");
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    if (!profile) return;

    setSettings((current) => ({
      ...current,
      name: profile.name,
      phone: profile.phone ?? "",
      email: profile.email,
      bio: profile.bio ?? "",
      experience: String(profile.experience),
      area: profile.area ?? "",
      city: profile.city ?? "",
      state: profile.state ?? "",
      pincode: profile.pincode ?? "",
      skills: profile.skill,
      available: profile.isAvailable,
      bankName: profile.name,
      accountNumber: profile.phone ?? "",
      upiId: profile.email.replace(/@.*/, "") + "@upi",
    }));
  }, [profile]);

  useEffect(() => {
    if (!savedToast) return;
    const timeout = window.setTimeout(() => setSavedToast(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [savedToast]);

  const avatar = useMemo(() => {
    if (profile?.profileImage) {
      return (
        <img
          src={profile.profileImage}
          alt={profile.name}
          className="h-full w-full rounded-full object-cover"
        />
      );
    }

    const initials = (profile?.name || "RK")
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();

    return (
      <div className="flex h-full w-full items-center justify-center rounded-full bg-[linear-gradient(150deg,var(--amber),#c97f1f)] font-['Space_Grotesk'] text-[1.9rem] font-bold text-[#2b1a05]">
        {initials || "RK"}
      </div>
    );
  }, [profile]);

  const activeIndex = useMemo(() => SECTIONS.findIndex((section) => section.key === activeSection), [activeSection]);

  function scrollToSection(section: SectionKey) {
    setActiveSection(section);
    document.getElementById(`section-${section}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function updateSetting<K extends keyof SettingsState>(key: K, value: SettingsState[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  function addSkill() {
    const next = draftSkill.trim();
    if (!next) return;
    setSettings((current) => ({ ...current, skills: [...current.skills, next] }));
    setDraftSkill("");
  }

  function removeSkill(index: number) {
    setSettings((current) => ({
      ...current,
      skills: current.skills.filter((_, skillIndex) => skillIndex !== index),
    }));
  }

  function saveAll() {
    setSavedToast(true);
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-56 rounded-[28px] bg-white/70" />
        <div className="grid gap-8 lg:grid-cols-[230px_1fr]">
          <div className="h-80 rounded-[18px] bg-white/70" />
          <div className="h-[900px] rounded-[28px] bg-white/70" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-[28px] bg-white p-6 text-center shadow-[0_20px_50px_rgba(16,32,27,0.05)]">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-rose-100 bg-rose-50 text-rose-600">
          <X size={28} />
        </div>
        <h2 className="text-xl font-bold text-[#10201b]">Failed to load settings</h2>
        <p className="mt-2 max-w-sm text-sm text-[#5c6d66]">{error}</p>
        <button
          type="button"
          onClick={refresh}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#146356] px-5 py-3 font-semibold text-white transition hover:opacity-95"
        >
          <Save size={16} />
          Try again
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-[28px] bg-white p-6 text-center shadow-[0_20px_50px_rgba(16,32,27,0.05)]">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#dfe8e3] bg-[#edf3ef] text-[#5c6d66]">
          <User size={28} />
        </div>
        <h2 className="text-xl font-bold text-[#10201b]">Worker profile not found</h2>
        <p className="mt-2 max-w-sm text-sm text-[#5c6d66]">We could not find a worker record linked to your account.</p>
      </div>
    );
  }

  const statusPct = Math.min(100, Math.round((profile.completedJobs / Math.max(profile.completedJobs || 1, 1)) * 100));

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-x-hidden bg-[var(--bg)] px-[5vw] py-[4vh] text-[#10201b]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        :root{
          --bg:#f3f7f5;
          --surface:#ffffff;
          --surface-2:#edf3ef;
          --ink:#10201b;
          --ink-soft:#5c6d66;
          --ink-faint:#93a39c;
          --teal:#146356;
          --teal-light:#1e8f7a;
          --teal-pale:#dcece6;
          --amber:#e5a03b;
          --amber-pale:#fbebd2;
          --rust:#c1503a;
          --rust-pale:#f6ddd6;
          --line:rgba(16,32,27,0.1);
        }
        *{box-sizing:border-box;}
        html{scroll-behavior:smooth;}
        .page-shell{position:relative;z-index:1;max-width:1180px;margin:0 auto;}
        .bg-decor{position:fixed;inset:0;z-index:0;pointer-events:none;}
        .bg-decor .orb{position:absolute;border-radius:50%;filter:blur(70px);opacity:.28;}
        .bg-decor .orb-1{width:32vw;height:32vw;top:-12vw;right:-10vw;background:radial-gradient(circle, var(--teal-light), transparent 70%);animation:drift1 18s ease-in-out infinite;}
        .bg-decor .orb-2{width:24vw;height:24vw;bottom:-8vw;left:-8vw;background:radial-gradient(circle, var(--amber), transparent 70%);opacity:.18;animation:drift2 22s ease-in-out infinite;}
        @keyframes drift1{0%,100%{transform:translate(0,0);}50%{transform:translate(-3vw,3vh);}}
        @keyframes drift2{0%,100%{transform:translate(0,0);}50%{transform:translate(3vw,-3vh);}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
        .fade-up{opacity:0;animation:fadeUp .7s ease forwards;}
        @media (prefers-reduced-motion: reduce){
          *, *::before, *::after{animation:none !important;transition:none !important;scroll-behavior:auto !important;}
        }
      `}</style>

      <div className="bg-decor">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>

      <div className="page-shell space-y-8">
        <header className="fade-up flex flex-wrap items-end justify-between gap-4" style={{ animationDelay: "0ms" }}>
          <div>
            <div className="mb-3 flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-[#1e8f7a]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1e8f7a] shadow-[0_0_8px_var(--teal-light)]" />
              Professional Account
            </div>
            <h1 className="font-['Space_Grotesk'] text-[clamp(1.9rem,3.4vw,2.6rem)] font-bold tracking-[-0.01em]">Settings</h1>
            <p className="mt-2 max-w-[30rem] text-[0.95rem] text-[#5c6d66]">Manage your profile, work preferences and payout details.</p>
          </div>

          <button
            type="button"
            onClick={refresh}
            className="inline-flex items-center gap-2 rounded-xl border border-[#dfe8e3] bg-white px-4 py-2.5 text-sm font-semibold text-[#146356] shadow-[0_10px_24px_rgba(16,32,27,0.05)] transition hover:-translate-y-0.5"
          >
            Sync from database
            <ChevronRight size={15} />
          </button>
        </header>

        <section className="fade-up flex flex-wrap items-center gap-6 rounded-[22px] bg-[linear-gradient(150deg,var(--teal),#0e4a41)] p-6 text-[#fdfbf2] shadow-[0_26px_50px_rgba(20,99,86,0.28)] sm:p-8" style={{ animationDelay: "120ms" }}>
          <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-full border-[3px] border-white/50 bg-[linear-gradient(150deg,var(--amber),#c97f1f)]">
            {avatar}
            <button type="button" className="absolute inset-0 flex items-center justify-center bg-[rgba(16,32,27,0.55)] opacity-0 transition-opacity hover:opacity-100" aria-label="Change profile photo">
              <Camera size={22} />
            </button>
            <div className="absolute -right-1 -bottom-1 flex h-[26px] w-[26px] items-center justify-center rounded-full border-[2.5px] border-[var(--teal)] bg-[var(--amber)]">
              <Check size={13} className="text-[#2b1a05]" />
            </div>
          </div>

          <div className="min-w-[200px] flex-1">
            <div className="font-['Space_Grotesk'] text-[1.4rem] font-bold">{settings.name || profile.name}</div>
            <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-[0.72rem] tracking-[0.08em] text-[#fbebd2]">
              <span className="rounded-[5px] bg-white/12 px-2 py-0.5">Worker</span>
              <span>·</span>
              <span>{profile.id}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-7">
            <div>
              <div className="font-['Space_Grotesk'] text-[1.5rem] font-bold"><CountUp value={profile.completedJobs} /></div>
              <div className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-white/65">Jobs done</div>
            </div>
            <div>
              <div className="font-['Space_Grotesk'] text-[1.5rem] font-bold"><CountUp value={profile.rating} decimals={1} /></div>
              <div className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-white/65">Rating</div>
            </div>
            <div>
              <div className="font-['Space_Grotesk'] text-[1.5rem] font-bold"><CountUp value={profile.experience} /></div>
              <div className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-white/65">Years</div>
            </div>
          </div>

          <div className="ml-auto flex min-w-[260px] items-center gap-3 rounded-[30px] bg-white/10 px-4 py-3">
            <div className="flex-1">
              <div className="text-[0.78rem] font-semibold text-white">Available for jobs</div>
              <div className="font-mono text-[0.6rem] text-white/65">{settings.available ? "Currently on duty" : "Off duty — jobs paused"}</div>
            </div>
            <label className="relative h-6 w-11 shrink-0 cursor-pointer">
              <input
                className="absolute h-0 w-0 opacity-0"
                type="checkbox"
                checked={settings.available}
                onChange={(event) => updateSetting("available", event.target.checked)}
              />
              <span className={`absolute inset-0 rounded-full transition ${settings.available ? "bg-[var(--amber)]" : "bg-white/25"}`} />
              <span className={`absolute left-[3px] top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.2)] transition-transform duration-300 ${settings.available ? "translate-x-5" : "translate-x-0"}`} />
            </label>
          </div>
        </section>

        <div className="sticky top-4 z-10 -mx-1 overflow-x-auto rounded-[18px] border border-[#dfe8e3] bg-white/95 p-2 shadow-[0_12px_30px_rgba(16,32,27,0.04)] backdrop-blur">
          <div className="relative flex min-w-max items-center gap-1">
            <span
              className="absolute left-2 top-2 h-[40px] rounded-[10px] bg-[var(--teal-pale)] transition-all duration-300"
              style={{
                width: `calc(${100 / 7}% - 12px)`,
                transform: `translateX(calc(${activeIndex * 100}% + ${activeIndex * 8}px))`,
              }}
            />
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              const active = activeSection === section.key;
              return (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => scrollToSection(section.key)}
                  className={`relative z-10 flex h-[40px] items-center gap-2 rounded-[10px] px-4 text-sm font-semibold transition ${active ? "text-[var(--teal)]" : "text-[var(--ink-soft)]"}`}
                >
                  <Icon size={17} />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <main className="space-y-6">
            <SectionCard id="profile" title="Profile" description="This is the live worker record stored in the database.">
              <EditableRow label="Full name" value={settings.name} onChange={(value) => updateSetting("name", value)} editing={editing.name} setEditing={(next) => setEditing((current) => ({ ...current, name: next }))} />
              <EditableRow label="Phone number" value={settings.phone} onChange={(value) => updateSetting("phone", value)} editing={editing.phone} setEditing={(next) => setEditing((current) => ({ ...current, phone: next }))} type="tel" />
              <EditableRow label="Email address" value={settings.email} onChange={(value) => updateSetting("email", value)} editing={editing.email} setEditing={(next) => setEditing((current) => ({ ...current, email: next }))} type="email" />
              <EditableRow label="Bio" value={settings.bio} onChange={(value) => updateSetting("bio", value)} editing={editing.bio} setEditing={(next) => setEditing((current) => ({ ...current, bio: next }))} description="Public summary shown on your worker profile." />
            </SectionCard>

            <SectionCard id="work" title="Work & skills" description="Skills, service territory, and experience loaded from your worker record.">
              <EditableRow label="Years of experience" value={settings.experience} onChange={(value) => updateSetting("experience", value)} editing={editing.experience} setEditing={(next) => setEditing((current) => ({ ...current, experience: next }))} />
              <EditableRow label="Service area" value={formatLocation(profile)} onChange={() => {}} editing={false} setEditing={() => undefined} description="Derived from your saved city, state, and area fields." />

              <div className="border-b border-[#e5ede8] py-4 last:border-b-0">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.04em] text-[#93a39c]">Skill tags</p>
                    <p className="mt-1 text-sm text-[#5c6d66]">These are stored in the database as your worker skill array.</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {settings.skills.length > 0 ? settings.skills.map((skill, index) => (
                    <span key={`${skill}-${index}`} className="inline-flex items-center gap-2 rounded-full bg-[#fbebd2] px-3 py-2 text-sm font-semibold text-[#7a521c]">
                      {skill}
                      <button type="button" className="text-base leading-none opacity-60 hover:opacity-100" onClick={() => removeSkill(index)} aria-label={`Remove ${skill}`}>
                        ×
                      </button>
                    </span>
                  )) : (
                    <span className="text-sm text-[#5c6d66]">No skills recorded yet.</span>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <input
                    value={draftSkill}
                    onChange={(event) => setDraftSkill(event.target.value)}
                    placeholder="Add a skill"
                    className="min-w-[220px] rounded-[10px] border border-[#dfe8e3] px-3 py-2 text-sm outline-none focus:border-[#1e8f7a]"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#146356] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
                  >
                    <Plus size={15} />
                    Add
                  </button>
                </div>
              </div>
            </SectionCard>

            <SectionCard id="availability" title="Availability" description="This uses your live availability flag and local schedule preferences.">
              <Toggle
                checked={settings.available}
                onChange={(next) => updateSetting("available", next)}
                label="Available for jobs"
                description={settings.available ? "Currently on duty." : "Off duty — jobs paused."}
              />
              <Toggle
                checked={settings.lastMinuteJobs}
                onChange={(next) => updateSetting("lastMinuteJobs", next)}
                label="Accept last-minute jobs"
                description="Get requests for bookings starting within the hour."
              />

              <div className="mt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.04em] text-[#93a39c]">Working days</p>
                <div className="flex flex-wrap gap-2">
                  {DAY_LABELS.map((day, index) => (
                    <button
                      key={day}
                      type="button"
                      className={`rounded-[10px] border px-4 py-2 text-sm font-semibold transition-all ${settings.workingDays[index] ? "border-[#146356] bg-[#146356] text-white" : "border-[#dfe8e3] bg-[#edf3ef] text-[#5c6d66]"}`}
                      onClick={() =>
                        setSettings((current) => ({
                          ...current,
                          workingDays: current.workingDays.map((value, dayIndex) => (dayIndex === index ? !value : value)),
                        }))
                      }
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <EditableRow label="Working hours" value={settings.workingHours} onChange={(value) => updateSetting("workingHours", value)} editing={false} setEditing={() => undefined} description="Local preference only until a save endpoint is added." />
            </SectionCard>

            <SectionCard id="bank" title="Bank & payouts" description="Currently shown from your profile and local form state. Database storage can be wired later.">
              <EditableRow label="Account holder name" value={settings.bankName || settings.name} onChange={(value) => updateSetting("bankName", value)} editing={editing.state} setEditing={(next) => setEditing((current) => ({ ...current, state: next }))} />
              <EditableRow label="Account number" value={settings.accountNumber} onChange={(value) => updateSetting("accountNumber", value)} editing={false} setEditing={() => undefined} description="This build keeps bank values local because no bank fields exist in the schema yet." />
              <EditableRow label="IFSC code" value={settings.ifscCode} onChange={(value) => updateSetting("ifscCode", value)} editing={false} setEditing={() => undefined} />
              <EditableRow label="UPI ID" value={settings.upiId} onChange={(value) => updateSetting("upiId", value)} editing={false} setEditing={() => undefined} />
            </SectionCard>

            <SectionCard id="notifications" title="Notifications" description="These preferences are kept locally in the current build.">
              <Toggle checked={settings.newJobAlerts} onChange={(next) => updateSetting("newJobAlerts", next)} label="New job alerts" description="Push notification the moment a job matches your skills." />
              <Toggle checked={settings.paymentUpdates} onChange={(next) => updateSetting("paymentUpdates", next)} label="Payment updates" description="When a payout is processed to your account." />
              <Toggle checked={settings.smsReminders} onChange={(next) => updateSetting("smsReminders", next)} label="SMS reminders" description="Text message an hour before a scheduled job." />
              <Toggle checked={settings.weeklySummary} onChange={(next) => updateSetting("weeklySummary", next)} label="Weekly earnings summary" description="Email every Monday with last week's totals." />
              <Toggle checked={settings.promotions} onChange={(next) => updateSetting("promotions", next)} label="Promotions & offers" description="Occasional updates about bonuses and incentives." />
            </SectionCard>

            <SectionCard id="security" title="Security" description="Local security controls for the current UI build.">
              <Toggle checked={settings.twoFactor} onChange={(next) => updateSetting("twoFactor", next)} label="Two-factor authentication" description="Require an OTP when signing in from a new device." />
              <Toggle checked={settings.loginAlerts} onChange={(next) => updateSetting("loginAlerts", next)} label="Login alerts" description="Get notified when your account is accessed elsewhere." />
            </SectionCard>

            <SectionCard id="preferences" title="App preferences" description="Language, units and theme controls.">
              <EditableRow label="App language" value={settings.language} onChange={(value) => updateSetting("language", value)} editing={editing.name} setEditing={(next) => setEditing((current) => ({ ...current, name: next }))} />

              <div className="border-b border-[#e5ede8] py-4 last:border-b-0">
                <p className="text-xs font-semibold uppercase tracking-[0.04em] text-[#93a39c]">Distance unit</p>
                <div className="mt-2 inline-flex rounded-[12px] bg-[#edf3ef] p-1">
                  {[
                    { value: "km" as const, label: "Kilometers" },
                    { value: "mi" as const, label: "Miles" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateSetting("distanceUnit", option.value)}
                      className={`rounded-[9px] px-4 py-2 text-sm font-semibold transition ${settings.distanceUnit === option.value ? "bg-[#146356] text-white" : "text-[#5c6d66]"}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-b border-[#e5ede8] py-4 last:border-b-0">
                <p className="text-xs font-semibold uppercase tracking-[0.04em] text-[#93a39c]">Theme</p>
                <div className="mt-2 inline-flex rounded-[12px] bg-[#edf3ef] p-1">
                  {[
                    { value: "light" as const, label: "Light", icon: SunMedium },
                    { value: "dark" as const, label: "Dark", icon: Moon },
                    { value: "system" as const, label: "System", icon: Globe },
                  ].map((option) => {
                    const Icon = option.icon;
                    const active = settings.theme === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateSetting("theme", option.value)}
                        className={`flex items-center gap-2 rounded-[9px] px-4 py-2 text-sm font-semibold transition ${active ? "bg-[#146356] text-white" : "text-[#5c6d66]"}`}
                      >
                        <Icon size={14} />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </SectionCard>
        </main>
      </div>

      <div className={`fixed left-1/2 bottom-6 z-20 flex -translate-x-1/2 items-center gap-5 rounded-[14px] bg-[#10201b] px-4 py-3 text-[0.88rem] text-[#fdfbf2] shadow-[0_20px_40px_rgba(0,0,0,0.25)] transition-all ${savedToast ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-4"}`}>
        <span>Changes saved locally</span>
        <button
          type="button"
          onClick={saveAll}
          className="inline-flex items-center gap-2 rounded-[9px] bg-[var(--amber)] px-4 py-2 text-[0.84rem] font-semibold text-[#2b1a05]"
        >
          <Save size={14} />
          Save changes
        </button>
      </div>
    </div>
  );
}
