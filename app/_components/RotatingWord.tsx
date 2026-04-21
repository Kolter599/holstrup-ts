"use client";

import { useEffect, useState } from "react";

const WORDS = ["tage", "terrasser", "tilbygninger", "sommerhuse", "renoveringer", "entrepriser", "rådgivning"];

export function RotatingWord() {
  const [i, setI] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    // Delay first rotation past LCP measurement window
    const startDelay = setTimeout(() => {
      const id = setInterval(() => {
        setAnimating(true);
        setTimeout(() => {
          setI((v) => (v + 1) % WORDS.length);
          setAnimating(false);
        }, 220);
      }, 2200);
      // Stash on window so cleanup can clear it
      (window as unknown as { __rotIv?: number }).__rotIv = id as unknown as number;
    }, 3500);
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
