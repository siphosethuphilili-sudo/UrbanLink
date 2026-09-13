import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/firebaseClient";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const notifs = await base44.entities.Notification.filter({ read: false });
        if (mounted) setUnread(notifs.length);
      } catch (e) { /* ignore */ }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} unread={unread} role={user?.role || "Resident"} />
      <div className={`transition-all duration-300 ${collapsed ? "lg:ml-[76px]" : "lg:ml-64"}`}>
        <Topbar onMenuToggle={() => setCollapsed(!collapsed)} unread={unread} user={user} />
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}