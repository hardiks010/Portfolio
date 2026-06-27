"use client";

import { useEffect } from "react";
import gsap from "gsap";

type NavbarProps = {
  onHomeClick: () => void;
  onProjectsClick: () => void;
  onAboutClick: () => void;
  onSocialsClick: () => void;
  onConnectClick: () => void;
  highlightedItem?: "projects" | "about" | "connect" | null;
};

export default function Navbar({
  onHomeClick,
  onProjectsClick,
  onAboutClick,
  onSocialsClick,
  onConnectClick,
  highlightedItem = null,
}: NavbarProps) {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-nav-item]");
    gsap.to(items, {
      scale: 1,
      filter: "drop-shadow(0 0 0 rgba(255,255,255,0))",
      duration: 0.3,
      ease: "power2.out",
    });

    if (!highlightedItem) return;

    const target = document.querySelector<HTMLElement>(
      `[data-nav-item="${highlightedItem}"]`
    );
    if (!target) return;

    gsap.to(target, {
      scale: 1.05,
      filter: "drop-shadow(0 0 16px rgba(255,255,255,0.95))",
      duration: 0.45,
      ease: "power2.out",
    });
  }, [highlightedItem]);

  return (
    <nav className="absolute top-0 left-0 right-0 z-[70] flex items-center justify-between px-8 py-6">
      {/* Logo */}
      <button
        type="button"
        onClick={onHomeClick}
        className="text-xl font-bold text-white transition-opacity hover:opacity-70"
        aria-label="Go to home"
      >
        hardik.
      </button>

      {/* Navigation */}
      <div className="flex gap-8">
        <button
          data-nav-item="projects"
          onClick={onProjectsClick}
          className={`rounded-full px-3 py-1.5 text-white transition-all duration-300 hover:opacity-70 ${
            highlightedItem === "projects"
              ? "bg-white/15 ring-1 ring-white/35 shadow-[0_0_24px_rgba(255,255,255,0.25)]"
              : ""
          }`}
        >
          Projects
        </button>

        <button
          data-nav-item="about"
          onClick={onAboutClick}
          className={`rounded-full px-3 py-1.5 text-white transition-all duration-300 hover:opacity-70 ${
            highlightedItem === "about"
              ? "bg-white/15 ring-1 ring-white/35 shadow-[0_0_24px_rgba(255,255,255,0.25)]"
              : ""
          }`}
        >
          About Me
        </button>

        <button
          onClick={onSocialsClick}
          className="text-white hover:opacity-70 transition-opacity"
        >
          Socials
        </button>
      </div>

      {/* CTA */}
      <button
        data-nav-item="connect"
        onClick={onConnectClick}
        className={`rounded-full bg-white px-5 py-2 font-medium text-black transition-all hover:scale-105 ${
          highlightedItem === "connect"
            ? "ring-2 ring-white/70 shadow-[0_0_30px_rgba(255,255,255,0.65)]"
            : ""
        }`}
      >
        Let&apos;s Connect
      </button>
    </nav>
  );
}
