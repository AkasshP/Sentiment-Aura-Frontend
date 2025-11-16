// src/components/DebugDrawer.tsx
import React, { useState } from "react";

type Props = {
  messages: string[];
};

export default function DebugDrawer({ messages }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <section className="panel-elevate rounded-2xl border border-slate-700/60 bg-slate-950/80 px-4 py-3 text-xs text-slate-100 shadow-xl shadow-slate-900/60 backdrop-blur-xl">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
            Debug Log
          </span>
          <p className="mt-1 text-[11px] text-slate-400">
            {open ? "Hide low-level events" : "Show low-level events"}
          </p>
        </div>
        <span className="rounded-full bg-slate-800/80 px-2 py-1 text-[11px] text-slate-200">
          {open ? "Collapse ▴" : "Expand ▾"}
        </span>
      </button>

      {open && (
        <pre className="mt-3 max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed text-slate-100/80">
          {messages.length === 0
            ? "— no debug messages yet —"
            : messages.join("\n")}
        </pre>
      )}
    </section>
  );
}
