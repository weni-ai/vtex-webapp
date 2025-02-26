import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AboutAgent, AboutAgentProps } from "../../components/AboutAgent";
import "@testing-library/jest-dom";
import activeAbandonedCartPreview from "../../assets/agents_preview/active_abandoned_cart.png";

const mockProps: AboutAgentProps = {
    open: true,
    category: "active",
    code: "abandoned_cart",
    toggleModal: vi.fn(),
};

describe("AboutAgent Component", () => {
    it("deve renderizar corretamente o título e os textos", () => {
        render(<AboutAgent {...mockProps} />);
        expect(screen.getByText(/agents.categories.active.abandoned_cart.title/i)).toBeInTheDocument();
        expect(screen.getByText(/agents.categories.active.abandoned_cart.details.title/i)).toBeInTheDocument();
        expect(screen.getByText(/agents.categories.active.abandoned_cart.details.description/i)).toBeInTheDocument();
    });

    it("deve renderizar a imagem correta baseada na categoria e código", () => {
        render(<AboutAgent {...mockProps} />);
        const img = screen.getByAltText(/agents.categories.active.abandoned_cart.title/i);
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute("src", activeAbandonedCartPreview);
    });

    it("deve chamar a função toggleModal ao fechar o modal", () => {
        render(<AboutAgent {...mockProps} />);
        const closeButton = screen.getByRole("button", { hidden: true });
        closeButton.click();
        expect(mockProps.toggleModal).toHaveBeenCalledTimes(1);
    });
});
