import { prisma } from "@/app/lib/prisma";

interface LivroProps {
  id: string;
  titulo: string;
  autor: string;
  codigo: number;
  categoria: number;
}

async function obterLivros() {
  const lista = await prisma.livro.findMany({ include: { categoria: true } });
  return lista.map(({ categoria, ...livro }) => ({
    ...livro,
    categoria: livro.categoriaId,
    categoriaNome: categoria.nome,
  }));
}

async function obterLivro(id: string) {
  return prisma.livro.findUnique({ where: { id: parseInt(id) } });
}

async function gravarLivro(
  titulo: string,
  autor: string,
  categoria: number = 0,
) {
  if (titulo === "") {
    throw new Error("O título do livro não pode ser vazio.");
  }
  if (autor === "") {
    throw new Error("O autor do livro não pode ser vazio.");
  }
  if (categoria === 0) {
    throw new Error("A categoria do livro não pode ser vazia.");
  }

  const tituloJaExiste = await prisma.livro.findFirst({ where: { titulo } });
  if (tituloJaExiste) throw new Error("O título do livro já existe.");

  const { _max } = await prisma.livro.aggregate({ _max: { codigo: true } });
  const codigo = (_max.codigo ?? 0) + 1;

  return prisma.livro.create({
    data: { titulo, autor, categoriaId: categoria, codigo },
  });
}

async function obterLivrosPorCategoria(categoriaId: number) {
  return prisma.livro.findMany({ where: { categoriaId } });
}

async function editarLivro({
  id = "",
  codigo = 0,
  titulo = "",
  autor = "",
  categoria = 0,
}: LivroProps) {
  if (id === "") {
    throw new Error("O ID do livro não pode ser vazio.");
  }
  if (codigo === 0) {
    throw new Error("O código do livro não pode ser vazio.");
  }
  if (titulo === "") {
    throw new Error("O título do livro não pode ser vazio.");
  }
  if (autor === "") {
    throw new Error("O autor do livro não pode ser vazio.");
  }
  if (categoria === 0) {
    throw new Error("A categoria do livro não pode ser vazia.");
  }

  const tituloJaExiste = await prisma.livro.findFirst({
    where: { titulo, NOT: { id: parseInt(id) } },
  });
  if (tituloJaExiste) {
    throw new Error("O título do livro já existe.");
  }

  return prisma.livro.update({
    where: { id: parseInt(id) },
    data: { titulo, autor, categoriaId: categoria },
  });
}

async function excluirLivro(id: string) {
  if (id === "") {
    throw new Error("O ID do livro não pode ser vazio.");
  }

  const livro = await obterLivro(id);
  if (!livro) {
    throw new Error("O livro não existe.");
  }

  return prisma.livro.delete({ where: { id: parseInt(id) } });
}

const livros = {
  obterLivros,
  obterLivro,
  obterLivrosPorCategoria,
  gravarLivro,
  editarLivro,
  excluirLivro,
};
export default livros;
