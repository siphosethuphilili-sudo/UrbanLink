import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, Bell, ChevronDown, LogOut, UserCircle, Settings as SettingsIcon } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function Topbar({ onMenuToggle, unread = 0, user }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = (user?.full_name || "User").split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center gap-3 px-4 sm:px-6 bg-card/80 backdrop-blur-md border-b border-border">
      <button onClick={onMenuToggle} className="lg:hidden grid place-items-center w-9 h-9 rounded-lg hover:bg-muted">
        <Menu className="w-5 h-5" />
      </button>

      <div className="hidden sm:flex items-center gap-2 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            placeholder="Search requests, services..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-muted border border-transparent focus:border-ring focus:bg-card text-sm outline-none transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <ThemeToggle />
        <Link to="/notifications" className="relative grid place-items-center w-9 h-9 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-4.5 h-4.5" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 grid place-items-center min-w-4.5 h-4.5 px-1 rounded-full bg-[hsl(var(--danger))] text-white text-[10px] font-bold">
              {unread}
            </span>
          )}
        </Link>

        <div className="relative" ref={ref}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 h-10 pl-1.5 pr-2.5 rounded-xl hover:bg-muted transition-colors"
          >
            <div className="grid place-items-center w-7 h-7 rounded-full bg-gradient-to-br from-[hsl(var(--secondary))] to-[hsl(var(--primary))] text-white text-xs font-bold">
              {initials}
            </div>
            <div className="hidden md:block text-left leading-tight">
              <p className="text-sm font-semibold truncate max-w-28">{user?.full_name || "Resident"}</p>
              <p className="text-[11px] text-muted-foreground">{user?.role === "admin" ? "Administrator" : user?.role === "user" ? "Resident" : user?.role || "Resident"}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card shadow-xl py-1.5 animate-fade-in">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-sm font-semibold truncate">{user?.full_name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted">
                <UserCircle className="w-4 h-4" /> My Profile
              </Link>
              <Link to="/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted">
                <SettingsIcon className="w-4 h-4" /> Settings
              </Link>
              <button
                onClick={async () => { await logout(); window.location.href = "/login"; }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[hsl(var(--danger))] hover:bg-muted"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}