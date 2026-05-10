import { prisma, resetDb, seedDb } from "../helpers/prisma";
import livros from "@/app/controller/livros";

let cat1: Awaited<ReturnType<typeof seedDb>>["cat1"];
let livro1: Awaited<ReturnType<typeof seedDb>>["livro1"];

beforeAll(async () => {
  await resetDb();
  const seed = await seedDb();
  cat1 = seed.cat1;
  livro1 = seed.livro1;
}, 15_000);

afterAll(async () => {
  await prisma.$disconnect();
});

describe("obterLivros", () => {
  it("retorna livros com o nome da categoria preenchido", async () => {
    const resultado = await livros.obterLivros();
    expect(resultado.length).toBeGreaterThanOrEqual(1);
    expect(resultado[0].categoriaNome).toBe("Ficção Científica");
  });
});

describe("gravarLivro", () => {
  it("cadastra um novo livro com código incrementado", async () => {
    const resultado = await livros.gravarLivro(
      "Fundação",
      "Isaac Asimov",
      cat1.id,
    );
    expect(resultado.titulo).toBe("Fundação");
    expect(resultado.codigo).toBe(livro1.codigo + 1);
  });

  it("lança erro se o título for vazio", async () => {
    await expect(livros.gravarLivro("", "Autor", cat1.id)).rejects.toThrow(
      "O título do livro não pode ser vazio.",
    );
  });

  it("lança erro se o autor for vazio", async () => {
    await expect(livros.gravarLivro("Título", "", cat1.id)).rejects.toThrow(
      "O autor do livro não pode ser vazio.",
    );
  });

  it("lança erro se a categoria for 0", async () => {
    await expect(livros.gravarLivro("Título", "Autor", 0)).rejects.toThrow(
      "A categoria do livro não pode ser vazia.",
    );
  });
});

describe("editarLivro", () => {
  it("atualiza os dados de um livro existente", async () => {
    const resultado = await livros.editarLivro({
      id: String(livro1.id),
      codigo: livro1.codigo,
      titulo: "Duna — Edição Revisada",
      autor: "Frank Herbert",
      categoria: cat1.id,
    });
    expect(resultado.titulo).toBe("Duna — Edição Revisada");
  });

  it("lança erro se o título já existir em outro livro", async () => {
    await expect(
      livros.editarLivro({
        id: String(livro1.id),
        codigo: livro1.codigo,
        titulo: "Fundação",
        autor: "Frank Herbert",
        categoria: cat1.id,
      }),
    ).rejects.toThrow("O título do livro já existe.");
  });

  it("lança erro se o id for vazio", async () => {
    await expect(
      livros.editarLivro({
        id: "",
        codigo: 1,
        titulo: "T",
        autor: "A",
        categoria: cat1.id,
      }),
    ).rejects.toThrow("O ID do livro não pode ser vazio.");
  });
});

describe("excluirLivro", () => {
  it("exclui um livro existente pelo id", async () => {
    const temp = await prisma.livro.create({
      data: {
        titulo: "Temp",
        autor: "Temp",
        categoriaId: cat1.id,
        codigo: 99,
      },
    });
    await expect(livros.excluirLivro(String(temp.id))).resolves.toBeDefined();
  });

  it("lança erro se o id for vazio", async () => {
    await expect(livros.excluirLivro("")).rejects.toThrow(
      "O ID do livro não pode ser vazio.",
    );
  });
});
