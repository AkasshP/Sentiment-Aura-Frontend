// src/components/AuraSketch.tsx
import { useMemo } from "react";
import Sketch from "react-p5";
import type p5Types from "p5";

type Props = {
  sentiment: number | null;
};

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

export default function AuraSketch({ sentiment }: Props) {
  const config = useMemo(() => {
    const s = clamp(sentiment ?? 0.5, 0, 1);

    // Map sentiment → base hue + mood
    // negative → magenta / red, neutral → indigo / blue, positive → teal / lime
    let hue: number;
    if (s < 0.33) {
      hue = 320 + (s / 0.33) * 40; // 320–360
    } else if (s > 0.66) {
      hue = 150 + ((s - 0.66) / 0.34) * 40; // 150–190
    } else {
      hue = 220; // neutral indigo
    }

    const flowSpeed = 0.0015 + s * 0.0045; // positive → faster, more energetic
    const brightness = 35 + s * 25;        // darker when negative, brighter when positive
    const saturation = 65 + s * 20;
    const strokeAlphaBack = 0.10;
    const strokeAlphaFront = 0.22 + s * 0.12;
    const strokeWeightBack = 0.6;
    const strokeWeightFront = 1 + s * 1.1;

    return {
      hue,
      flowSpeed,
      brightness,
      saturation,
      strokeAlphaBack,
      strokeAlphaFront,
      strokeWeightBack,
      strokeWeightFront,
    };
  }, [sentiment]);

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    const canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
    canvas.parent(canvasParentRef);
    p5.pixelDensity(1);
    p5.noiseDetail(3, 0.45);
    p5.colorMode(p5.HSL, 360, 100, 100, 1);

    // initial background
    p5.background(220, 35, 5, 1);

    // keep some state on the p5 instance for smooth transitions
    (p5 as any)._auraState = {
      currentHue: config.hue,
      currentBrightness: config.brightness,
      currentSaturation: config.saturation,
    };
  };

  const draw = (p5: p5Types) => {
    const state = ((p5 as any)._auraState ?? {
      currentHue: config.hue,
      currentBrightness: config.brightness,
      currentSaturation: config.saturation,
    }) as {
      currentHue: number;
      currentBrightness: number;
      currentSaturation: number;
    };

    // Smoothly ease toward new sentiment config
    state.currentHue = p5.lerp(state.currentHue, config.hue, 0.02);
    state.currentBrightness = p5.lerp(
      state.currentBrightness,
      config.brightness,
      0.02
    );
    state.currentSaturation = p5.lerp(
      state.currentSaturation,
      config.saturation,
      0.02
    );

    (p5 as any)._auraState = state;

    const { flowSpeed } = config;

    // fade old trails slightly
    p5.noStroke();
    p5.fill(220, 25, 4, 0.18);
    p5.rect(0, 0, p5.width, p5.height);

    // ---------- Layer 1: soft background “waves” ----------
    const spacingBack = 40;

    p5.strokeWeight(config.strokeWeightBack);
    for (let x = -20; x < p5.width + 20; x += spacingBack) {
      for (let y = -20; y < p5.height + 20; y += spacingBack) {
        const n = p5.noise(
          x * 0.0012,
          y * 0.0012,
          p5.frameCount * flowSpeed * 0.5
        );
        const angle = n * Math.PI * 4;
        const len = 40 * n;

        const x2 = x + Math.cos(angle) * len;
        const y2 = y + Math.sin(angle) * len;

        const h = state.currentHue + (n - 0.5) * 40;
        p5.stroke(h, state.currentSaturation - 10, state.currentBrightness, config.strokeAlphaBack);
        p5.line(x, y, x2, y2);
      }
    }

    // ---------- Layer 2: sharp foreground “glyphs” ----------
    const spacingFront = 18;

    p5.strokeWeight(config.strokeWeightFront);
    for (let x = -10; x < p5.width + 10; x += spacingFront) {
      for (let y = -10; y < p5.height + 10; y += spacingFront) {
        const n = p5.noise(
          x * 0.003,
          y * 0.003,
          1000 + p5.frameCount * flowSpeed
        );
        const angle = n * Math.PI * 6;
        const len = 26 * (0.4 + n);

        const x2 = x + Math.cos(angle) * len;
        const y2 = y + Math.sin(angle) * len;

        const h = state.currentHue + (n - 0.5) * 70;
        p5.stroke(h, state.currentSaturation, state.currentBrightness + 5, config.strokeAlphaFront);
        p5.line(x, y, x2, y2);
      }
    }

    // subtle vignette to keep focus in center
    const gradStrength = 0.18;
    const centerX = p5.width / 2;
    const centerY = p5.height / 2;
    const maxDist = Math.hypot(centerX, centerY);

    p5.noStroke();
    for (let r = 0; r < maxDist; r += 50) {
      const alpha = gradStrength * (r / maxDist);
      p5.fill(220, 40, 3, alpha);
      p5.ellipse(centerX, centerY, r * 2.3, r * 2.3);
    }
  };

  const windowResized = (p5: p5Types) => {
    p5.resizeCanvas(window.innerWidth, window.innerHeight);
  };

  return (
    <div className="aura-root">
      <div className="aura-bg" />
      <Sketch setup={setup} draw={draw} windowResized={windowResized} />
    </div>
  );
}
