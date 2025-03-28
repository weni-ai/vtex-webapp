/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import { Dashboard } from "../../pages/Dashboard";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "../../store/projectSlice";
import userReducer from "../../store/userSlice";
import { expect, vi, describe, it } from "vitest";
import { UserState } from "src/interfaces/Store";

const mockStore = (agents = [], integratedAgents = []) => configureStore({ 
    reducer: { project: projectReducer, user: userReducer },
    preloadedState: {
        project: { 
            agents, 
            integratedAgents, 
            selectProject: "test-project",
            project_uuid: '',
            wpp_cloud_app_uuid: '',
            flows_channel_uuid: '',
            loadingSetup: false,
            loading: false,
            error: null,
            success: false,
            data: null,
            settings: null,
            integrations: null,
            flows: [],
            setupError: false,
            agentBuilderLoading: false,
            agentsLoading: [],
            selectedAgent: null,
            selectedFlow: null,
            selectedIntegration: null,
            updateAgentLoading: false,
            disableAgentLoading: false,
            wppLoading: false,
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
                channel: {
                    uuid: '',
                    name: ''
                }
            }
        },
        user: { 
            user: "test@example.com",
            userData: null,
            accountData: null,
            loadingWhatsAppIntegration: false,
            isWhatsAppIntegrated: false,
            error: null,
            isAgentBuilderIntegrated: false,
            whatsAppError: null
        } as UserState
    }
});

global.open = vi.fn();

const renderComponent = (agents = [], integratedAgents = []) => {
    return render(
        <Provider store={mockStore(agents, integratedAgents)}>
            <Dashboard />
        </Provider>
    );
};

describe("Dashboard Component", () => {
    it("renders the dashboard title", () => {
        renderComponent();
        expect(screen.getByTestId("title")).toBeInTheDocument();
    });

    it("renders the improvement alert with button", () => {
        renderComponent();
        expect(screen.getByTestId("improve-alert")).toBeInTheDocument();
        expect(screen.getByTestId("improve-button")).toBeInTheDocument();
    });

    it("calls window.open when clicking the improve button", () => {
        renderComponent();
        fireEvent.click(screen.getByTestId("improve-button"));
        expect(global.open).toHaveBeenCalled();
    });

    it("renders the agents section title", () => {
        renderComponent();
        expect(screen.getByText("agents.title")).toBeInTheDocument();
    });

    it("renders the agent list when agents are available", () => {
        const agentsMock = [{ uuid: "1", code: "test-agent", isInTest: false, isConfiguring: false }];
        renderComponent(agentsMock as never[], []);
        expect(screen.getByText("test-agent")).toBeInTheDocument();
    });

    it("renders the integrated agent list when agents are integrated", () => {
        const integratedAgentsMock = [{ uuid: "2", code: "integrated-agent", isInTest: false, isConfiguring: false }];
        renderComponent([], integratedAgentsMock as never[]);
        expect(screen.getByText("integrated-agent")).toBeInTheDocument();
    });
});
