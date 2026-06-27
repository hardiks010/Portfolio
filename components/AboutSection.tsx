"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { TraitId } from "./AboutTraits";

type DialogueLine = {
  text: string;
  pause?: boolean;
  aside?: boolean;
};

const DIALOGUE: DialogueLine[] = [
  { text: "With great power..." },
  { text: "comes.." },
  { text: "way too many unfinished side projects." },
  { text: "Fortunately..." },
  { text: "this isn't one of them." },

  { text: "", pause: true },

  { text: "Yeah..." },
  { text: "He thought this was a good idea." },
  { text: "Somehow..." },
  { text: "I agreed." },

  { text: "Anyway." },

  { text: "I'm Hardik's guide." },

  { text: "He's probably busy saying," },
  { text: "\"I'll just fix one more thing.\"" },
  { text: "Trust me." },
  { text: "That's never just one thing." },

  { text: "", pause: true },

  { text: "Officially?" },
  { text: "Computer Science student." },

  { text: "Unofficially?" },

  { text: "Builder." },
  { text: "Problem solver." },
  { text: "Professional overthinker." },

  { text: " ", pause: true },

  { text: "AI." },
  { text: "Products." },
  { text: "Design." },
  { text: "Startups." },

  { text: "If it's interesting," },
  { text: "he'll probably try building it." },

  { text: "try clicking on these pills,", pause: true },
  { text: "to know more.", pause: true },

  { text: "Now..." },
  { text: "enough talking." },
  { text: "Go explore." },
  { text: "That's where he does his best work." },
];

type AboutSectionProps = {
  onSpeakingChange: (speaking: boolean) => void;
  onLookChange: (
    direction: "left" | "right" | "center"
  ) => void;

  onRevealTrait: (trait: TraitId) => void;
};

export default function AboutSection({
  onSpeakingChange,
  onLookChange,
  onRevealTrait,
}: AboutSectionProps) {
  const lineRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;

    const timeline = gsap.timeline({
      onComplete: () => onSpeakingChange(false),
    });

    timeline
      .call(() => onLookChange("left"))
      .to({}, { duration: 1.1 })

      .call(() => onLookChange("center"))
      .to({}, { duration: 0.45 })

      .call(() => onLookChange("right"))
      .to({}, { duration: 1.1 })

      .call(() => onLookChange("center"))
      .to({}, { duration: 0.7 });

    DIALOGUE.forEach((item) => {
      timeline.call(() => {
        line.textContent = item.text;
        line.dataset.aside = String(Boolean(item.aside));

        onSpeakingChange(!item.pause && !item.aside);

        switch (item.text) {
          case "Computer Science student.":
            onRevealTrait("computer-science");
            break;

          case "Builder.":
            onRevealTrait("builder");
            break;

          case "Problem solver.":
            onRevealTrait("problem-solver");
            break;

          case "AI.":
            onRevealTrait("ai");
            break;

          case "Design.":
            onRevealTrait("product-design");
            break;

          case "Startups.":
            onRevealTrait("startups");
            break;
        }
      });

      timeline.fromTo(
        line,
        {
          autoAlpha: 0,
          y: 18,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.42,
          ease: "power2.out",
        }
      );

      timeline.to({}, {
        duration: item.pause ? 0.7 : 1.05,
      });

      timeline.to(line, {
        autoAlpha: 0,
        y: -10,
        duration: 0.28,
        ease: "power2.in",
      });
    });

    return () => {
      timeline.kill();
      onSpeakingChange(false);
      onLookChange("center");
    };
  }, [onLookChange, onSpeakingChange, onRevealTrait]);

  return (
    <section
      className="pointer-events-none fixed inset-0 z-20"
      aria-label="About Hardik"
      aria-live="polite"
    >
      <div className="absolute left-1/2 top-[18%] w-[min(90vw,900px)] -translate-x-1/2 text-center">
        <p
          ref={lineRef}
          className="text-balance text-3xl font-medium leading-tight text-white opacity-0 md:text-5xl data-[aside=true]:text-2xl data-[aside=true]:italic data-[aside=true]:text-zinc-400"
        />
      </div>
    </section>
  );
}