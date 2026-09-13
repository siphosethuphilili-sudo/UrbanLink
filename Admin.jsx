import React, { useEffect, useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";
import {
  Users, ListChecks, Building2, TrendingUp, Clock, CheckCircle2, AlertCircle,
  UserPlus, Download, Search, ChevronRight
} from "lucide-react";
import { base44 } from "@/api/firebaseClient";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const statusOptions = ["Submitted", "Assigned", "In Progress", "Resolved", "Closed", "Overdue"];

export default function Admin() {
  const [requests, setRequests] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [assignModal, setAssignModal] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [r, d] = await Promise.all([
          base44.entities.ServiceRequest.list("-created_date", 100),
          base44.entities.Department.list(),
        ]);
        setRequests(r);
        setDepartments(d);
      } catch (e) {}
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => requests.filter((r) => !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.reference_number.toLowerCase().includes(search.toLowerCase())), [requests, search]);

  const stats = {
    total: requests.length,
    open: requests.filter((r) => !["Resolved", "Closed"].includes(r.status)).length,
    resolved: requests.filter((r) => ["Resolved", "Closed"].includes(r.status)).length,
    overdue: requests.filter((r) => r.status === "Overdue").length,
  };

  const assign = async (reqId, dept) => {
    try {
      await base44.entities.ServiceRequest.update(reqId, { assigned_department: dept, status: "Assigned", progress: 25 });
      setRequests((p) => p.map((r) => r.id === reqId ? { ...r, assigned_department: dept, status: "Assigned", progress: 25 } : r));
      toast.success("Request assigned");
      setAssignModal(null);
    } catch (e) { toast.error("Failed to assign"); }
  };

  const tabs = [
    ["overview", "Overview", TrendingUp],
    ["requests", "Request Management", ListChecks],
    ["departments", "Departments", Building2],
    ["users", "User Management", Users],
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">Admin Dashboard <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[hsl(var(--primary))] text-white">Staff</span></h1>
        <p className="text-sm text-muted-foreground">Manage requests, departments, and system performance.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map(([k, l, Icon]) => (
          <button key={k} onClick={() => setTab(k)} className={cn("flex items-center gap-2 px-4 h-10 rounded-xl text-sm font-medium whitespace-nowrap", tab === k ? "bg-[hsl(var(--primary))] text-white" : "bg-card border border-border hover:bg-muted")}>
            <Icon className="w-4 h-4" /> {l}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Total Requests", value: stats.total, icon: ListChecks, color: "primary" },
              { label: "Open", value: stats.open, icon: Clock, color: "warning" },
              { label: "Resolved", value: stats.resolved, icon: CheckCircle2, color: "success" },
              { label: "Overdue", value: stats.overdue, icon: AlertCircle, color: "danger" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="p-5 rounded-2xl bg-card border border-border">
                  <div className={cn("grid place-items-center w-10 h-10 rounded-xl", `bg-[hsl(var(--${s.color}))]/12 text-[hsl(var(--${s.color}))]`)}><Icon className="w-5 h-5" /></div>
                  <p className="mt-3 text-3xl font-extrabold">{loading ? "—" : s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-card border border-border">
              <h3 className="font-bold mb-4">Requests by Status</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={statusOptions.map((s) => ({ name: s, count: requests.filter((r) => r.status === s).length }))} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} angle={-20} height={50} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }} cursor={{ fill: "hsl(var(--muted))" }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="hsl(var(--secondary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="p-5 rounded-2xl bg-card border border-border">
              <h3 className="font-bold mb-4">Resolution Trend</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={[{d:"W1",r:12},{d:"W2",r:18},{d:"W3",r:15},{d:"W4",r:24}]}>
                  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.4} /><stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="d" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                  <Area type="monotone" dataKey="r" stroke="hsl(var(--success))" strokeWidth={2.5} fill="url(#g)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {tab === "requests" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search requests..." className="w-full h-10 pl-10 pr-4 rounded-xl bg-card border border-border text-sm outline-none focus:border-ring" />
            </div>
            <button onClick={() => toast.success("Exported")} className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-border text-sm font-semibold hover:bg-muted"><Download className="w-4 h-4" /> Export</button>
          </div>
          <div className="rounded-2xl bg-card border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
                  <tr>
                    <th className="text-left p-3 font-semibold">Reference</th>
                    <th className="text-left p-3 font-semibold">Title</th>
                    <th className="text-left p-3 font-semibold">Priority</th>
                    <th className="text-left p-3 font-semibold">Status</th>
                    <th className="text-left p-3 font-semibold">Department</th>
                    <th className="text-right p-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/30">
                      <td className="p-3 font-mono text-xs">{r.reference_number}</td>
                      <td className="p-3 font-semibold max-w-48 truncate">{r.title}</td>
                      <td className="p-3"><span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", `bg-[hsl(var(--${r.priority === "Emergency" ? "danger" : r.priority === "High" ? "warning" : r.priority === "Medium" ? "secondary" : "success"}))]/10`)}>{r.priority}</span></td>
                      <td className="p-3"><span className="text-xs font-medium">{r.status}</span></td>
                      <td className="p-3 text-xs text-muted-foreground">{r.assigned_department || "—"}</td>
                      <td className="p-3 text-right"><button onClick={() => setAssignModal(r)} className="text-xs font-semibold text-[hsl(var(--secondary))] hover:underline">Assign</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "departments" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {departments.map((d) => (
            <div key={d.id} className="p-5 rounded-2xl bg-card border border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm">{d.name}</h3>
                <span className="text-xs text-muted-foreground">{d.staff_count} staff</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{d.description}</p>
              <p className="mt-2 text-xs">Head: <span className="font-semibold">{d.head}</span></p>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1"><span className="text-muted-foreground">Performance</span><span className="font-bold">{d.performance}%</span></div>
                <div className="h-2 rounded-full bg-muted overflow-hidden"><div className={cn("h-full rounded-full", d.performance >= 85 ? "bg-[hsl(var(--success))]" : d.performance >= 75 ? "bg-[hsl(var(--warning))]" : "bg-[hsl(var(--danger))]")} style={{ width: `${d.performance}%` }} /></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "users" && (
        <div className="rounded-2xl bg-card border border-border p-8 text-center">
          <Users className="w-12 h-12 mx-auto text-muted-foreground/40" />
          <p className="mt-4 font-semibold">User Management</p>
          <p className="text-sm text-muted-foreground">Invite and manage users through the platform's user system.</p>
          <button onClick={() => toast.info("Use the invite system to add users")} className="mt-4 inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-[hsl(var(--primary))] text-white text-sm font-semibold"><UserPlus className="w-4 h-4" /> Invite User</button>
        </div>
      )}

      {/* Assign modal */}
      {assignModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 animate-fade-in" onClick={() => setAssignModal(null)}>
          <div className="w-full max-w-md p-6 rounded-2xl bg-card border border-border" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold">Assign Request</h3>
            <p className="text-sm text-muted-foreground mt-1">{assignModal.reference_number} — {assignModal.title}</p>
            <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
              {departments.map((d) => (
                <button key={d.id} onClick={() => assign(assignModal.id, d.name)} className="w-full flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted text-left">
                  <div><p className="font-semibold text-sm">{d.name}</p><p className="text-xs text-muted-foreground">Head: {d.head}</p></div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
            <button onClick={() => setAssignModal(null)} className="mt-4 w-full h-10 rounded-xl border border-border text-sm font-semibold hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}