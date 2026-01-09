// components/ScrollbarsOnScroll.tsx
"use client";
import { useEffect } from "react";

export default function ScrollbarsOnScroll({ hideAfter = 600 }: { hideAfter?: number }) {
  useEffect(() => {
    let timer: number | undefined;

    const onScroll = () => {
      document.body.classList.add("is-scrolling");
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        document.body.classList.remove("is-scrolling");
      }, hideAfter);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hideAfter]);

  return null;
}
