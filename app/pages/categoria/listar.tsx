"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/app/hooks/store";
import { CategoriaProps } from "./cadastrar";
import Toast from "@/app/pages/components/toast";
import { useToast } from "@/app/hooks/useToast";

const thBase =
  "text-left px-3.5 py-3 font-mono text-[11px] tracking-[0.12em] uppercase text-(--text-faint) font-medium border-b border-(--line) bg-(--bg-2)";
const tdBase = "p-3.5 border-b border-(--line) text-(--text) align-middle";
const tdMono = `${tdBase} font-mono text-[13px] text-(--text-dim)`;

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

export default function ListarCategorias() {
  const categorias = useStore(
    (state: { categorias: CategoriaProps[] }) => state.categorias,
  );
  const atualizarCategorias = useStore((state) => state.atualizarCategorias);
  const recarregarCategorias = useStore((state) => state.recarregarCategorias);
  const alterarStatusCategorias = useStore(
    (state) => state.alterarStatusCategorias,
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { show, message, triggerToast, onClose } = useToast();

  useEffect(() => {
    fetch("/api/categoria")
      .then((res) => res.json())
      .then((data) => atualizarCategorias(data))
      .catch(() => {})
      .finally(() => alterarStatusCategorias(false));
  }, [recarregarCategorias, atualizarCategorias, alterarStatusCategorias]);

  async function handleExclusao(id: string | number) {
    setDeleteError(null);
    try {
      const response = await fetch(`/api/categoria/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erro ao excluir categoria.");
      }
      alterarStatusCategorias(true);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "erro desconhecido";
      if (msg.includes("livros associados")) {
        setDeleteError(msg);
      } else {
        triggerToast("Erro ao excluir! " + msg);
      }
    }
  }

  return (
    <div className="bg-(--surface) border border-(--line) rounded-lg overflow-hidden">
      <div className="px-4 py-3.5 border-b border-(--line) flex items-center justify-between font-mono text-xs text-(--text-dim)">
        <span>Categorias</span>
        <span className="text-(--text-faint)">{categorias.length} rows</span>
      </div>

      {categorias.length === 0 ? (
        <div
          data-testid="empty-categorias"
          className="py-12 px-4 text-center text-(--text-faint) font-mono text-[13px] tracking-[0.04em]"
        >
          Nenhuma categoria cadastrada
        </div>
      ) : (
        <table
          data-testid="tabela-categorias"
          className="w-full border-collapse text-[14px]"
        >
          <thead>
            <tr>
              <th className={`${thBase} w-17.5`}>id</th>
              <th className={`${thBase} w-32.5`}>código</th>
              <th className={thBase}>nome</th>
              <th className={`${thBase} w-15`} />
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat) => (
              <tr key={cat.id} data-testid={`row-categoria-${cat.id}`}>
                <td className={tdMono}>{cat.id}</td>
                <td className={`${tdMono} text-(--accent)`}>{cat.codigo}</td>
                <td className={tdBase}>{cat.nome}</td>
                <td className={`${tdBase} text-right`}>
                  <button
                    title="Excluir"
                    aria-label={`Excluir ${cat.nome}`}
                    onClick={() => handleExclusao(String(cat.id))}
                    data-testid={`delete-categoria-${cat.id}`}
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

      {deleteError && (
        <div
          data-testid="error-excluir-categoria"
          className="px-4 py-3 border-t border-(--line) text-(--danger) font-mono text-[13px] tracking-[0.02em]"
        >
          {deleteError}
        </div>
      )}
      <Toast message={message} show={show} onClose={onClose} />
    </div>
  );
}
