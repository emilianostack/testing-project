import { execSync } from "child_process";
import { join } from "path";
import { APIRequestContext } from "@playwright/test";

export function resetDb() {
  execSync(`node "${join(__dirname, "reset.cjs")}"`, { stdio: "inherit" });
}

export async function seedCategoria(request: APIRequestContext, nome: string) {
  await request.post("http://localhost:3000/api/categoria", {
    data: { nome },
  });
}

export async function seedLivro(
  request: APIRequestContext,
  {
    titulo,
    autor,
    categoriaNome,
  }: { titulo: string; autor: string; categoriaNome: string },
) {
  const categoriaResponse = await request.get(
    "http://localhost:3000/api/categoria",
  );
  const categorias = await categoriaResponse.json();
  const categoria = categorias.find(
    (c: { nome: string }) => c.nome === categoriaNome,
  );

  if (!categoria) {
    throw new Error(`Categoria "${categoriaNome}" não encontrada.`);
  }

  await request.post("http://localhost:3000/api/livros", {
    data: { titulo, autor, categoria: categoria.id },
  });
}
