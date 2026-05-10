import categorias from "@/app/controller/categorias";

export async function GET() {
  try {
    const categoriasList = await categorias.obterCategorias();

    return Response.json(categoriasList, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error: Error | unknown) {
    return Response.json(
      {
        message: `Erro ao obter categorias: ${error instanceof Error ? error.message : "erro desconhecido"}`,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { nome } = await request.json();

    const novaCategoria = await categorias.gravarCategoria(nome);

    return Response.json(novaCategoria, { status: 201 });
  } catch (error: Error | unknown) {
    return Response.json(
      {
        message: `Erro ao criar categoria: ${error instanceof Error ? error.message : "erro desconhecido"}`,
      },
      { status: 500 },
    );
  }
}
