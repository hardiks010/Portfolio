"use client";

import { useEffect } from "react";
import gsap from "gsap";



export default function Mascot() {


function blink() {
  const tl = gsap.timeline();

  tl.to(["#left-eye", "#right-eye"], {
    scaleY: 0.1,
    duration: 0.08,
  });

  tl.to(["#left-eye", "#right-eye"], {
    scaleY: 1,
    duration: 0.08,
  });
}
//wave function
function wave() {
  const tl = gsap.timeline();
   // Raise arm
tl.to("#right-arm", {
  rotation: -150,
  duration: 0.35,
});

// Wave while arm stays raised
tl.to("#right-arm", {
  rotation: -110,
  duration: 0.18,
  yoyo: true,
  repeat: 5,
});

// Put arm back down
tl.to("#right-arm", {
  rotation: -12,
  duration: 0.35,
});

}

//breathing function
function breath() {
  gsap.to("#mascot", {
    y: -8,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
}

//smile
function smile() {
  gsap.to("#mouth", {
    scale: 1.15,
    duration: 0.8,
    ease: "back.out(2)",
  });
}

//normalsmile
function normalSmile() {
  gsap.to("#mouth", {
    scale: 1,
    duration: 0.4,
    ease: "power2.out",
  });
}


    useEffect(() => {
  const tl = gsap.timeline();
  let isSmiling = false;

    const handleMouseMove = (e: MouseEvent) => {


      const mascot = document.getElementById("mascot");

if (!mascot) return;

const rect = mascot.getBoundingClientRect();

const mascotCenterX = rect.left + rect.width / 2;
const mascotCenterY = rect.top + rect.height / 2;

const distanceX = e.clientX - mascotCenterX;
const distanceY = e.clientY - mascotCenterY;

const distance = Math.sqrt(
  distanceX * distanceX +
  distanceY * distanceY
);
console.log(distance);

console.log(distanceX, distanceY);

console.log(mascotCenterX, mascotCenterY);

if (distance < 250) {
  smile();
} else {
  normalSmile();
}
if (distance < 250 && !isSmiling) {
  smile();
  isSmiling = true;
}

if (distance >= 250 && isSmiling) {
  normalSmile();
  isSmiling = false;
}





        console.log(e.clientX, e.clientY);
  const centerX = window.innerWidth / 2;

  const xMovement = ((e.clientX - centerX) / centerX) * 8;

  const centerY = window.innerHeight / 2;

const yMovement = ((e.clientY - centerY) / centerY) * 6;

  gsap.to(["#left-eye", "#right-eye"], {
    x: xMovement,
     y: yMovement,
    duration: 0.2,
    ease: "power2.out",
  });

  gsap.to("#head", {
  rotation: xMovement * 0.9,
    y: yMovement * 0.5,
  duration: 0.4,
  ease: "power2.out",
});
};

  window.addEventListener("mousemove", handleMouseMove);
//pop-up timeline
  tl.from("#mascot", {
    y: 400,
    duration: 1,
    ease: "back.out(1.7)",
  });

  //calling wave function
  tl.call(() => {
  wave();
});

tl.call(() => {
  smile();
});

tl.call(() => {
  normalSmile();
});

//breahting function
tl.call(() => {
  breath();
});


const blinkInterval = setInterval(() => {
    blink();
  }, 4000);


  
 

  return () => {
    clearInterval(blinkInterval);
    window.removeEventListener("mousemove", handleMouseMove);
  };

}, []);

  return (
     <div
      id="mascot"
      className="relative flex flex-col items-center"
    >
  {/* Head */}
  <div   id="head" className="w-40 h-40 rounded-full bg-zinc-200 relative z-10">
    <div   id="left-eye"
className="absolute top-14 left-10 w-8 h-8 rounded-full bg-black  origin-center"></div>
    <div   id="right-eye"
className="absolute top-14 right-10 w-8 h-8 rounded-full bg-black origin-center"></div>

<div
  id="mouth"
  className="absolute bottom-8 left-1/2 -translate-x-1/2 overflow-hidden w-12 h-6 flex items-end"
>
  <div className="w-12 h-12 bg-black rounded-full"></div>
</div>
  </div>

  {/* Arms */}
  <div className="absolute top-48 -left-2 w-12 h-56 bg-zinc-300 rounded-full rotate-10 origin-top"></div>

 <div
  id="right-arm"
  className="absolute top-48 -right-2 w-12 h-56 bg-zinc-300 rounded-full -rotate-10 origin-top"
></div>

  {/* Body */}
  <div className="w-48 h-64 bg-zinc-300/90 rounded-t-full"></div>
</div>
  );
}