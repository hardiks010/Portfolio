"use client";

import { useEffect } from "react";
import gsap from "gsap";

const CARD_POSITIONS = [
  { id: "orb-1", x: -420, y: -40 },
  { id: "orb-2", x: -140, y: -40 },
  { id: "orb-3", x: 140, y: -40 },
  { id: "orb-4", x: 420, y: -40 },
];

const PROJECTS = [
  {
    id: "orb-1",
    title: "Kizuna",
    loading: "Loading Kizuna...",
    description: "Domestic workforce platform.",
    tech: "Next.js • Firebase • Tailwind",
    github: "https://github.com/Deyad11/kizuna",
    live: "https://drive.google.com/file/d/1YpQHrLm8vJi0o3nilEP3GcynQuOcUMwT/view",
  },
  {
    id: "orb-2",
    title: "CIVIQ",
    loading: "Deploying Smart Contract...",
    description: "Re-imagined civic issue reporting platform.",
    tech: "React • Solidity • Hardhat",
    github: "https://github.com/nxtnilesh/civiQ",
    live: "https://civiq-client.vercel.app",
  },
  {
    id: "orb-3",
    title: "Graphic Design",
    loading: "Initializing Session...",
    description: "Created branding, editorial, and marketing assets.",
    tech: "Graphic design • Editorials • Magazines",
    live: "https://www.fiverr.com/users/kyubiworks/portfolio/#",
  },
  {
    id: "orb-4",
    title: "EY Internship",
    loading: "Rendering Experience...",
    description: "Interned at EY as a cloud integration intern in SAP CPI.",
    tech: "SAP CPI • Groovy Script • XML",
  },
];

type ProjectCardsProps = {
  closing: boolean;
  onCloseFinished: () => void;
};

export default function ProjectCards({
  closing,
  onCloseFinished,
}: ProjectCardsProps) {
  useEffect(() => {
    const mascot = document.getElementById("mascot");
    if (!mascot) return;

    const rect = mascot.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top - 100;
    const cleanups: Array<() => void> = [];

    CARD_POSITIONS.forEach((card, index) => {
      const orb = document.getElementById(card.id);
      const overlay = document.getElementById(`${card.id}-overlay`);
      const loading = document.getElementById(`${card.id}-loading`);
      const content = document.getElementById(`${card.id}-content`);

      if (!orb || !overlay || !loading || !content) return;

      gsap.set(overlay, {
        left: cx + card.x,
        top: cy + card.y,
        width: 240,
        height: 280,
      });

      gsap.to(orb, {
        x: cx + card.x,
        y: cy + card.y,
        width: 250,
        height: 340,
        borderRadius: 24,
        backgroundColor: "#ffffff",
        boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        duration: 0.8,
        ease: "power3.inOut",
        delay: index * 0.08,
      });

      const timeline = gsap.timeline({ delay: 0.55 + index * 0.08 });
      timeline
        .to(overlay, { opacity: 1, duration: 0.25, ease: "power2.out" })
        .to(loading, { opacity: 0, duration: 0.3 }, "+=0.8")
        .fromTo(
          content,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
          "<"
        );

      const handleMouseEnter = () => {
        gsap.to(orb, {
          y: cy + card.y - 12,
          scale: 1.03,
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto",
        });
        gsap.to(overlay, {
          y: -12,
          scale: 1.03,
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto",
        });
      };
      const handleMouseLeave = () => {
        gsap.to(orb, {
          y: cy + card.y,
          scale: 1,
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto",
        });
        gsap.to(overlay, {
          y: 0,
          scale: 1,
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      overlay.addEventListener("mouseenter", handleMouseEnter);
      overlay.addEventListener("mouseleave", handleMouseLeave);
      cleanups.push(() => {
        overlay.removeEventListener("mouseenter", handleMouseEnter);
        overlay.removeEventListener("mouseleave", handleMouseLeave);
        timeline.kill();
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  useEffect(() => {
    if (!closing) return;

    const overlays = PROJECTS.map((project) =>
      document.getElementById(`${project.id}-overlay`)
    ).filter((element): element is HTMLElement => element !== null);

    gsap.to(overlays, {
      opacity: 0,
      scale: 0.9,
      duration: 0.35,
      stagger: 0.04,
      ease: "power2.in",
      overwrite: true,
      onComplete: onCloseFinished,
    });
  }, [closing, onCloseFinished]);

  return (
    <div
      id="project-cards"
      className="pointer-events-none fixed inset-0 z-50"
    >
      {PROJECTS.map((project) => (
        <div
          key={project.id}
          id={`${project.id}-overlay`}
          className="pointer-events-auto absolute cursor-pointer overflow-hidden rounded-3xl opacity-0"
          style={{
            transform: "translate(-50%, -50%)",
            boxShadow:
              "0 0 40px rgba(255,255,255,0.04), inset 0 1px rgba(255,255,255,0.06)",
          }}
        >
          <div
            id={`${project.id}-loading`}
            className="absolute inset-0 flex items-center justify-center text-sm font-medium text-black"
          >
            {project.loading}
          </div>

          <div
            id={`${project.id}-content`}
            className="absolute inset-0 flex flex-col justify-between p-6 text-black opacity-0"
          >
            <h3 className="text-2xl font-bold">{project.title}</h3>

            <p className="mt-3 text-sm leading-relaxed text-neutral-700">
              {project.description}
            </p>

            <p className="mt-5 text-xs uppercase tracking-widest text-neutral-500">
              {project.tech}
            </p>

            <div className="mt-auto flex gap-3">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-black px-4 py-1.5 text-sm text-white transition hover:scale-105"
                >
                  GitHub
                </a>
              )}

              {project.live ? (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-black px-4 py-1.5 text-sm transition hover:bg-black hover:text-white"
                >
                  Live Demo
                </a>
              ) : (
                <span className="cursor-not-allowed rounded-full border border-neutral-300 px-4 py-1.5 text-sm text-neutral-400">
                  Coming Soon
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
