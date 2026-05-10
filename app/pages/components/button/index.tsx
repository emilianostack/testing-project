"use client";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "danger";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  variant?: Variant;
};

export default function Button({
  variant = "primary",
  children,
  disabled,
  className = "",
  onMouseEnter,
  onMouseLeave,
  ...props
}: Props) {
  const base =
    "py-2.75 px-5 rounded-(--radius) font-semibold text-[14px] font-sans tracking-[0.01em] transition-[background] duration-150";
  const cursor = disabled ? "cursor-not-allowed" : "cursor-pointer";
  const variantCls =
    variant === "danger"
      ? "bg-transparent border border-(--danger) text-(--danger)"
      : disabled
        ? "bg-(--surface-2) text-(--text-faint) border-0"
        : "bg-(--accent) text-[oklch(0.18_0.01_155)] border-0";

  return (
    <button
      disabled={disabled}
      className={`${base} ${cursor} ${variantCls} ${className}`}
      onMouseEnter={(e) => {
        if (!disabled && variant === "primary")
          e.currentTarget.style.background = "oklch(0.84 0.13 155)";
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (!disabled && variant === "primary")
          e.currentTarget.style.background = "var(--accent)";
        onMouseLeave?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
