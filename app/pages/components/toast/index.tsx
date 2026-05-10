"use client";
import { useEffect } from "react";

type ToastProps = {
  message: string;
  show: boolean;
  onClose: () => void;
  duration?: number;
};

export default function Toast({
  message,
  show,
  onClose,
  duration = 1500,
}: ToastProps) {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 flex items-center gap-3 px-5 py-3.5 rounded-2xl text-white text-sm font-medium shadow-xl transition-all duration-300 pointer-events-none border
      ${show ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-3 scale-95"}
      ${message.includes("Erro") ? "bg-red-900/80 border-red-700/40" : "bg-brand border-brand/40"}`}
    >
      <span
        className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold flex-shrink-0
        ${message.includes("Erro") ? "bg-red-700/60" : "bg-brand/60"}`}
      >
        {message.includes("Erro") ? "!" : "✓"}
      </span>
      {message}
    </div>
  );
}
