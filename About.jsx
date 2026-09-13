import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Target, Eye, ChevronDown, Mail, Phone, MapPin, Clock,
  Globe, MessageSquareText, Shield, FileText, Send
} from "lucide-react";
import Logo from "@/components/Logo";
import { sendContactEmail } from "@/lib/emailApi";

const team = [
  { name: "Mokwena Cebile", role: "Lead Developer", color: "from-blue-500 to-indigo-600" },
  { name: "Mngwenya Vusimuzi", role: "Frontend Specialist", color: "from-cyan-500 to-blue-600" },
  { name: "Sibeko Siphosethu", role: "UI/UX Designer", color: "from-purple-500 to-pink-600" },
  { name: "Mtshubungu Amzile", role: "Backend Developer", color: "from-emerald-500 to-teal-600" },
  { name: "Milazi Zandi", role: "Project Manager", color: "from-amber-500 to-orange-600" },
];

const timeline = [
  { date: "Jan 2026", title: "Project Conception", desc: "NexGen Developers identified the communication gap between Mbombela residents and municipal services." },
  { date: "Mar 2026", title: "Partnership Formed", desc: "Collaboration with Mbombela Municipality established to centralize service request management." },
  { date: "Jun 2026", title: "Platform Development", desc: "Core features built: reporting, tracking, notifications, and community engagement." },
  { date: "Aug 2026", title: "Public Launch", desc: "UrbanLink v1.0.0 released to the residents of Mbombela." },
];

const faqs = [
  { q: "How do I report an issue?", a: "Sign in, click 'Report an Issue', choose a category, describe the problem, set the location, and submit. You'll receive a reference number to track progress." },
  { q: "Can I report anonymously?", a: "Yes. Toggle the anonymous option during submission and your identity will be hidden from public views while still allowing the department to address the issue." },
  { q: "How long does it take to resolve a request?", a: "Resolution times vary by category and priority. Most standard requests are addressed within 5–10 business days. Emergency requests are prioritized immediately." },
  { q: "Is UrbanLink free to use?", a: "Yes, UrbanLink is a free public service provided by Mbombela Municipality for all residents." },
  { q: "How do I contact my assigned department?", a: "Open the request detail page and use the comment section to communicate directly with assigned staff." },
];

export default function About() {
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitStatus({ type: "", message: "" });
    setIsSubmitting(true);

    try {
      const response = await sendContactEmail(form);
      setSubmitStatus({
        type: "success",
        message: response.message || "Your message was sent successfully."
      });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error.message || "There was a problem sending your message."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative py-24 px-4 sm:px-8 text-white overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[hsl(var(--primary))] via-[hsl(var(--secondary))] to-[hsl(205_57%_24%)]" />
        <div className="absolute inset-0 -z-10 opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486328218599-e93de9bb1f0c?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold tracking-wider uppercase text-[hsl(var(--accent))]">Our Story</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold">About UrbanLink</h1>
          <p className="mt-5 text-lg text-white/80 text-balance">Born from a vision to create a seamless connection between Mbombela residents and their municipal services.</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-5">
          <div className="p-7 rounded-2xl bg-card border border-border">
            <div className="grid place-items-center w-12 h-12 rounded-xl bg-[hsl(var(--secondary))]/10 text-[hsl(var(--secondary))]"><Target className="w-6 h-6" /></div>
            <h2 className="mt-4 text-xl font-bold">Our Mission</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">To empower communities through technology by providing transparent, efficient, and accessible municipal services that improve the quality of life for all residents of Mbombela.</p>
          </div>
          <div className="p-7 rounded-2xl bg-card border border-border">
            <div className="grid place-items-center w-12 h-12 rounded-xl bg-[hsl(var(--accent))]/20 text-[hsl(var(--secondary))]"><Eye className="w-6 h-6" /></div>
            <h2 className="mt-4 text-xl font-bold">Our Vision</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">To become the leading digital platform for municipal-citizen engagement across South Africa, setting new standards for service delivery and community participation.</p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-12 px-4 sm:px-8 bg-muted/40">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold">The UrbanLink Story</h2>
          <p className="mt-5 text-muted-foreground leading-relaxed text-lg">
            UrbanLink was born from the vision of creating a seamless connection between Mbombela residents and their municipal services. In 2026, NexGen Developers collaborated with Mbombela Municipality to address the challenges of service request management and communication gaps. The platform was developed to centralize municipal service activities, making it easier for residents to submit and monitor service requests while helping municipal departments manage, share, and report on service-related information.
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-sm font-semibold text-[hsl(var(--secondary))] uppercase tracking-wider">NexGen Developers</span>
            <h2 className="mt-2 text-3xl font-extrabold">Meet the Team</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {team.map((m) => (
              <div key={m.name} className="text-center group">
                <div className={`mx-auto w-20 h-20 rounded-full bg-gradient-to-br ${m.color} grid place-items-center text-white text-2xl font-bold group-hover:scale-105 transition-transform`}>
                  {m.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <p className="mt-3 font-semibold text-sm">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4 sm:px-8 bg-[hsl(var(--primary))] text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-12">Our Journey</h2>
          <div className="space-y-6">
            {timeline.map((t, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="grid place-items-center w-10 h-10 rounded-full bg-[hsl(var(--accent))] text-[hsl(var(--primary))] font-bold shrink-0">{i + 1}</div>
                  {i < timeline.length - 1 && <div className="w-0.5 flex-1 bg-white/20 mt-2" />}
                </div>
                <div className="pb-6">
                  <span className="text-xs font-semibold text-[hsl(var(--accent))]">{t.date}</span>
                  <h3 className="font-bold text-lg mt-0.5">{t.title}</h3>
                  <p className="text-white/70 text-sm mt-1">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mbombela info */}
      <section className="py-16 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-extrabold">Mbombela Municipality</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">The City of Mbombela is a Category B municipality situated in the Ehlanzeni District Municipality within the Mpumalanga province. The municipality serves a diverse community with a commitment to excellence in service delivery. UrbanLink is proud to partner with Mbombela Municipality in this digital transformation journey.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-muted/50"><p className="text-2xl font-extrabold text-[hsl(var(--secondary))]">600K+</p><p className="text-xs text-muted-foreground">Residents served</p></div>
              <div className="p-4 rounded-xl bg-muted/50"><p className="text-2xl font-extrabold text-[hsl(var(--secondary))]">8</p><p className="text-xs text-muted-foreground">Departments</p></div>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-border h-64">
            <iframe title="mbombela" width="100%" height="100%" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=30.7%2C-25.6%2C31.3%2C-25.3&layer=mapnik" />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-4 sm:px-8 bg-muted/40">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-10">Get In Touch</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Mail, label: "Email", value: "support@urbanlink.co.za" },
              { icon: Phone, label: "Phone", value: "+27 13 123 4567" },
              { icon: MapPin, label: "Address", value: "Mbombela Municipality, Nelspruit" },
              { icon: Clock, label: "Hours", value: "Mon–Fri, 8AM–5PM" },
            ].map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.label} className="p-5 rounded-2xl bg-card border border-border text-center">
                  <div className="inline-grid place-items-center w-11 h-11 rounded-xl bg-[hsl(var(--secondary))]/10 text-[hsl(var(--secondary))]"><Icon className="w-5 h-5" /></div>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{c.label}</p>
                  <p className="mt-1 text-sm font-semibold">{c.value}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-8 flex justify-center gap-2.5">
            {[Globe, MessageSquareText, Mail, Phone].map((Icon, i) => (
              <a key={i} href="#" className="grid place-items-center w-10 h-10 rounded-xl bg-card border border-border hover:bg-[hsl(var(--primary))] hover:text-white hover:border-transparent transition-colors"><Icon className="w-4.5 h-4.5" /></a>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid place-items-center w-10 h-10 rounded-xl bg-[hsl(var(--secondary))]/10 text-[hsl(var(--secondary))]">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Send us a message</h3>
                <p className="text-sm text-muted-foreground">This goes to the configured email inbox for your UrbanLink deployment.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium">Full name</label>
                <input id="name" name="name" value={form.name} onChange={handleChange} required className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none ring-0 focus:border-[hsl(var(--primary))]" placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium">Email address</label>
                <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none ring-0 focus:border-[hsl(var(--primary))]" placeholder="you@example.com" />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="subject" className="mb-2 block text-sm font-medium">Subject</label>
              <input id="subject" name="subject" value={form.subject} onChange={handleChange} required className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none ring-0 focus:border-[hsl(var(--primary))]" placeholder="How can we help?" />
            </div>

            <div className="mt-4">
              <label htmlFor="message" className="mb-2 block text-sm font-medium">Message</label>
              <textarea id="message" name="message" rows="5" value={form.message} onChange={handleChange} required className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none ring-0 focus:border-[hsl(var(--primary))]" placeholder="Tell us what you need help with..." />
            </div>

            {submitStatus.message && (
              <div className={`mt-4 rounded-xl border px-3 py-2 text-sm ${submitStatus.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`}>
                {submitStatus.message}
              </div>
            )}

            <div className="mt-5 flex justify-end">
              <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
                <Send className="w-4 h-4" />
                {isSubmitting ? "Sending..." : "Send message"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-xl bg-card border border-border overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
                  <span className="font-semibold text-sm">{f.q}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && <p className="px-4 pb-4 text-sm text-muted-foreground">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[hsl(var(--primary))] text-white/70 py-10 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo light />
          <p className="text-xs">© 2026 UrbanLink by NexGen Developers · v1.0.0</p>
          <div className="flex gap-4 text-xs">
            <a href="#" className="hover:text-white flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Privacy</a>
            <a href="#" className="hover:text-white flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> Terms</a>
            <Link to="/dashboard" className="hover:text-white">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}