"use client";
import { useEffect } from "react";
import { useStore } from "@/app/hooks/store";
import Toast from "@/app/pages/components/toast";
import { useToast } from "@/app/hooks/useToast";

export interface LivroProps {
  id: string;
  codigo: number;
  titulo: string;
  autor: string;
  categoria: string;
  categoriaNome?: string;
}

const thBase =
  "text-left px-3.5 py-3 font-mono text-[11px] tracking-[0.12em] uppercase text-(--text-faint) font-medium border-b border-(--line) bg-(--bg-2)";
const tdBase = "p-3.5 border-b border-(--line) text-(--text) align-middle";

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 4h10M6.5 4V2.5h3V4M5 4l.5 9h5L11 4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CategoriaPill({ nome }: { nome?: string }) {
  if (!nome) {
    return <span className="text-(--text-faint) font-mono text-xs">—</span>;
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.75 bg-(--accent-soft) text-(--accent) border border-[oklch(0.40_0.07_155)] rounded-full font-mono text-[11px] font-medium tracking-[0.04em]">
      {nome}
    </span>
  );
}

export default function ListarLivros() {
  const livros = useStore((state) => state.livros);
  const atualizarLivros = useStore((state) => state.atualizarLivros);
  const recarregarLivros = useStore((state) => state.recarregarLivros);
  const alterarStatusLivros = useStore((state) => state.alterarStatusLivros);
  const { show, message, triggerToast, onClose } = useToast();

  useEffect(() => {
    fetch("/api/livros")
      .then((res) => res.json())
      .then((data) => atualizarLivros(data))
      .catch(() => {})
      .finally(() => alterarStatusLivros(false));
  }, [recarregarLivros, atualizarLivros, alterarStatusLivros]);

  async function handleExclusao(id: string | number) {
    try {
      const response = await fetch(`/api/livros/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erro ao excluir livro.");
      }
      alterarStatusLivros(true);
    } catch (error: unknown) {
      triggerToast(
        "Erro ao excluir! " +
          (error instanceof Error ? error.message : "erro desconhecido"),
      );
    }
  }

  return (
    <div className="bg-(--surface) border border-(--line) rounded-lg overflow-hidden">
      <div className="px-4 py-3.5 border-b border-(--line) flex items-center justify-between font-mono text-xs text-(--text-dim)">
        <span>Livros</span>
        <span className="text-(--text-faint)">{livros.length} rows</span>
      </div>

      {livros.length === 0 ? (
        <div
          data-testid="empty-livros"
          className="py-12 px-4 text-center text-(--text-faint) font-mono text-[13px] tracking-[0.04em]"
        >
          Nenhum livro cadastrado
        </div>
      ) : (
        <table
          data-testid="tabela-livros"
          className="w-full border-collapse text-[14px]"
        >
          <thead>
            <tr>
              <th className={`${thBase} w-32.5`}>código</th>
              <th className={thBase}>título</th>
              <th className={thBase}>autor</th>
              <th className={`${thBase} w-55`}>categoria</th>
              <th className={`${thBase} w-15`} />
            </tr>
          </thead>
          <tbody>
            {livros.map((livro) => (
              <tr key={livro.id} data-testid={`row-livro-${livro.id}`}>
                <td
                  className={`${tdBase} font-mono text-[13px] text-(--accent)`}
                >
                  {livro.codigo}
                </td>
                <td className={tdBase}>{livro.titulo}</td>
                <td className={`${tdBase} text-(--text-dim)`}>{livro.autor}</td>
                <td className={tdBase}>
                  <CategoriaPill nome={livro.categoriaNome} />
                </td>
                <td className={`${tdBase} text-right`}>
                  <button
                    title="Excluir"
                    aria-label={`Excluir ${livro.titulo}`}
                    onClick={() => handleExclusao(String(livro.id))}
                    data-testid={`delete-livro-${livro.id}`}
                    className="w-7.5 h-7.5 inline-flex items-center justify-center bg-transparent border border-(--line) rounded-(--radius) text-(--text-dim) cursor-pointer transition-all duration-150"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--danger)";
                      e.currentTarget.style.color = "var(--danger)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--line)";
                      e.currentTarget.style.color = "var(--text-dim)";
                    }}
                  >
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Toast message={message} show={show} onClose={onClose} />
    </div>
  );
}
