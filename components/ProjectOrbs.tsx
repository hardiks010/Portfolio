"use client";
import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

const ORBS = [
  { id: "orb-1", color: "#FFFFFF" },
  { id: "orb-2", color: "#FFFFFF" },
  { id: "orb-3", color: "#FFFFFF" },
  { id: "orb-4", color: "#FFFFFF" },
];

export default function ProjectOrbs({
  projectsOpen,
  mascotRef,
  onArmsRaised,
  onFinished,
}: {
  projectsOpen: boolean;
  mascotRef: React.RefObject<HTMLDivElement | null>;
  onArmsRaised: (fn: () => void) => void;
  onFinished: () => void;
}) {
  const flyInAndOrbit = useCallback(() => {
    if (!mascotRef.current) return;

    const rect = mascotRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top - 100; // just above the head
    const W = window.innerWidth;

    // Start positions — two from far left, two from far right, at different heights
    gsap.set("#orb-1", { x: -W, y: cy - 60, opacity: 1 });
    gsap.set("#orb-2", { x: -W, y: cy + 60, opacity: 1 });
    gsap.set("#orb-3", { x:  W, y: cy - 60, opacity: 1 });
    gsap.set("#orb-4", { x:  W, y: cy + 60, opacity: 1 });

    

    const tl = gsap.timeline();

    // Slow build then accelerate into center — like being pulled by a force
    tl.to(["#orb-1", "#orb-2", "#orb-3", "#orb-4"], {
      x: cx,
      y: cy,
      duration: 2.2,
      ease: "power4.in", // starts slow, slams in
      stagger: 0.08,
      scaleX: 3,        // stretches orb horizontally — fakes the trail elongation
  filter: "blur(8px)", // motion blur while traveling
    });

    // On collision — small shockwave scatter
    tl.to("#orb-1", { x: cx - 70, y: cy - 70, duration: 0.18, ease: "power3.out" ,scaleX: 1, filter: "blur(0px)"});
    tl.to("#orb-2", { x: cx - 70, y: cy + 70, duration: 0.18, ease: "power3.out",scaleX: 1, filter: "blur(0px)" }, "<");
    tl.to("#orb-3", { x: cx + 70, y: cy - 70, duration: 0.18, ease: "power3.out" ,scaleX: 1, filter: "blur(0px)"}, "<");
    tl.to("#orb-4", { x: cx + 70, y: cy + 70, duration: 0.18, ease: "power3.out" ,scaleX: 1, filter: "blur(0px)"}, "<");



// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
const orbitRadius = 80;
const proxy = {
  angle: -Math.PI / 2,
  progress: 0,
};
const orbEls = ORBS.map((o) => document.getElementById(o.id));



// slow start → ramp up → blur into ring
tl.to(proxy, {
  angle: Math.PI * 14,
  progress: 1,
  duration: 1.8,
  ease: "power2.in",

  onUpdate() {
    const speed = proxy.progress;

    orbEls.forEach((el, i) => {
      if (!el) return;

      const offset = (i / ORBS.length) * Math.PI * 2;
      const a = proxy.angle + offset;

      gsap.set(el, {
        x: cx + orbitRadius * Math.cos(a),
        y: cy + orbitRadius * Math.sin(a),
        filter: `blur(${speed * 10}px)`,
        scale: 1 + speed * 0.35,
      });
    });
  },
});

tl.to(proxy, {
  angle: Math.PI * 16,   // only ONE more revolution
  progress: 0,
  duration: 2.8,
  ease: "expo.out",

  onUpdate() {
    const speed = proxy.progress;

    orbEls.forEach((el, i) => {
      if (!el) return;

      const offset = (i / ORBS.length) * Math.PI * 2;
      const a = proxy.angle + offset;

      gsap.set(el, {
        x: cx + orbitRadius * Math.cos(a),
        y: cy + orbitRadius * Math.sin(a),
        filter: `blur(${speed * 10}px)`,
        scale: 1 + speed * 0.35,
      });
    });
  },

  onComplete() {
    gsap.set(orbEls, {
      filter: "blur(0px)",
      scale: 1,
      scaleX: 1,
      scaleY: 1,
    });
    onFinished();
  },
});
 
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

  }, [mascotRef]);

  
  

useEffect(() => {
  onArmsRaised(flyInAndOrbit);
}, [flyInAndOrbit, onArmsRaised]);

  useEffect(() => {
    if (!projectsOpen || !mascotRef.current) return;
    // hide orbs initially
    gsap.set(["#orb-1", "#orb-2", "#orb-3", "#orb-4"], { opacity: 0 });
  }, [projectsOpen]);

  if (!projectsOpen) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {ORBS.map((orb) => (
        <div
          key={orb.id}
          id={orb.id}
          className="absolute w-16 h-16 rounded-full"
          style={{
            backgroundColor: orb.color,
            top: 0,
            left: 0,
            transform: "translate(-50%, -50%)",
              transformOrigin: "center center",
            boxShadow: `0 0 24px 8px ${orb.color}99`,
          }}
        />
      ))}
    </div>
  );
}