import React, { useState } from "react";
import {
  Trophy, Star, MessageSquare, ThumbsUp,
  Send, Calendar, Heart
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const leaderboard = [
  { name: "Nomsa M.", points: 540, reports: 42, rank: 1 },
  { name: "Sipho K.", points: 480, reports: 38, rank: 2 },
  { name: "Johan P.", points: 410, reports: 31, rank: 3 },
  { name: "Faith N.", points: 360, reports: 28, rank: 4 },
  { name: "Lebo M.", points: 320, reports: 24, rank: 5 },
];

const polls = [
  { q: "Which area needs the most attention this quarter?", options: ["Road repairs", "Water infrastructure", "Waste management", "Public safety"], votes: [142, 198, 87, 65] },
];

const forumTopics = [
  { title: "Ideas for the new Riverside Park", author: "Nomsa M.", replies: 24, likes: 18, tag: "Parks" },
  { title: "Traffic congestion on Madiba Drive", author: "Johan P.", replies: 41, likes: 35, tag: "Roads" },
  { title: "Community garden initiative in KaNyamazane", author: "Faith N.", replies: 16, likes: 22, tag: "Environment" },
  { title: "Better street lighting for West Acres", author: "Sipho K.", replies: 12, likes: 9, tag: "Safety" },
];

const events = [
  { title: "Community Clean-Up Day", date: "5 Sep 2026", location: "Nelspruit CBD", going: 124 },
  { title: "Public Budget Hearing", date: "12 Sep 2026", location: "Council Chambers", going: 67 },
  { title: "Youth Tech Workshop", date: "20 Sep 2026", location: "Library Hall", going: 89 },
];

export default function Community() {
  const [pollVotes, setPollVotes] = useState({});
  const [newTopic, setNewTopic] = useState("");

  const vote = (pollIdx, optIdx) => {
    setPollVotes((p) => ({ ...p, [pollIdx]: optIdx }));
    toast.success("Vote recorded!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold">Community Engagement</h1>
        <p className="text-sm text-muted-foreground">Connect with neighbors, contribute ideas, and shape your community.</p>
      </div>

      {/* Leaderboard */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[hsl(var(--warning))]/10 to-[hsl(var(--primary))]/5 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-[hsl(var(--warning))]" />
          <h2 className="font-bold text-lg">Community Scoreboard</h2>
          <span className="text-xs text-muted-foreground ml-auto">Top reporters this month</span>
        </div>
        <div className="space-y-2">
          {leaderboard.map((u) => (
            <div key={u.rank} className={cn("flex items-center gap-3 p-3 rounded-xl", u.rank <= 3 ? "bg-card border border-border" : "bg-muted/30")}>
              <div className={cn("grid place-items-center w-9 h-9 rounded-full font-bold text-sm shrink-0", u.rank === 1 ? "bg-[hsl(var(--warning))] text-white" : u.rank === 2 ? "bg-[hsl(var(--muted-foreground))] text-white" : u.rank === 3 ? "bg-[hsl(var(--accent))] text-[hsl(var(--primary))]" : "bg-muted text-muted-foreground")}>
                {u.rank === 1 ? <Trophy className="w-4 h-4" /> : u.rank}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{u.name}</p>
                <p className="text-xs text-muted-foreground">{u.reports} reports filed</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm flex items-center gap-1"><Star className="w-3.5 h-3.5 text-[hsl(var(--warning))]" /> {u.points}</p>
                <p className="text-[10px] text-muted-foreground">points</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Polls */}
        <div className="p-5 rounded-2xl bg-card border border-border">
          <h3 className="font-bold flex items-center gap-2 mb-4"><ThumbsUp className="w-4 h-4 text-[hsl(var(--secondary))]" /> Public Polls</h3>
          {polls.map((poll, pi) => {
            const total = poll.votes.reduce((a, b) => a + b, 0);
            const voted = pollVotes[pi] !== undefined;
            return (
              <div key={pi}>
                <p className="font-semibold text-sm mb-3">{poll.q}</p>
                <div className="space-y-2">
                  {poll.options.map((opt, oi) => {
                    const pct = Math.round((poll.votes[oi] / total) * 100);
                    return (
                      <button key={oi} onClick={() => vote(pi, oi)} disabled={voted} className="w-full text-left">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{opt}</span>
                          <span className="text-xs text-muted-foreground">{voted ? `${pct}%` : ""}</span>
                        </div>
                        <div className="h-7 rounded-lg bg-muted overflow-hidden relative">
                          {voted && <div className="absolute inset-y-0 left-0 rounded-lg bg-[hsl(var(--secondary))]/30" style={{ width: `${pct}%` }} />}
                          <span className="relative px-3 text-xs leading-7 text-muted-foreground">{poll.votes[oi]} votes</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {voted && <p className="mt-3 text-xs text-[hsl(var(--success))] font-semibold">✓ Thanks for voting! {total} total votes.</p>}
              </div>
            );
          })}
        </div>

        {/* Events */}
        <div className="p-5 rounded-2xl bg-card border border-border">
          <h3 className="font-bold flex items-center gap-2 mb-4"><Calendar className="w-4 h-4 text-[hsl(var(--secondary))]" /> Upcoming Events</h3>
          <div className="space-y-3">
            {events.map((e) => (
              <div key={e.title} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <div className="grid place-items-center w-12 h-12 rounded-lg bg-[hsl(var(--primary))] text-white text-center leading-tight">
                  <span className="text-[10px] font-semibold">{e.date.split(" ")[1]}</span>
                  <span className="text-lg font-extrabold">{e.date.split(" ")[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{e.title}</p>
                  <p className="text-xs text-muted-foreground">{e.location} · {e.going} going</p>
                </div>
                <button onClick={() => toast.success("You're going!")} className="text-xs font-semibold text-[hsl(var(--secondary))] hover:underline shrink-0">RSVP</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Forum */}
      <div className="p-5 rounded-2xl bg-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold flex items-center gap-2"><MessageSquare className="w-4 h-4 text-[hsl(var(--secondary))]" /> Community Forum</h3>
          <span className="text-xs text-muted-foreground">{forumTopics.length} active topics</span>
        </div>
        <div className="flex gap-2 mb-4">
          <input value={newTopic} onChange={(e) => setNewTopic(e.target.value)} placeholder="Start a new discussion..." className="flex-1 h-10 px-4 rounded-xl bg-muted border border-transparent focus:border-ring focus:bg-card text-sm outline-none" />
          <button onClick={() => { if (newTopic) { toast.success("Topic posted!"); setNewTopic(""); } }} className="grid place-items-center w-10 h-10 rounded-xl bg-[hsl(var(--primary))] text-white"><Send className="w-4 h-4" /></button>
        </div>
        <div className="space-y-2">
          {forumTopics.map((t) => (
            <div key={t.title} className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-muted transition-colors cursor-pointer">
              <div className="grid place-items-center w-10 h-10 rounded-full bg-[hsl(var(--secondary))]/10 text-[hsl(var(--secondary))] text-sm font-bold shrink-0">{t.author[0]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm truncate">{t.title}</p>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">{t.tag}</span>
                </div>
                <p className="text-xs text-muted-foreground">by {t.author}</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {t.replies}</span>
                <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {t.likes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}