"use client";

import { useEffect } from "react";

export function MotionEffects() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.innerWidth < 760) return;
    let destroy = () => {};
    let active = true;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("lenis")]).then(([gsapModule, triggerModule, lenisModule]) => {
      if (!active) return;
      const gsap = gsapModule.gsap;
      const ScrollTrigger = triggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new lenisModule.default({ duration: 0.8, smoothWheel: true, syncTouch: false });
      const frame = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(frame);
      gsap.ticker.lagSmoothing(0);
      const ctx = gsap.context(() => {
        gsap.fromTo(".hero__shoe", { y: 0, rotate: -11 }, { y: -12, rotate: -6, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.8 } });
        gsap.utils.toArray<HTMLElement>(".story-band,.editorial-panel").forEach((element) => gsap.fromTo(element, { y: 18, opacity: 0.78 }, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", scrollTrigger: { trigger: element, start: "top 88%", once: true } }));
      });
      destroy = () => { ctx.revert(); gsap.ticker.remove(frame); lenis.destroy(); };
    }).catch(() => { /* Native scrolling and static artwork remain the fallback. */ });
    return () => { active = false; destroy(); };
  }, []);
  return null;
}
