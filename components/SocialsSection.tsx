"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SOCIALS, type Social } from "@/data/socials";

type LookDirection = "left" | "right" | "center" | "up";

type SocialsSectionProps = {
  onSpeakingChange: (speaking: boolean) => void;
  onLookChange: (direction: LookDirection) => void;
};

const lookForSocial = (social: Social): LookDirection => {
  if (social.position.x < 0) return "left";
  if (social.position.x > 0) return "right";
  return "up";
};

export default function SocialsSection({
  onSpeakingChange,
  onLookChange,
}: SocialsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const dialogueRef = useRef<HTMLParagraphElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const dialogue = dialogueRef.current;
    const pulse = pulseRef.current;
    if (!section || !dialogue || !pulse) return;

    const orbs = Array.from(
      section.querySelectorAll<HTMLElement>(".social-orb")
    );
    const floatTweens = new Map<HTMLElement, gsap.core.Tween>();
    const timeline = gsap.timeline();

    const say = (text: string, hold = 0.65) => {
      timeline
        .call(() => {
          dialogue.textContent = text;
          onSpeakingChange(true);
        })
        .fromTo(
          dialogue,
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" }
        )
        .to({}, { duration: hold })
        .call(() => onSpeakingChange(false))
        .to(dialogue, {
          autoAlpha: 0,
          y: -8,
          duration: 0.22,
          ease: "power2.in",
        });
    };

    onLookChange("up");
    timeline
      .to({}, { duration: 0.55 })
      .fromTo(
        pulse,
        { autoAlpha: 0, scale: 0.65 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.7,
          ease: "power2.out",
        }
      );
    say("Searching...");
    timeline.to({}, { duration: 0.35 });
    say("Searching...");
    timeline.to({}, { duration: 0.35 });
    say("Signal found.");
    timeline.to(pulse, {
      autoAlpha: 0,
      scale: 1.8,
      duration: 0.55,
      ease: "power2.out",
    });
    say("He's... probably online somewhere.");
    say("Choose where you'd like to find him.", 0.85);
    timeline.call(() => {
      onSpeakingChange(false);
      onLookChange("center");
    });
    timeline.fromTo(
      orbs,
      { autoAlpha: 0, scale: 0.75 },
      {
        autoAlpha: 1,
        scale: 1,
        duration: 0.75,
        stagger: 0.16,
        ease: "back.out(1.5)",
      }
    );
    timeline.call(() => {
      orbs.forEach((orb, index) => {
        const tween = gsap.to(orb, {
          y: index % 2 === 0 ? -10 : 10,
          x: index === 1 ? 7 : -5,
          duration: 2.8 + index * 0.35,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        floatTweens.set(orb, tween);
      });
    });

    const cleanups = orbs.map((orb) => {
      const label = orb.querySelector<HTMLElement>(".social-label");
      const content = orb.querySelector<HTMLElement>(".social-content");
      const social = SOCIALS.find((item) => item.id === orb.dataset.social);

      const handleEnter = () => {
        floatTweens.get(orb)?.pause();
        onLookChange(social ? lookForSocial(social) : "center");

        orbs.forEach((item) => {
          if (item !== orb) {
            gsap.to(item, { opacity: 0.42, duration: 0.3 });
          }
        });
        gsap.to(orb, {
          width: 236,
          height: 156,
          borderRadius: 26,
          scale: 1.025,
          backgroundColor: "#f4f4f5",
          boxShadow: "0 22px 70px rgba(255,255,255,0.16)",
          duration: 0.42,
          ease: "power3.out",
          overwrite: "auto",
        });
        gsap.to(label, { autoAlpha: 0, duration: 0.16 });
        gsap.to(content, {
          autoAlpha: 1,
          y: 0,
          duration: 0.28,
          delay: 0.12,
        });
      };

      const handleLeave = () => {
        onLookChange("center");
        orbs.forEach((item) => {
          gsap.to(item, { opacity: 1, duration: 0.3 });
        });
        gsap.to(content, { autoAlpha: 0, y: 8, duration: 0.16 });
        gsap.to(orb, {
          width: 82,
          height: 82,
          borderRadius: 999,
          scale: 1,
          backgroundColor: "#ffffff",
          boxShadow: "0 0 28px 8px rgba(255,255,255,0.16)",
          duration: 0.4,
          ease: "power3.inOut",
          overwrite: "auto",
          onComplete: () => floatTweens.get(orb)?.resume(),
        });
        gsap.to(label, { autoAlpha: 1, duration: 0.2, delay: 0.17 });
      };

      orb.addEventListener("mouseenter", handleEnter);
      orb.addEventListener("mouseleave", handleLeave);

      return () => {
        orb.removeEventListener("mouseenter", handleEnter);
        orb.removeEventListener("mouseleave", handleLeave);
      };
    });

    return () => {
      timeline.kill();
      floatTweens.forEach((tween) => tween.kill());
      cleanups.forEach((cleanup) => cleanup());
      gsap.killTweensOf(orbs);
      onSpeakingChange(false);
      onLookChange("center");
    };
  }, [onLookChange, onSpeakingChange]);

  return (
    <section
      ref={sectionRef}
      className="fixed inset-0 z-20"
      aria-label="Find Hardik online"
    >
      <p
        ref={dialogueRef}
        className="pointer-events-none absolute left-1/2 top-[14%] w-[90vw] -translate-x-1/2 text-center text-3xl font-medium text-white opacity-0 md:text-5xl"
        aria-live="polite"
      />

      <div
        ref={pulseRef}
        className="pointer-events-none absolute left-1/2 top-[34%] h-12 w-12 -translate-x-1/2 rounded-full border border-white/40 opacity-0 shadow-[0_0_35px_10px_rgba(255,255,255,0.12)]"
      />

      <div className="absolute inset-0 max-md:scale-75">
        {SOCIALS.map((social) => (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            data-social={social.id}
            className="social-orb absolute left-1/2 top-0 flex h-[82px] w-[82px] -translate-x-1/2 items-center justify-center overflow-hidden border border-black/5 bg-white text-black opacity-0 shadow-[0_0_28px_8px_rgba(255,255,255,0.16)]"
            style={{
              marginLeft: social.position.x,
              marginTop: social.position.y,
              borderRadius: 999,
              transformOrigin: "center",
            }}
            aria-label={`Open ${social.label}`}
          >
            <span className="social-label text-xs font-semibold uppercase tracking-wider">
              {social.label}
            </span>
            <span className="social-content invisible absolute inset-0 flex translate-y-2 flex-col p-5 opacity-0">
              <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                Signal found
              </span>
              <span className="mt-3">
                <strong className="block text-xl font-semibold">
                  {social.label}
                </strong>
                <span className="mt-1 block text-sm text-zinc-600">
                  {social.description}
                </span>
              </span>
              <span className="mt-auto flex items-center justify-between border-t border-black/10 pt-3 text-sm font-medium">
                View profile
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-black/15">
                  ↗
                </span>
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
