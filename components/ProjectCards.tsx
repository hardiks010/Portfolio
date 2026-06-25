"use client";

import { useEffect } from "react";
import gsap from "gsap";

const CARD_POSITIONS = [
  { id: "orb-1", x: -420, y: -40 },
  { id: "orb-2", x: -140, y: -40 },
  { id: "orb-3", x: 140,  y: -40 },
  { id: "orb-4", x: 420,  y: -40 },
];

export default function ProjectCards() {
  useEffect(() => {
    const mascot = document.getElementById("mascot");
    if (!mascot) return;

    const rect = mascot.getBoundingClientRect();

    const cx = rect.left + rect.width / 2;
    const cy = rect.top - 100;

    CARD_POSITIONS.forEach((card, index) => {
    gsap.to(`#${card.id}`, {
  x: cx + card.x,
  y: cy + card.y,

  width: 230,
  height: 300,

  borderRadius: 24,

  backgroundColor: "#ffffff",

  boxShadow: "0 20px 60px rgba(0,0,0,0.35)",

  duration: 0.8,
  ease: "power3.inOut",
  delay: index * 0.08,
});
    });
  }, []);

  return (
    <div
      id="project-cards"
      className="fixed inset-0 pointer-events-none z-40"
    />
  );
}