import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TermsAndConditions } from "../../components/TermsAndConditions";
import "@testing-library/jest-dom";

vi.mock("@vtex/shoreline", async () => {
    const actual = await vi.importActual("@vtex/shoreline");
    return {
        ...(actual as object),
        Modal: ({ children, open }: { children: React.ReactNode; open: boolean }) => (
            open ? <div data-testid="modal">{children}</div> : null
        ),
        ModalHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        ModalHeading: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
        ModalDismiss: ({ onClick }: { onClick: () => void }) => (
            <button data-testid="dismiss-button" onClick={onClick}>X</button>
        ),
        ModalContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        ModalFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        Button: ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
            <button onClick={onClick}>{children}</button>
        ),
        Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
    };
});

vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe("TermsAndConditions Component", () => {
    const mockProps = {
        open: true,
        approve: vi.fn(),
        dismiss: vi.fn(),
    };

    it("should render the modal when open", () => {
        render(<TermsAndConditions {...mockProps} />);
        expect(screen.getByTestId("modal")).toBeInTheDocument();
    });

    it("should call dismiss function when cancel button is clicked", () => {
        render(<TermsAndConditions {...mockProps} />);
        const cancelButton = screen.getByText("common.cancel");
        fireEvent.click(cancelButton);
        expect(mockProps.dismiss).toHaveBeenCalledTimes(1);
    });

    it("should call approve function when agree button is clicked", () => {
        render(<TermsAndConditions {...mockProps} />);
        const approveButton = screen.getByText("terms.agree");
        fireEvent.click(approveButton);
        expect(mockProps.approve).toHaveBeenCalledTimes(1);
    });

    it("should call dismiss function when modal dismiss button is clicked", () => {
        render(<TermsAndConditions {...mockProps} />);
        const dismissButton = screen.getByTestId("dismiss-button");
        fireEvent.click(dismissButton);
        expect(mockProps.dismiss).toHaveBeenCalledTimes(1);
    });
});
