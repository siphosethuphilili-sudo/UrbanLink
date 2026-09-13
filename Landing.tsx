import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import React from "react";

// Simple inline ArrowRight icon to avoid needing types for 'lucide-react' in this file
const ArrowRight: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import type { ServiceRequest } from "@/types/requests";
import type { Announcement } from "@/types/announcements";



const testimonials = [
  { name: "Nomsa M.", role: "Resident, KaNyamazane", text: "I reported a broken streetlight and it was fixed in three days. UrbanLink made me feel heard for the first time.", rating: 5 },
  { name: "Johan P.", role: "Business Owner, CBD", text: "The transparency is incredible. I can see exactly which department is handling my request and when to expect resolution.", rating: 5 },
  { name: "Sipho K.", role: "Resident, West Acres", text: "The emergency SOS button gave me peace of mind during the floods. Help arrived faster than I imagined.", rating: 4 },
  { name: "Faith N.", role: "Resident, Riverside", text: "Finally a platform that connects us to the municipality without standing in queues. Game changer for Mbombela.", rating: 5 },
];

const featureCards = [
  {
    title: "Smart Issue Reporting",
    description: "Report potholes, outages, illegal dumping, and service issues with a few taps using a guided form and location details.",
    accent: "from-sky-500 to-cyan-500",
  },
  {
    title: "Transparent Tracking",
    description: "Follow every request from submission to resolution with status updates, assignment history, and service-owner visibility.",
    accent: "from-violet-500 to-purple-500",
  },
  {
    title: "Community Updates",
    description: "Stay informed with municipality announcements, maintenance schedules, alerts, and public service activity.",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    title: "Emergency Coordination",
    description: "Fast-track urgent incidents with clear escalation paths, emergency resources, and public safety communication.",
    accent: "from-amber-500 to-orange-500",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Create a report",
    description: "Residents describe the issue, add a photo, and share the location to ensure the right team can respond quickly.",
  },
  {
    number: "02",
    title: "Assign and review",
    description: "Municipal teams receive the case, validate the details, and assign it to the most relevant department.",
  },
  {
    number: "03",
    title: "Track progress",
    description: "Residents can monitor status, receive updates, and respond with new information before closure.",
  },
  {
    number: "04",
    title: "Resolve and close",
    description: "Once work is complete, the request is closed with a clear confirmation and community update.",
  },
];

export default function Landing(): JSX.Element {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestsResponse = await fetch('/api/service-requests?limit=5&sort=-created_date');
        const requestsData = await requestsResponse.json();
        setRequests(requestsData);
        const announcementsResponse = await fetch('/api/announcements?limit=3&sort=-created_date');
        const announcementsData = await announcementsResponse.json();
        setAnnouncements(announcementsData);
      } catch (e) {
        console.error('Error fetching data:', e);
        setRequests([
          { id: '1', title: 'Pothole on Madiba Drive', category: 'Roads & Infrastructure', reference_number: 'REF-2026-001', status: 'In Progress', anonymous: false },
          { id: '2', title: 'Water outage in West Acres', category: 'Water & Sanitation', reference_number: 'REF-2026-002', status: 'Assigned', anonymous: true },
          { id: '3', title: 'Streetlight not working', category: 'Electricity', reference_number: 'REF-2026-003', status: 'Pending', anonymous: false },
        ]);
        setAnnouncements([
          { id: '1', title: 'Water Maintenance Schedule', body: 'Planned maintenance in CBD area from 8 AM to 6 PM.', category: 'Infrastructure' },
          { id: '2', title: 'Community Meeting', body: 'Join us for the quarterly community feedback session.', category: 'Community' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 h-16 flex items-center justify-between px-4 sm:px-8 bg-card/80 backdrop-blur-md border-b border-border">
        <Logo />
        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how" className="hover:text-foreground transition-colors">How It Works</a>
          <a href="#feed" className="hover:text-foreground transition-colors">Live Feed</a>
          <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
        </div>
          <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link to="/login" className="hidden sm:inline-flex h-9 px-4 items-center rounded-lg text-sm font-semibold text-foreground hover:bg-muted transition-colors">Sign In</Link>
          <Link to="/register" className="h-9 px-4 inline-flex items-center gap-1.5 rounded-lg bg-[hsl(var(--primary))] text-white text-sm font-semibold hover:opacity-90 transition-opacity">Get Started <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-8 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary))] via-[hsl(var(--secondary))] to-[hsl(205_57%_24%)]" />
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1597212618440-8062628a7566?w=1600&q=80')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--primary))]/80 to-transparent" />
        </div>
        <div className="max-w-6xl mx-auto text-center text-white">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass text-xs font-medium tracking-wide animate-fade-up"><span className="w-2 h-2 rounded-full bg-[hsl(var(--accent))] animate-pulse-soft" />Mbombela Municipality · Official Platform</span>
          <h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-balance animate-fade-up" style={{ animationDelay: '0.1s' }}>Connecting Communities,<br /><span className="text-[hsl(var(--accent))]">Solving Problems</span></h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-white/80 text-balance animate-fade-up" style={{ animationDelay: '0.2s' }}>Report municipal issues, track their progress in real time, and engage with your local government — all in one transparent platform built for the people of Mbombela.</p>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/register" className="group inline-flex items-center gap-2 h-13 px-7 py-3.5 rounded-xl bg-[hsl(var(--accent))] text-[hsl(var(--primary))] font-bold text-base hover:scale-[1.03] transition-transform shadow-xl shadow-accent/30">Report an Issue <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" /></Link>
            <a href="#how" className="inline-flex items-center gap-2 h-13 px-7 py-3.5 rounded-xl glass text-white font-semibold text-base hover:bg-white/15 transition-colors">Learn More</a>
          </div>
        </div>
      </section>

      <section id="features" className="px-4 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[hsl(var(--secondary))]">Features</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Everything residents need to stay informed and connected</h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-transform hover:-translate-y-1">
                <div className={`mb-5 h-12 w-12 rounded-xl bg-gradient-to-br ${feature.accent}`} />
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="bg-muted/40 px-4 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[hsl(var(--secondary))]">How it works</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">From a problem report to a visible fix</h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {processSteps.map((step) => (
              <div key={step.number} className="rounded-2xl border border-border bg-background p-6">
                <span className="inline-flex rounded-full bg-[hsl(var(--secondary))]/10 px-2.5 py-1 text-xs font-semibold text-[hsl(var(--secondary))]">{step.number}</span>
                <h3 className="mt-4 text-xl font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="feed" className="px-4 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[hsl(var(--secondary))]">Live feed</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">See what is happening across the city right now</h2>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-xl font-bold">Recent reports</h3>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600">Live</span>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="h-16 animate-pulse rounded-xl bg-muted" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.length > 0 ? requests.map((request) => (
                    <div key={request.id ?? request.reference_number} className="rounded-xl border border-border bg-background p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{request.title}</p>
                          <p className="text-xs text-muted-foreground">{request.category}</p>
                        </div>
                        <span className="rounded-full bg-[hsl(var(--secondary))]/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[hsl(var(--secondary))]">
                          {request.status ?? 'Pending'}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Ref: {request.reference_number ?? 'N/A'}
                      </p>
                    </div>
                  )) : (
                    <p className="text-sm text-muted-foreground">No recent reports yet.</p>
                  )}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-xl font-bold">Municipal updates</h3>
                <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-600">Announcements</span>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="h-16 animate-pulse rounded-xl bg-muted" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {announcements.length > 0 ? announcements.map((announcement) => (
                    <div key={announcement.id ?? announcement.title} className="rounded-xl border border-border bg-background p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold">{announcement.title}</p>
                        <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                          {announcement.category ?? 'Update'}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{announcement.body}</p>
                    </div>
                  )) : (
                    <p className="text-sm text-muted-foreground">No municipal updates available right now.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[hsl(var(--primary))] px-4 py-20 text-white sm:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[hsl(var(--accent))]">Community impact</p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Built to make local service delivery faster, more transparent, and easier to trust.</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
              <p className="text-3xl font-extrabold text-[hsl(var(--accent))]">4x</p>
              <p className="mt-2 text-sm text-white/75">Faster issue visibility for communities and departments</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
              <p className="text-3xl font-extrabold text-[hsl(var(--accent))]">24/7</p>
              <p className="mt-2 text-sm text-white/75">Public access to the most important service updates</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
              <p className="text-3xl font-extrabold text-[hsl(var(--accent))]">100%</p>
              <p className="mt-2 text-sm text-white/75">Transparent progress tracking from report to closure</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-8">
        <div className="mx-auto max-w-5xl">
          {testimonials.map((item, index) => (
            <div key={`${item.name}-${index}`} className="rounded-2xl border border-border bg-card p-6 text-center">
              <div className="flex justify-center gap-1 text-amber-400">
                {Array.from({ length: item.rating }).map((_, starIndex) => (
                  <span key={starIndex}>★</span>
                ))}
              </div>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">“{item.text}”</p>
              <div className="mt-4">
                <p className="font-bold">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
