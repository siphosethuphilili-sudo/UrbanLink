import React, { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import {
  Lock, Bell, Globe, Palette, Accessibility, Shield, Database, LogOut, Check
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const sections = [
  { key: "security", label: "Security", icon: Lock },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "language", label: "Language", icon: Globe },
  { key: "appearance", label: "Appearance", icon: Palette },
  { key: "accessibility", label: "Accessibility", icon: Accessibility },
  { key: "data", label: "Data Management", icon: Database },
];

export default function Settings() {
  const { user, logout } = useAuth();
  const [active, setActive] = useState("security");
  const [prefs, setPrefs] = useState({
    emailNotif: true, smsNotif: false, pushNotif: true, inAppNotif: true,
    quietHours: false, digest: "daily",
    twoFactor: false, language: "English", fontSize: "medium", highContrast: false,
  });

  const set = (k, v) => { setPrefs((p) => ({ ...p, [k]: v })); toast.success("Preference saved"); };

  const Toggle = ({ on, onChange }) => (
    <button onClick={() => onChange(!on)} className={cn("relative w-11 h-6 rounded-full transition-colors", on ? "bg-[hsl(var(--primary))]" : "bg-muted")}>
      <span className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform", on ? "translate-x-5" : "translate-x-0.5")} />
    </button>
  );

  return (
    <div className="space-y-5 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account preferences and security.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-5">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="flex lg:flex-col gap-1 overflow-x-auto">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <button key={s.key} onClick={() => setActive(s.key)} className={cn("flex items-center gap-2.5 px-3.5 h-10 rounded-xl text-sm font-medium whitespace-nowrap transition-colors", active === s.key ? "bg-[hsl(var(--primary))] text-white" : "bg-card border border-border hover:bg-muted")}>
                  <Icon className="w-4 h-4" /> {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 p-6 rounded-2xl bg-card border border-border">
          {active === "security" && (
            <div className="space-y-5">
              <h3 className="font-bold flex items-center gap-2"><Shield className="w-4 h-4" /> Security</h3>
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div><p className="font-semibold text-sm">Two-Factor Authentication</p><p className="text-xs text-muted-foreground mt-0.5">Add an extra layer of security to your account</p></div>
                <Toggle on={prefs.twoFactor} onChange={(v) => set("twoFactor", v)} />
              </div>
              <div>
                <p className="font-semibold text-sm mb-2">Change Password</p>
                <div className="space-y-2">
                  <input type="password" placeholder="Current password" className="w-full h-11 px-4 rounded-xl bg-muted border border-transparent focus:border-ring focus:bg-card text-sm outline-none" />
                  <input type="password" placeholder="New password" className="w-full h-11 px-4 rounded-xl bg-muted border border-transparent focus:border-ring focus:bg-card text-sm outline-none" />
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full w-3/4 rounded-full bg-[hsl(var(--success))]" /></div>
                  <input type="password" placeholder="Confirm new password" className="w-full h-11 px-4 rounded-xl bg-muted border border-transparent focus:border-ring focus:bg-card text-sm outline-none" />
                </div>
                <button onClick={() => toast.success("Password updated")} className="mt-3 h-10 px-5 rounded-xl bg-[hsl(var(--primary))] text-white text-sm font-semibold">Update Password</button>
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="font-semibold text-sm mb-2">Active Sessions</p>
                <div className="flex items-center justify-between text-sm py-1.5"><span>📱 Chrome on Windows · Nelspruit</span><span className="text-xs text-[hsl(var(--success))] font-semibold">Current</span></div>
                <div className="flex items-center justify-between text-sm py-1.5"><span>📱 Safari on iPhone · Mbombela</span><button onClick={() => toast.success("Session revoked")} className="text-xs text-[hsl(var(--danger))] font-semibold">Revoke</button></div>
              </div>
            </div>
          )}

          {active === "notifications" && (
            <div className="space-y-4">
              <h3 className="font-bold flex items-center gap-2"><Bell className="w-4 h-4" /> Notification Preferences</h3>
              {[
                ["emailNotif", "Email Notifications", "Receive updates via email"],
                ["smsNotif", "SMS Notifications", "Receive updates via text message"],
                ["pushNotif", "Push Notifications", "Browser and mobile push alerts"],
                ["inAppNotif", "In-App Notifications", "Show notifications in the app"],
                ["quietHours", "Quiet Hours", "Pause notifications 10PM–6AM"],
              ].map(([k, t, d]) => (
                <div key={k} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                  <div><p className="font-semibold text-sm">{t}</p><p className="text-xs text-muted-foreground mt-0.5">{d}</p></div>
                  <Toggle on={prefs[k]} onChange={(v) => set(k, v)} />
                </div>
              ))}
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="font-semibold text-sm mb-2">Digest Mode</p>
                <div className="flex gap-2">
                  {["daily", "weekly"].map((d) => (
                    <button key={d} onClick={() => set("digest", d)} className={cn("px-4 h-9 rounded-lg text-sm font-medium capitalize", prefs.digest === d ? "bg-[hsl(var(--primary))] text-white" : "bg-card border border-border")}>{d} summary</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {active === "language" && (
            <div className="space-y-4">
              <h3 className="font-bold flex items-center gap-2"><Globe className="w-4 h-4" /> Language Preference</h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {["English", "isiZulu", "Afrikaans", "Portuguese"].map((l) => (
                  <button key={l} onClick={() => set("language", l)} className={cn("flex items-center justify-between p-3.5 rounded-xl border", prefs.language === l ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5" : "border-border hover:bg-muted")}>
                    <span className="text-sm font-medium">{l}</span>
                    {prefs.language === l && <Check className="w-4 h-4 text-[hsl(var(--primary))]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {active === "appearance" && (
            <div className="space-y-4">
              <h3 className="font-bold flex items-center gap-2"><Palette className="w-4 h-4" /> Appearance</h3>
              <p className="text-sm text-muted-foreground">Use the theme toggle in the top bar to switch between light and dark mode. Your preference is saved automatically.</p>
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="font-semibold text-sm mb-2">Font Size</p>
                <div className="flex gap-2">
                  {["small", "medium", "large"].map((s) => (
                    <button key={s} onClick={() => set("fontSize", s)} className={cn("px-4 h-9 rounded-lg text-sm font-medium capitalize", prefs.fontSize === s ? "bg-[hsl(var(--primary))] text-white" : "bg-card border border-border")}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {active === "accessibility" && (
            <div className="space-y-4">
              <h3 className="font-bold flex items-center gap-2"><Accessibility className="w-4 h-4" /> Accessibility</h3>
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div><p className="font-semibold text-sm">High Contrast Mode</p><p className="text-xs text-muted-foreground mt-0.5">Increase visual contrast for better readability</p></div>
                <Toggle on={prefs.highContrast} onChange={(v) => set("highContrast", v)} />
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="font-semibold text-sm">Keyboard Navigation</p>
                <p className="text-xs text-muted-foreground mt-1">Full keyboard support is enabled by default across the platform.</p>
              </div>
            </div>
          )}

          {active === "data" && (
            <div className="space-y-4">
              <h3 className="font-bold flex items-center gap-2"><Database className="w-4 h-4" /> Data Management</h3>
              <button onClick={() => toast.success("Data export requested — you'll receive an email")} className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted text-left">
                <div><p className="font-semibold text-sm">Download My Data</p><p className="text-xs text-muted-foreground mt-0.5">Export all your data as a JSON file</p></div>
                <Database className="w-4 h-4 text-muted-foreground" />
              </button>
              <button onClick={() => toast.success("Deletion request submitted")} className="w-full flex items-center justify-between p-4 rounded-xl bg-[hsl(var(--danger))]/5 border border-[hsl(var(--danger))]/20 text-left">
                <div><p className="font-semibold text-sm text-[hsl(var(--danger))]">Request Data Deletion</p><p className="text-xs text-muted-foreground mt-0.5">Permanently delete your account and all data</p></div>
              </button>
              <button onClick={async () => { await logout(); window.location.href = "/login"; }} className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border border-[hsl(var(--danger))]/30 text-[hsl(var(--danger))] font-semibold text-sm hover:bg-[hsl(var(--danger))]/5">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}