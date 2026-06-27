"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export type TraitId =
  | "computer-science"
  | "builder"
  | "problem-solver"
  | "ai"
  | "product-design"
  | "startups";

const TRAITS: Array<{
  id: TraitId;
  label: string;
  description: string;
}> = [
  {
    id: "computer-science",
    label: "Computer Science",
    description: "The technical foundation behind the experiments.",
  },
  {
    id: "builder",
    label: "Builder",
    description: "Turns ideas into products.",
  },
  {
    id: "problem-solver",
    label: "Problem Solver",
    description: "Enjoys finding a way through difficult problems.",
  },
  {
    id: "ai",
    label: "AI",
    description: "Exploring AI-powered products and experiences.",
  },
  {
    id: "product-design",
    label: "Product Design",
    description: "Believes software should feel as good as it functions.",
  },
  {
    id: "startups",
    label: "Startups",
    description: "Drawn to ambitious ideas and fast-moving teams.",
  },
];

function TraitPill({
  label,
  description,
}: {
  label: string;
  description: string;
}) {
  const pillRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!pillRef.current) return;

    const animation = gsap.fromTo(
      pillRef.current,
      { autoAlpha: 0, scale: 0.8, y: 12 },
      {
        autoAlpha: 1,
        scale: 1,
        y: 0,
        duration: 0.48,
        ease: "back.out(1.7)",
      }
    );

    return () => {
      animation.kill();
    };
  }, []);

  return (
    <li
      ref={pillRef}
      className="group relative z-0 w-fit opacity-0 hover:z-50"
    >
      <span className="block rounded-full border border-white/45 bg-black/70 px-4 py-2 text-sm font-medium tracking-wide text-white backdrop-blur-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-white/75 group-hover:bg-zinc-950">
        {label}
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute right-0 top-[calc(100%+8px)] z-[60] w-56 rounded-xl border border-white/10 bg-zinc-950/95 px-3 py-2 text-xs leading-relaxed text-zinc-300 opacity-0 shadow-2xl transition-opacity duration-200 group-hover:opacity-100"
      >
        {description}
      </span>
    </li>
  );
}

export default function AboutTraits({
  revealedTraits,
}: {
  revealedTraits: TraitId[];
}) {
  const visibleTraits = TRAITS.filter((trait) =>
    revealedTraits.includes(trait.id)
  );

  return (
    <aside
      className="pointer-events-auto absolute right-[6vw] top-1/2 z-40 w-60 -translate-y-1/2 max-lg:left-1/2 max-lg:right-auto max-lg:top-[38%] max-lg:w-[90vw] max-lg:-translate-x-1/2 max-lg:translate-y-0"
      aria-label="Collected traits"
    >
      <ul className="flex min-h-12 flex-col items-end gap-3 max-lg:flex-row max-lg:flex-wrap max-lg:items-center max-lg:justify-center max-lg:gap-2">
        {visibleTraits.map((trait) => (
          <TraitPill
            key={trait.id}
            label={trait.label}
            description={trait.description}
          />
        ))}
      </ul>
    </aside>
  );
}
