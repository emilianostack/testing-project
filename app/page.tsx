import Nav from "@/app/pages/components/nav";
import CadastrarCategoria from "./pages/categoria/cadastrar";
import CadastrarLivro from "./pages/livros/cadastrar";

const sectionCls = "min-h-screen px-8 pt-30 pb-20 relative";
const innerCls = "w-full max-w-[1100px] mx-auto";

export default function Home() {
  return (
    <div className="relative z-[1]">
      <Nav />

      <section
        id="home"
        className={`${sectionCls} flex flex-col justify-center`}
      >
        <div className={innerCls}>
          <div className="font-mono text-[11px] tracking-[0.18em] text-(--accent) uppercase mb-3 flex items-center gap-2.5">
            <span>{"// home"}</span>
            <span className="flex-1 h-px bg-(--line) block" />
          </div>

          <div className="grid grid-cols-[1.4fr_1fr] gap-16 items-center">
            <div>
              <h1 className="text-[56px] font-semibold tracking-[-0.02em] m-0 mb-6 leading-[1.05]">
                Sistema de cadastro
                <br />
                <span className="text-(--accent)">de livros</span>
              </h1>
              <p className="text-[18px] text-(--text-dim) max-w-[640px] m-0 leading-[1.55]">
                Projeto feito para testar React Testing Library, Jest e E2E
                test.
              </p>
              <div className="flex gap-3 mt-9">
                <a
                  href="#categoria"
                  data-testid="cta-categoria"
                  className="px-5 py-2.75 bg-(--accent) text-[oklch(0.18_0.01_155)] rounded-(--radius) font-semibold text-[14px] no-underline tracking-[0.01em] inline-block"
                >
                  Cadastrar categoria →
                </a>
                <a
                  href="#livro"
                  data-testid="cta-livro"
                  className="px-4 py-2.75 bg-transparent text-(--text-dim) border border-(--line-strong) rounded-(--radius) font-medium text-[14px] no-underline inline-block"
                >
                  Cadastrar livro
                </a>
              </div>
            </div>

            <div className="bg-(--bg-2) border border-(--line) rounded-lg p-7 font-mono text-[13px] overflow-hidden">
              <div className="flex items-center gap-1.5 pb-3.5 mb-3.5 border-b border-(--line)">
                {(
                  [
                    "oklch(0.65 0.18 25)",
                    "oklch(0.80 0.15 80)",
                    "oklch(0.75 0.13 155)",
                  ] as const
                ).map((c, i) => (
                  <span
                    key={i}
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ background: c }}
                  />
                ))}
                <span className="ml-3 text-(--text-faint) text-[11px]">
                  cadastro.test.tsx
                </span>
              </div>

              <div className="leading-[1.9] text-(--text-dim)">
                <div>
                  <span className="text-[oklch(0.78_0.13_290)]">describe</span>
                  {"("}
                  <span className="text-(--accent)">
                    {"'cadastro de livros'"}
                  </span>
                  {", () => {"}
                </div>
                {[
                  "'cria categoria'",
                  "'cadastra livro'",
                  "'lista cadastros'",
                ].map((label) => (
                  <div key={label} className="pl-4.5">
                    <span className="text-[oklch(0.78_0.13_290)]">it</span>
                    {"("}
                    <span className="text-(--accent)">{label}</span>
                    {", () => {})"}
                  </div>
                ))}
                <div>{"})"}</div>
              </div>

              <div className="mt-4.5 pt-3.5 border-t border-(--line) flex gap-3 text-[11px] text-(--text-faint)">
                <span>
                  <span className="text-(--accent)">✓</span> 3 passed
                </span>
                <span>0 failed</span>
                <span className="ml-auto">1.24s</span>
              </div>
            </div>
          </div>

          <div className="mt-20 pt-8 border-t border-(--line) grid grid-cols-3 gap-8">
            {[
              { k: "Stack", v: "Next.js · Prisma · TS" },
              { k: "Tests", v: "Jest · RTL · Playwright" },
              { k: "Storage", v: "SQLite (Prisma)" },
            ].map((m) => (
              <div key={m.k}>
                <div className="font-mono text-[11px] tracking-[0.14em] text-(--text-faint) uppercase mb-1.5">
                  {m.k}
                </div>
                <div className="text-base">{m.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="categoria" className={sectionCls}>
        <div className={innerCls}>
          <CadastrarCategoria />
        </div>
      </section>

      <section id="livro" className={sectionCls}>
        <div className={innerCls}>
          <CadastrarLivro />
        </div>
      </section>

      <footer className="p-8 border-t border-(--line) text-center font-mono text-[11px] text-(--text-faint) tracking-[0.06em] relative z-[1]">
        cadastro-livros · feito para testes automatizados
      </footer>
    </div>
  );
}
