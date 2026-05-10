"use client";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/app/hooks/useToast";
import { useStore } from "@/app/hooks/store";
import Toast from "@/app/pages/components/toast";
import Input from "@/app/pages/components/input";
import Button from "@/app/pages/components/button";
import ListarLivros from "./listar";

export interface LivroFormProps {
  titulo: string;
  autor: string;
  categoria: number | "";
}

const emptyForm: LivroFormProps = { titulo: "", autor: "", categoria: "" };

const SVG_ARROW =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'><path d='M1 1.5L6 6.5L11 1.5' stroke='%23a8a8a0' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>\")";

export default function CadastrarLivro() {
  const [form, setForm] = useState<LivroFormProps>(emptyForm);
  const [errors, setErrors] = useState<{
    titulo?: string;
    autor?: string;
    categoria?: string;
  }>({});
  const [flash, setFlash] = useState<string | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const categorias = useStore((state) => state.categorias);
  const livros = useStore((state) => state.livros);
  const alterarStatusLivros = useStore((state) => state.alterarStatusLivros);
  const { show, message, triggerToast, onClose } = useToast();

  useEffect(() => {
    fetch("/api/categoria")
      .then((res) => res.json())
      .then((data) => useStore.getState().atualizarCategorias(data));
  }, []);

  async function cadastrarLivro(titulo: string) {
    try {
      const response = await fetch("/api/livros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: form.titulo,
          autor: form.autor,
          categoria: form.categoria,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erro ao cadastrar livro.");
      }
      alterarStatusLivros(true);
      if (flashTimer.current) clearTimeout(flashTimer.current);
      setFlash(titulo);
      flashTimer.current = setTimeout(() => setFlash(null), 1600);
      setForm(emptyForm);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "erro desconhecido";
      if (msg.includes("já existe")) {
        setErrors({ titulo: msg });
      } else {
        triggerToast("Erro ao cadastrar livro! " + msg);
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { titulo?: string; autor?: string; categoria?: string } = {};
    if (!form.titulo.trim()) errs.titulo = "O título é obrigatório.";
    if (!form.autor.trim()) errs.autor = "O autor é obrigatório.";
    if (!form.categoria) errs.categoria = "Selecione uma categoria.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    await cadastrarLivro(form.titulo.trim());
  };

  const noCategorias = categorias.length === 0;

  return (
    <div>
      <div className="font-mono text-[11px] tracking-[0.18em] text-(--accent) uppercase mb-3 flex items-center gap-2.5">
        <span>{"// livro"}</span>
        <span className="flex-1 h-px bg-(--line) block" />
        <span className="text-(--text-faint)">
          {livros.length} {livros.length === 1 ? "registro" : "registros"}
        </span>
      </div>

      <h2 className="text-[36px] font-semibold tracking-[-0.015em] m-0 mb-2 leading-[1.1]">
        Cadastrar livro
      </h2>
      <p className="text-[18px] text-(--text-dim) m-0 mb-8 leading-[1.55]">
        Vincule cada livro a uma categoria existente.
      </p>

      {noCategorias && (
        <div className="px-4 py-3 bg-[oklch(0.30_0.06_80_/_0.25)] border border-[oklch(0.50_0.10_80)] rounded-(--radius) text-(--warn) text-[13px] mb-6 flex items-center gap-2.5 font-mono">
          <span>⚠</span>
          <span>
            Cadastre pelo menos uma categoria antes de adicionar livros.
          </span>
          <a href="#categoria" className="ml-auto text-(--warn) underline">
            ir para categoria →
          </a>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        data-testid="form-livro"
        className="bg-(--surface) border border-(--line) rounded-lg p-7 mb-6"
      >
        <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-4">
          {/* Título */}
          <div>
            <label
              htmlFor="livro-titulo"
              className="block font-mono text-[11px] tracking-[0.12em] uppercase text-(--text-faint) mb-2"
            >
              Título
            </label>
            <Input
              id="livro-titulo"
              type="text"
              value={form.titulo}
              onChange={(e) => {
                setForm({ ...form, titulo: e.target.value });
                if (errors.titulo) setErrors({ ...errors, titulo: undefined });
              }}
              placeholder="Ex.: O Hobbit"
              error={!!errors.titulo}
              data-testid="input-livro-titulo"
              autoComplete="off"
            />
            {errors.titulo && (
              <div
                data-testid="error-livro-titulo"
                className="font-mono text-[11px] text-(--danger) mt-1.5 tracking-[0.02em]"
              >
                {errors.titulo}
              </div>
            )}
          </div>

          {/* Autor */}
          <div>
            <label
              htmlFor="livro-autor"
              className="block font-mono text-[11px] tracking-[0.12em] uppercase text-(--text-faint) mb-2"
            >
              Autor
            </label>
            <Input
              id="livro-autor"
              type="text"
              value={form.autor}
              onChange={(e) => {
                setForm({ ...form, autor: e.target.value });
                if (errors.autor) setErrors({ ...errors, autor: undefined });
              }}
              placeholder="Ex.: J. R. R. Tolkien"
              error={!!errors.autor}
              data-testid="input-livro-autor"
              autoComplete="off"
            />
            {errors.autor && (
              <div
                data-testid="error-livro-autor"
                className="font-mono text-[11px] text-(--danger) mt-1.5 tracking-[0.02em]"
              >
                {errors.autor}
              </div>
            )}
          </div>

          {/* Categoria */}
          <div>
            <label
              htmlFor="livro-categoria"
              className="block font-mono text-[11px] tracking-[0.12em] uppercase text-(--text-faint) mb-2"
            >
              Categoria
            </label>
            <select
              id="livro-categoria"
              value={form.categoria}
              onChange={(e) => {
                setForm({
                  ...form,
                  categoria: e.target.value ? Number(e.target.value) : "",
                });
                if (errors.categoria)
                  setErrors({ ...errors, categoria: undefined });
              }}
              className={`w-full px-3.5 py-2.75 pr-9 bg-(--bg-2) border rounded-(--radius) text-(--text) text-[15px] font-sans outline-none appearance-none transition-[border-color,box-shadow] duration-150 ${errors.categoria ? "border-(--danger)" : "border-(--line-strong)"}`}
              style={{
                backgroundImage: SVG_ARROW,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 14px center",
              }}
              disabled={noCategorias}
              data-testid="select-livro-categoria"
            >
              <option value="">
                {noCategorias ? "— sem categorias —" : "Selecione…"}
              </option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id ?? ""}>
                  {cat.nome}
                </option>
              ))}
            </select>
            {errors.categoria && (
              <div
                data-testid="error-livro-categoria"
                className="font-mono text-[11px] text-(--danger) mt-1.5 tracking-[0.02em]"
              >
                {errors.categoria}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2.5 mt-[22px] items-center">
          <Button type="submit" data-testid="btn-cadastrar-livro">
            Cadastrar
          </Button>
          {flash && (
            <span className="font-mono text-xs text-(--accent) tracking-[0.03em]">
              ✓ &quot;{flash}&quot; cadastrado
            </span>
          )}
        </div>
      </form>

      <ListarLivros />
      <Toast message={message} show={show} onClose={onClose} />
    </div>
  );
}
