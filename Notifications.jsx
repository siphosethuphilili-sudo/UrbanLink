import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell, CheckCheck, AlertCircle, UserCheck, CheckCircle2,
  Megaphone, Star, X, Settings2
} from "lucide-react";
import { base44 } from "@/api/firebaseClient";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const typeConfig = {
  status: { icon: AlertCircle, color: "secondary" },
  assignment: { icon: UserCheck, color: "secondary" },
  resolution: { icon: CheckCircle2, color: "success" },
  announcement: { icon: Megaphone, color: "warning" },
  feedback: { icon: Star, color: "warning" },
  alert: { icon: AlertCircle, color: "danger" },
};

export default function Notifications() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      setNotifs(await base44.entities.Notification.list("-created_date", 50));
    } catch (e) { /* ignore */ }
    setLoading(false);
  };

  const markAllRead = async () => {
    const unread = notifs.filter((n) => !n.read);
    if (!unread.length) return;
    await base44.entities.Notification.bulkUpdate(unread.map((n) => ({ id: n.id, read: true })));
    toast.success("All marked as read");
    load();
  };

  const toggleRead = async (n) => {
    await base44.entities.Notification.update(n.id, { read: !n.read });
    load();
  };

  const remove = async (n) => {
    await base44.entities.Notification.delete(n.id);
    load();
  };

  const filtered = filter === "unread" ? notifs.filter((n) => !n.read) : notifs;
  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <div className="space-y-5 animate-fade-in max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2">Notifications {unreadCount > 0 && <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-[hsl(var(--danger))] text-white">{unreadCount}</span>}</h1>
          <p className="text-sm text-muted-foreground">Stay updated on your requests and municipal alerts.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={markAllRead} className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-border text-sm font-semibold hover:bg-muted"><CheckCheck className="w-4 h-4" /> Mark all read</button>
          <Link to="/settings" className="grid place-items-center w-9 h-9 rounded-lg border border-border hover:bg-muted"><Settings2 className="w-4 h-4" /></Link>
        </div>
      </div>

      <div className="flex gap-1">
        {[["all", "All"], ["unread", "Unread"]].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)} className={cn("px-4 h-9 rounded-lg text-sm font-medium", filter === k ? "bg-[hsl(var(--primary))] text-white" : "bg-card border border-border hover:bg-muted")}>{l}</button>
        ))}
      </div>

      <div className="space-y-2">
        {loading && [...Array(5)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />)}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <Bell className="w-12 h-12 mx-auto text-muted-foreground/40" />
            <p className="mt-4 font-semibold">You're all caught up!</p>
            <p className="text-sm text-muted-foreground">No notifications to show.</p>
          </div>
        )}
        {!loading && filtered.map((n) => {
          const cfg = typeConfig[n.type] || typeConfig.status;
          const Icon = cfg.icon;
          return (
            <div key={n.id} className={cn("flex items-start gap-3 p-4 rounded-xl border transition-colors", n.read ? "bg-card border-border" : "bg-[hsl(var(--accent))]/8 border-[hsl(var(--accent))]/30")}>
              <div className={cn("grid place-items-center w-10 h-10 rounded-lg shrink-0", `bg-[hsl(var(--${cfg.color}))]/12 text-[hsl(var(--${cfg.color}))]`)}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{n.title}</p>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-[hsl(var(--secondary))] shrink-0" />}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                <div className="mt-2 flex items-center gap-3">
                  {n.request_ref && <Link to="/requests" className="text-xs font-semibold text-[hsl(var(--secondary))] hover:underline">View request</Link>}
                  <button onClick={() => toggleRead(n)} className="text-xs text-muted-foreground hover:text-foreground">{n.read ? "Mark unread" : "Mark read"}</button>
                </div>
              </div>
              <button onClick={() => remove(n)} className="grid place-items-center w-8 h-8 rounded-lg text-muted-foreground hover:text-[hsl(var(--danger))] hover:bg-muted shrink-0"><X className="w-4 h-4" /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}