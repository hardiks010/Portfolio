"use client";
import { useEffect, useRef, forwardRef } from "react";
import gsap from "gsap";

const Mascot = forwardRef<HTMLDivElement, {
  projectsOpen: boolean;
  onArmsRaised?: () => void;
  
}>(({ projectsOpen, onArmsRaised, }, ref) => {
  const projectsOpenRef = useRef(false);

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
    gsap.killTweensOf(["#right-arm", "#left-arm", "#head", "#mascot"]);
    const tl = gsap.timeline();

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
  }, [projectsOpen]);

  useEffect(() => {
    if (projectsOpen) summonPose();
  }, [projectsOpen]);

  useEffect(() => {
    const tl = gsap.timeline();
    let isSmiling = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (projectsOpenRef.current) return;

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