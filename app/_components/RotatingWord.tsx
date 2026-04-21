"use client";

import { useEffect, useState } from "react";

const WORDS = ["projekter", "rådgivning", "tage", "terrasser", "tilbygninger", "sommerhuse", "renoveringer", "entrepriser"];

export function RotatingWord() {
  const [i, setI] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    // Brief delay so first paint is stable, then start rotation
    const startDelay = setTimeout(() => {
      const id = setInterval(() => {
        setAnimating(true);
        setTimeout(() => {
          setI((v) => (v + 1) % WORDS.length);
          setAnimating(false);
        }, 220);
      }, 1800);
      (window as unknown as { __rotIv?: number }).__rotIv = id as unknown as number;
    }, 1200);
    return () => {
      clearTimeout(startDelay);
      const iv = (window as unknown as { __rotIv?: number }).__rotIv;
      if (iv) clearInterval(iv);
    };
  }, []);

  return (
    <span
      className="inline-block align-baseline"
      style={{
        color: "var(--color-blue)",
        transform: animating ? "translateY(-14px)" : "translateY(0)",
        opacity: animating ? 0 : 1,
        transition: "transform 220ms ease, opacity 220ms ease",
        whiteSpace: "nowrap",
      }}
    >
      {WORDS[i]}
    </span>
  );
}
