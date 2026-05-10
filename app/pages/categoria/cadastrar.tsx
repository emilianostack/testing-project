"use client";
import { useState, useRef } from "react";
import { useToast } from "@/app/hooks/useToast";
import { useStore } from "@/app/hooks/store";
import Toast from "@/app/pages/components/toast";
import Button from "@/app/pages/components/button";
import ListarCategorias from "./listar";

export interface CategoriaProps {
  id?: string;
  codigo?: number;
  nome: string;
}

const emptyForm: CategoriaProps = { nome: "" };

export default function CadastrarCategoria() {
  const [form, setForm] = useState<CategoriaProps>(emptyForm);
  const [fieldError, setFieldError] = useState("");
  const [flash, setFlash] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const categorias = useStore((state) => state.categorias);
  const alterarStatusCategorias = useStore(
    (state) => state.alterarStatusCategorias,
  );
  const { show, message, triggerToast, onClose } = useToast();

  async function cadastrarCategoria(nome: string) {
    try {
      const response = await fetch("/api/categoria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erro ao cadastrar categoria.");
      }
      alterarStatusCategorias(true);
      if (flashTimer.current) clearTimeout(flashTimer.current);
      setFlash(nome);
      flashTimer.current = setTimeout(() => setFlash(null), 1600);
      setForm(emptyForm);
      inputRef.current?.focus();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "erro desconhecido";
      if (msg.includes("já existe")) {
        setFieldError(msg);
      } else {
        triggerToast("Erro ao cadastrar categoria! " + msg);
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = form.nome.trim();
    if (!v) {
      setFieldError("O nome da categoria é obrigatório.");
      return;
    }
    if (v.length < 2) {
      setFieldError("Mínimo de 2 caracteres.");
      return;
    }
    await cadastrarCategoria(v);
  };

  return (
    <div>
      <div className="font-mono text-[11px] tracking-[0.18em] text-(--accent) uppercase mb-3 flex items-center gap-2.5">
        <span>{"// categoria"}</span>
        <span className="flex-1 h-px bg-(--line) block" />
        <span className="text-(--text-faint)">
          {categorias.length}{" "}
          {categorias.length === 1 ? "registro" : "registros"}
        </span>
      </div>

      <h2 className="text-[36px] font-semibold tracking-[-0.015em] m-0 mb-2 leading-[1.1]">
        Cadastrar categoria
      </h2>
      <p className="text-[18px] text-(--text-dim) m-0 mb-8 leading-[1.55]">
        Cadastre as categorias que serão associadas aos livros.
      </p>

      <div className="grid grid-cols-[1fr_1.7fr] gap-6 items-start">
        <form
          onSubmit={handleSubmit}
          data-testid="form-categoria"
          className="bg-(--surface) border border-(--line) rounded-lg p-7"
        >
          <div>
            <label
              htmlFor="cat-nome"
              className="block font-mono text-[11px] tracking-[0.12em] uppercase text-(--text-faint) mb-2"
            >
              Nome
            </label>
            <input
              id="cat-nome"
              ref={inputRef}
              type="text"
              value={form.nome}
              onChange={(e) => {
                setForm({ ...form, nome: e.target.value });
                if (fieldError) setFieldError("");
              }}
              placeholder="Ex.: Ficção científica"
              className={`w-full px-3.5 py-2.75 bg-(--bg-2) border rounded-(--radius) text-(--text) text-[15px] font-sans outline-none transition-[border-color,box-shadow] duration-150 ${fieldError ? "border-(--danger)" : "border-(--line-strong)"}`}
              onFocus={(e) => {
                e.target.style.borderColor = fieldError
                  ? "var(--danger)"
                  : "var(--accent-dim)";
                e.target.style.boxShadow = `0 0 0 3px ${fieldError ? "oklch(0.70 0.16 25 / 0.15)" : "oklch(0.55 0.10 155 / 0.18)"}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = fieldError
                  ? "var(--danger)"
                  : "var(--line-strong)";
                e.target.style.boxShadow = "none";
              }}
              data-testid="input-categoria-nome"
              autoComplete="off"
            />
            {fieldError && (
              <div
                data-testid="error-categoria-nome"
                className="font-mono text-[11px] text-(--danger) mt-1.5 tracking-[0.02em]"
              >
                {fieldError}
              </div>
            )}
          </div>

          <div className="flex gap-2.5 mt-5 items-center">
            <Button type="submit" data-testid="btn-cadastrar-categoria">
              Cadastrar
            </Button>
            {flash && (
              <span className="font-mono text-xs text-(--accent) tracking-[0.03em]">
                ✓ &quot;{flash}&quot; cadastrada
              </span>
            )}
          </div>
        </form>

        <ListarCategorias />
      </div>

      <Toast message={message} show={show} onClose={onClose} />
    </div>
  );
}
