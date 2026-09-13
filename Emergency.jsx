import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Siren, Ambulance, Flame, ShieldAlert, Building2, Send, Loader2,
  CheckCircle2, Droplets, Zap, Trees, AlertTriangle, LifeBuoy
} from "lucide-react";
import { base44 } from "@/api/firebaseClient";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";

const emergencyContacts = [
  { name: "Police", number: "10111", icon: ShieldAlert, color: "secondary" },
  { name: "Ambulance", number: "10177", icon: Ambulance, color: "danger" },
  { name: "Fire Department", number: "102", icon: Flame, color: "warning" },
  { name: "Municipal Emergency", number: "013 123 4567", icon: Building2, color: "primary" },
];

const guides = [
  { icon: Droplets, title: "Flooding", desc: "Move to higher ground immediately. Avoid walking or driving through flood water. Report burst pipes or blocked drains." },
  { icon: Flame, title: "Fire", desc: "Call 102 immediately. Evacuate the area, stay low to avoid smoke, and do not use elevators." },
  { icon: ShieldAlert, title: "Crime", desc: "Call 10111. Do not confront criminals. Note descriptions and report via UrbanLink for follow-up." },
  { icon: Zap, title: "Electrical Hazard", desc: "Stay away from downed power lines. Do not touch anyone in contact with electricity. Call the municipality." },
  { icon: Trees, title: "Fallen Trees", desc: "Avoid the area. Report immediately so roads can be cleared and infrastructure checked." },
  { icon: LifeBuoy, title: "Medical", desc: "Call 10177 for an ambulance. Provide clear location details and stay on the line until help arrives." },
];

export default function Emergency() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [desc, setDesc] = useState("");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  const submit = async () => {
    if (!desc || !location) { toast.error("Please fill in all fields"); return; }
    setSubmitting(true);
    try {
      const ref = `REF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      await base44.entities.ServiceRequest.create({
        title: `EMERGENCY: ${desc.slice(0, 50)}`,
        category: "Public Safety & Emergency",
        description: desc,
        priority: "Emergency",
        status: "Submitted",
        reference_number: ref,
        address: location,
        assigned_department: "Public Safety & Emergency",
        progress: 10,
        days_open: 1,
      });
      await base44.entities.Notification.create({
        title: "Emergency report filed",
        message: `Your emergency report ${ref} has been flagged for immediate attention.`,
        type: "alert", read: false, request_ref: ref,
      });
      setSubmitted(ref);
    } catch (e) { toast.error("Failed to submit"); }
    setSubmitting(false);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="rounded-2xl bg-gradient-to-r from-[hsl(var(--danger))] to-[hsl(0_60%_35%)] p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="grid place-items-center w-12 h-12 rounded-xl bg-white/20"><Siren className="w-6 h-6" /></div>
          <div>
            <h1 className="text-2xl font-extrabold">Emergency Center</h1>
            <p className="text-white/80 text-sm">For life-threatening emergencies, call the numbers below directly.</p>
          </div>
        </div>
      </div>

      {/* Emergency contacts */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {emergencyContacts.map((c) => {
          const Icon = c.icon;
          return (
            <a key={c.name} href={`tel:${c.number.replace(/\s/g, "")}`} className={`p-5 rounded-2xl bg-card border-2 border-[hsl(var(--${c.color}))]/20 hover:border-[hsl(var(--${c.color}))] transition-colors text-center group`}>
              <div className={`inline-grid place-items-center w-12 h-12 rounded-xl bg-[hsl(var(--${c.color}))]/12 text-[hsl(var(--${c.color}))] group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className="mt-3 font-bold text-sm">{c.name}</p>
              <p className="text-lg font-extrabold font-mono mt-0.5">{c.number}</p>
            </a>
          );
        })}
      </div>

      {/* Quick emergency report */}
      {submitted ? (
        <div className="p-8 rounded-2xl bg-card border border-[hsl(var(--success))]/30 text-center">
          <div className="inline-grid place-items-center w-16 h-16 rounded-full bg-[hsl(var(--success))]/12 text-[hsl(var(--success))]"><CheckCircle2 className="w-8 h-8" /></div>
          <h2 className="mt-4 text-xl font-extrabold">Emergency Report Filed</h2>
          <p className="mt-2 text-muted-foreground text-sm">Your emergency has been flagged for immediate attention. Reference: <span className="font-mono font-bold text-[hsl(var(--danger))]">{submitted}</span></p>
          <div className="mt-6 flex gap-3 justify-center">
            <button onClick={() => navigate("/requests")} className="h-10 px-5 rounded-xl bg-[hsl(var(--primary))] text-white text-sm font-semibold">Track Report</button>
            <button onClick={() => setSubmitted(null)} className="h-10 px-5 rounded-xl border border-border text-sm font-semibold hover:bg-muted">File Another</button>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-card border border-[hsl(var(--danger))]/20">
          <h2 className="font-bold text-lg flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-[hsl(var(--danger))]" /> Quick Emergency Report</h2>
          <p className="text-sm text-muted-foreground mt-1">Use this for urgent municipal issues that need immediate attention.</p>
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-sm font-semibold">What's the emergency?</label>
              <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="Briefly describe the emergency..." className="mt-1.5 w-full p-3.5 rounded-xl bg-muted border border-transparent focus:border-ring focus:bg-card text-sm outline-none resize-none" />
            </div>
            <div>
              <label className="text-sm font-semibold">Location</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Where is it happening?" className="mt-1.5 w-full h-11 px-4 rounded-xl bg-muted border border-transparent focus:border-ring focus:bg-card text-sm outline-none" />
            </div>
            <button onClick={submit} disabled={submitting} className="w-full h-12 rounded-xl bg-[hsl(var(--danger))] text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60">
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {submitting ? "Sending..." : "Submit Emergency Report"}
            </button>
          </div>
        </div>
      )}

      {/* Emergency guides */}
      <div>
        <h2 className="font-bold text-lg mb-3">Emergency Guides</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {guides.map((g) => {
            const Icon = g.icon;
            return (
              <div key={g.title} className="p-4 rounded-xl bg-card border border-border hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2.5">
                  <div className="grid place-items-center w-9 h-9 rounded-lg bg-[hsl(var(--danger))]/10 text-[hsl(var(--danger))]"><Icon className="w-4.5 h-4.5" /></div>
                  <h3 className="font-semibold text-sm">{g.title}</h3>
                </div>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{g.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}