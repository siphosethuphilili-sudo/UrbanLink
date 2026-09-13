import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  PlusCircle, ListChecks, Siren, BarChart3, Clock, CheckCircle2,
  AlertCircle, Activity, TrendingUp, Sun, Cloud, CloudRain,
  Megaphone, ChevronRight
} from "lucide-react";
import { base44 } from "@/api/firebaseClient";
import { useAuth } from "@/lib/AuthContext";
import AnimatedCounter from "@/components/AnimatedCounter";

const trendData = [
  { day: "Aug 1", requests: 12, resolved: 8 },
  { day: "Aug 5", requests: 19, resolved: 14 },
  { day: "Aug 9", requests: 15, resolved: 17 },
  { day: "Aug 13", requests: 24, resolved: 19 },
  { day: "Aug 17", requests: 22, resolved: 21 },
  { day: "Aug 21", requests: 28, resolved: 24 },
  { day: "Aug 25", requests: 31, resolved: 27 },
];

const deptPerf = [
  { name: "Water", value: 87 }, { name: "Electric", value: 92 },
  { name: "Waste", value: 78 }, { name: "Roads", value: 71 },
  { name: "Safety", value: 89 }, { name: "Health", value: 90 },
];

const categoryData = [
  { name: "Water & San.", value: 28, color: "hsl(205 90% 60%)" },
  { name: "Electricity", value: 22, color: "hsl(43 74% 58%)" },
  { name: "Roads", value: 18, color: "hsl(27 87% 62%)" },
  { name: "Waste", value: 14, color: "hsl(163 57% 45%)" },
  { name: "Safety", value: 10, color: "hsl(0 70% 55%)" },
  { name: "Other", value: 8, color: "hsl(280 50% 60%)" },
];

const quickActions = [
  { label: "Report New Issue", path: "/report", icon: PlusCircle, primary: true },
  { label: "My Requests", path: "/requests", icon: ListChecks },
  { label: "Track Request", path: "/requests", icon: Activity },
  { label: "Emergency", path: "/emergency", icon: Siren, danger: true },
  { label: "Analytics", path: "/admin", icon: BarChart3 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [reqs, anns] = await Promise.all([
          base44.entities.ServiceRequest.list("-created_date", 50),
          base44.entities.Announcement.list("-created_date", 5),
        ]);
        setRequests(reqs);
        setAnnouncements(anns);
      } catch (e) { /* ignore */ }
      setLoading(false);
    })();
  }, []);

  const stats = useMemo(() => {
    const open = requests.filter((r) => ["Submitted", "In Progress", "Assigned", "Overdue"].includes(r.status)).length;
    const resolved = requests.filter((r) => ["Resolved", "Closed"].includes(r.status)).length;
    const mine = requests.length;
    const overdue = requests.filter((r) => r.status === "Overdue").length;
    return { open, resolved, mine, overdue };
  }, [requests]);

  const firstName = (user?.full_name || "Resident").split(" ")[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] p-6 sm:p-8 text-white">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-[hsl(var(--accent))]/15 animate-float" />
        <div className="relative">
          <p className="text-white/70 text-sm">{greeting},</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">{firstName} 👋</h1>
          <p className="mt-2 text-white/70 text-sm max-w-lg">Here's what's happening with your municipal requests and your community today.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Open Requests", value: stats.open, icon: AlertCircle, color: "warning", sub: "Awaiting action" },
          { label: "Resolved This Month", value: stats.resolved, icon: CheckCircle2, color: "success", sub: "Completed" },
          { label: "My Active Requests", value: stats.mine, icon: ListChecks, color: "secondary", sub: "Total tracked" },
          { label: "Pending Actions", value: stats.overdue, icon: Clock, color: "danger", sub: "Need attention" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="p-5 rounded-2xl bg-card border border-border animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex items-center justify-between">
                <div className={`grid place-items-center w-10 h-10 rounded-xl bg-[hsl(var(--${s.color}))]/12 text-[hsl(var(--${s.color}))]`}>
                  <Icon className="w-5 h-5" />
                </div>
                <TrendingUp className="w-4 h-4 text-muted-foreground/40" />
              </div>
              <p className="mt-4 text-3xl font-extrabold font-heading">
                {loading ? <span className="inline-block w-10 h-8 rounded bg-muted animate-pulse" /> : <AnimatedCounter value={s.value} />}
              </p>
              <p className="text-sm font-semibold mt-0.5">{s.label}</p>
              <p className="text-xs text-muted-foreground">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {quickActions.map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.label}
              to={a.path}
              className={`group flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                a.primary ? "bg-[hsl(var(--primary))] text-white border-transparent"
                : a.danger ? "bg-[hsl(var(--danger))]/8 text-[hsl(var(--danger))] border-[hsl(var(--danger))]/20"
                : "bg-card border-border hover:border-[hsl(var(--secondary))]/40"
              }`}
            >
              <Icon className={`w-6 h-6 ${a.primary ? "" : a.danger ? "" : "text-[hsl(var(--secondary))]"}`} />
              <span className="text-xs font-semibold text-center">{a.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 p-5 rounded-2xl bg-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold">Request Trends</h3>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]">+18% this month</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
              <Line type="monotone" dataKey="requests" stroke="hsl(var(--secondary))" strokeWidth={2.5} dot={false} name="New Requests" />
              <Line type="monotone" dataKey="resolved" stroke="hsl(var(--success))" strokeWidth={2.5} dot={false} name="Resolved" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border">
          <h3 className="font-bold">Issue Categories</h3>
          <p className="text-xs text-muted-foreground mb-4">Distribution this month</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2}>
                {categoryData.map((e) => <Cell key={e.name} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1.5">
            {categoryData.slice(0, 4).map((c) => (
              <div key={c.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                <span className="text-muted-foreground flex-1">{c.name}</span>
                <span className="font-semibold">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Department performance */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-card border border-border">
          <h3 className="font-bold mb-4">Department Performance</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deptPerf} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }} cursor={{ fill: "hsl(var(--muted))" }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} name="Performance %">
                {deptPerf.map((d, i) => (
                  <Cell key={i} fill={d.value >= 85 ? "hsl(var(--success))" : d.value >= 75 ? "hsl(var(--secondary))" : "hsl(var(--warning))"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weather */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[hsl(205_57%_34%)] to-[hsl(205_71%_17%)] text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-xs">Mbombela, MP</p>
              <p className="text-4xl font-extrabold mt-1">21°C</p>
              <p className="text-sm text-white/80 mt-0.5">Partly Cloudy</p>
            </div>
            <Cloud className="w-16 h-16 text-white/80 animate-float" />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            {[
              { day: "Fri", icon: Sun, t: "24°" },
              { day: "Sat", icon: CloudRain, t: "19°" },
              { day: "Sun", icon: Cloud, t: "22°" },
            ].map((d) => {
              const Icon = d.icon;
              return (
                <div key={d.day} className="rounded-xl bg-white/10 py-2.5">
                  <p className="text-[10px] text-white/60">{d.day}</p>
                  <Icon className="w-5 h-5 mx-auto my-1 text-[hsl(var(--accent))]" />
                  <p className="text-xs font-semibold">{d.t}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent activity + Announcements */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 p-5 rounded-2xl bg-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Recent Activity</h3>
            <Link to="/requests" className="text-xs font-semibold text-[hsl(var(--secondary))] flex items-center gap-1 hover:gap-1.5 transition-all">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {loading && [...Array(4)].map((_, i) => <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />)}
            {!loading && requests.slice(0, 5).map((r) => (
              <Link key={r.id} to={`/requests/${r.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors">
                <span className={`w-2 h-2 rounded-full ${
                  r.status === "Resolved" || r.status === "Closed" ? "bg-[hsl(var(--success))]" :
                  r.status === "Overdue" ? "bg-[hsl(var(--danger))]" :
                  r.status === "In Progress" ? "bg-[hsl(var(--warning))]" : "bg-[hsl(var(--secondary))]"
                }`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.reference_number} · {r.category}</p>
                </div>
                <span className="text-xs font-medium text-muted-foreground shrink-0">{r.days_open}d</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Megaphone className="w-4 h-4 text-[hsl(var(--secondary))]" />
            <h3 className="font-bold">Announcements</h3>
          </div>
          <div className="space-y-3">
            {announcements.slice(0, 4).map((a) => (
              <div key={a.id} className="p-3 rounded-xl bg-muted/50">
                <span className="text-[10px] font-bold uppercase tracking-wide text-[hsl(var(--secondary))]">{a.category}</span>
                <p className="text-sm font-semibold mt-0.5 leading-tight">{a.title}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}