import { test, expect } from "@playwright/test";
import { resetDb, seedCategoria, seedLivro } from "../helpers";

test.describe("Categoria E2E Tests - Sucesso", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async () => {
    await resetDb();
  });

  test("tem titulo home", async ({ page }) => {
    await page.goto("http://localhost:3000/#home");

    await expect(page).toHaveTitle(/Cadastro de Livros/);
  });

  test("Cadastrar categoria", async ({ page }) => {
    const hydrated = page.waitForResponse(
      (resp) =>
        resp.url().includes("/api/categoria") &&
        resp.request().method() === "GET",
    );
    await page.goto("http://localhost:3000/#categoria");
    await hydrated;

    await page.getByTestId("input-categoria-nome").fill("teste-categoria");
    await page.getByTestId("btn-cadastrar-categoria").click();

    await expect(page.getByTestId("tabela-categorias")).toBeVisible();
  });

  test("Listar categoria", async ({ page, request }) => {
    await seedCategoria(request, "teste-categoria");
    await page.goto("http://localhost:3000/#categoria");

    const tabela = page.getByTestId("tabela-categorias");
    await expect(tabela).toBeVisible();
    await expect(tabela).toContainText("teste-categoria");
  });

  test("Excluir categoria", async ({ page, request }) => {
    await seedCategoria(request, "teste-categoria");
    await page.goto("http://localhost:3000/#categoria");

    const tabela = page.getByTestId("tabela-categorias");
    await expect(tabela).toBeVisible();
    await expect(tabela).toContainText("teste-categoria");

    const deleted = page.waitForResponse(
      (resp) =>
        resp.url().includes("/api/categoria/") &&
        resp.request().method() === "DELETE",
    );
    const refetched = page.waitForResponse(
      (resp) =>
        resp.url().includes("/api/categoria") &&
        !resp.url().includes("/api/categoria/") &&
        resp.request().method() === "GET",
    );
    await page.getByRole("button", { name: "Excluir teste-categoria" }).click();
    await deleted;
    await refetched;

    await expect(page.getByTestId("empty-categorias")).toBeVisible();
  });
});

test.describe("Categoria E2E Tests - Erro", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async () => {
    await resetDb();
  });

  test("Cadastrar categoria - sem nome", async ({ page }) => {
    const hydrated = page.waitForResponse(
      (resp) =>
        resp.url().includes("/api/categoria") &&
        resp.request().method() === "GET",
    );
    await page.goto("http://localhost:3000/#categoria");
    await hydrated;

    await page.getByTestId("input-categoria-nome").fill("");
    await page.getByTestId("btn-cadastrar-categoria").click();

    await expect(page.getByTestId("error-categoria-nome")).toBeVisible();
  });

  test("Cadastrar categoria - nome já cadastrado", async ({
    page,
    request,
  }) => {
    await seedCategoria(request, "teste-categoria");

    const hydrated = page.waitForResponse(
      (resp) =>
        resp.url().includes("/api/categoria") &&
        resp.request().method() === "GET",
    );
    await page.goto("http://localhost:3000/#categoria");
    await hydrated;

    await page.getByTestId("input-categoria-nome").fill("teste-categoria");
    await page.getByTestId("btn-cadastrar-categoria").click();

    await expect(page.getByTestId("error-categoria-nome")).toBeVisible();
  });

  test("Excluir categoria - contem livro", async ({ page, request }) => {
    await seedCategoria(request, "teste-categoria");
    await seedLivro(request, {
      titulo: "Teste Livro",
      autor: "Teste Autor",
      categoriaNome: "teste-categoria",
    });
    await page.goto("http://localhost:3000/#categoria");

    const tabela = page.getByTestId("tabela-categorias");
    await expect(tabela).toBeVisible();
    await expect(tabela).toContainText("teste-categoria");
    await page.getByRole("button", { name: "Excluir teste-categoria" }).click();
    await expect(page.getByTestId("error-excluir-categoria")).toBeVisible();
  });
});
