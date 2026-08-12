"use client";

import { useEffect, useRef } from "react";

type Trace = {
  x: number;
  y: number;
  previousX: number;
  previousY: number;
  life: number;
  seed: number;
};

type Ripple = {
  x: number;
  y: number;
  radius: number;
  life: number;
};

type Dust = {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  life: number;
  size: number;
};

export function DualityBackground() {
  const artRef = useRef<HTMLDivElement>(null);
  const sunGlowRef = useRef<HTMLDivElement>(null);
  const moonGlowRef = useRef<HTMLDivElement>(null);
  const washRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const art = artRef.current;
    const sunGlow = sunGlowRef.current;
    const moonGlow = moonGlowRef.current;
    const wash = washRef.current;
    if (!canvas || !art || !sunGlow || !moonGlow || !wash) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const traces: Trace[] = [];
    const ripples: Ripple[] = [];
    const dust: Dust[] = [];
    let frame = 0;
    let width = 0;
    let height = 0;
    let lastX = window.innerWidth / 2;
    let lastY = window.innerHeight / 2;
    let lastRippleAt = 0;
    let cycleTravel = 0;
    let nightProgress = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const updateScroll = () => {
      const maximum = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      // Travel keeps increasing through the complete scroll. The final value lands
      // on the start of the next repeated panorama instead of reversing direction.
      const travelValues = [0, 0.18, 0.52, 1, 2];
      const nightValues = [0, 0, 0.44, 1, 0];
      const anchors = ["top", "chapter-0", "chapter-1", "chapter-2", "chapter-3"]
        .map((id, index) => {
          const element = document.getElementById(id);
          const documentTop = element ? element.getBoundingClientRect().top + window.scrollY : 0;
          return element
            ? {
                position: Math.min(documentTop, maximum),
                travel: travelValues[index],
                night: nightValues[index],
              }
            : null;
        })
        .filter(
          (anchor): anchor is { position: number; travel: number; night: number } => anchor !== null,
        );

      cycleTravel = anchors.at(-1)?.travel ?? 0;
      nightProgress = anchors.at(-1)?.night ?? 0;
      for (let index = 0; index < anchors.length - 1; index += 1) {
        const current = anchors[index];
        const next = anchors[index + 1];
        if (window.scrollY > next.position) continue;
        const span = Math.max(1, next.position - current.position);
        const progress = Math.min(1, Math.max(0, (window.scrollY - current.position) / span));
        const eased = progress * progress * (3 - 2 * progress);
        cycleTravel = current.travel + (next.travel - current.travel) * eased;
        nightProgress = current.night + (next.night - current.night) * eased;
        break;
      }

      // Keep the entire vertical span of the original painting visible. The
      // panorama still travels horizontally, so every part of the source art
      // enters the viewport during one complete cycle.
      const artworkHeightScale = 1;
      const artworkWidth = window.innerHeight * artworkHeightScale * (16 / 9);
      const firstPassDistance = Math.max(0, artworkWidth - window.innerWidth);
      const horizontalOffset =
        cycleTravel <= 1
          ? cycleTravel * firstPassDistance
          : firstPassDistance + (cycleTravel - 1) * window.innerWidth;
      art.style.backgroundPosition = `${-horizontalOffset}px center`;
      wash.style.opacity = `${0.04 + Math.sin(nightProgress * Math.PI) * 0.2}`;

      // These restrained glow layers follow the sun and moon already painted
      // into the panorama. Keeping them separate lets the day-night rhythm
      // remain legible without redrawing or covering the original artwork.
      const repeatedPosition = (sourceX: number, size: number) => {
        let position = sourceX - (horizontalOffset % artworkWidth);
        while (position < -size) position += artworkWidth;
        while (position > width + size) position -= artworkWidth;
        return position;
      };
      const sunSize = height * 0.075;
      const moonSize = height * 0.105;
      const sunX = repeatedPosition(artworkWidth * 0.122, sunSize);
      const moonX = repeatedPosition(artworkWidth * 0.918, moonSize);

      sunGlow.style.width = `${sunSize}px`;
      sunGlow.style.height = `${sunSize}px`;
      sunGlow.style.transform = `translate3d(${sunX - sunSize / 2}px, ${height * 0.184 - sunSize / 2}px, 0)`;
      sunGlow.style.opacity = `${Math.max(0, 0.68 - nightProgress * 0.68)}`;
      moonGlow.style.width = `${moonSize}px`;
      moonGlow.style.height = `${moonSize}px`;
      moonGlow.style.transform = `translate3d(${moonX - moonSize / 2}px, ${height * 0.152 - moonSize / 2}px, 0)`;
      moonGlow.style.opacity = `${0.18 + nightProgress * 0.64}`;
    };

    const addPointerTrace = (event: PointerEvent) => {
      const distance = Math.hypot(event.clientX - lastX, event.clientY - lastY);
      if (distance < 2) return;

      traces.push({
        x: event.clientX,
        y: event.clientY,
        previousX: lastX,
        previousY: lastY,
        life: 1,
        seed: Math.random() * Math.PI * 2,
      });

      for (let index = 0; index < Math.min(3, Math.ceil(distance / 12)); index += 1) {
        dust.push({
          x: event.clientX + (Math.random() - 0.5) * 12,
          y: event.clientY + (Math.random() - 0.5) * 12,
          velocityX: (Math.random() - 0.5) * 0.55,
          velocityY: -0.15 - Math.random() * 0.55,
          life: 1,
          size: 0.55 + Math.random() * 1.6,
        });
      }

      const now = performance.now();
      if (now - lastRippleAt > 95) {
        ripples.push({ x: event.clientX, y: event.clientY, radius: 4, life: 1 });
        lastRippleAt = now;
      }

      lastX = event.clientX;
      lastY = event.clientY;

      if (reduceMotion) draw(now);
    };

    const drawMist = (time: number) => {
      const mistColor = nightProgress > 0.55 ? "184, 161, 102" : "100, 125, 120";
      for (let index = 0; index < 5; index += 1) {
        const x = width * ((index * 0.23 + time * 0.000006) % 1.18) - width * 0.09;
        const y = height * (0.18 + index * 0.17) + Math.sin(time * 0.00025 + index) * 22;
        const radius = Math.max(width, height) * (0.12 + index * 0.018);
        const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(${mistColor}, 0.045)`);
        gradient.addColorStop(1, `rgba(${mistColor}, 0)`);
        context.fillStyle = gradient;
        context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      }
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      drawMist(time);

      for (let index = traces.length - 1; index >= 0; index -= 1) {
        const trace = traces[index];
        trace.life -= 0.018;
        if (trace.life <= 0) {
          traces.splice(index, 1);
          continue;
        }

        const curl = Math.sin(trace.seed + (1 - trace.life) * 5) * 8;
        const middleX = (trace.previousX + trace.x) / 2 + curl;
        const middleY = (trace.previousY + trace.y) / 2 - curl * 0.45;
        const nightWeight = Math.min(1, nightProgress * 1.25);
        const alpha = trace.life * trace.life;

        context.save();
        context.lineCap = "round";
        context.lineJoin = "round";
        context.shadowBlur = 18;
        context.shadowColor = `rgba(202, 165, 87, ${alpha * 0.76})`;
        context.strokeStyle = `rgba(205, 169, 92, ${alpha * (0.58 + nightWeight * 0.34)})`;
        context.lineWidth = 1.15 + trace.life * 3.15;
        context.beginPath();
        context.moveTo(trace.previousX, trace.previousY);
        context.quadraticCurveTo(middleX, middleY, trace.x, trace.y);
        context.stroke();

        context.shadowBlur = 9;
        context.shadowColor = "rgba(89, 126, 121, 0.62)";
        context.strokeStyle = `rgba(77, 118, 114, ${alpha * (0.5 - nightWeight * 0.12)})`;
        context.lineWidth = 0.8 + trace.life * 1.4;
        context.translate(0, 2.5);
        context.stroke();
        context.restore();
      }

      for (let index = ripples.length - 1; index >= 0; index -= 1) {
        const ripple = ripples[index];
        ripple.life -= 0.015;
        ripple.radius += 0.72;
        if (ripple.life <= 0) {
          ripples.splice(index, 1);
          continue;
        }
        context.strokeStyle = `rgba(198, 164, 91, ${ripple.life * 0.56})`;
        context.lineWidth = 1;
        context.beginPath();
        context.ellipse(ripple.x, ripple.y, ripple.radius * 1.7, ripple.radius * 0.62, -0.08, 0, Math.PI * 2);
        context.stroke();
      }

      for (let index = dust.length - 1; index >= 0; index -= 1) {
        const particle = dust[index];
        particle.life -= 0.022;
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        if (particle.life <= 0) {
          dust.splice(index, 1);
          continue;
        }
        context.fillStyle = `rgba(205, 169, 92, ${particle.life * 0.9})`;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
        context.fill();
      }

      if (!reduceMotion) frame = window.requestAnimationFrame(draw);
    };

    const handleResize = () => {
      resize();
      updateScroll();
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("pointermove", addPointerTrace, { passive: true });
    frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pointermove", addPointerTrace);
    };
  }, []);

  return (
    <div className="duality-background" aria-hidden="true">
      <div ref={artRef} className="duality-art" />
      <div ref={sunGlowRef} className="duality-celestial duality-sun-glow" />
      <div ref={moonGlowRef} className="duality-celestial duality-moon-glow" />
      <div ref={washRef} className="duality-wash" />
      <div className="duality-paper" />
      <canvas ref={canvasRef} className="duality-effects" />
    </div>
  );
}
