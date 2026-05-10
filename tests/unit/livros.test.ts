import livros from "@/app/controller/livros";
import { prisma } from "@/app/lib/prisma";

jest.mock("@/app/lib/prisma");

const mockLivro = prisma.livro as jest.Mocked<typeof prisma.livro>;

const CAT = { id: 1, codigo: 1, nome: "Ficção Científica" };

beforeEach(() => {
  jest.clearAllMocks();
});

describe("obterLivros", () => {
  it("retorna livros com o nome da categoria preenchido", async () => {
    const lista = [
      {
        id: 1,
        codigo: 1,
        titulo: "Duna",
        autor: "Frank Herbert",
        categoriaId: 1,
        categoria: CAT,
      },
    ];
    mockLivro.findMany.mockResolvedValue(lista as never);

    const resultado = await livros.obterLivros();

    expect(resultado[0].categoriaNome).toBe("Ficção Científica");
  });
});

describe("gravarLivro", () => {
  it("lança erro se o título for vazio", async () => {
    await expect(livros.gravarLivro("", "Autor", 1)).rejects.toThrow(
      "O título do livro não pode ser vazio.",
    );
  });

  it("lança erro se o autor for vazio", async () => {
    await expect(livros.gravarLivro("Título", "", 1)).rejects.toThrow(
      "O autor do livro não pode ser vazio.",
    );
  });

  it("lança erro se a categoria for 0", async () => {
    await expect(livros.gravarLivro("Título", "Autor", 0)).rejects.toThrow(
      "A categoria do livro não pode ser vazia.",
    );
  });

  it("cria livro com código incrementado em relação ao último", async () => {
    const criado = {
      id: 2,
      codigo: 6,
      titulo: "Livro B",
      autor: "Autor B",
      categoriaId: 1,
    };
    mockLivro.aggregate.mockResolvedValue({ _max: { codigo: 5 } } as never);
    mockLivro.create.mockResolvedValue(criado);

    const resultado = await livros.gravarLivro("Livro B", "Autor B", 1);

    expect(resultado).toEqual(criado);
    expect(mockLivro.create).toHaveBeenCalledWith({
      data: { titulo: "Livro B", autor: "Autor B", categoriaId: 1, codigo: 6 },
    });
  });

  it("usa código 1 quando não há livros cadastrados", async () => {
    mockLivro.aggregate.mockResolvedValue({ _max: { codigo: null } } as never);
    mockLivro.create.mockResolvedValue({
      id: 1,
      codigo: 1,
      titulo: "Primeiro",
      autor: "Autor",
      categoriaId: 1,
    });

    await livros.gravarLivro("Primeiro", "Autor", 1);

    expect(mockLivro.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ codigo: 1 }) }),
    );
  });
});

describe("editarLivro", () => {
  it("lança erro se o id for vazio", async () => {
    await expect(
      livros.editarLivro({
        id: "",
        codigo: 1,
        titulo: "T",
        autor: "A",
        categoria: 1,
      }),
    ).rejects.toThrow("O ID do livro não pode ser vazio.");
  });

  it("lança erro se o código for 0", async () => {
    await expect(
      livros.editarLivro({
        id: "l1",
        codigo: 0,
        titulo: "T",
        autor: "A",
        categoria: 1,
      }),
    ).rejects.toThrow("O código do livro não pode ser vazio.");
  });

  it("lança erro se o título for vazio", async () => {
    await expect(
      livros.editarLivro({
        id: "l1",
        codigo: 1,
        titulo: "",
        autor: "A",
        categoria: 1,
      }),
    ).rejects.toThrow("O título do livro não pode ser vazio.");
  });

  it("lança erro se o autor for vazio", async () => {
    await expect(
      livros.editarLivro({
        id: "l1",
        codigo: 1,
        titulo: "T",
        autor: "",
        categoria: 1,
      }),
    ).rejects.toThrow("O autor do livro não pode ser vazio.");
  });

  it("lança erro se a categoria for 0", async () => {
    await expect(
      livros.editarLivro({
        id: "l1",
        codigo: 1,
        titulo: "T",
        autor: "A",
        categoria: 0,
      }),
    ).rejects.toThrow("A categoria do livro não pode ser vazia.");
  });

  it("lança erro se o título já existir para outro id", async () => {
    mockLivro.findFirst.mockResolvedValue({
      id: 2,
      codigo: 2,
      titulo: "Duna",
      autor: "Frank",
      categoriaId: 1,
    });
    await expect(
      livros.editarLivro({
        id: "1",
        codigo: 1,
        titulo: "Duna",
        autor: "Autor",
        categoria: 1,
      }),
    ).rejects.toThrow("O título do livro já existe.");
  });

  it("atualiza o livro com sucesso", async () => {
    const atualizado = {
      id: 1,
      codigo: 1,
      titulo: "Duna Editada",
      autor: "Frank Herbert",
      categoriaId: 1,
    };
    mockLivro.findFirst.mockResolvedValue(null);
    mockLivro.update.mockResolvedValue(atualizado);

    const resultado = await livros.editarLivro({
      id: "1",
      codigo: 1,
      titulo: "Duna Editada",
      autor: "Frank Herbert",
      categoria: 1,
    });

    expect(resultado).toEqual(atualizado);
    expect(mockLivro.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { titulo: "Duna Editada", autor: "Frank Herbert", categoriaId: 1 },
    });
  });
});

describe("excluirLivro", () => {
  it("lança erro se o id for vazio", async () => {
    await expect(livros.excluirLivro("")).rejects.toThrow(
      "O ID do livro não pode ser vazio.",
    );
  });

  it("exclui o livro com sucesso", async () => {
    const livro = {
      id: 1,
      codigo: 1,
      titulo: "Duna",
      autor: "Frank",
      categoriaId: 1,
    };
    mockLivro.findUnique.mockResolvedValue(livro);
    mockLivro.delete.mockResolvedValue(livro);

    await livros.excluirLivro("1");

    expect(mockLivro.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
