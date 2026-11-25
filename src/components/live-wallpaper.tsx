import { useEffect, useRef } from "react";

/**
 * Animated 3D monochrome wallpaper: a rotating point-sphere over a
 * perspective grid floor, drawn on a fixed canvas behind all content.
 */
export function LiveWallpaper() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fg = getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim() || "white";
    const color = (a: number) => `color-mix(in oklab, ${fg} ${Math.round(a * 100)}%, transparent)`;

    let w = 0, h = 0, raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const N = 900;
    const pts = Array.from({ length: N }, (_, i) => {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = i * Math.PI * (3 - Math.sqrt(5));
      return [Math.cos(t) * r, y, Math.sin(t) * r] as const;
    });
    let mx = 0, my = 0;
    const onMove = (e: PointerEvent) => { mx = e.clientX / w - 0.5; my = e.clientY / h - 0.5; };
    window.addEventListener("pointermove", onMove);

    const draw = (time: number) => {
      const t = reduce ? 0 : time * 0.00015;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h * 0.42, R = Math.min(w, h) * 0.34, fov = 3;

      // perspective grid floor
      const horizon = h * 0.62, off = (t * 400) % 1;
      for (let i = 0; i < 24; i++) {
        const z = (i + 1 - off) / 24;
        const y = horizon + (h - horizon) * z * z;
        ctx.strokeStyle = color(0.12 * z);
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
      for (let i = -20; i <= 20; i++) {
        ctx.strokeStyle = color(0.07);
        ctx.beginPath(); ctx.moveTo(cx + i * 6, horizon); ctx.lineTo(cx + i * w * 0.12, h); ctx.stroke();
      }

      // rotating sphere
      const ay = t * 6 + mx * 0.8, ax = 0.35 + my * 0.5;
      const cyA = Math.cos(ay), syA = Math.sin(ay), cxA = Math.cos(ax), sxA = Math.sin(ax);
      for (const [x0, y0, z0] of pts) {
        const x1 = x0 * cyA - z0 * syA, z1 = x0 * syA + z0 * cyA;
        const y2 = y0 * cxA - z1 * sxA, z2 = y0 * sxA + z1 * cxA;
        const s = fov / (fov + z2);
        const a = (1 - z2) / 2;
        ctx.fillStyle = color(0.15 + a * 0.75);
        ctx.fillRect(cx + x1 * R * s, cy + y2 * R * s, 1.6 * s, 1.6 * s);
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-background">
      <canvas ref={ref} className="h-full w-full" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--background)_85%)]" />
    </div>
  );
}
