# Cadastro de Livros

Aplicação web para cadastro e gerenciamento de livros e categorias.

## Tecnologias

- **Next.js 16** com Turbopack
- **Prisma** com SQLite (better-sqlite3)
- **Zustand** para gerenciamento de estado
- **Tailwind CSS v4**
- **TypeScript**

## Pré-requisitos

- Node.js 20+
- npm

## Instalação

```bash
npm install
npx prisma generate
npx prisma db push
```

## Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Testes

```bash
# Todos os testes em cascata
npm test

# Individual
npm run test:unit
npm run test:integration
npm run test:front
npm run test:e2e
```

Os testes E2E usam Playwright (Chromium, Firefox, WebKit) e esperam o servidor em `http://localhost:3000`.

## CI

| Workflow  | Trigger          | Jobs                             |
| --------- | ---------------- | -------------------------------- |
| `ci-lint` | push / PR → main | lint, format check               |
| `ci-test` | push / PR → main | unit → integration → front → e2e |

## Estrutura

```
app/
  api/           # Route handlers (categoria, livros)
  controller/    # Lógica de negócio
  hooks/         # Zustand store e hooks
  lib/           # Configuração do Prisma
  pages/         # Componentes de página e UI
tests/
  unit/          # Testes unitários (Jest)
  integration/   # Testes de integração (Jest + banco real)
  front/         # Testes de componente (Jest + jsdom)
  e2e/           # Testes end-to-end (Playwright)
```

## Modelos

- **Categoria** — `id`, `codigo`, `nome`
- **Livro** — `id`, `codigo`, `titulo`, `autor`, `categoria`

Um livro pertence a uma categoria. Não é possível excluir uma categoria que possui livros associados.
