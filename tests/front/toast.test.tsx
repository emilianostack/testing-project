/**
 * @jest-environment jsdom
 */
import { render, screen, act } from "@testing-library/react";
import Toast from "@/app/pages/components/toast";

describe("Toast", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("exibe a mensagem quando show=true", () => {
    render(
      <Toast message="Salvo com sucesso!" show={true} onClose={jest.fn()} />,
    );
    expect(screen.getByText("Salvo com sucesso!")).toBeInTheDocument();
  });

  it("tem classe opacity-100 quando show=true", () => {
    const { container } = render(
      <Toast message="Sucesso!" show={true} onClose={jest.fn()} />,
    );
    expect(container.firstChild?.className).toContain("opacity-100");
  });

  it("tem classe opacity-0 quando show=false", () => {
    const { container } = render(
      <Toast message="Sucesso!" show={false} onClose={jest.fn()} />,
    );
    expect(container.firstChild?.className).toContain("opacity-0");
  });

  it("exibe ícone ✓ para mensagem de sucesso", () => {
    render(
      <Toast message="Salvo com sucesso!" show={true} onClose={jest.fn()} />,
    );
    expect(screen.getByText("✓")).toBeInTheDocument();
  });

  it("exibe ícone ! para mensagem de erro", () => {
    render(<Toast message="Erro ao salvar!" show={true} onClose={jest.fn()} />);
    expect(screen.getByText("!")).toBeInTheDocument();
  });

  it("aplica classe de erro quando mensagem contém 'Erro'", () => {
    const { container } = render(
      <Toast message="Erro ao salvar!" show={true} onClose={jest.fn()} />,
    );
    expect(container.firstChild?.className).toContain("bg-red-900/80");
  });

  it("aplica classe de sucesso quando mensagem não contém 'Erro'", () => {
    const { container } = render(
      <Toast message="Salvo com sucesso!" show={true} onClose={jest.fn()} />,
    );
    expect(container.firstChild?.className).toContain("bg-brand");
  });

  it("chama onClose após duration customizada", () => {
    const onClose = jest.fn();
    render(
      <Toast
        message="Sucesso!"
        show={true}
        onClose={onClose}
        duration={1000}
      />,
    );
    expect(onClose).not.toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(1000));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("usa duration padrão de 1500ms", () => {
    const onClose = jest.fn();
    render(<Toast message="Sucesso!" show={true} onClose={onClose} />);
    act(() => jest.advanceTimersByTime(1499));
    expect(onClose).not.toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(1));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("não chama onClose quando show=false", () => {
    const onClose = jest.fn();
    render(<Toast message="Sucesso!" show={false} onClose={onClose} />);
    act(() => jest.advanceTimersByTime(5000));
    expect(onClose).not.toHaveBeenCalled();
  });
});
