import { test, expect } from "@playwright/test";
import { resetDb, seedCategoria, seedLivro } from "../helpers";

test.describe("Livros E2E Tests - Sucesso", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async () => {
    await resetDb();
  });

  test("tem titulo home", async ({ page }) => {
    await page.goto("http://localhost:3000/#home");

    await expect(page).toHaveTitle(/Cadastro de Livros/);
  });

  test("Cadastrar livro", async ({ page, request }) => {
    await seedCategoria(request, "teste-categoria");
    const hydrated = page.waitForResponse(
      (resp) =>
        resp.url().includes("/api/livros") && resp.request().method() === "GET",
    );
    await page.goto("http://localhost:3000/#livros");
    await hydrated;

    await page.getByTestId("input-livro-titulo").fill("Teste Livro");
    await page.getByTestId("input-livro-autor").fill("Teste Autor");
    await page
      .getByTestId("select-livro-categoria")
      .selectOption("teste-categoria");
    await page.getByTestId("btn-cadastrar-livro").click();

    await expect(page.getByTestId("tabela-livros")).toBeVisible();
  });

  test("Listar livro", async ({ page, request }) => {
    await seedCategoria(request, "teste-categoria");
    await seedLivro(request, {
      titulo: "Teste Livro",
      autor: "Teste Autor",
      categoriaNome: "teste-categoria",
    });
    await page.goto("http://localhost:3000/#livros");

    const tabela = page.getByTestId("tabela-livros");
    await expect(tabela).toBeVisible();
    await expect(tabela).toContainText("Teste Livro");
  });

  test("Excluir livro", async ({ page, request }) => {
    await seedCategoria(request, "teste-categoria");
    await seedLivro(request, {
      titulo: "Teste Livro",
      autor: "Teste Autor",
      categoriaNome: "teste-categoria",
    });
    await page.goto("http://localhost:3000/#livros");

    const tabela = page.getByTestId("tabela-livros");
    await expect(tabela).toBeVisible();
    await expect(tabela).toContainText("Teste Livro");
    await page.getByRole("button", { name: "Excluir Teste Livro" }).click();
    await expect(page.getByTestId("empty-livros")).toBeVisible();
  });
});

test.describe("Livros E2E Tests - Erro", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async () => {
    await resetDb();
  });

  test("Cadastrar livro - sem título", async ({ page }) => {
    const hydrated = page.waitForResponse(
      (resp) =>
        resp.url().includes("/api/livros") && resp.request().method() === "GET",
    );
    await page.goto("http://localhost:3000/#livros");
    await hydrated;

    await page.getByTestId("input-livro-titulo").fill("");
    await page.getByTestId("btn-cadastrar-livro").click();

    await expect(page.getByTestId("error-livro-titulo")).toBeVisible();
  });

  test("Cadastrar livro - título já cadastrado", async ({ page, request }) => {
    await seedCategoria(request, "teste-categoria");
    await seedLivro(request, {
      titulo: "Teste Livro",
      autor: "Teste Autor",
      categoriaNome: "teste-categoria",
    });

    const hydrated = page.waitForResponse(
      (resp) =>
        resp.url().includes("/api/livros") && resp.request().method() === "GET",
    );
    await page.goto("http://localhost:3000/#livros");
    await hydrated;

    await page.getByTestId("input-livro-titulo").fill("Teste Livro");
    await page.getByTestId("input-livro-autor").fill("Teste Autor");
    await page
      .getByTestId("select-livro-categoria")
      .selectOption("teste-categoria");
    await page.getByTestId("btn-cadastrar-livro").click();

    await expect(page.getByTestId("error-livro-titulo")).toBeVisible();
  });

  test("Cadastrar livro - sem titulo", async ({ page, request }) => {
    await seedCategoria(request, "teste-categoria");

    const hydrated = page.waitForResponse(
      (resp) =>
        resp.url().includes("/api/livros") && resp.request().method() === "GET",
    );
    await page.goto("http://localhost:3000/#livros");
    await hydrated;

    await page.getByTestId("input-livro-autor").fill("Teste Autor");
    await page
      .getByTestId("select-livro-categoria")
      .selectOption("teste-categoria");
    await page.getByTestId("btn-cadastrar-livro").click();

    await expect(page.getByTestId("error-livro-titulo")).toBeVisible();
  });

  test("Cadastrar livro - Sem autor", async ({ page, request }) => {
    await seedCategoria(request, "teste-categoria");

    const hydrated = page.waitForResponse(
      (resp) =>
        resp.url().includes("/api/livros") && resp.request().method() === "GET",
    );
    await page.goto("http://localhost:3000/#livros");
    await hydrated;

    await page.getByTestId("input-livro-titulo").fill("Teste Livro");
    await page
      .getByTestId("select-livro-categoria")
      .selectOption("teste-categoria");
    await page.getByTestId("btn-cadastrar-livro").click();

    await expect(page.getByTestId("error-livro-autor")).toBeVisible();
  });

  test("Cadastrar livro - Sem categoria", async ({ page, request }) => {
    await seedCategoria(request, "teste-categoria");

    const hydrated = page.waitForResponse(
      (resp) =>
        resp.url().includes("/api/livros") && resp.request().method() === "GET",
    );
    await page.goto("http://localhost:3000/#livros");
    await hydrated;

    await page.getByTestId("input-livro-titulo").fill("Teste Livro");
    await page.getByTestId("input-livro-autor").fill("Teste Autor");
    await page.getByTestId("btn-cadastrar-livro").click();

    await expect(page.getByTestId("error-livro-categoria")).toBeVisible();
  });
});
