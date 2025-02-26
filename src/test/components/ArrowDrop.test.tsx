import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ArrowDrop } from "../../components/ArrowDrop";
import "@testing-library/jest-dom";


describe("ArrowDrop Component", () => {
  it("deve renderizar o SVG corretamente", () => {
    render(<ArrowDrop isDown={false} />);
    const svgElement = screen.getByTestId("arrow-drop");
    expect(svgElement).toBeInTheDocument();
  });

  it("deve rotacionar o ícone quando `isDown` for `true`", () => {
    render(<ArrowDrop isDown={true} />);
    const svgElement = screen.getByTestId("arrow-drop");

    // Obtém os estilos computados pelo navegador
    const styles = window.getComputedStyle(svgElement);
    expect(styles.transform).toBe("rotate(180deg)");
  });

  it("deve manter o ícone sem rotação quando `isDown` for `false`", () => {
    render(<ArrowDrop isDown={false} />);
    const svgElement = screen.getByTestId("arrow-drop");

    // Obtém os estilos computados e verifica a rotação
    const styles = window.getComputedStyle(svgElement);
    expect(styles.transform).toBe("rotate(0deg)");
  });

  it("deve aplicar estilos personalizados corretamente", () => {
    const customStyle = { color: "red", marginLeft: "10px" };

    render(<ArrowDrop isDown={false} style={customStyle} />);
    const svgElement = screen.getByTestId("arrow-drop");

    const styles = window.getComputedStyle(svgElement);
    expect(styles.color).toBe("rgb(255, 0, 0)");
    expect(styles.marginLeft).toBe("10px");
  });
});
