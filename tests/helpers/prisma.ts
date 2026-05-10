import { prisma } from "@/app/lib/prisma";

export { prisma };

export async function resetDb() {
  await prisma.livro.deleteMany();
  await prisma.categoria.deleteMany();
}

export async function seedDb() {
  const cat1 = await prisma.categoria.create({
    data: { nome: "Ficção Científica", codigo: 1 },
  });
  const cat2 = await prisma.categoria.create({
    data: { nome: "Romance", codigo: 2 },
  });
  const livro1 = await prisma.livro.create({
    data: {
      titulo: "Duna",
      autor: "Frank Herbert",
      categoriaId: cat1.id,
      codigo: 1,
    },
  });
  return { cat1, cat2, livro1 };
}
