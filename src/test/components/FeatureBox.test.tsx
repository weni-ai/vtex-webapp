/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { FeatureBox } from "../../components/FeatureBox";
import { useSelector } from "react-redux";
import { integrateFeature } from "../../services/features.service";
import "@testing-library/jest-dom";
import { featureList, selectProject, updateFeatureLoading } from "../../store/projectSlice";
import { toast } from "@vtex/shoreline";

vi.mock("react-redux", () => ({
    useSelector: vi.fn(),
}));

vi.mock("../../services/features.service", () => ({
    integrateFeature: vi.fn().mockResolvedValue({ error: false }), // Garante retorno válido
}));

vi.mock("@vtex/shoreline", async (importOriginal) => {
    const actual = await importOriginal(); // Importa os componentes reais

    return {
        ...actual, // Mantém tudo que já existe no módulo
        toast: {
            critical: vi.fn(),
            success: vi.fn(),
        },
        Button: ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
            <button onClick={onClick}>{children}</button>
        ),
        Spinner: () => <div data-testid="spinner">Loading...</div>,
        IconCheck: () => <span data-testid="icon-check">✔</span>,
        IconDotsThreeVertical: () => <span data-testid="icon-dots">⋮</span>,
        IconGearSix: () => <span data-testid="icon-gear">⚙</span>,
        IconInfo: () => <span data-testid="icon-info">ℹ</span>,
        IconPauseCircle: () => <span data-testid="icon-pause">⏸</span>,
        IconPlus: () => <span data-testid="icon-plus">➕</span>,
        Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
        Flex: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        IconButton: ({ onClick }: { onClick: () => void }) => (
            <button data-testid="menu-button" onClick={onClick}></button>
        ),
        MenuProvider: ({ children }: { children: React.ReactNode }) => (
            <div data-testid="menu-provider">{children}</div>
        ),
        MenuTrigger: ({ children }: { children: React.ReactNode }) => (
            <div data-testid="menu-trigger">{children}</div>
        ),
        MenuPopover: ({ children }: { children: React.ReactNode }) => (
            <div data-testid="menu-popover">{children}</div>
        ),
        MenuItem: ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
            <button onClick={onClick}>{children}</button>
        ),
        MenuSeparator: () => <div data-testid="menu-separator"></div>,
        Tag: ({ children }: { children: React.ReactNode }) => <span data-testid="tag">{children}</span>,
    };
});

describe("FeatureBox Component", () => {
    const mockProps = {
        uuid: "123",
        code: "order_status" as const,
        type: "active" as const,
        isIntegrated: false,
        isInTest: false,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useSelector as any).mockImplementation((selector: any) => {
            if (selector === selectProject) return "project-uuid";
            if (selector === featureList) return [{ code: "order_status", uuid: "feature-uuid" }]; // Garante array válido
            if (selector === updateFeatureLoading) return (_state: any, _uuid: string) => false; // Função válida
        });
    });

    it("deve renderizar corretamente os textos e botões", () => {
        render(<FeatureBox {...mockProps} />);

        // expect(screen.getByText("agents.categories.active.order_status.title")).toBeInTheDocument();
        expect(screen.getByText("agents.categories.active.order_status.description")).toBeInTheDocument();
        // expect(screen.getByText("agents.common.add")).toBeInTheDocument();
    });

    it("deve chamar `integrateFeature` ao clicar no botão de adicionar", async () => {
        render(<FeatureBox {...mockProps} />);

        const addButton = screen.getByText("agents.common.add");
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(integrateFeature).toHaveBeenCalledWith("feature-uuid", "project-uuid");
        });

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith("integration.success");
        });
    });

    it("deve exibir um erro no `toast` caso `integrateFeature` retorne erro", async () => {
        (integrateFeature as any).mockResolvedValue({ error: true });

        render(<FeatureBox {...mockProps} />);

        const addButton = screen.getByText("agents.common.add");
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(toast.critical).toHaveBeenCalledWith("integration.error");
        });
    });

    // it("deve exibir o `Spinner` quando `isUpdateFeatureLoading` for `true`", () => {
    //     (useSelector as any).mockImplementation((selector: any) => {
    //         if (selector === featureList) return [{ code: "order_status", uuid: "feature-uuid" }]
    //         if (selector === updateFeatureLoading) return (_state: any, _uuid: string) => true;
    //     });

    //     render(<FeatureBox {...mockProps} />);

    //     expect(screen.getByTestId("spinner")).toBeInTheDocument();
    // });

    it("deve renderizar o ícone de verificação se a feature estiver integrada", () => {
        render(<FeatureBox {...mockProps} isIntegrated={true} />);

        expect(screen.getByTestId("icon-check")).toBeInTheDocument();
    });
});
