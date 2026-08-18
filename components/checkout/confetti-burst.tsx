"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#D8A942", "#F4D37A", "#22C55E", "#3B82F6", "#EF4444", "#FFFFFF"];
const GRAVITY = 0.12;
const DURATION_MS = 3200;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vr: number;
  size: number;
  color: string;
};

function makeParticles(width: number, height: number): Particle[] {
  const count = Math.min(160, Math.round((width * height) / 9000));
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: height * -0.2 - Math.random() * height * 0.3,
    vx: (Math.random() - 0.5) * 6,
    vy: Math.random() * 3 + 2,
    rotation: Math.random() * 360,
    vr: (Math.random() - 0.5) * 12,
    size: Math.random() * 6 + 4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));
}

// A self-contained one-shot confetti burst — no external library, since this
// is the only place in the app that needs it. Skips entirely for
// prefers-reduced-motion.
export function ConfettiBurst() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles = makeParticles(width, height);
    const start = performance.now();
    let frameId: number;

    function frame(now: number) {
      const elapsed = now - start;
      ctx!.clearRect(0, 0, width, height);

      const fadeStart = DURATION_MS * 0.7;
      const alpha = elapsed < fadeStart ? 1 : Math.max(0, 1 - (elapsed - fadeStart) / (DURATION_MS - fadeStart));

      for (const p of particles) {
        p.vy += GRAVITY;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vr;

        ctx!.save();
        ctx!.globalAlpha = alpha;
        ctx!.translate(p.x, p.y);
        ctx!.rotate((p.rotation * Math.PI) / 180);
        ctx!.fillStyle = p.color;
        ctx!.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx!.restore();
      }

      if (elapsed < DURATION_MS) {
        frameId = requestAnimationFrame(frame);
      } else {
        ctx!.clearRect(0, 0, width, height);
      }
    }

    frameId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50"
    />
  );
}
