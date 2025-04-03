/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { FeatureBox } from "../../components/FeatureBox";
import { integrateAgent } from "../../services/agent.service";
import "@testing-library/jest-dom";
import { toast } from "@vtex/shoreline";
import { useSelector } from "react-redux";

interface AgentLoading {
    agent_uuid: string;
    isLoading: boolean;
}

const mockState = {
    project: {
        project_uuid: "project-uuid",
        agents: [
            { 
                code: "order_status", 
                uuid: "feature-uuid",
                category: "ACTIVE",
                isInTest: false,
                isConfiguring: false,
                channel: {
                    uuid: "channel-uuid",
                    name: "test-channel"
                }
            }
        ],
        agentsLoading: [] as AgentLoading[],
        flows_channel_uuid: "flows-channel-uuid",
        wpp_cloud_app_uuid: "wpp-cloud-uuid",
        channel: "site_editor",
        agentBuilder: {
            name: '',
            description: '',
            code: '',
            settings: null,
            flows: [],
            integrations: [],
            links: [],
            occupation: '',
            objective: '',
            channel: "site_editor"
        }
    },
    auth: {
        base_address: "test-address"
    }
};

vi.mock("react-redux", () => ({
    useSelector: vi.fn((selector: (state: typeof mockState) => any) => selector(mockState))
}));

vi.mock("../../services/agent.service", () => ({
    integrateAgent: vi.fn().mockResolvedValue({}),
}));

vi.mock("@vtex/shoreline", async () => {
    const actual = await vi.importActual("@vtex/shoreline");
    return {
        ...actual,
        toast: {
            critical: vi.fn(),
            success: vi.fn(),
        }
    };
});

describe("FeatureBox Component", () => {
    const mockProps = {
        uuid: "123",
        code: "order_status" as const,
        type: "active" as const,
        isIntegrated: false,
        isInTest: false,
        isConfiguring: false,
        channel: {
            uuid: "channel-uuid",
            name: "test-channel"
        }
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render correctly with texts and buttons", () => {
        render(<FeatureBox {...mockProps} />);

        // Find the title within the main feature box
        const titleElement = screen.getByTestId('feature-box-title');
        expect(titleElement).toBeInTheDocument();

        // Find the description text
        const descriptionElement = screen.getByText(/agents.categories.active.order_status.description/i);
        expect(descriptionElement).toBeInTheDocument();

        // Find the add button
        const addButton = screen.getByRole('button', { name: /agents.common.add/i });
        expect(addButton).toBeInTheDocument();
    });

    it("should call integrateAgent when clicking the add button", async () => {
        render(<FeatureBox {...mockProps} />);

        const addButton = screen.getByRole('button', { name: /agents.common.add/i });
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(integrateAgent).toHaveBeenCalledWith("feature-uuid", "project-uuid");
        });

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith("integration.success");
        });
    });

    it("should display error toast when integrateAgent returns error", async () => {
        (integrateAgent as any).mockResolvedValue({ error: true });

        render(<FeatureBox {...mockProps} />);

        const addButton = screen.getByRole('button', { name: /agents.common.add/i });
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(toast.critical).toHaveBeenCalledWith("integration.error");
        });
    });

    it("should show loading spinner when isUpdateAgentLoading is true", () => {
        const loadingState = {
            ...mockState,
            project: {
                ...mockState.project,
                agentsLoading: [{ agent_uuid: "123", isLoading: true }]
            }
        };
        vi.mocked(useSelector).mockImplementation((selector: (state: typeof mockState) => any) => selector(loadingState));

        render(<FeatureBox {...mockProps} />);
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it("should show test status when isInTest is true", () => {
        render(<FeatureBox {...mockProps} isInTest={true} />);
        expect(screen.getByText(/agents.common.test/i)).toBeInTheDocument();
    });

    it("should show configuring status when isConfiguring is true", () => {
        render(<FeatureBox {...mockProps} isConfiguring={true} />);
        expect(screen.getByText(/agents.common.configuring/i)).toBeInTheDocument();
    });

    it("should show integrated status when isIntegrated is true", () => {
        render(<FeatureBox {...mockProps} isIntegrated={true} />);
        expect(screen.getByText(/agents.common.added/i)).toBeInTheDocument();
    });
});
