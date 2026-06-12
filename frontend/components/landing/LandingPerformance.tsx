"use client";

import { useEffect } from "react";

export function LandingPerformance() {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>(".landing-lazy");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      { rootMargin: "180px 0px", threshold: 0.01 },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return null;
}
