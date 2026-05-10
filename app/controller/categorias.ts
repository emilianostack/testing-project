import { prisma } from "@/app/lib/prisma";
import livros from "./livros";

interface Categoria {
  id: string;
  codigo: number;
  nome: string;
}

async function obterCategorias() {
  return prisma.categoria.findMany();
}

async function obterCategoria(id: string) {
  return prisma.categoria.findUnique({ where: { id: parseInt(id) } });
}

async function gravarCategoria(nome: string) {
  if (nome === "") {
    throw new Error("O nome da categoria não pode ser vazio.");
  }

  const nomeJaExiste = await prisma.categoria.findFirst({ where: { nome } });
  if (nomeJaExiste) {
    throw new Error("O nome da categoria já existe.");
  }

  const { _max } = await prisma.categoria.aggregate({ _max: { codigo: true } });
  const codigo = (_max.codigo ?? 0) + 1;

  return prisma.categoria.create({ data: { nome, codigo } });
}

async function editarCategoria({ id = "", codigo = 0, nome = "" }: Categoria) {
  if (id === "") {
    throw new Error("O ID da categoria não pode ser vazio.");
  }
  if (codigo === 0) {
    throw new Error("O código da categoria não pode ser vazio.");
  }
  if (nome === "") {
    throw new Error("O nome da categoria não pode ser vazio.");
  }

  const nomeJaExiste = await prisma.categoria.findFirst({
    where: { nome, NOT: { id: parseInt(id) } },
  });
  if (nomeJaExiste) {
    throw new Error("O nome da categoria já existe.");
  }

  return prisma.categoria.update({
    where: { id: parseInt(id) },
    data: { nome },
  });
}

async function excluirCategoria(id: string) {
  const categoria = await obterCategoria(id);
  if (!categoria) {
    throw new Error("Categoria não encontrada.");
  }

  const livrosAssociados = await livros.obterLivrosPorCategoria(categoria.id);
  if (livrosAssociados.length > 0) {
    throw new Error(
      "Não é possível excluir a categoria, existem livros associados a ela.",
    );
  }

  return prisma.categoria.delete({ where: { id: parseInt(id) } });
}

const categorias = {
  obterCategorias,
  obterCategoria,
  gravarCategoria,
  editarCategoria,
  excluirCategoria,
};
export default categorias;
