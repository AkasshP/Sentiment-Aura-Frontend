// src/components/AuraCanvas.tsx
import React, { useMemo } from "react";

type Props = {
  sentiment: number | null;
};

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

export default function AuraCanvas({ sentiment }: Props) {
  const style = useMemo(() => {
    const s = clamp(sentiment ?? 0.5, 0, 1);
    // 0 → blue / calm, 1 → warm / energetic
    const hue = 220 + (s - 0.5) * 140; // 220 → ~360/80
    const speedSeconds = 28 - s * 10; // happier = faster motion

    return {
      ["--aura-hue" as string]: hue.toString(),
      ["--aura-speed" as string]: `${speedSeconds}s`,
    } as React.CSSProperties;
  }, [sentiment]);

  return (
    <div className="aura-bg" aria-hidden="true" style={style}>
      <div
        className="aura-orb"
        style={{
          top: "-15%",
          left: "-10%",
          width: "460px",
          height: "460px",
        }}
      />
      <div
        className="aura-orb aura-orb--secondary"
        style={{
          bottom: "-14%",
          right: "-8%",
          width: "520px",
          height: "520px",
        }}
      />
      <div
        className="aura-orb aura-orb--accent"
        style={{
          top: "32%",
          left: "40%",
          width: "420px",
          height: "420px",
        }}
      />
    </div>
  );
}
