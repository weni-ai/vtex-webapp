import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TagType } from "../../components/TagType";
import "@testing-library/jest-dom";

vi.mock("@vtex/shoreline", () => ({
    Tag: ({ children, color, variant }: { children: React.ReactNode; color: string; variant: string }) => (
        <span data-testid="tag" data-color={color} data-variant={variant}>{children}</span>
    ),
}));

vi.mock("../components/TagType", () => ({
    t: (key: string) => key,
}));

describe("TagType Component", () => {
    it("should render the tag correctly with blue color for 'active' type", () => {
        render(<TagType type="active" />);
        
        const tag = screen.getByTestId("tag");
        expect(tag).toHaveAttribute("data-color", "blue");
        expect(tag).toHaveAttribute("data-variant", "secondary");
        expect(tag).toHaveTextContent("agents.categories.active.title");
    });

    it("should render the tag correctly with purple color for 'passive' type", () => {
        render(<TagType type="passive" />);
        
        const tag = screen.getByTestId("tag");
        expect(tag).toHaveAttribute("data-color", "purple");
        expect(tag).toHaveAttribute("data-variant", "secondary");
        expect(tag).toHaveTextContent("agents.categories.passive.title");
    });
});
