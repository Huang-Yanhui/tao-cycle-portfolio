"use client";

import { useEffect, useRef } from "react";

export const phases = [
  { key: "起", label: "当下", description: "从此刻开始" },
  { key: "承", label: "行旅", description: "让经历沉淀" },
  { key: "转", label: "转折", description: "在变化中生长" },
  { key: "合", label: "余韵", description: "把目光放向远处" },
] as const;

type CycleCanvasProps = {
  activePhase: number;
  onPhaseChange: (phase: number) => void;
};

type Pointer = { x: number; y: number; active: boolean };

export function CycleCanvas({ activePhase, onPhaseChange }: CycleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<Pointer>({ x: 0.5, y: 0.5, active: false });
  const phaseRef = useRef(activePhase);

  useEffect(() => {
    phaseRef.current = activePhase;
  }, [activePhase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      if (reduceMotion) render(0);
    };

    const drawRing = (
      time: number,
      direction: 1 | -1,
      color: string,
      opacity: number,
      offset: number,
    ) => {
      const phase = phaseRef.current;
      const centerX = width / 2;
      const centerY = height / 2;
      const baseRadius = Math.min(width, height) * 0.255;
      const pointer = pointerRef.current;
      const pointerX = (pointer.x - 0.5) * width;
      const pointerY = (pointer.y - 0.5) * height;

      context.beginPath();
      for (let index = 0; index <= 240; index += 1) {
        const angle = (index / 240) * Math.PI * 2;
        const pulse = Math.sin(angle * 3 * direction + time * 0.0007 + offset) * 8;
        const tide = Math.sin(angle * 7 - time * 0.0011 * direction + offset) * 3;
        const phaseShift = Math.sin(angle - phase * (Math.PI / 2)) * 5;
        const influence = pointer.active
          ? Math.max(0, Math.cos(angle - Math.atan2(pointerY, pointerX))) * 13
          : 0;
        const radius = baseRadius + pulse + tide + phaseShift + influence;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius * 0.72;

        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }

      context.strokeStyle = color;
      context.globalAlpha = opacity;
      context.lineWidth = 0.75;
      context.stroke();
      context.globalAlpha = 1;
    };

    const render = (time: number) => {
      context.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.235;
      const phaseAngle = phaseRef.current * (Math.PI / 2);

      const aura = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.65);
      aura.addColorStop(0, "rgba(143, 191, 169, 0.12)");
      aura.addColorStop(0.52, "rgba(49, 92, 89, 0.07)");
      aura.addColorStop(1, "rgba(11, 23, 22, 0)");
      context.fillStyle = aura;
      context.fillRect(0, 0, width, height);

      for (let layer = 0; layer < 7; layer += 1) {
        drawRing(time + layer * 410, layer % 2 === 0 ? 1 : -1, layer % 2 === 0 ? "#b7d6c4" : "#527d78", 0.11 + layer * 0.012, layer * 0.9);
      }

      context.save();
      context.translate(centerX, centerY);
      context.rotate(phaseAngle + time * 0.00008);
      context.beginPath();
      context.arc(0, 0, radius * 0.82, 0, Math.PI);
      context.arc(0, 0, radius * 0.82, Math.PI, Math.PI * 2, true);
      context.fillStyle = "rgba(230, 228, 216, 0.07)";
      context.fill();
      context.restore();

      context.beginPath();
      context.arc(centerX, centerY, radius * 0.22, 0, Math.PI * 2);
      context.fillStyle = "rgba(230, 228, 216, 0.12)";
      context.fill();

      if (!reduceMotion) frame = window.requestAnimationFrame(render);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    frame = window.requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const updatePointer = (clientX: number, clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerRef.current = {
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height,
      active: true,
    };
  };

  const selectByPointer = (clientX: number, clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left - rect.width / 2;
    const y = clientY - rect.top - rect.height / 2;
    const angle = (Math.atan2(y, x) + Math.PI * 2 + Math.PI / 4) % (Math.PI * 2);
    onPhaseChange(Math.floor(angle / (Math.PI / 2)) % phases.length);
  };

  return (
    <div className="cycle-stage">
      <canvas
        ref={canvasRef}
        className="cycle-canvas"
        aria-hidden="true"
        onPointerMove={(event) => updatePointer(event.clientX, event.clientY)}
        onPointerLeave={() => {
          pointerRef.current.active = false;
        }}
        onPointerDown={(event) => selectByPointer(event.clientX, event.clientY)}
      />
      <p className="cycle-hint" aria-hidden="true">
        触碰水纹，改变相位
      </p>
      <nav className="cycle-controls" aria-label="人生篇章">
        {phases.map((phase, index) => (
          <button
            className={index === activePhase ? "cycle-control is-active" : "cycle-control"}
            key={phase.key}
            type="button"
            aria-pressed={index === activePhase}
            onClick={() => onPhaseChange(index)}
          >
            <span>{phase.key}</span>
            <small>{phase.label}</small>
          </button>
        ))}
      </nav>
    </div>
  );
}
