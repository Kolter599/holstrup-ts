"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
};

export function BeforeAfter({ beforeSrc, afterSrc, beforeAlt = "Før", afterAlt = "Efter" }: Props) {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const update = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, x)));
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => {
      e.preventDefault();
      update(e.clientX);
    };
    const onUp = () => setDragging(false);
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragging, update]);

  return (
    <div
      ref={ref}
      onPointerDown={(e) => {
        (e.target as Element).setPointerCapture?.(e.pointerId);
        setDragging(true);
        update(e.clientX);
      }}
      className="relative aspect-[3/2] w-full overflow-hidden bg-[color:var(--color-surface)] select-none touch-none cursor-ew-resize"
      style={{ userSelect: "none" }}
    >
      <Image src={afterSrc} alt={afterAlt} fill className="object-cover pointer-events-none" sizes="(min-width:768px) 60vw, 100vw" />
      <div className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none" style={{ width: `${pos}%` }}>
        <div className="absolute inset-y-0 left-0" style={{ width: `${(100 / Math.max(pos, 0.01)) * 100}%` }}>
          <Image src={beforeSrc} alt={beforeAlt} fill className="object-cover" sizes="(min-width:768px) 60vw, 100vw" />
        </div>
      </div>
      <div className="absolute top-4 left-4 px-2.5 py-1 bg-white/95 text-[color:var(--color-ink)] text-xs font-mono uppercase tracking-wider pointer-events-none">Før</div>
      <div className="absolute top-4 right-4 px-2.5 py-1 bg-[color:var(--color-accent)] text-[color:var(--color-ink)] text-xs font-mono uppercase tracking-wider pointer-events-none">Efter</div>
      <div
        className="absolute top-0 bottom-0 w-px bg-white pointer-events-none"
        style={{ left: `${pos}%`, boxShadow: "0 0 0 1px rgba(0,0,0,0.18)" }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white border-2 border-[color:var(--color-ink)] flex items-center justify-center text-[color:var(--color-ink)] font-bold pointer-events-none shadow-lg"
        style={{ left: `${pos}%` }}
      >
        ⇆
      </div>
    </div>
  );
}
