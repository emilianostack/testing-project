/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from "@testing-library/react";
import Input from "@/app/pages/components/input";

describe("Input", () => {
  it("renderiza um elemento input", () => {
    render(<Input placeholder="Digite aqui" />);
    expect(screen.getByPlaceholderText("Digite aqui")).toBeInTheDocument();
  });

  it("aplica classe de borda normal quando error=false", () => {
    render(<Input />);
    const input = screen.getByRole("textbox");
    expect(input.className).toContain("border-(--line-strong)");
  });

  it("aplica classe de borda de erro quando error=true", () => {
    render(<Input error />);
    const input = screen.getByRole("textbox");
    expect(input.className).toContain("border-(--danger)");
  });

  it("aplica estilo de foco com accent quando sem erro", () => {
    render(<Input />);
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    expect(input.style.borderColor).toBe("var(--accent-dim)");
    expect(input.style.boxShadow).toContain("oklch");
  });

  it("aplica estilo de foco com danger quando error=true", () => {
    render(<Input error />);
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    expect(input.style.borderColor).toBe("var(--danger)");
    expect(input.style.boxShadow).toContain("oklch");
  });

  it("remove box-shadow e restaura borda normal no blur", () => {
    render(<Input />);
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(input.style.boxShadow).toBe("none");
    expect(input.style.borderColor).toBe("var(--line-strong)");
  });

  it("restaura borda de erro no blur quando error=true", () => {
    render(<Input error />);
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(input.style.boxShadow).toBe("none");
    expect(input.style.borderColor).toBe("var(--danger)");
  });

  it("chama onFocus e onBlur customizados", () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    render(<Input onFocus={onFocus} onBlur={onBlur} />);
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    expect(onFocus).toHaveBeenCalledTimes(1);
    fireEvent.blur(input);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it("repassa props adicionais para o input", () => {
    render(<Input data-testid="meu-input" maxLength={10} />);
    const input = screen.getByTestId("meu-input");
    expect(input).toHaveAttribute("maxlength", "10");
  });
});
