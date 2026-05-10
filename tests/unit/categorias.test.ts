import categorias from "@/app/controller/categorias";
import { prisma } from "@/app/lib/prisma";

jest.mock("@/app/lib/prisma");

const mockCategoria = prisma.categoria as jest.Mocked<typeof prisma.categoria>;
const mockLivro = prisma.livro as jest.Mocked<typeof prisma.livro>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("obterCategorias", () => {
  it("retorna a lista de categorias", async () => {
    const lista = [{ id: 1, codigo: 1, nome: "Ficção" }];
    mockCategoria.findMany.mockResolvedValue(lista);
    const resultado = await categorias.obterCategorias();
    expect(resultado).toEqual(lista);
  });
});

describe("obterCategoria", () => {
  it("retorna uma categoria pelo id", async () => {
    const cat = { id: 1, codigo: 1, nome: "Ficção" };
    mockCategoria.findUnique.mockResolvedValue(cat);
    const resultado = await categorias.obterCategoria("1");
    expect(resultado).toEqual(cat);
  });
});

describe("gravarCategoria", () => {
  it("lança erro se o nome for vazio", async () => {
    await expect(categorias.gravarCategoria("")).rejects.toThrow(
      "O nome da categoria não pode ser vazio.",
    );
  });

  it("lança erro se o nome já existir", async () => {
    mockCategoria.findFirst.mockResolvedValue({
      id: 1,
      codigo: 1,
      nome: "Ficção",
    });
    await expect(categorias.gravarCategoria("Ficção")).rejects.toThrow(
      "O nome da categoria já existe.",
    );
  });

  it("cria categoria com código incrementado em relação ao último", async () => {
    const criada = { id: 2, codigo: 4, nome: "Comédia" };
    mockCategoria.findFirst.mockResolvedValue(null);
    mockCategoria.aggregate.mockResolvedValue({ _max: { codigo: 3 } } as never);
    mockCategoria.create.mockResolvedValue(criada);

    const resultado = await categorias.gravarCategoria("Comédia");

    expect(resultado).toEqual(criada);
    expect(mockCategoria.create).toHaveBeenCalledWith({
      data: { nome: "Comédia", codigo: 4 },
    });
  });

  it("usa código 1 quando não há categorias cadastradas", async () => {
    const criada = { id: 1, codigo: 1, nome: "Nova" };
    mockCategoria.findFirst.mockResolvedValue(null);
    mockCategoria.aggregate.mockResolvedValue({
      _max: { codigo: null },
    } as never);
    mockCategoria.create.mockResolvedValue(criada);

    await categorias.gravarCategoria("Nova");

    expect(mockCategoria.create).toHaveBeenCalledWith({
      data: { nome: "Nova", codigo: 1 },
    });
  });
});

describe("editarCategoria", () => {
  it("lança erro se o id for vazio", async () => {
    await expect(
      categorias.editarCategoria({ id: "", codigo: 1, nome: "Ficção" }),
    ).rejects.toThrow("O ID da categoria não pode ser vazio.");
  });

  it("lança erro se o código for 0", async () => {
    await expect(
      categorias.editarCategoria({ id: "1", codigo: 0, nome: "Ficção" }),
    ).rejects.toThrow("O código da categoria não pode ser vazio.");
  });

  it("lança erro se o nome for vazio", async () => {
    await expect(
      categorias.editarCategoria({ id: "1", codigo: 1, nome: "" }),
    ).rejects.toThrow("O nome da categoria não pode ser vazio.");
  });

  it("lança erro se o nome já existir para outro id", async () => {
    mockCategoria.findFirst.mockResolvedValue({
      id: 2,
      codigo: 2,
      nome: "Ficção",
    });
    await expect(
      categorias.editarCategoria({ id: "1", codigo: 1, nome: "Ficção" }),
    ).rejects.toThrow("O nome da categoria já existe.");
  });

  it("atualiza a categoria com sucesso", async () => {
    const atualizada = { id: 1, codigo: 1, nome: "Ficção Científica" };
    mockCategoria.findFirst.mockResolvedValue(null);
    mockCategoria.update.mockResolvedValue(atualizada);

    const resultado = await categorias.editarCategoria({
      id: "1",
      codigo: 1,
      nome: "Ficção Científica",
    });

    expect(resultado).toEqual(atualizada);
    expect(mockCategoria.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { nome: "Ficção Científica" },
    });
  });
});

describe("excluirCategoria", () => {
  it("lança erro se existirem livros associados", async () => {
    mockCategoria.findUnique.mockResolvedValue({
      id: 1,
      codigo: 1,
      nome: "Ficção",
    });
    mockLivro.findMany.mockResolvedValue([
      { id: 1, codigo: 1, titulo: "Duna", autor: "Frank", categoriaId: 1 },
    ]);
    await expect(categorias.excluirCategoria("1")).rejects.toThrow(
      "Não é possível excluir a categoria, existem livros associados a ela.",
    );
  });

  it("exclui a categoria com sucesso quando sem livros", async () => {
    const cat = { id: 1, codigo: 1, nome: "Ficção" };
    mockCategoria.findUnique.mockResolvedValue(cat);
    mockLivro.findMany.mockResolvedValue([]);
    mockCategoria.delete.mockResolvedValue(cat);

    const resultado = await categorias.excluirCategoria("1");

    expect(resultado).toEqual(cat);
    expect(mockCategoria.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
