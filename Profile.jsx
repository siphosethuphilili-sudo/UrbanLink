import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/firebaseClient";
import {
  User, Mail, Phone, MapPin, Camera, Award, TrendingUp, Star, Activity,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", address: "" });

  useEffect(() => {
    (async () => {
      try { setRequests(await base44.entities.ServiceRequest.list("-created_date", 100)); } catch (e) {}
    })();
  }, []);

  useEffect(() => {
    if (user) setForm({ full_name: user.full_name || "", phone: user.phone || "", address: user.address || "" });
  }, [user]);

  const save = async () => {
    try {
      await base44.auth.updateMe(form);
      toast.success("Profile updated");
      setEditing(false);
    } catch (e) { toast.error("Update failed"); }
  };

  const stats = {
    total: requests.length,
    resolved: requests.filter((r) => ["Resolved", "Closed"].includes(r.status)).length,
    open: requests.filter((r) => !["Resolved", "Closed"].includes(r.status)).length,
  };
  const points = stats.total * 10 + stats.resolved * 25;

  return (
    <div className="space-y-5 animate-fade-in max-w-4xl mx-auto">
      {/* Header card */}
      <div className="relative rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] p-6 sm:p-8 text-white overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-[hsl(var(--accent))]/15 animate-float" />
        <div className="relative flex items-center gap-5">
          <div className="relative">
            <div className="grid place-items-center w-20 h-20 rounded-2xl bg-white/15 text-3xl font-extrabold backdrop-blur">
              {(user?.full_name || "U")[0]?.toUpperCase()}
            </div>
            <button className="absolute -bottom-1 -right-1 grid place-items-center w-7 h-7 rounded-full bg-white text-[hsl(var(--primary)))]"><Camera className="w-3.5 h-3.5" /></button>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold">{user?.full_name || "Resident"}</h1>
            <p className="text-white/70 text-sm">{user?.email}</p>
            <span className="mt-2 inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-white/15">{user?.role || "Resident"}</span>
          </div>
        </div>
      </div>

      {/* Gamification */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Points Earned", value: points, icon: TrendingUp, color: "warning" },
          { label: "Requests Filed", value: stats.total, icon: Activity, color: "secondary" },
          { label: "Issues Resolved", value: stats.resolved, icon: CheckCircle2, color: "success" },
          { label: "Community Rank", value: "#12", icon: Award, color: "primary" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="p-4 rounded-2xl bg-card border border-border">
              <div className={`grid place-items-center w-9 h-9 rounded-lg bg-[hsl(var(--${s.color}))]/12 text-[hsl(var(--${s.color}))]`}><Icon className="w-4.5 h-4.5" /></div>
              <p className="mt-3 text-2xl font-extrabold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Badges */}
      <div className="p-5 rounded-2xl bg-card border border-border">
        <h3 className="font-bold mb-3 flex items-center gap-2"><Award className="w-4 h-4 text-[hsl(var(--warning))]" /> Achievements</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { name: "First Report", desc: "Filed your first request", earned: stats.total > 0 },
            { name: "Problem Solver", desc: "5 resolved issues", earned: stats.resolved >= 5 },
            { name: "Active Citizen", desc: "10 requests filed", earned: stats.total >= 10 },
            { name: "Community Voice", desc: "Earned 100 points", earned: points >= 100 },
          ].map((b) => (
            <div key={b.name} className={`flex items-center gap-2.5 p-3 rounded-xl border ${b.earned ? "border-[hsl(var(--warning))]/30 bg-[hsl(var(--warning))]/5" : "border-border opacity-50"}`}>
              <div className={`grid place-items-center w-9 h-9 rounded-full ${b.earned ? "bg-[hsl(var(--warning))]/15 text-[hsl(var(--warning))]" : "bg-muted text-muted-foreground"}`}>
                <Star className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">{b.name}</p>
                <p className="text-xs text-muted-foreground">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personal info */}
      <div className="p-5 rounded-2xl bg-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">Personal Information</h3>
          <button onClick={() => setEditing(!editing)} className="text-sm font-semibold text-[hsl(var(--secondary))]">{editing ? "Cancel" : "Edit"}</button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { key: "full_name", label: "Full Name", icon: User, type: "text" },
            { key: "email", label: "Email", icon: Mail, type: "text", readonly: true },
            { key: "phone", label: "Phone", icon: Phone, type: "text" },
            { key: "address", label: "Address", icon: MapPin, type: "text" },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.key}>
                <label className="text-xs font-semibold text-muted-foreground">{f.label}</label>
                <div className="relative mt-1">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    value={f.key === "email" ? user?.email || "" : form[f.key] || ""}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    disabled={f.readonly || !editing}
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted border border-transparent focus:border-ring focus:bg-card text-sm outline-none disabled:opacity-70"
                  />
                </div>
              </div>
            );
          })}
        </div>
        {editing && (
          <button onClick={save} className="mt-4 h-11 px-6 rounded-xl bg-[hsl(var(--primary))] text-white font-semibold text-sm hover:opacity-90">Save Changes</button>
        )}
      </div>
    </div>
  );
}