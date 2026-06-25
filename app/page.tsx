"use client";
import { useState, useRef, useCallback } from "react";
import Mascot from "@/components/Mascot";
import ProjectOrbs from "@/components/ProjectOrbs";

import ProjectCards from "@/components/ProjectCards";

export default function Home() {
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [showProjectCards, setShowProjectCards] = useState(false);
  const mascotRef = useRef<HTMLDivElement>(null);

  const armsRaisedFnRef = useRef<(() => void) | null>(null);
  const presentingFnRef = useRef<(() => void) | null>(null);

  const registerArmsRaised = useCallback((fn: () => void) => {
    armsRaisedFnRef.current = fn;
  }, []);

  const registerPresenting = useCallback((fn: () => void) => {
    presentingFnRef.current = fn;
  }, []);

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      <nav className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-6 z-50">
        <span className="text-white font-bold text-xl">hardik.</span>
        <div className="flex gap-8">
          <button onClick={() => setProjectsOpen(true)} className="text-white hover:opacity-70 transition-opacity">
            Projects
          </button>
          <button className="text-white hover:opacity-70 transition-opacity">About Me</button>
          <button className="text-white hover:opacity-70 transition-opacity">Socials</button>
        </div>
        <button className="bg-white text-black px-5 py-2 rounded-full font-medium">
          Let's Connect
        </button>
      </nav>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <Mascot
          ref={mascotRef}
          projectsOpen={projectsOpen}
          onArmsRaised={() => armsRaisedFnRef.current?.()}
        
        />
      </div>

      <ProjectOrbs
        projectsOpen={projectsOpen}
        mascotRef={mascotRef}
        onArmsRaised={registerArmsRaised}
         onFinished={() => setShowProjectCards(true)}
      />
      {showProjectCards && <ProjectCards />}
    </main>
  );
}