import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search, LayoutGrid, List, Filter, Download, X, Droplets, Zap, Trash2,
  Route, FileText, Siren, Trees, HeartPulse, HelpCircle, Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const categoryIcons = {
  "Water & Sanitation": Droplets,
  "Electricity": Zap,
  "Waste Management": Trash2,
  "Roads & Infrastructure": Route,
  "Permits & Applications": FileText,
  "Public Safety & Emergency": Siren,
  "Environmental Services": Trees,
  "Health Services": HeartPulse,
};

const statusConfig = {
  "Submitted": { color: "secondary", label: "Submitted" },
  "In Progress": { color: "warning", label: "In Progress" },
  "Assigned": { color: "secondary", label: "Assigned" },
  "Resolved": { color: "success", label: "Resolved" },
  "Closed": { color: "muted", label: "Closed" },
  "Overdue": { color: "danger", label: "Overdue" },
};

const tabs = ["All", "In Progress", "Resolved", "Closed", "Overdue"];

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("All");
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priority, setPriority] = useState("All");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // Try to fetch from API
        const response = await fetch('/api/service-requests?sort=-created_date&limit=100');
        if (!response.ok) {
          throw new Error('Failed to fetch requests');
        }
        const data = await response.json();
        setRequests(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching requests:', err);
        setError('Failed to load requests. Using sample data.');
        
        // Set mock data for development
        setRequests([
          {
            id: "1",
            reference_number: "REF-2026-001",
            title: "Pothole on Madiba Drive",
            category: "Roads & Infrastructure",
            priority: "High",
            status: "In Progress",
            assigned_department: "Roads & Infrastructure",
            days_open: 5,
            progress: 60,
            created_date: "2026-08-20",
            description: "Large pothole causing traffic issues"
          },
          {
            id: "2",
            reference_number: "REF-2026-002",
            title: "Water outage in West Acres",
            category: "Water & Sanitation",
            priority: "Emergency",
            status: "Assigned",
            assigned_department: "Water & Sanitation",
            days_open: 2,
            progress: 30,
            created_date: "2026-08-24",
            description: "No water supply in the area"
          },
          {
            id: "3",
            reference_number: "REF-2026-003",
            title: "Streetlight not working",
            category: "Electricity",
            priority: "Medium",
            status: "Resolved",
            assigned_department: "Electricity",
            days_open: 7,
            progress: 100,
            created_date: "2026-08-18",
            description: "Streetlight on corner of Main and 2nd"
          },
          {
            id: "4",
            reference_number: "REF-2026-004",
            title: "Waste collection missed",
            category: "Waste Management",
            priority: "Low",
            status: "Submitted",
            assigned_department: "Waste Management",
            days_open: 1,
            progress: 10,
            created_date: "2026-08-25",
            description: "Bins not collected on scheduled day"
          },
          {
            id: "5",
            reference_number: "REF-2026-005",
            title: "Road flooding",
            category: "Roads & Infrastructure",
            priority: "High",
            status: "Overdue",
            assigned_department: "Roads & Infrastructure",
            days_open: 14,
            progress: 40,
            created_date: "2026-08-10",
            description: "Flooding on main road after heavy rain"
          },
          {
            id: "6",
            reference_number: "REF-2026-006",
            title: "Air pollution concern",
            category: "Environmental Services",
            priority: "Medium",
            status: "In Progress",
            assigned_department: "Environmental Services",
            days_open: 3,
            progress: 45,
            created_date: "2026-08-22",
            description: "Excessive smoke from nearby factory"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (tab !== "All") {
        if (tab === "In Progress" && !["In Progress", "Assigned", "Submitted"].includes(r.status)) return false;
        if (tab === "Resolved" && !["Resolved", "Closed"].includes(r.status)) return false;
        if (tab === "Closed" && r.status !== "Closed") return false;
        if (tab === "Overdue" && r.status !== "Overdue") return false;
      }
      if (category !== "All" && r.category !== category) return false;
      if (priority !== "All" && r.priority !== priority) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!r.title.toLowerCase().includes(q) && !r.reference_number.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [requests, tab, category, priority, search]);

  const getStatusCount = (status) => {
    if (status === "All") return requests.length;
    if (status === "In Progress") {
      return requests.filter((r) => ["In Progress", "Assigned", "Submitted"].includes(r.status)).length;
    }
    if (status === "Resolved") {
      return requests.filter((r) => ["Resolved", "Closed"].includes(r.status)).length;
    }
    return requests.filter((r) => r.status === status).length;
  };

  const exportCsv = () => {
    try {
      const headers = ["Reference", "Title", "Category", "Priority", "Status", "Department", "Days Open"];
      const rows = filtered.map((r) => [
        r.reference_number, 
        r.title, 
        r.category, 
        r.priority, 
        r.status, 
        r.assigned_department || "", 
        r.days_open
      ]);
      const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; 
      a.download = "urbanlink-requests.csv"; 
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Exported to CSV");
    } catch (err) {
      toast.error("Failed to export CSV");
    }
  };

  const categories = ["All", ...Object.keys(categoryIcons)];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">My Requests</h1>
          <p className="text-sm text-muted-foreground">Track and manage all your municipal service requests.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={exportCsv} 
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors"
            disabled={filtered.length === 0}
          >
            <Download className="w-4 h-4" /> Export
          </button>
          <Link to="/report" className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-[hsl(var(--primary))] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
            New Request
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-warning/10 text-warning text-sm">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 h-9 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
              tab === t ? "bg-[hsl(var(--primary))] text-white" : "bg-card border border-border hover:bg-muted"
            )}
          >
            {t}
            <span className="ml-1.5 text-xs opacity-70">
              ({getStatusCount(t)})
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by reference or keyword..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-card border border-border text-sm outline-none focus:border-ring"
          />
        </div>
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          className="h-10 px-3 rounded-xl bg-card border border-border text-sm outline-none focus:border-ring"
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select 
          value={priority} 
          onChange={(e) => setPriority(e.target.value)} 
          className="h-10 px-3 rounded-xl bg-card border border-border text-sm outline-none focus:border-ring"
        >
          {["All", "Low", "Medium", "High", "Emergency"].map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <div className="flex items-center gap-1 p-1 rounded-xl bg-card border border-border">
          <button 
            onClick={() => setView("grid")} 
            className={cn(
              "grid place-items-center w-8 h-8 rounded-lg transition-colors",
              view === "grid" ? "bg-[hsl(var(--primary))] text-white" : "text-muted-foreground hover:bg-muted"
            )}
            aria-label="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setView("list")} 
            className={cn(
              "grid place-items-center w-8 h-8 rounded-lg transition-colors",
              view === "list" ? "bg-[hsl(var(--primary))] text-white" : "text-muted-foreground hover:bg-muted"
            )}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className={cn("grid gap-3", view === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1")}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-grid place-items-center w-16 h-16 rounded-full bg-muted text-muted-foreground mx-auto">
            <Filter className="w-7 h-7" />
          </div>
          <p className="mt-4 font-semibold">No requests found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or report a new issue.</p>
        </div>
      ) : (
        <div className={cn("grid gap-3", view === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1")}>
          {filtered.map((r) => {
            const Icon = categoryIcons[r.category] || HelpCircle;
            const sc = statusConfig[r.status] || statusConfig.Submitted;
            return (
              <Link 
                key={r.id} 
                to={`/requests/${r.id}`} 
                className="group p-4 rounded-2xl bg-card border border-border hover:border-[hsl(var(--secondary))]/40 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="grid place-items-center w-10 h-10 rounded-lg bg-[hsl(var(--secondary))]/10 text-[hsl(var(--secondary))]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold uppercase px-2 py-1 rounded-full",
                    `bg-[hsl(var(--${sc.color}))]/12 text-[hsl(var(--${sc.color}))]`
                  )}>
                    {sc.label}
                  </span>
                </div>
                <p className="mt-3 font-semibold text-sm leading-tight line-clamp-2">{r.title}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{r.reference_number}</p>
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span className={cn(
                    "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                    `bg-[hsl(var(--${r.priority === "Emergency" ? "danger" : r.priority === "High" ? "warning" : r.priority === "Medium" ? "secondary" : "success"}))]/10`
                  )}>
                    {r.priority}
                  </span>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {r.days_open}d open
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{r.progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full", `bg-[hsl(var(--${sc.color}))]`)} 
                      style={{ width: `${r.progress}%` }} 
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}