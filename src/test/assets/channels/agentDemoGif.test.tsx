import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import AgentDemoGif from "../../../assets/channels/agentDemoGif";
import { expect, describe, it } from "vitest";

describe("AgentDemoGif", () => {
    it("renders the GIF image correctly", () => {
        render(<AgentDemoGif />);
        const img = screen.getByAltText("Mocked GIF");
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute("src", "/src/assets/channels/agentdemo.gif");
    });

    it("displays the correct text description", () => {
        render(<AgentDemoGif />);
        expect(screen.getByText("agent.details.example.description")).toBeInTheDocument();
    });
});
