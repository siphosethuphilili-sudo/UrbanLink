import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, MapPin, Calendar, User, Building2, MessageSquare,
  Send, Share2, Printer, Droplets, Zap, Trash2, Route, FileText,
  Siren, Trees, HeartPulse, HelpCircle, Star, Clock, CheckCircle2, AlertCircle
} from "lucide-react";
import { base44 } from "@/api/firebaseClient";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const categoryIcons = {
  "Water & Sanitation": Droplets, "Electricity": Zap, "Waste Management": Trash2,
  "Roads & Infrastructure": Route, "Permits & Applications": FileText,
  "Public Safety & Emergency": Siren, "Environmental Services": Trees, "Health Services": HeartPulse,
};

const statusColor = {
  "Submitted": "secondary", "In Progress": "warning", "Assigned": "secondary",
  "Resolved": "success", "Closed": "muted", "Overdue": "danger",
};

const timelineSteps = [
  { key: "Submitted", label: "Request Submitted", icon: CheckCircle2 },
  { key: "Assigned", label: "Assigned to Department", icon: User },
  { key: "In Progress", label: "Work In Progress", icon: Clock },
  { key: "Resolved", label: "Issue Resolved", icon: CheckCircle2 },
];

export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [req, setReq] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const [r, c] = await Promise.all([
          base44.entities.ServiceRequest.get(id),
          base44.entities.Comment.filter({ request_id: id }),
        ]);
        setReq(r);
        setComments(c);
      } catch (e) { /* ignore */ }
      setLoading(false);
    })();
  }, [id]);

  const addComment = async () => {
    if (!comment.trim()) return;
    setPosting(true);
    try {
      const created = await base44.entities.Comment.create({
        request_id: id,
        author_name: user?.full_name || "Resident",
        author_role: user?.role || "Resident",
        body: comment,
      });
      setComments((p) => [...p, created]);
      setComment("");
      toast.success("Comment added");
    } catch (e) {
      toast.error("Failed to add comment");
    }
    setPosting(false);
  };

  if (loading) return <div className="h-96 rounded-2xl bg-muted animate-pulse" />;
  if (!req) return (
    <div className="text-center py-20">
      <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground" />
      <p className="mt-4 font-semibold">Request not found</p>
      <Link to="/requests" className="mt-3 inline-block text-sm font-semibold text-[hsl(var(--secondary))]">← Back to requests</Link>
    </div>
  );

  const Icon = categoryIcons[req.category] || HelpCircle;
  const sc = statusColor[req.status] || "secondary";
  const currentStepIndex = timelineSteps.findIndex((s) => s.key === req.status);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied"); }} className="grid place-items-center w-9 h-9 rounded-lg border border-border hover:bg-muted"><Share2 className="w-4 h-4" /></button>
          <button onClick={() => window.print()} className="grid place-items-center w-9 h-9 rounded-lg border border-border hover:bg-muted"><Printer className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header */}
          <div className="p-6 rounded-2xl bg-card border border-border">
            <div className="flex items-start gap-4">
              <div className="grid place-items-center w-14 h-14 rounded-xl bg-[hsl(var(--secondary))]/10 text-[hsl(var(--secondary))] shrink-0">
                <Icon className="w-7 h-7" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs text-muted-foreground">{req.reference_number}</span>
                  <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full", `bg-[hsl(var(--${sc}))]/12 text-[hsl(var(--${sc}))]`)}>{req.status}</span>
                  <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", `bg-[hsl(var(--${req.priority === "Emergency" ? "danger" : req.priority === "High" ? "warning" : req.priority === "Medium" ? "secondary" : "success"}))]/10`)}>{req.priority} Priority</span>
                </div>
                <h1 className="mt-2 text-xl font-extrabold leading-tight">{req.title}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{req.category}</p>
              </div>
            </div>
            <div className="mt-5">
              <p className="text-sm font-semibold mb-1.5">Description</p>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{req.description}</p>
            </div>
            {req.images && req.images.length > 0 && (
              <div className="mt-5">
                <p className="text-sm font-semibold mb-2">Photos</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {req.images.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noreferrer">
                      <img src={url} alt="" className="w-full h-24 rounded-lg object-cover hover:opacity-80 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="p-6 rounded-2xl bg-card border border-border">
            <h3 className="font-bold mb-5">Status Timeline</h3>
            <div className="space-y-1">
              {timelineSteps.map((s, i) => {
                const SIcon = s.icon;
                const done = i <= currentStepIndex || req.status === "Resolved" || req.status === "Closed";
                return (
                  <div key={s.key} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={cn("grid place-items-center w-9 h-9 rounded-full shrink-0", done ? "bg-[hsl(var(--success))] text-white" : "bg-muted text-muted-foreground")}>
                        <SIcon className="w-4 h-4" />
                      </div>
                      {i < timelineSteps.length - 1 && <div className={cn("w-0.5 h-8", done ? "bg-[hsl(var(--success))]" : "bg-border")} />}
                    </div>
                    <div className="pt-1.5 pb-8">
                      <p className={cn("text-sm font-semibold", !done && "text-muted-foreground")}>{s.label}</p>
                      <p className="text-xs text-muted-foreground">{done ? "Completed" : "Pending"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Comments */}
          <div className="p-6 rounded-2xl bg-card border border-border">
            <h3 className="font-bold mb-4 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Comments ({comments.length})</h3>
            <div className="space-y-3">
              {comments.length === 0 && <p className="text-sm text-muted-foreground py-2">No comments yet. Be the first to add an update.</p>}
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <div className="grid place-items-center w-9 h-9 rounded-full bg-[hsl(var(--secondary))] text-white text-xs font-bold shrink-0">
                    {c.author_name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 p-3.5 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{c.author_name}</span>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[hsl(var(--secondary))]/10 text-[hsl(var(--secondary))]">{c.author_role}</span>
                    </div>
                    <p className="mt-1.5 text-sm text-muted-foreground">{c.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addComment()}
                placeholder="Add a comment or update..."
                className="flex-1 h-11 px-4 rounded-xl bg-muted border border-transparent focus:border-ring focus:bg-card text-sm outline-none"
              />
              <button onClick={addComment} disabled={posting || !comment.trim()} className="grid place-items-center w-11 h-11 rounded-xl bg-[hsl(var(--primary))] text-white hover:opacity-90 disabled:opacity-40">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-card border border-border">
            <h3 className="font-bold mb-4">Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2.5"><MapPin className="w-4 h-4 text-muted-foreground" /><span>{req.address || "—"}</span></div>
              <div className="flex items-center gap-2.5"><Building2 className="w-4 h-4 text-muted-foreground" /><span>{req.assigned_department || "Unassigned"}</span></div>
              <div className="flex items-center gap-2.5"><User className="w-4 h-4 text-muted-foreground" /><span>{req.assigned_to_name || "Awaiting assignment"}</span></div>
              <div className="flex items-center gap-2.5"><Calendar className="w-4 h-4 text-muted-foreground" /><span>{req.days_open} days open</span></div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5"><span>Progress</span><span className="font-semibold">{req.progress}%</span></div>
              <div className="h-2 rounded-full bg-muted overflow-hidden"><div className={cn("h-full rounded-full", `bg-[hsl(var(--${sc}))]`)} style={{ width: `${req.progress}%` }} /></div>
            </div>
          </div>

          {(req.status === "Resolved" || req.status === "Closed") && (
            <div className="p-5 rounded-2xl bg-card border border-border">
              <h3 className="font-bold mb-3">Rate the Service</h3>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => { setRating(n); toast.success("Thanks for your feedback!"); }}>
                    <Star className={cn("w-7 h-7 transition-colors", n <= rating ? "fill-[hsl(var(--warning))] text-[hsl(var(--warning))]" : "text-muted-foreground/30")} />
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Your feedback helps us improve service delivery.</p>
            </div>
          )}

          <div className="rounded-2xl overflow-hidden border border-border">
            <iframe title="loc" width="100%" height="180" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=30.85%2C-25.52%2C31.15%2C-25.40&layer=mapnik&marker=-25.4658%2C30.9806" />
          </div>
        </div>
      </div>
    </div>
  );
}