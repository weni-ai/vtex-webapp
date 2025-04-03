import { render } from "@testing-library/react";
import { expect, vi, describe, it } from "vitest";
import { Setup } from "../../pages/Setup";
const mockInitializeProject = vi.fn();

vi.mock("../../pages/setup/useUserSetup", () => ({
    useUserSetup: () => ({
        initializeProject: mockInitializeProject
    })
}));

describe("Setup Component", () => {
    it("calls initializeProject on mount", () => {
        render(<Setup />);
        expect(mockInitializeProject).toHaveBeenCalled();
    });
});
