import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Droplets, Zap, Trash2, Route, FileText, Siren, Trees, HeartPulse, HelpCircle,
  Check, ArrowRight, ArrowLeft, MapPin, Upload, X, Sparkles, Loader2, PartyPopper, Copy
} from "lucide-react";
import { base44 } from "@/api/firebaseClient";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";

const categories = [
  { name: "Water & Sanitation", icon: Droplets, desc: "Leaks, supply, sewerage" },
  { name: "Electricity", icon: Zap, desc: "Outages, streetlights" },
  { name: "Waste Management", icon: Trash2, desc: "Collection, dumping" },
  { name: "Roads & Infrastructure", icon: Route, desc: "Potholes, signage" },
  { name: "Permits & Applications", icon: FileText, desc: "Building, licensing" },
  { name: "Public Safety & Emergency", icon: Siren, desc: "Crime, hazards" },
  { name: "Environmental Services", icon: Trees, desc: "Parks, pollution" },
  { name: "Health Services", icon: HeartPulse, desc: "Clinics, sanitation" },
  { name: "Other Municipal Services", icon: HelpCircle, desc: "General services" },
];

const priorities = [
  { name: "Low", color: "success", desc: "Minor inconvenience" },
  { name: "Medium", color: "secondary", desc: "Needs attention" },
  { name: "High", color: "warning", desc: "Urgent issue" },
  { name: "Emergency", color: "danger", desc: "Immediate danger" },
];

const steps = ["Category", "Details", "Location", "Review"];

export default function ReportIssue() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [form, setForm] = useState({
    category: "",
    title: "",
    description: "",
    priority: "Medium",
    address: "",
    anonymous: false,
    contact_method: "Email",
    images: [],
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleFiles = (files) => {
    const arr = Array.from(files).slice(0, 5);
    Promise.all(arr.map((f) => base44.integrations.Core.UploadFile({ file: f })))
      .then((res) => set("images", [...form.images, ...res.map((r) => r.file_url)]))
      .catch(() => toast.error("Upload failed"));
  };

  const aiSuggest = async () => {
    if (!form.description || form.description.length < 10) {
      toast.error("Add a description first for AI suggestions");
      return;
    }
    setAiLoading(true);
    try {
      const response = await base44.functions.invoke("AICategorize", { description: form.description });
      const res = response.data;
      if (res.error) { toast.error(res.error); }
      else {
        set("category", res.category);
        set("priority", res.priority);
        toast.success("AI suggestions applied!");
      }
    } catch (e) {
      toast.error("AI suggestion unavailable");
    }
    setAiLoading(false);
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const ref = `REF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const created = await base44.entities.ServiceRequest.create({
        ...form,
        reference_number: ref,
        status: "Submitted",
        progress: 10,
        days_open: 1,
        assigned_department: form.category,
      });
      await base44.entities.Notification.create({
        title: "Request submitted successfully",
        message: `Your request ${ref} (${form.title}) has been received and is being routed.`,
        type: "status",
        read: false,
        request_ref: ref,
      });
      setDone(ref);
    } catch (e) {
      toast.error("Failed to submit request");
    }
    setSubmitting(false);
  };

  if (done) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 animate-fade-in">
        <div className="inline-grid place-items-center w-20 h-20 rounded-full bg-[hsl(var(--success))]/12 text-[hsl(var(--success))] mx-auto">
          <PartyPopper className="w-10 h-10" />
        </div>
        <h1 className="mt-6 text-2xl font-extrabold">Request Submitted!</h1>
        <p className="mt-2 text-muted-foreground">Your issue has been received and routed to the relevant department.</p>
        <div className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-muted border border-border">
          <span className="text-sm text-muted-foreground">Reference:</span>
          <span className="font-mono font-bold text-lg text-[hsl(var(--primary))]">{done}</span>
          <button onClick={() => { navigator.clipboard.writeText(done); toast.success("Copied!"); }} className="p-1.5 rounded-lg hover:bg-card">
            <Copy className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate("/requests")} className="h-11 px-6 rounded-xl bg-[hsl(var(--primary))] text-white font-semibold hover:opacity-90">Track My Request</button>
          <button onClick={() => { setDone(null); setStep(0); setForm({ category: "", title: "", description: "", priority: "Medium", address: "", anonymous: false, contact_method: "Email", images: [] }); }} className="h-11 px-6 rounded-xl border border-border font-semibold hover:bg-muted">Report Another</button>
        </div>
      </div>
    );
  }

  const canNext = step === 0 ? !!form.category : step === 1 ? !!form.title && !!form.description : step === 2 ? !!form.address : true;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold">Report a Municipal Issue</h1>
        <p className="mt-2 text-muted-foreground">Help us improve your community — it takes less than 2 minutes.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center gap-1.5">
              <div className={`grid place-items-center w-9 h-9 rounded-full text-sm font-bold transition-colors ${
                i < step ? "bg-[hsl(var(--success))] text-white" : i === step ? "bg-[hsl(var(--primary))] text-white" : "bg-muted text-muted-foreground"
              }`}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-[11px] font-medium ${i === step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
            </div>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-1 rounded ${i < step ? "bg-[hsl(var(--success))]" : "bg-muted"}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="rounded-2xl bg-card border border-border p-6 sm:p-8">
        {/* Step 1: Category */}
        {step === 0 && (
          <div className="animate-fade-in">
            <h2 className="font-bold text-lg mb-1">Select a service category</h2>
            <p className="text-sm text-muted-foreground mb-5">Choose the category that best describes your issue.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((c) => {
                const Icon = c.icon;
                const active = form.category === c.name;
                return (
                  <button
                    key={c.name}
                    onClick={() => set("category", c.name)}
                    className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all hover:-translate-y-0.5 ${
                      active ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5 ring-1 ring-[hsl(var(--primary))]" : "border-border hover:border-[hsl(var(--secondary))]/40"
                    }`}
                  >
                    <div className={`grid place-items-center w-10 h-10 rounded-lg shrink-0 ${active ? "bg-[hsl(var(--primary))] text-white" : "bg-[hsl(var(--secondary))]/10 text-[hsl(var(--secondary))]"}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="font-bold text-lg">Describe the issue</h2>
            <div>
              <label className="text-sm font-semibold">Issue Title</label>
              <input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Burst water pipe on Boshoff Street"
                className="mt-1.5 w-full h-11 px-4 rounded-xl bg-muted border border-transparent focus:border-ring focus:bg-card text-sm outline-none transition-colors"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold">Description</label>
                <button onClick={aiSuggest} disabled={aiLoading} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--secondary))] hover:underline disabled:opacity-50">
                  {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />} AI Suggest
                </button>
              </div>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={5}
                placeholder="Provide as much detail as possible — what, when, and the impact..."
                className="mt-1.5 w-full p-4 rounded-xl bg-muted border border-transparent focus:border-ring focus:bg-card text-sm outline-none transition-colors resize-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Priority Level</label>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {priorities.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => set("priority", p.name)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      form.priority === p.name ? `border-[hsl(var(--${p.color}))] bg-[hsl(var(--${p.color}))]/8` : "border-border hover:bg-muted"
                    }`}
                  >
                    <p className="font-semibold text-sm">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{p.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold">Photo Attachments (optional)</label>
              <p className="text-xs text-muted-foreground mb-2">Up to 5 images. Drag and drop or click to browse.</p>
              <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-border hover:border-[hsl(var(--secondary))]/50 hover:bg-muted/50 cursor-pointer transition-colors">
                <Upload className="w-6 h-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Click to upload photos</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
              </label>
              {form.images.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {form.images.map((url, i) => (
                    <div key={i} className="relative">
                      <img src={url} alt="" className="w-16 h-16 rounded-lg object-cover" />
                      <button onClick={() => set("images", form.images.filter((_, j) => j !== i))} className="absolute -top-1.5 -right-1.5 grid place-items-center w-5 h-5 rounded-full bg-[hsl(var(--danger))] text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Location */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="font-bold text-lg">Where is the issue?</h2>
            <div>
              <label className="text-sm font-semibold">Address / Location description</label>
              <div className="relative mt-1.5">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder="e.g. Corner of Boshoff & Paul Kruger, Nelspruit"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted border border-transparent focus:border-ring focus:bg-card text-sm outline-none transition-colors"
                />
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-border">
              <iframe
                title="map"
                width="100%"
                height="260"
                loading="lazy"
                src="https://www.openstreetmap.org/export/embed.html?bbox=30.85%2C-25.52%2C31.15%2C-25.40&layer=mapnik&marker=-25.4658%2C30.9806"
              />
            </div>
            <button
              onClick={() => { set("address", "Nelspruit CBD, Mbombela"); toast.success("Location detected"); }}
              className="text-sm font-semibold text-[hsl(var(--secondary))] hover:underline flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4" /> Use my current location
            </button>
            <div>
              <label className="text-sm font-semibold">Preferred Contact Method</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {["Email", "SMS", "Both"].map((m) => (
                  <button key={m} onClick={() => set("contact_method", m)} className={`p-2.5 rounded-xl border text-sm font-medium transition-all ${form.contact_method === m ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5" : "border-border hover:bg-muted"}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 cursor-pointer">
              <input type="checkbox" checked={form.anonymous} onChange={(e) => set("anonymous", e.target.checked)} className="w-4 h-4 accent-[hsl(var(--primary))]" />
              <span className="text-sm">Report anonymously (my name won't be shown publicly)</span>
            </label>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 3 && (
          <div className="animate-fade-in space-y-4">
            <h2 className="font-bold text-lg">Review & Submit</h2>
            <p className="text-sm text-muted-foreground">Please confirm the details below before submitting.</p>
            <div className="rounded-xl border border-border divide-y divide-border">
              {[
                ["Category", form.category], ["Title", form.title], ["Priority", form.priority],
                ["Address", form.address], ["Contact Method", form.contact_method], ["Anonymous", form.anonymous ? "Yes" : "No"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-start justify-between gap-4 p-3.5">
                  <span className="text-sm text-muted-foreground">{k}</span>
                  <span className="text-sm font-semibold text-right">{v || "—"}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1.5">Description</p>
              <p className="text-sm p-3.5 rounded-xl bg-muted/50">{form.description}</p>
            </div>
            {form.images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.images.map((url, i) => <img key={i} src={url} alt="" className="w-16 h-16 rounded-lg object-cover" />)}
              </div>
            )}
          </div>
        )}

        {/* Nav buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-1.5 h-11 px-5 rounded-xl border border-border font-semibold text-sm hover:bg-muted disabled:opacity-40 disabled:pointer-events-none"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          {step < 3 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext}
              className="inline-flex items-center gap-1.5 h-11 px-6 rounded-xl bg-[hsl(var(--primary))] text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 disabled:pointer-events-none"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={submitting}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-[hsl(var(--success))] text-white font-semibold text-sm hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}