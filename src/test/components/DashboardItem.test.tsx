import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DashboardItem } from "../../components/DashboardItem";
import "@testing-library/jest-dom";

describe("DashboardItem Component", () => {
    const mockProps = {
        title: "Total Sales",
        value: "$10,000",
        percentageDifference: 5,
    };

    it("deve renderizar corretamente o título e o valor", () => {
        render(<DashboardItem {...mockProps} />);

        expect(screen.getByText(mockProps.title)).toBeInTheDocument();
        expect(screen.getByText(mockProps.value)).toBeInTheDocument();
    });

    it("deve exibir a variação percentual corretamente", () => {
        render(<DashboardItem {...mockProps} />);

        expect(screen.getByText("5%")).toBeInTheDocument();
    });

    it("deve exibir a seta para baixo quando a variação for negativa", () => {
        render(<DashboardItem {...mockProps} percentageDifference={-10} />);

        expect(screen.getByText("10%")).toBeInTheDocument();
        expect(screen.getByTestId("arrow-drop")).toBeInTheDocument();
    });

    it("não deve exibir a seta quando a variação for neutra", () => {
        render(<DashboardItem {...mockProps} percentageDifference={0} />);

        expect(screen.getByText("0%")).toBeInTheDocument();
        expect(screen.queryByTestId("arrow-drop")).not.toBeInTheDocument();
    });

    it("deve aplicar estilos corretamente", () => {
        const customStyle = { backgroundColor: "red", padding: "20px" };

        render(<DashboardItem {...mockProps} style={customStyle} />);

        const container = screen.getByTestId("dashboard-item-container");

        expect(container).toHaveStyle("background-color: rgb(255, 0, 0);");
        expect(container).toHaveStyle("padding: 20px");
    });
});
