"use client";
import { useState, useEffect, useCallback } from "react";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "categoria", label: "Categoria" },
  { id: "livro", label: "Livro" },
];

export default function Nav() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const jump = useCallback((id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <nav
      data-testid="main-nav"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between py-3.5 px-8 bg-[oklch(0.16_0.006_60/0.72)] backdrop-blur-md border-b border-(--line)"
    >
      <div className="font-mono text-[13px] tracking-[0.04em] flex items-center gap-2.5 text-(--text)">
        <span className="w-2 h-2 rounded-full bg-(--accent) shadow-[0_0_10px_oklch(0.78_0.13_155/0.6)] inline-block shrink-0" />
        <span>cadastro-livros</span>
        <span className="text-(--text-faint)">/</span>
        <span className="text-(--text-dim)">v0.1.0</span>
      </div>

      <div className="flex gap-1">
        {SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <a
              key={s.id}
              href={"#" + s.id}
              data-testid={"nav-" + s.id}
              onClick={(e) => {
                e.preventDefault();
                jump(s.id);
              }}
              className={`px-3.5 py-2 text-[13px] font-medium font-mono tracking-[0.02em] rounded-(--radius) cursor-pointer no-underline transition-all duration-150 inline-block border ${
                isActive
                  ? "text-(--text) bg-(--surface) border-(--line-strong)"
                  : "text-(--text-dim) bg-transparent border-transparent"
              }`}
            >
              {s.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
