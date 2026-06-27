"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Section } from "@/types/Navigation";

type IntroGesture = "projects" | "about" | "connect" | null;
type HighlightedNav = Extract<Section, "projects" | "about" | "connect"> | null;

type IntroLine = {
  text: string;
  pause?: boolean;
  highlight?: HighlightedNav;
  gesture?: IntroGesture;
  look?: "center" | "up";
};


const INTRO_LINES: IntroLine[] = [
  { text: "Hey." },
  { text: "Welcome." },

  { text: "I'm NPC-01." },
  { text: "Temporary name." },
  { text: "Supposedly." },

  { text: "Hardik said he'd rename me..." },
  { text: '"right before launch, until..."' },

  { text: '"just one more feature."' },
  { text: "Again." },

  { text: "And again." },

  { text: "At this point..." },
  { text: "I don't think he knows what 'finished' means." },

  { text: "He's probably around here somewhere..." },

  { text: "Moving a button..." },
  { text: "three pixels to the left." },

  { text: "Calling it..." },
  { text: '"a huge improvement."' },

  { text: "Trust me." },

  { text: "If we wait for him..." },
  { text: "this introduction will be rewritten too." },

  { text: "So..." },

  {
    text: "Projects.",
    highlight: "projects",
    gesture: "projects",
  },

  { text: "That's where the sleepless nights went.", highlight: "projects" },

  {
    text: "About.",
    highlight: "about",
    gesture: "about",
    look: "up",
  },

  { text: "You'll understand why he's like this.", highlight: "about" },

  {
    text: "Let's Connect.",
    highlight: "connect",
    gesture: "connect",
  },

  {
    text: "He's always looking for people...",
    highlight: "connect",
  },

  {
    text: "who build crazy things too.",
    highlight: "connect",
  },

  { text: "I'll stay here..." },
  { text: "making sure he doesn't add another feature." },
];



type HomeIntroProps = {
  onSpeakingChange: (speaking: boolean) => void;
  onLookChange: (direction: "center" | "up") => void;
  onGestureChange: (gesture: IntroGesture) => void;
  onHighlightChange: (section: HighlightedNav) => void;
  onFinished: () => void;
};

export default function HomeIntro({
  onSpeakingChange,
  onLookChange,
  onGestureChange,
  onHighlightChange,
  onFinished,
}: HomeIntroProps) {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const bubble = bubbleRef.current;
    const text = textRef.current;
    if (!bubble || !text) return;

    const timeline = gsap.timeline({
      delay: 1.45,
      onComplete: () => {
        onSpeakingChange(false);
        onLookChange("center");
        onGestureChange(null);
        onHighlightChange(null);
        onFinished();
      },
    });

    INTRO_LINES.forEach((line) => {
      timeline.call(() => {
        text.textContent = line.text;
        onSpeakingChange(!line.pause);
        onHighlightChange(line.highlight ?? null);
        onGestureChange(line.gesture ?? null);
        onLookChange(line.look ?? "center");
      });
      timeline.fromTo(
        bubble,
        { autoAlpha: 0, y: 12, scale: 0.98 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1.00,
          ease: "power2.out",
        }
      );
      timeline.to({}, { duration: line.pause ? 0.7 : 0.82 });
      timeline.call(() => onSpeakingChange(false));
      timeline.to(bubble, {
        autoAlpha: 0,
        y: -8,
        duration: 0.22,
        ease: "power2.in",
      });
    });

    return () => {
      timeline.kill();
      gsap.killTweensOf(bubble);
      onSpeakingChange(false);
      onLookChange("center");
      onGestureChange(null);
      onHighlightChange(null);
    };
  }, [
    onFinished,
    onGestureChange,
    onHighlightChange,
    onLookChange,
    onSpeakingChange,
  ]);

  return (
    <section
      className="pointer-events-none fixed inset-0 z-40"
      aria-label="Website introduction"
    >
      <div
        ref={bubbleRef}
        className="absolute bottom-[59%] left-1/2 max-w-[min(88vw,680px)] -translate-x-1/2 rounded-[26px] border border-white/15 bg-white/[0.08] px-7 py-4 text-center opacity-0 shadow-[0_18px_65px_rgba(0,0,0,0.3)] backdrop-blur-xl"
      >
        <p
          ref={textRef}
          className="text-balance text-2xl font-medium leading-snug text-white md:text-4xl"
          aria-live="polite"
        />
      </div>
    </section>
  );
}
