"use client";

import { useCallback, useRef, useState } from "react";
import AboutSection from "@/components/AboutSection";
import AboutTraits, { type TraitId } from "@/components/AboutTraits";
import ConnectSection from "@/components/ConnectSection";
import HomeIntro from "@/components/HomeIntro";
import Mascot from "@/components/Mascot";
import Navbar from "@/components/Navbar";
import ProjectCards from "@/components/ProjectCards";
import ProjectOrbs from "@/components/ProjectOrbs";
import SocialsSection from "@/components/SocialsSection";
import type { Section } from "@/types/Navigation";

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [pendingSection, setPendingSection] = useState<Section | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [showProjectCards, setShowProjectCards] = useState(false);
  const [projectsClosing, setProjectsClosing] = useState(false);
  const [mascotSpeaking, setMascotSpeaking] = useState(false);
  const [introActive, setIntroActive] = useState(true);
  const [introGesture, setIntroGesture] = useState<
    "projects" | "about" | "connect" | null
  >(null);
  const [highlightedNav, setHighlightedNav] = useState<
    "projects" | "about" | "connect" | null
  >(null);
  const [mascotLook, setMascotLook] = useState<
    "left" | "right" | "center" | "up"
  >("center");

const [revealedTraits, setRevealedTraits] = useState<TraitId[]>([]);

  const mascotRef = useRef<HTMLDivElement>(null);
  const projectsOpenRef = useRef(false);
  const armsRaisedFnRef = useRef<(() => void) | null>(null);

  const registerArmsRaised = useCallback((fn: () => void) => {
    armsRaisedFnRef.current = fn;
  }, []);

  const handleOrbsFinished = useCallback(() => {
    if (projectsOpenRef.current) {
      setShowProjectCards(true);
    }
  }, []);

  const handleProjectCardsClosed = useCallback(() => {
    setShowProjectCards(false);
    setProjectsClosing(false);
    projectsOpenRef.current = false;
    setProjectsOpen(false);
  }, []);

  const handleMascotReset = useCallback(() => {
    if (pendingSection) {
      setActiveSection(pendingSection);
      setPendingSection(null);
    }
    setTransitioning(false);
  }, [pendingSection]);

  const handleIntroFinished = useCallback(() => {
    setIntroActive(false);
  }, []);

  const handleRevealTrait = useCallback((trait: TraitId) => {
  setRevealedTraits((prev) =>
    prev.includes(trait) ? prev : [...prev, trait]
  );
}, []);

  const handleNavigate = useCallback(
    (section: Section) => {
      if (transitioning) return;

      if (introActive) {
        setIntroActive(false);
        setMascotSpeaking(false);
        setMascotLook("center");
        setIntroGesture(null);
        setHighlightedNav(null);
      }

      if (section === activeSection) return;

      if (activeSection === "projects") {
        setPendingSection(section);
        setTransitioning(true);

        if (showProjectCards) {
          setProjectsClosing(true);
        } else {
          projectsOpenRef.current = false;
          setProjectsOpen(false);
        }
        return;
      }

      setMascotSpeaking(false);
      setMascotLook("center");
      if (section === "about") {
  setRevealedTraits([]);
}
      setActiveSection(section);

      if (section === "projects") {
        projectsOpenRef.current = true;
        setProjectsOpen(true);
      }
    },
    [activeSection, introActive, showProjectCards, transitioning]
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <Navbar
        onHomeClick={() => handleNavigate("home")}
        onProjectsClick={() => handleNavigate("projects")}
        onAboutClick={() => handleNavigate("about")}
        onSocialsClick={() => handleNavigate("socials")}
        onConnectClick={() => handleNavigate("connect")}
        highlightedItem={highlightedNav}
      />

      {activeSection === "home" && introActive && (
        <HomeIntro
          onSpeakingChange={setMascotSpeaking}
          onLookChange={setMascotLook}
          onGestureChange={setIntroGesture}
          onHighlightChange={setHighlightedNav}
          onFinished={handleIntroFinished}
        />
      )}

      {activeSection === "about" && (
  <>
    <AboutSection
      onSpeakingChange={setMascotSpeaking}
      onLookChange={setMascotLook}
      onRevealTrait={handleRevealTrait}
    />

    <AboutTraits
      revealedTraits={revealedTraits}
    />
  </>
)}

      {activeSection === "connect" && (
        <ConnectSection
          onSpeakingChange={setMascotSpeaking}
          onLookChange={setMascotLook}
        />
      )}

      {activeSection === "socials" && (
        <SocialsSection
          onSpeakingChange={setMascotSpeaking}
          onLookChange={setMascotLook}
        />
      )}

      <div className="absolute bottom-0 left-1/2 z-30 -translate-x-1/2">
        <Mascot
          ref={mascotRef}
          projectsOpen={projectsOpen}
          speaking={mascotSpeaking}
          lookDirection={mascotLook}
          introGesture={introGesture}
          onArmsRaised={() => armsRaisedFnRef.current?.()}
          onProjectsReset={handleMascotReset}
        />
      </div>

      <ProjectOrbs
        projectsOpen={projectsOpen}
        mascotRef={mascotRef}
        onArmsRaised={registerArmsRaised}
        onFinished={handleOrbsFinished}
      />

      {showProjectCards && (
        <ProjectCards
          closing={projectsClosing}
          onCloseFinished={handleProjectCardsClosed}
        />
      )}
    </main>
  );
}
