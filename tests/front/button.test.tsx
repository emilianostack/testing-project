/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "@/app/pages/components/button";

describe("Button", () => {
  it("renderiza com texto filho", () => {
    render(<Button>Salvar</Button>);
    expect(screen.getByRole("button", { name: "Salvar" })).toBeInTheDocument();
  });

  it("variante primary tem classe de accent por padrão", () => {
    render(<Button>Salvar</Button>);
    expect(screen.getByRole("button").className).toContain("bg-(--accent)");
  });

  it("variante danger tem borda e texto de danger", () => {
    render(<Button variant="danger">Excluir</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("border-(--danger)");
    expect(btn.className).toContain("text-(--danger)");
  });

  it("disabled aplica cursor-not-allowed e bg de surface", () => {
    render(<Button disabled>Salvar</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    expect(btn.className).toContain("cursor-not-allowed");
    expect(btn.className).toContain("bg-(--surface-2)");
  });

  it("mouseenter em primary muda o background", () => {
    render(<Button>Salvar</Button>);
    const btn = screen.getByRole("button");
    fireEvent.mouseEnter(btn);
    expect(btn.style.background).toBe("oklch(0.84 0.13 155)");
  });

  it("mouseleave em primary restaura o background", () => {
    render(<Button>Salvar</Button>);
    const btn = screen.getByRole("button");
    fireEvent.mouseEnter(btn);
    fireEvent.mouseLeave(btn);
    expect(btn.style.background).toBe("var(--accent)");
  });

  it("mouseenter em disabled não muda o background", () => {
    render(<Button disabled>Salvar</Button>);
    const btn = screen.getByRole("button");
    fireEvent.mouseEnter(btn);
    expect(btn.style.background).toBe("");
  });

  it("mouseenter em danger não muda o background", () => {
    render(<Button variant="danger">Excluir</Button>);
    const btn = screen.getByRole("button");
    fireEvent.mouseEnter(btn);
    expect(btn.style.background).toBe("");
  });

  it("chama onMouseEnter e onMouseLeave customizados", () => {
    const onMouseEnter = jest.fn();
    const onMouseLeave = jest.fn();
    render(
      <Button onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        Salvar
      </Button>,
    );
    const btn = screen.getByRole("button");
    fireEvent.mouseEnter(btn);
    expect(onMouseEnter).toHaveBeenCalledTimes(1);
    fireEvent.mouseLeave(btn);
    expect(onMouseLeave).toHaveBeenCalledTimes(1);
  });

  it("repassa props adicionais para o button", () => {
    render(
      <Button data-testid="meu-btn" type="submit">
        Salvar
      </Button>,
    );
    expect(screen.getByTestId("meu-btn")).toHaveAttribute("type", "submit");
  });

  it("aceita className extra", () => {
    render(<Button className="extra-class">Salvar</Button>);
    expect(screen.getByRole("button").className).toContain("extra-class");
  });
});
