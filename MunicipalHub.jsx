import React, { useEffect, useState } from "react";
import {
  Building2, Calendar, FileText, Briefcase, Megaphone, Download, ChevronRight,
  Droplets, Zap, Trash2, Route, FileText as Doc, Siren, Trees, HeartPulse, HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const serviceIcons = {
  "Water & Sanitation": Droplets,
  "Electricity": Zap,
  "Waste Management": Trash2,
  "Roads & Infrastructure": Route,
  "Permits & Applications": Doc,
  "Public Safety & Emergency": Siren,
  "Environmental Services": Trees,
  "Health Services": HeartPulse,
};

const wasteSchedule = [
  { day: "Mon", zones: "Zones A, B" }, 
  { day: "Tue", zones: "Zones C, D" },
  { day: "Wed", zones: "Zones A, E" }, 
  { day: "Thu", zones: "Zones B, C" },
  { day: "Fri", zones: "Zones D, E" },
];

const holidays = [
  { date: "24 Sep", name: "Heritage Day" }, 
  { date: "16 Dec", name: "Day of Reconciliation" },
  { date: "25 Dec", name: "Christmas Day" }, 
  { date: "26 Dec", name: "Day of Goodwill" },
];

const documents = [
  { name: "Annual Report 2025", type: "PDF", size: "2.4 MB" },
  { name: "Service Charter", type: "PDF", size: "1.1 MB" },
  { name: "Building Permit Application", type: "DOCX", size: "340 KB" },
  { name: "Water Tariff Schedule", type: "PDF", size: "880 KB" },
];

const jobs = [
  { title: "Senior Civil Engineer", dept: "Roads & Infrastructure", type: "Permanent", closing: "15 Sep 2026" },
  { title: "Environmental Officer", dept: "Environmental Services", type: "Contract", closing: "30 Sep 2026" },
  { title: "Clinic Nurse", dept: "Health Services", type: "Permanent", closing: "20 Sep 2026" },
];

const tenders = [
  { title: "R40 Road Resurfacing Phase 2", ref: "TND-2026-014", closing: "10 Sep 2026" },
  { title: "Water Pipeline Installation — KaNyamazane", ref: "TND-2026-017", closing: "22 Sep 2026" },
];

export default function MunicipalHub() {
  const [departments, setDepartments] = useState<Department>([]);
  const [announcements, setAnnouncements] = useState<Announcement>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch departments
        const deptResponse = await fetch('/api/departments');
        if (!deptResponse.ok) {
          throw new Error('Failed to fetch departments');
        }
        const deptData = await deptResponse.json();
        setDepartments(deptData);

        // Fetch announcements
        const annResponse = await fetch('/api/announcements?sort=-created_date&limit=10');
        if (!annResponse.ok) {
          throw new Error('Failed to fetch announcements');
        }
        const annData = await annResponse.json();
        setAnnouncements(annData);

        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load municipal data. Please refresh the page.');
        
        // Set mock data for development
        setDepartments([
          { id: "1", name: "Water & Sanitation", description: "Water supply, sanitation, and wastewater management", head: "Mr. T. Mokoena" },
          { id: "2", name: "Electricity", description: "Power distribution and electrical infrastructure", head: "Ms. L. Nkosi" },
          { id: "3", name: "Waste Management", description: "Waste collection, recycling, and disposal", head: "Mr. S. Dlamini" },
          { id: "4", name: "Roads & Infrastructure", description: "Road maintenance and infrastructure development", head: "Mr. P. Makhubu" },
          { id: "5", name: "Permits & Applications", description: "Building permits and business licenses", head: "Ms. M. Shongwe" },
          { id: "6", name: "Public Safety & Emergency", description: "Emergency services and public safety", head: "Chief J. Ndlovu" },
          { id: "7", name: "Environmental Services", description: "Environmental protection and conservation", head: "Ms. T. Maseko" },
          { id: "8", name: "Health Services", description: "Public health and clinic services", head: "Dr. K. Mthembu" },
        ]);

        setAnnouncements([
          { id: "1", title: "Water Maintenance Notice", body: "Scheduled maintenance in CBD area from 8 AM to 6 PM.", category: "Infrastructure", created_date: "2026-08-25" },
          { id: "2", title: "Community Engagement Forum", body: "Join us for the quarterly community feedback session.", category: "Community", created_date: "2026-08-24" },
          { id: "3", title: "New Waste Collection Routes", body: "Updated waste collection schedules effective September 2026.", category: "Services", created_date: "2026-08-23" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-extrabold">Municipal Information Hub</h1>
          <p className="text-sm text-muted-foreground">Loading municipal data...</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="p-4 rounded-2xl bg-muted animate-pulse h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-extrabold">Municipal Information Hub</h1>
          <p className="text-sm text-muted-foreground">Services, schedules, news, and resources from Mbombela Municipality.</p>
        </div>
        <div className="p-6 rounded-2xl bg-destructive/10 text-destructive text-center">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-destructive text-white rounded-lg hover:bg-destructive/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold">Municipal Information Hub</h1>
        <p className="text-sm text-muted-foreground">Services, schedules, news, and resources from Mbombela Municipality.</p>
      </div>

      {/* Service Directory */}
      <div>
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[hsl(var(--secondary))]" /> 
          Service Directory
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {departments.map((d) => {
            const Icon = serviceIcons[d.name] || HelpCircle;
            return (
              <div key={d.id} className="p-4 rounded-2xl bg-card border border-border hover:shadow-md transition-shadow">
                <div className="grid place-items-center w-10 h-10 rounded-lg bg-[hsl(var(--secondary))]/10 text-[hsl(var(--secondary))]">
                  <Icon className="w-5 h-5" />
                </div>
                <p className="mt-3 font-semibold text-sm">{d.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{d.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">Head: {d.head}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Waste Schedule */}
        <div className="p-5 rounded-2xl bg-card border border-border">
          <h3 className="font-bold flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-[hsl(var(--secondary))]" /> 
            Waste Collection Schedule
          </h3>
          <div className="space-y-2">
            {wasteSchedule.map((w) => (
              <div key={w.day} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="font-semibold text-sm">{w.day}</span>
                <span className="text-sm text-muted-foreground">{w.zones}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Public Holidays */}
        <div className="p-5 rounded-2xl bg-card border border-border">
          <h3 className="font-bold flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-[hsl(var(--secondary))]" /> 
            Public Holidays
          </h3>
          <div className="space-y-2">
            {holidays.map((h) => (
              <div key={h.date} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <div className="grid place-items-center w-12 h-12 rounded-lg bg-[hsl(var(--primary))] text-white text-xs font-bold leading-tight text-center">
                  {h.date}
                </div>
                <span className="font-semibold text-sm">{h.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* News */}
      <div>
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-[hsl(var(--secondary))]" /> 
          News & Announcements
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {announcements.map((a) => (
            <div key={a.id} className="p-4 rounded-2xl bg-card border border-border">
              <span className="text-[10px] font-bold uppercase tracking-wide text-[hsl(var(--secondary))]">
                {a.category}
              </span>
              <p className="font-semibold text-sm mt-1">{a.title}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Jobs */}
        <div className="p-5 rounded-2xl bg-card border border-border">
          <h3 className="font-bold flex items-center gap-2 mb-4">
            <Briefcase className="w-4 h-4 text-[hsl(var(--secondary))]" /> 
            Job Postings
          </h3>
          <div className="space-y-2">
            {jobs.map((j) => (
              <div key={j.title} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div>
                  <p className="font-semibold text-sm">{j.title}</p>
                  <p className="text-xs text-muted-foreground">{j.dept} · {j.type}</p>
                </div>
                <span className="text-xs text-muted-foreground">Closes {j.closing}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tenders */}
        <div className="p-5 rounded-2xl bg-card border border-border">
          <h3 className="font-bold flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-[hsl(var(--secondary))]" /> 
            Tender Notices
          </h3>
          <div className="space-y-2">
            {tenders.map((t) => (
              <div key={t.ref} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div>
                  <p className="font-semibold text-sm">{t.title}</p>
                  <p className="text-xs text-muted-foreground font-mono">{t.ref}</p>
                </div>
                <span className="text-xs text-muted-foreground">Closes {t.closing}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Documents */}
      <div>
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[hsl(var(--secondary))]" /> 
          Documents Center
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {documents.map((d) => (
            <button 
              key={d.name} 
              className="p-4 rounded-2xl bg-card border border-border text-left hover:shadow-md transition-shadow"
              onClick={() => alert(`Downloading ${d.name}...`)}
            >
              <div className="grid place-items-center w-10 h-10 rounded-lg bg-[hsl(var(--accent))]/20 text-[hsl(var(--secondary))]">
                <Doc className="w-5 h-5" />
              </div>
              <p className="mt-3 font-semibold text-sm">{d.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{d.type} · {d.size}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[hsl(var(--secondary))]">
                <Download className="w-3.5 h-3.5" /> Download
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}