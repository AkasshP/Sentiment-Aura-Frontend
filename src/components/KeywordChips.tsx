// src/components/KeywordChips.tsx


type Props = {
  keywords: string[];
};

export default function KeywordChips({ keywords }: Props) {
  if (!keywords.length) return null;

  return (
    <section className="mt-4 panel-elevate">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
        Key Topics
      </h2>
      <div className="flex flex-wrap gap-2">
        {keywords.map((k, i) => (
          <span
            key={`${k}-${i}`}
            className="keyword-chip rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-100 backdrop-blur shadow-[0_0_18px_rgba(16,185,129,0.25)]"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            {k}
          </span>
        ))}
      </div>
    </section>
  );
}
