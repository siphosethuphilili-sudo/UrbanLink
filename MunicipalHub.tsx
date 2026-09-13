// @ts-nocheck
import React, { useEffect, useState } from "react";
import {
  Building2, Calendar, FileText, Briefcase, Megaphone, Download,
  Droplets, Zap, Trash2, Route, FileText as Doc, Siren, Trees, HeartPulse, HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MunicipalHub(): JSX.Element {
  // Types moved to runtime unchecked file
  const serviceIcons: Record<string, any> = {
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

  const [departments, setDepartments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const deptResponse = await fetch('/api/departments');
        if (!deptResponse.ok) throw new Error('Failed to fetch departments');
        const deptData = await deptResponse.json();
        setDepartments(deptData);
        const annResponse = await fetch('/api/announcements?sort=-created_date&limit=10');
        if (!annResponse.ok) throw new Error('Failed to fetch announcements');
        const annData = await annResponse.json();
        setAnnouncements(annData);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load municipal data. Please refresh the page.');
        setDepartments([
          { id: "1", name: "Water & Sanitation", description: "Water supply, sanitation, and wastewater management", head: "Mr. T. Mokoena" },
          { id: "2", name: "Electricity", description: "Power distribution and electrical infrastructure", head: "Ms. L. Nkosi" },
        ]);
        setAnnouncements([
          { id: "1", title: "Water Maintenance Notice", body: "Scheduled maintenance in CBD area from 8 AM to 6 PM.", category: "Infrastructure", created_date: "2026-08-25" },
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
          <button onClick={() => window.location.reload()} className="mt-2 px-4 py-2 bg-destructive text-white rounded-lg hover:bg-destructive/90">Retry</button>
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

      <div>
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><Building2 className="w-5 h-5 text-[hsl(var(--secondary))]" /> Service Directory</h2>
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
    </div>
  );
}
