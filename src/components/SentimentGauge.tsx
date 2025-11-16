// src/components/SentimentGauge.tsx
import React from "react";

type Props = {
  sentiment: number | null;
};

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

export default function SentimentGauge({ sentiment }: Props) {
  const sRaw = sentiment ?? 0.5;
  const s = clamp(sRaw, 0, 1);

  const label =
    sentiment == null
      ? "Waiting…"
      : s > 0.66
      ? "Positive"
      : s < 0.33
      ? "Negative"
      : "Neutral";

  const percentText =
    sentiment == null ? "—" : `${Math.round(s * 100)}%`;

  const size = 96;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - s);

  const hue = 220 + (s - 0.5) * 140;
  const hue2 = hue + 40;

  return (
    <div className="sentiment-card rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 shadow-lg shadow-black/50 backdrop-blur-xl flex items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="shrink-0"
      >
        <defs>
          <linearGradient
            id="sentimentGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor={`hsl(${hue}, 90%, 65%)`}
            />
            <stop
              offset="100%"
              stopColor={`hsl(${hue2}, 95%, 70%)`}
            />
          </linearGradient>
        </defs>

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(148, 163, 184, 0.4)"
          strokeWidth={strokeWidth}
          fill="none"
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#sentimentGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius - strokeWidth}
          fill="rgba(15, 23, 42, 0.95)"
        />
      </svg>

      <div className="flex flex-col">
        <span className="text-[11px] uppercase tracking-[0.18em] text-slate-300">
          Sentiment
        </span>
        <span className="text-sm font-semibold text-slate-50">
          {label}
        </span>
        <span className="mt-1 text-xs text-slate-300">
          Score:{" "}
          <span className="font-medium text-slate-50">
            {percentText}
          </span>
        </span>
        <span className="mt-1 text-[11px] text-slate-400">
          Live mood ring powered by your speech.
        </span>
      </div>
    </div>
  );
}
