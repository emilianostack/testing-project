/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from "@testing-library/react";
import Nav from "@/app/pages/components/nav";

const mockObserve = jest.fn();
const mockDisconnect = jest.fn();

beforeEach(() => {
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: mockObserve,
    disconnect: mockDisconnect,
  }));
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Nav", () => {
  it("renderiza o elemento nav", () => {
    render(<Nav />);
    expect(screen.getByTestId("main-nav")).toBeInTheDocument();
  });

  it("renderiza os 3 links de seção", () => {
    render(<Nav />);
    expect(screen.getByTestId("nav-home")).toBeInTheDocument();
    expect(screen.getByTestId("nav-categoria")).toBeInTheDocument();
    expect(screen.getByTestId("nav-livro")).toBeInTheDocument();
  });

  it("exibe os labels corretos", () => {
    render(<Nav />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Categoria")).toBeInTheDocument();
    expect(screen.getByText("Livro")).toBeInTheDocument();
  });

  it("exibe o nome do projeto e versão", () => {
    render(<Nav />);
    expect(screen.getByText("cadastro-livros")).toBeInTheDocument();
    expect(screen.getByText("v0.1.0")).toBeInTheDocument();
  });

  it("link home está ativo por padrão", () => {
    render(<Nav />);
    expect(screen.getByTestId("nav-home").className).toContain(
      "bg-(--surface)",
    );
  });

  it("links inativos têm fundo transparente", () => {
    render(<Nav />);
    expect(screen.getByTestId("nav-categoria").className).toContain(
      "bg-transparent",
    );
    expect(screen.getByTestId("nav-livro").className).toContain(
      "bg-transparent",
    );
  });

  it("configura IntersectionObserver no mount", () => {
    render(<Nav />);
    expect(global.IntersectionObserver).toHaveBeenCalledTimes(1);
  });

  it("desconecta o IntersectionObserver no unmount", () => {
    const { unmount } = render(<Nav />);
    unmount();
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  it("clique no link chama scrollIntoView", () => {
    const scrollIntoView = jest.fn();
    jest
      .spyOn(document, "getElementById")
      .mockReturnValue({ scrollIntoView } as unknown as HTMLElement);

    render(<Nav />);
    fireEvent.click(screen.getByTestId("nav-categoria"));
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });
  });

  it("links têm href com hash correto", () => {
    render(<Nav />);
    expect(screen.getByTestId("nav-home")).toHaveAttribute("href", "#home");
    expect(screen.getByTestId("nav-categoria")).toHaveAttribute(
      "href",
      "#categoria",
    );
    expect(screen.getByTestId("nav-livro")).toHaveAttribute("href", "#livro");
  });
});
