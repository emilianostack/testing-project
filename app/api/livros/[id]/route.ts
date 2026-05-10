import livros from "@/app/controller/livros";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { codigo, titulo, autor, categoria } = await request.json();
    const { id } = await params;
    const novoLivro = await livros.editarLivro({
      id,
      codigo,
      titulo,
      autor,
      categoria,
    });
    return Response.json(novoLivro, { status: 200 });
  } catch (error: Error | unknown) {
    return Response.json(
      {
        message: `Erro ao atualizar livro: ${error instanceof Error ? error.message : "erro desconhecido"}`,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const livro = await livros.excluirLivro(id);
    return Response.json(livro, { status: 200 });
  } catch (error: Error | unknown) {
    return Response.json(
      {
        message: `Erro ao excluir livro: ${error instanceof Error ? error.message : "erro desconhecido"}`,
      },
      { status: 500 },
    );
  }
}
