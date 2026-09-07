"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "li";
  /** Задержка появления, мс */
  delay?: number;
  /** Мягкий подъём или только fade */
  variant?: "up" | "fade";
};

export function Reveal({
  children,
  className = "",
  as: Tag = "div",
  delay = 0,
  variant = "up",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          node.classList.add("is-visible");
          observer.unobserve(node);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const style: CSSProperties | undefined = delay
    ? { transitionDelay: `${delay}ms` }
    : undefined;

  return (
    <Tag
      ref={ref as never}
      style={style}
      className={`scroll-reveal scroll-reveal--${variant} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
