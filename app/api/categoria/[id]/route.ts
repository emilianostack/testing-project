import categorias from "@/app/controller/categorias";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { codigo, nome } = await request.json();

    const { id } = await params;
    const novaCategoria = await categorias.editarCategoria({
      id,
      codigo,
      nome,
    });

    return Response.json(novaCategoria, { status: 200 });
  } catch (error: Error | unknown) {
    return Response.json(
      {
        message: `Erro ao atualizar categoria: ${error instanceof Error ? error.message : "erro desconhecido"}`,
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
    const categoria = await categorias.excluirCategoria(id);
    return Response.json(categoria, { status: 200 });
  } catch (error: Error | unknown) {
    return Response.json(
      {
        message: `Erro ao excluir categoria: ${error instanceof Error ? error.message : "erro desconhecido"}`,
      },
      { status: 500 },
    );
  }
}
