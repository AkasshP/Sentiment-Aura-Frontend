// src/components/TranscriptPanel.tsx
import { useEffect, useRef } from "react";

type Props = {
  transcript: string;
  onClear: () => void;
};

export default function TranscriptPanel({ transcript, onClear }: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const display =
    transcript.trim().length > 0
      ? transcript
      : "Start speaking. Your live transcript will appear here in real time.";

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [transcript]);

  return (
    <section className="panel-elevate relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-950/70 px-5 py-4 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
          Transcript
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-100 transition hover:bg-white/10 hover:text-white"
        >
          Clear
        </button>
      </div>

      <div
        ref={scrollRef}
        className="max-h-64 overflow-y-auto pr-1 text-sm leading-relaxed text-slate-100/90"
      >
        <p className="whitespace-pre-wrap">{display}</p>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-950/90 to-transparent" />
    </section>
  );
}
