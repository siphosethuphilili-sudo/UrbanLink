import React from "react";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Logo({ compact = false, light = false, className }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-[hsl(var(--secondary))] to-[hsl(var(--primary))] shadow-lg shadow-primary/20">
        <Building2 className="w-5 h-5 text-white" strokeWidth={2.4} />
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[hsl(var(--accent))] ring-2 ring-white/40 animate-pulse-soft" />
      </div>
      {!compact && (
        <div className="leading-none">
          <span className={cn("font-heading font-extrabold text-lg tracking-tight", light ? "text-white" : "text-foreground")}>
            Urban<span className="text-[hsl(var(--accent))]">Link</span>
          </span>
          <p className={cn("text-[10px] font-medium tracking-wide uppercase", light ? "text-white/60" : "text-muted-foreground")}>
            Mbombela Municipality
          </p>
        </div>
      )}
    </div>
  );
}