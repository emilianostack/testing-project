import livros from "@/app/controller/livros";

export async function GET() {
  try {
    const livrosList = await livros.obterLivros();

    return Response.json(livrosList, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error: Error | unknown) {
    return Response.json(
      {
        message: `Erro ao obter livros: ${error instanceof Error ? error.message : "erro desconhecido"}`,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { titulo, autor, categoria } = await request.json();

    const novoLivro = await livros.gravarLivro(titulo, autor, categoria);

    return Response.json(novoLivro, { status: 201 });
  } catch (error: Error | unknown) {
    return Response.json(
      {
        message: `Erro ao criar livro: ${error instanceof Error ? error.message : "erro desconhecido"}`,
      },
      { status: 500 },
    );
  }
}
