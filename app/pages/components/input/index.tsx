"use client";
import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export default function Input({ error = false, onFocus, onBlur, ...props }: InputProps) {
  return (
    <input
      className={`w-full py-2.75 px-3.5 bg-(--bg-2) border rounded-(--radius) text-(--text) text-[15px] font-sans outline-none transition-[border-color,box-shadow] duration-150 ${error ? "border-(--danger)" : "border-(--line-strong)"}`}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = error ? "var(--danger)" : "var(--accent-dim)";
        e.currentTarget.style.boxShadow = `0 0 0 3px ${error ? "oklch(0.70 0.16 25 / 0.15)" : "oklch(0.55 0.10 155 / 0.18)"}`;
        onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = error ? "var(--danger)" : "var(--line-strong)";
        e.currentTarget.style.boxShadow = "none";
        onBlur?.(e);
      }}
      {...props}
    />
  );
}
