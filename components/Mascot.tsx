"use client";
import { forwardRef, useEffect, useRef } from "react";
import gsap from "gsap";

const Mascot = forwardRef<HTMLDivElement, {
  projectsOpen: boolean;
  speaking?: boolean;
  lookDirection?: "left" | "right" | "center" | "up";
  introGesture?: "projects" | "about" | "connect" | null;
  onArmsRaised?: () => void;
  onProjectsReset?: () => void;
}>(({
  projectsOpen,
  speaking = false,
  lookDirection = "center",
  introGesture = null,
  onArmsRaised,
  onProjectsReset,
}, ref) => {
  const projectsOpenRef = useRef(false);
  const guidedRef = useRef(false);
  const wasProjectsOpenRef = useRef(false);
  const summonTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const onProjectsResetRef = useRef(onProjectsReset);

  useEffect(() => {
    onProjectsResetRef.current = onProjectsReset;
  }, [onProjectsReset]);

  useEffect(() => {
    guidedRef.current =
      speaking || lookDirection !== "center" || introGesture !== null;
  }, [introGesture, lookDirection, speaking]);

  function blink() {
    const tl = gsap.timeline();
    tl.to(["#left-eye", "#right-eye"], { scaleY: 0.1, duration: 0.08 });
    tl.to(["#left-eye", "#right-eye"], { scaleY: 1, duration: 0.08 });
  }

  function wave() {
    const tl = gsap.timeline();
    tl.to("#right-arm", { rotation: -150, duration: 0.35 });
    tl.to("#right-arm", { rotation: -110, duration: 0.18, yoyo: true, repeat: 5 });
    tl.to("#right-arm", { rotation: -12, duration: 0.35 });
  }

  function breath() {
    gsap.to("#mascot", {
      y: -8, duration: 1.5, repeat: -1, yoyo: true, ease: "sine.inOut",
    });
  }

  function smile() {
    gsap.to("#mouth", { scale: 1.15, duration: 0.8, ease: "back.out(2)" });
  }

  function normalSmile() {
    gsap.to("#mouth", { scale: 1, duration: 0.4, ease: "power2.out" });
  }

  function closeEyes() {
    gsap.to(["#left-eye", "#right-eye"], { height: 4, borderRadius: 999, duration: 0.4 });
  }

  function openEyes() {
    gsap.to(["#left-eye", "#right-eye"], { height: 32, borderRadius: 999, duration: 0.3 });
  }

  function concentrationMouth() {
    gsap.to("#mouth", { opacity: 0, duration: 0.2 });
    gsap.to("#mouth-line", { opacity: 1, duration: 0.2 });
  }

  function normalMouth() {
    gsap.to("#mouth", { opacity: 1, duration: 0.3 });
    gsap.to("#mouth-line", { opacity: 0, duration: 0.2 });
  }

  function summonPose() {
    summonTimelineRef.current?.kill();
    gsap.killTweensOf(["#right-arm", "#left-arm", "#head", "#mascot"]);
    const tl = gsap.timeline();
    summonTimelineRef.current = tl;

    // Reset eyes and head
    tl.to(["#left-eye", "#right-eye"], { x: 0, y: 0, duration: 0.5 }, 0);
    tl.to("#head", { rotation: 0, y: 0, duration: 0.5 }, 0);

    // Close eyes + concentration mouth
    tl.call(() => { closeEyes(); concentrationMouth(); }, [], "+=0.1");

    // Slowly raise arms — this is the magnetic moment
    tl.to("#left-arm", { rotation: 140, duration: 2.4, ease: "power2.inOut" }, "+=0.2");
    tl.to("#right-arm", { rotation: -140, duration: 2.4, ease: "power2.inOut" }, "<");
    tl.to("#head", { y: 12, duration: 1.0, ease: "power2.inOut" }, "<0.2");

    // Arms fully raised — fire the orb fly-in
    tl.call(() => { onArmsRaised?.(); });

    // Hold the raised pose while orbs orbit (orbit takes ~2.2s)
    tl.to({}, { duration: 6.5 });

    // Lower arms to horizontal "presenting" — fires as orbs settle
    tl.to("#left-arm", { rotation: 80, duration: 0.8, ease: "power2.inOut" });
    tl.to("#right-arm", { rotation: -80, duration: 0.8, ease: "power2.inOut" }, "<");
   

    // Return to happy face
    tl.to({}, { duration: 0.6 });
    tl.call(() => { openEyes(); normalMouth(); smile(); });
  }

  useEffect(() => {
    projectsOpenRef.current = projectsOpen;

    if (projectsOpen) {
      wasProjectsOpenRef.current = true;
      summonPose();
      return;
    }

    if (!wasProjectsOpenRef.current) return;
    wasProjectsOpenRef.current = false;
    summonTimelineRef.current?.kill();
    gsap.killTweensOf([
      "#left-arm",
      "#right-arm",
      "#head",
      "#left-eye",
      "#right-eye",
      "#mouth",
      "#mouth-line",
    ]);

    const resetTimeline = gsap.timeline({
      onComplete: () => onProjectsResetRef.current?.(),
    });
    resetTimeline.to(
      "#left-arm",
      { rotation: 10, duration: 0.6, ease: "power2.inOut" },
      0
    );
    resetTimeline.to(
      "#right-arm",
      { rotation: -10, duration: 0.6, ease: "power2.inOut" },
      0
    );
    resetTimeline.to(
      "#head",
      { x: 0, y: 0, rotation: 0, duration: 0.5, ease: "power2.out" },
      0
    );
    resetTimeline.to(
      ["#left-eye", "#right-eye"],
      { x: 0, y: 0, height: 32, scaleY: 1, duration: 0.35 },
      0
    );
    resetTimeline.to("#mouth-line", { opacity: 0, duration: 0.2 }, 0);
    resetTimeline.to(
      "#mouth",
      { opacity: 1, width: 48, height: 24, scale: 1, duration: 0.35 },
      0.1
    );

    return () => {
      resetTimeline.kill();
    };
    // The transition is intentionally driven only by projectsOpen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectsOpen]);

  useEffect(() => {
    if (projectsOpen) return;

    gsap.killTweensOf(["#mouth", "#head"]);

    if (!speaking) {
      gsap.to("#mouth", {
        width: 48,
        height: 24,
        scaleX: 1,
        scaleY: 1,
        duration: 0.18,
        ease: "power2.out",
      });
      gsap.to("#head", { rotation: 0, y: 0, duration: 0.25 });
      return;
    }

    const talkingTimeline = gsap.timeline({ repeat: -1 });
    talkingTimeline
      .to("#mouth", { width: 34, height: 18, duration: 0.12 })
      .to("#mouth", { width: 52, height: 28, duration: 0.14 })
      .to("#mouth", { width: 40, height: 13, duration: 0.1 })
      .to("#mouth", { width: 47, height: 23, duration: 0.13 });
    talkingTimeline
      .to("#head", { rotation: -1.4, y: 1, duration: 0.28 }, 0)
      .to("#head", { rotation: 1.2, y: -1, duration: 0.28 }, 0.28);

    return () => {
      talkingTimeline.kill();
    };
  }, [projectsOpen, speaking]);

  useEffect(() => {
    if (projectsOpen || speaking) return;

    const x = lookDirection === "left" ? -12 : lookDirection === "right" ? 12 : 0;
    const y = lookDirection === "up" ? -10 : 0;
    const rotation =
      lookDirection === "left" ? -7 : lookDirection === "right" ? 7 : 0;

    gsap.to(["#left-eye", "#right-eye"], {
      x,
      y,
      duration: 0.45,
      ease: "power2.inOut",
    });
    gsap.to("#head", {
      rotation,
      x: x * 0.35,
      y: lookDirection === "up" ? -5 : 0,
      duration: 0.55,
      ease: "power2.inOut",
    });
  }, [lookDirection, projectsOpen, speaking]);

  useEffect(() => {
    if (projectsOpen) return;

    const leftRotation = introGesture === "projects" ? 112 : 10;
    const rightRotation = introGesture === "connect" ? -112 : -10;

    gsap.to("#left-arm", {
      rotation: leftRotation,
      duration: 0.55,
      ease: "power3.inOut",
    });
    gsap.to("#right-arm", {
      rotation: rightRotation,
      duration: 0.55,
      ease: "power3.inOut",
    });
  }, [introGesture, projectsOpen]);

  useEffect(() => {
    const tl = gsap.timeline();
    let isSmiling = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (projectsOpenRef.current || guidedRef.current) return;

      const mascot = document.getElementById("mascot");
      if (!mascot) return;

      const rect = mascot.getBoundingClientRect();
      const mascotCenterX = rect.left + rect.width / 2;
      const mascotCenterY = rect.top + rect.height / 2;
      const dx = e.clientX - mascotCenterX;
      const dy = e.clientY - mascotCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 250 && !isSmiling) { smile(); isSmiling = true; }
      if (distance >= 250 && isSmiling) { normalSmile(); isSmiling = false; }

      const xMovement = ((e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)) * 8;
      const yMovement = ((e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)) * 6;

      gsap.to(["#left-eye", "#right-eye"], { x: xMovement, y: yMovement, duration: 0.2, ease: "power2.out" });
      gsap.to("#head", { rotation: xMovement * 0.9, y: yMovement * 0.5, duration: 0.4, ease: "power2.out" });
    };

    window.addEventListener("mousemove", handleMouseMove);

    tl.from("#mascot", { y: 400, duration: 1, ease: "back.out(1.7)" });
    tl.call(() => wave());
    tl.call(() => smile());
    tl.call(() => normalSmile());
    tl.call(() => breath());

    const blinkInterval = setInterval(() => {
      if (!projectsOpenRef.current) blink();
    }, 4000);

    return () => {
      clearInterval(blinkInterval);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div ref={ref} id="mascot" className="relative flex flex-col items-center">
      <div id="head" className="w-40 h-40 rounded-full bg-zinc-200 relative z-10">
        <div id="left-eye" className="absolute top-14 left-10 w-8 h-8 rounded-full bg-black origin-center" />
        <div id="right-eye" className="absolute top-14 right-10 w-8 h-8 rounded-full bg-black origin-center" />
        <div id="mouth" className="absolute bottom-8 left-1/2 -translate-x-1/2 overflow-hidden w-12 h-6 flex items-end">
          <div className="w-12 h-12 bg-black rounded-full" />
        </div>
        <div id="mouth-line" className="absolute bottom-10 left-1/2 -translate-x-1/2 w-8 h-1 bg-black rounded-full opacity-0 rotate-[-8deg]" />
      </div>
      <div id="left-arm" className="absolute top-48 -left-2 w-12 h-56 bg-zinc-300 rounded-full rotate-10 origin-top" />
      <div id="right-arm" className="absolute top-48 -right-2 w-12 h-56 bg-zinc-300 rounded-full -rotate-10 origin-top" />
      <div className="w-48 h-64 bg-zinc-300/90 rounded-t-full" />
    </div>
  );
});

Mascot.displayName = "Mascot";
export default Mascot;
