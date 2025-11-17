// src/components/MicVisualizer.tsx


type Props = {
  recording: boolean;
};

export default function MicVisualizer({ recording }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-8 w-10 items-end justify-between rounded-full bg-slate-900/70 px-1.5 py-1 shadow-inner shadow-black/60 ${
          recording ? "" : "opacity-40"
        }`}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`mic-bar w-1.5 rounded-full bg-emerald-400/80 ${
              recording ? "" : "!scale-y-[0.35]"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-slate-300">
        {recording ? "Listening…" : "Mic idle"}
      </span>
    </div>
  );
}
