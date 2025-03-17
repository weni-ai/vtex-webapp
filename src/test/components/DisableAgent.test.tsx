/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DisableAgent } from "../../components/DisableAgent";
import { useSelector } from "react-redux";
import { disableAgent } from "../../services/agent.service";
import "@testing-library/jest-dom";
import { disableAgentLoading, selectProject } from "../../store/projectSlice";
import { toast } from "@vtex/shoreline";

vi.mock("react-redux", () => ({
    useSelector: vi.fn(),
}));

vi.mock("../../services/agent.service", () => ({
    disableAgent: vi.fn(),
}));


vi.mock("@vtex/shoreline", () => {
    return {
        toast: {
            critical: vi.fn(),
            success: vi.fn(),
        },
        Button: ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
            <button onClick={onClick}>{children}</button>
        ),
        Modal: ({ children }: { children: React.ReactNode }) => <div data-testid="modal">{children}</div>,
        ModalHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        ModalContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        ModalDismiss: ({ onClick }: { onClick: () => void }) => (
            <button data-testid="close-modal" onClick={onClick}>
                X
            </button>
        ),
        Spinner: () => <div data-testid="spinner">Loading...</div>,
        Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
        Flex: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        ModalHeading: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
    };
});


describe("DisableAgent Component", () => {
    const mockProps = {
        open: true,
        agentUuid: "123",
        agent: "Test Agent",
        toggleModal: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useSelector as any).mockImplementation((selector: any) => {
            if (selector === disableAgentLoading) return false;
            if (selector === selectProject) return "project-uuid";
        });
    });

    it("deve renderizar corretamente os textos e botões", () => {
        render(<DisableAgent {...mockProps} />);

        expect(screen.getByText("agents.common.disable.title")).toBeInTheDocument();
        expect(screen.getByText("agents.common.disable.description", { exact: false })).toBeInTheDocument();
        expect(screen.getByText("common.cancel")).toBeInTheDocument();
        expect(screen.getByText("common.disable")).toBeInTheDocument();
    });

    it("deve chamar `toggleModal` ao clicar no botão de cancelar", () => {
        render(<DisableAgent {...mockProps} />);

        const cancelButton = screen.getByText("common.cancel");
        fireEvent.click(cancelButton);

        expect(mockProps.toggleModal).toHaveBeenCalledTimes(1);
    });

    it("deve exibir o `Spinner` quando `isDisabling` for `true`", () => {
        (useSelector as any).mockImplementation((selector: any) => {
            if (selector === disableAgentLoading) return true;
            if (selector === selectProject) return "project-uuid";
        });

        render(<DisableAgent {...mockProps} />);

        expect(screen.getByTestId("spinner")).toBeInTheDocument();
    });

    it("deve chamar `disableAgent` ao clicar no botão de desativação", async () => {
        (disableAgent as any).mockResolvedValue({});

        render(<DisableAgent {...mockProps} />);

        const disableButton = screen.getByText("common.disable");
        fireEvent.click(disableButton);

        await waitFor(() => {
            expect(disableAgent).toHaveBeenCalledWith("project-uuid", "123");
        });

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith("agents.common.disable.success");
        });

        expect(mockProps.toggleModal).toHaveBeenCalledTimes(1);
    });

    it("deve exibir um erro no `toast` caso `disableAgent` retorne erro", async () => {
        (disableAgent as any).mockResolvedValue({ error: true });

        render(<DisableAgent {...mockProps} />);

        const disableButton = screen.getByText("common.disable");
        fireEvent.click(disableButton);

        await waitFor(() => {
            expect(toast.critical).toHaveBeenCalledTimes(1);
            expect(toast.critical).toHaveBeenCalledWith("agents.common.disable.error");
        });

        expect(mockProps.toggleModal).not.toHaveBeenCalled();
    });

});
