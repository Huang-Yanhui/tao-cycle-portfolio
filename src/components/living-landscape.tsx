"use client";

import { useEffect, useRef } from "react";
import { measureCycle, sampleCycle } from "@/lib/landscape-cycle";

type Wake = { x: number; y: number; age: number; seed: number };
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function LivingLandscape({ paused }: { paused: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
    window.dispatchEvent(new Event("landscape-refresh"));
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctx) return;
    const painting = new Image();
    const pine = new Image();
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let w = innerWidth, h = innerHeight, frame = 0, previous = 0, elapsed = 0;
    let anchors = measureCycle();
    let pointer = { x: w * .5, y: h * .5, tx: w * .5, ty: h * .5 };
    let lastWake = 0;
    let disposed = false;
    const wakes: Wake[] = [];
    const stars = Array.from({ length: 75 }, (_, i) => ({ x: ((i * 73.137) % 101) / 101, y: ((i * 31.913) % 53) / 100, r: .5 + (i % 3) * .4, seed: i * 1.76 }));

    function mist(x: number, y: number, radius: number, alpha: number, night: number) {
      const gradient = ctx!.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(${night > .6 ? "164,181,167" : "250,246,231"},${alpha})`);
      gradient.addColorStop(1, "rgba(240,237,219,0)");
      ctx!.fillStyle = gradient;
      ctx!.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }

    function render(now: number) {
      if (disposed) return;
      const dt = previous ? Math.min(40, now - previous) : 16;
      previous = now;
      const animated = !pausedRef.current && !motion.matches;
      if (animated) elapsed += dt;
      const t = elapsed / 1000;
      const { travel, night } = sampleCycle(scrollY, anchors);
      const parallax = animated ? 1 : 0;
      pointer.x += (pointer.tx - pointer.x) * .07;
      pointer.y += (pointer.ty - pointer.y) * .07;
      const px = (pointer.x / w - .5) * parallax;
      const py = (pointer.y / h - .5) * parallax;
      const artW = Math.max(w, h * (1672 / 941));
      const pan = travel * artW;
      ctx!.fillStyle = "#f4eedf";
      ctx!.fillRect(0, 0, w, h);

      if (painting.complete && painting.naturalWidth) {
        const start = -((pan + px * 9) % artW);
        for (let i = -1; i <= 2; i++) {
          const x = start + i * artW;
          if (x > w || x + artW < 0) continue;
          ctx!.drawImage(painting, x, -3 + py * 3, artW, h + 6);
          // Mist conceals the panorama join without changing travel direction.
          mist(x, h * .5, h * .32, .78, 0);
        }
      }

      // Water highlights follow the river's painted course, inside a narrow mask.
      ctx!.save();
      const riverStart = -(pan % artW);
      for (let repeat = -1; repeat <= 2; repeat++) {
        ctx!.save();
        ctx!.translate(riverStart + repeat * artW, 0);
        ctx!.beginPath();
        ctx!.moveTo(artW * .60, h * .54);
        ctx!.bezierCurveTo(artW * .33, h * .61, artW * .90, h * .65, artW * .52, h * .75);
        ctx!.bezierCurveTo(artW * .30, h * .84, artW * .98, h * .87, artW * .57, h * 1.04);
        ctx!.lineTo(artW * .79, h * 1.04);
        ctx!.bezierCurveTo(artW * 1.04, h * .86, artW * .43, h * .81, artW * .60, h * .77);
        ctx!.bezierCurveTo(artW * .96, h * .64, artW * .40, h * .60, artW * .62, h * .54);
        ctx!.closePath();
        ctx!.clip();
        for (let j = 0; j < 36; j++) {
          const y = h * (.55 + ((j / 36 + t * .012) % .49));
          const alpha = .10 + Math.sin(t * .9 + j * 1.3) * .07;
          ctx!.strokeStyle = `rgba(205,166,89,${alpha})`;
          ctx!.lineWidth = .5 + (y / h) * 1.2;
          ctx!.beginPath();
          ctx!.moveTo(artW * .32, y);
          ctx!.bezierCurveTo(artW * .55, y - 7, artW * .66, y + 6, artW, y);
          ctx!.stroke();
        }
        ctx!.restore();
      }
      ctx!.restore();

      for (let i = 0; i < 5; i++) {
        const x = ((i * .27 + t * .009) % 1.5 - .25) * w;
        mist(x + px * 20, h * (.49 + i * .08) + Math.sin(t * .18 + i) * 13, w * .22 + 70, .22, 0);
      }

      if (pine.complete && pine.naturalWidth) {
        const pineWidth = Math.max(w * .79, h * .95);
        const pineHeight = pineWidth * 941 / 1672;
        const shift = Math.sin(travel * Math.PI * 2) * w * .14;
        ctx!.globalAlpha = .84;
        ctx!.drawImage(pine, -pineWidth * .04 - shift + px * 28, h - pineHeight + 20 + py * 12, pineWidth, pineHeight);
        ctx!.globalAlpha = 1;
      }

      // Grade the actual painting, preserving gold detail as the sky darkens.
      if (night > .001) {
        ctx!.save();
        ctx!.globalCompositeOperation = "multiply";
        ctx!.fillStyle = `rgba(29,45,47,${night * .88})`;
        ctx!.fillRect(0, 0, w, h);
        ctx!.restore();
      }

      const celestialX = w * .79 + Math.sin(travel * Math.PI * 2) * w * .06;
      const celestialY = h * .20;
      const radius = Math.min(w, h) * .038;
      if (night < .95) {
        const glow = ctx!.createRadialGradient(celestialX, celestialY, radius * .4, celestialX, celestialY, radius * 3.6);
        glow.addColorStop(0, `rgba(218,176,89,${.26 * (1 - night)})`);
        glow.addColorStop(1, "rgba(218,176,89,0)");
        ctx!.fillStyle = glow; ctx!.fillRect(celestialX - radius * 4, celestialY - radius * 4, radius * 8, radius * 8);
        ctx!.fillStyle = `rgba(197,153,64,${.62 * (1 - night)})`;
        ctx!.beginPath(); ctx!.arc(celestialX, celestialY, radius, 0, Math.PI * 2); ctx!.fill();
      }
      if (night > .05) {
        ctx!.save();
        ctx!.globalAlpha = night;
        ctx!.shadowBlur = 22; ctx!.shadowColor = "#c4b482";
        ctx!.fillStyle = "#e5d6a8";
        ctx!.beginPath(); ctx!.arc(celestialX, celestialY, radius, .5 * Math.PI, 1.5 * Math.PI);
        ctx!.bezierCurveTo(celestialX - radius * .1, celestialY - radius * .6, celestialX - radius * .1, celestialY + radius * .6, celestialX, celestialY + radius);
        ctx!.fill(); ctx!.restore();
        for (const star of stars) {
          ctx!.fillStyle = `rgba(232,214,161,${night * (.26 + .28 * (1 + Math.sin(t * .6 + star.seed)) / 2)})`;
          ctx!.beginPath(); ctx!.arc(star.x * w, star.y * h, star.r, 0, Math.PI * 2); ctx!.fill();
        }
      }

      // Cursor wakes are bounded, time-based, and fade rather than accumulate.
      if (animated) {
        for (let i = wakes.length - 1; i >= 0; i--) {
          const wake = wakes[i];
          wake.age += dt / 1000;
          if (wake.age > 1.8) { wakes.splice(i, 1); continue; }
          const life = 1 - wake.age / 1.8;
          const r = 8 + wake.age * 28;
          ctx!.strokeStyle = `rgba(${night > .5 ? "225,198,128" : "120,129,105"},${life * .55})`;
          ctx!.lineWidth = .8;
          ctx!.beginPath(); ctx!.ellipse(wake.x, wake.y, r * 1.6, r * .42, -.1, 0, Math.PI * 2); ctx!.stroke();
          ctx!.fillStyle = `rgba(213,172,84,${life * .8})`;
          ctx!.beginPath(); ctx!.arc(wake.x + Math.sin(wake.seed + wake.age) * 13, wake.y - wake.age * 20, 1.5 * life, 0, Math.PI * 2); ctx!.fill();
          mist(wake.x + wake.age * 7, wake.y, 40 + wake.age * 25, life * .06, night);
        }
      }
      canvas!.dataset.night = night.toFixed(3);
      canvas!.dataset.travel = travel.toFixed(3);
      frame = animated && !document.hidden ? requestAnimationFrame(render) : 0;
    }

    function refresh() {
      if (!frame && !disposed) { previous = 0; frame = requestAnimationFrame(render); }
    }
    function resize() {
      w = innerWidth; h = innerHeight;
      const ratio = Math.min(devicePixelRatio || 1, w < 760 ? 1.25 : 1.75);
      canvas!.width = Math.floor(w * ratio); canvas!.height = Math.floor(h * ratio);
      ctx!.setTransform(ratio, 0, 0, ratio, 0, 0);
      anchors = measureCycle(); refresh();
    }
    function onPointer(event: PointerEvent) {
      pointer = { ...pointer, tx: event.clientX, ty: event.clientY };
      if (pausedRef.current || motion.matches || (event.target as HTMLElement)?.closest("button,a,.reading-surface,.preview-dock")) return;
      const now = performance.now();
      if (now - lastWake > 55) {
        wakes.push({ x: event.clientX, y: event.clientY, age: 0, seed: now });
        if (wakes.length > 40) wakes.shift();
        lastWake = now;
      }
    }
    function onVisibility() { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else refresh(); }
    painting.onload = refresh; pine.onload = refresh;
    painting.src = `${basePath}/images/landscape-v2-day.webp`;
    pine.src = `${basePath}/images/landscape-v2-pine.webp`;
    resize();
    const observer = new ResizeObserver(() => { anchors = measureCycle(); refresh(); });
    observer.observe(document.body);
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", refresh, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("landscape-refresh", refresh);
    document.addEventListener("visibilitychange", onVisibility);
    motion.addEventListener("change", refresh);
    return () => {
      disposed = true; cancelAnimationFrame(frame); observer.disconnect();
      painting.onload = null; pine.onload = null;
      window.removeEventListener("resize", resize); window.removeEventListener("scroll", refresh);
      window.removeEventListener("pointermove", onPointer); window.removeEventListener("landscape-refresh", refresh);
      document.removeEventListener("visibilitychange", onVisibility); motion.removeEventListener("change", refresh);
    };
  }, []);

  return <div className="living-landscape" aria-hidden="true" style={{ backgroundImage: `url("${basePath}/images/landscape-v2-day.webp")` }}><canvas ref={canvasRef} /></div>;
}
