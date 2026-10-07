"use client";

import { useReducedMotion } from "framer-motion";
import { useState, type CSSProperties } from "react";

const PIECES = ["🍪", "✨", "💗", "🍓", "🤎", "✨"];
const COLORS = ["#F4B8C5", "#E58CA2", "#D9A066", "#2FB5AA", "#B83F63"];

type Piece = { left: number; delay: number; duration: number; dx: number; rot: number; emoji: string | null; color: string; size: number };

function makePieces(): Piece[] {
  return Array.from({ length: 34 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.9,
    duration: 2.6 + Math.random() * 2,
    dx: (Math.random() - 0.5) * 160,
    rot: 240 + Math.random() * 600,
    emoji: i % 3 === 0 ? PIECES[i % PIECES.length] : null,
    color: COLORS[i % COLORS.length],
    size: 8 + Math.random() * 8,
  }));
}

/** A gentle shower of cookies and sparkles. Skipped for reduced-motion users. */
export function Confetti() {
  const reduce = useReducedMotion();
  const [pieces] = useState(makePieces);
  if (reduce) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[65] overflow-hidden">
      {pieces.map((piece, index) => (
        <span
          key={index}
          className="absolute top-0 block"
          style={
            {
              left: `${piece.left}%`,
              fontSize: piece.size + 8,
              width: piece.emoji ? undefined : piece.size,
              height: piece.emoji ? undefined : piece.size * 0.45,
              borderRadius: 999,
              background: piece.emoji ? undefined : piece.color,
              animation: `confetti-fall ${piece.duration}s ${piece.delay}s ease-in forwards`,
              opacity: 0,
              "--dx": `${piece.dx}px`,
              "--rot": `${piece.rot}deg`,
            } as CSSProperties
          }
        >
          {piece.emoji}
        </span>
      ))}
    </div>
  );
}
