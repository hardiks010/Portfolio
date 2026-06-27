"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

const EMAIL = "hardiksati@gmail.com";
const LINKEDIN_URL = "https://in.linkedin.com/in/hardik-sati";
const RESUME_URL = "/resume.pdf";

type LookDirection = "left" | "right" | "center" | "up";

type ConnectSectionProps = {
  onSpeakingChange: (speaking: boolean) => void;
  onLookChange: (direction: LookDirection) => void;
};

type ContactCardProps = {
  className: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  onHover: () => void;
  onLeave: () => void;
};

function ContactCard({
  className,
  eyebrow,
  title,
  children,
  onHover,
  onLeave,
}: ContactCardProps) {
  return (
    <article
      className={`${className} contact-card flex min-h-52 w-64 flex-col rounded-[28px] bg-white p-6 text-black shadow-[0_24px_70px_rgba(0,0,0,0.35)]`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
        {eyebrow}
      </p>
      <h2 className="mt-3 break-words text-xl font-semibold leading-snug">
        {title}
      </h2>
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
        {children}
      </div>
    </article>
  );
}

export default function ConnectSection({
  onSpeakingChange,
  onLookChange,
}: ConnectSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const dialogueRef = useRef<HTMLParagraphElement>(null);
  const [copied, setCopied] = useState(false);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const dialogue = dialogueRef.current;
    if (!section || !dialogue) return;

    const cards = section.querySelectorAll<HTMLElement>(".contact-card");
    const timeline = gsap.timeline();
    const say = (text: string, hold = 0.8) => {
      timeline
        .call(() => {
          dialogue.textContent = text;
          onSpeakingChange(true);
        })
        .fromTo(
          dialogue,
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.38,
            ease: "power2.out",
          }
        )
        .to({}, { duration: hold })
        .call(() => onSpeakingChange(false))
        .to(dialogue, {
          autoAlpha: 0,
          y: -8,
          duration: 0.25,
          ease: "power2.in",
        });
    };

    onLookChange("center");
    timeline.to({}, { duration: 0.65 });
    say("Finally.");
    timeline.to({}, { duration: 0.4 });
    say("Someone wants to talk.");
    timeline.to({}, { duration: 0.4 });
    say("I'll make this easy.", 0.65);
    timeline.call(() => onSpeakingChange(false));
    timeline.fromTo(
      cards,
      { autoAlpha: 0, y: 190, rotation: 0 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.95,
        stagger: 0.14,
        ease: "power3.out",
      }
    );
    timeline.to(cards, {
      y: -6,
      duration: 2.2,
      stagger: 0.18,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    cards.forEach((card) => {
      const enter = () => {
        gsap.to(card, {
          y: -12,
          scale: 1.025,
          boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
          duration: 0.28,
          ease: "power2.out",
          overwrite: "auto",
        });
      };
      const leave = () => {
        gsap.to(card, {
          y: -6,
          scale: 1,
          boxShadow: "0 24px 70px rgba(0,0,0,0.35)",
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      card.addEventListener("mouseenter", enter);
      card.addEventListener("mouseleave", leave);
    });

    return () => {
      timeline.kill();
      gsap.killTweensOf(cards);
      onSpeakingChange(false);
      onLookChange("center");
    };
  }, [onLookChange, onSpeakingChange]);

  return (
    <section
      ref={sectionRef}
      className="fixed inset-0 z-20"
      aria-label="Connect with Hardik"
    >
      <p
        ref={dialogueRef}
        className="pointer-events-none absolute left-1/2 top-[15%] w-[90vw] -translate-x-1/2 text-center text-3xl font-medium text-white opacity-0 md:text-5xl"
        aria-live="polite"
      />

      <div className="absolute left-1/2 top-[18%] flex -translate-x-1/2 items-end gap-5 max-md:top-[14%] max-md:scale-[0.72] max-md:gap-3">
        <ContactCard
          className="-rotate-2"
          eyebrow="Email"
          title={EMAIL}
          onHover={() => onLookChange("left")}
          onLeave={() => onLookChange("center")}
        >
          <button
            type="button"
            onClick={copyEmail}
            className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-105"
          >
            {copied ? "Copied" : "Copy email"}
          </button>
          <a
            href={`mailto:${EMAIL}`}
            className="rounded-full border border-zinc-300 px-3 py-2 text-sm transition-colors hover:border-black"
          >
            Open mail
          </a>
        </ContactCard>

        <ContactCard
          className=""
          eyebrow="LinkedIn"
          title="Let's connect."
          onHover={() => onLookChange("center")}
          onLeave={() => onLookChange("center")}
        >
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-105"
          >
            View profile
          </a>
        </ContactCard>

        <ContactCard
          className="rotate-2"
          eyebrow="Resume"
          title="View Resume"
          onHover={() => onLookChange("right")}
          onLeave={() => onLookChange("center")}
        >
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-105"
          >
            Open PDF
          </a>
        </ContactCard>
      </div>
    </section>
  );
}
