import { prisma, resetDb, seedDb } from "../helpers/prisma";
import categorias from "@/app/controller/categorias";

let cat1: Awaited<ReturnType<typeof seedDb>>["cat1"];
let cat2: Awaited<ReturnType<typeof seedDb>>["cat2"];

beforeAll(async () => {
  await resetDb();
  const seed = await seedDb();
  cat1 = seed.cat1;
  cat2 = seed.cat2;
}, 15_000);

afterAll(async () => {
  await prisma.$disconnect();
});

describe("obterCategorias", () => {
  it("retorna todas as categorias cadastradas", async () => {
    const resultado = await categorias.obterCategorias();
    expect(resultado.length).toBeGreaterThanOrEqual(2);
    expect(resultado.some((c) => c.nome === "Ficção Científica")).toBe(true);
  });
});

describe("gravarCategoria", () => {
  it("cadastra uma nova categoria", async () => {
    const resultado = await categorias.gravarCategoria("Terror");
    expect(resultado.nome).toBe("Terror");
    expect(typeof resultado.codigo).toBe("number");
  });

  it("lança erro ao tentar cadastrar nome duplicado", async () => {
    await expect(
      categorias.gravarCategoria("Ficção Científica"),
    ).rejects.toThrow("O nome da categoria já existe.");
  });

  it("lança erro se nome for vazio", async () => {
    await expect(categorias.gravarCategoria("")).rejects.toThrow(
      "O nome da categoria não pode ser vazio.",
    );
  });
});

describe("editarCategoria", () => {
  it("atualiza o nome de uma categoria existente", async () => {
    const resultado = await categorias.editarCategoria({
      id: String(cat1.id),
      codigo: cat1.codigo,
      nome: "Ficção Científica Atualizada",
    });
    expect(resultado.nome).toBe("Ficção Científica Atualizada");
  });

  it("lança erro ao tentar usar nome de outra categoria", async () => {
    await expect(
      categorias.editarCategoria({
        id: String(cat1.id),
        codigo: cat1.codigo,
        nome: "Romance",
      }),
    ).rejects.toThrow("O nome da categoria já existe.");
  });
});

describe("excluirCategoria", () => {
  it("exclui uma categoria sem livros associados", async () => {
    const nova = await prisma.categoria.create({
      data: { nome: "Para Excluir", codigo: 99 },
    });
    await expect(
      categorias.excluirCategoria(String(nova.id)),
    ).resolves.toBeDefined();
  });

  it("lança erro ao excluir categoria com livros associados", async () => {
    await prisma.livro.create({
      data: {
        titulo: "Dom Casmurro",
        autor: "Machado",
        categoriaId: cat2.id,
        codigo: 50,
      },
    });
    await expect(categorias.excluirCategoria(String(cat2.id))).rejects.toThrow(
      "Não é possível excluir a categoria, existem livros associados a ela.",
    );
  });
});
