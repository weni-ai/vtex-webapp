import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { AgentBuilderSkeleton } from "../../../pages/agent/AgentBuilderSkeleton";
import { describe, it, expect } from "vitest";

describe("AgentBuilderSkeleton", () => {
    it("renders all skeleton blocks", () => {
        render(<AgentBuilderSkeleton />);
        const skeletons = screen.getAllByTestId("agent-builder-skeleton");
        expect(skeletons).toHaveLength(1);
    });
    it("renders all skeleton blocks", () => {
        render(<AgentBuilderSkeleton />);
        const skeletons = screen.getAllByTestId("agent-builder-skeleton-row");
        expect(skeletons).toHaveLength(1);
    });
    it("renders all skeleton blocks", () => {
        render(<AgentBuilderSkeleton />);
        const skeletons = screen.getAllByTestId("agent-builder-skeleton-column");
        expect(skeletons).toHaveLength(1);
    });
});
