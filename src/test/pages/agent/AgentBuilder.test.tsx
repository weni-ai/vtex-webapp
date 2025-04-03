/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import { AgentBuilder } from "../../../pages/agent/AgentBuilder";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "../../../store/projectSlice";
import userReducer from "../../../store/userSlice";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { ProjectState } from "src/interfaces/Store";
import { UserState } from "src/interfaces/Store";
import { Reducer } from "redux";
import { BrowserRouter } from "react-router-dom";

const mockBuildAgent = vi.fn();

vi.mock("../../../pages/setup/useAgentBuilderSetup", () => ({
    useAgentBuilderSetup: () => ({ buildAgent: mockBuildAgent })
}));

vi.mock("../../../pages/setup/useUserSetup", () => ({
    useUserSetup: () => ({ initializeUser: vi.fn() })
}));

vi.mock("your-i18n-library", () => ({
    t: (key: any) => key
}));

const mockStore = configureStore({
    reducer: { 
        project: projectReducer as Reducer<ProjectState, any>, 
        user: userReducer as Reducer<UserState, any> 
    },  
    preloadedState: {
        project: {
            project_uuid: '',
            wpp_cloud_app_uuid: '',
            flows_channel_uuid: '',
            setupError: false,
            agentBuilder: {
                name: '',
                links: [''],
                occupation: '',
                objective: '',
                channel: ''
            },
            loadingSetup: false,
            agentBuilderLoading: false,
            wppLoading: false,
            agentsLoading: [],
            agents: [],
            integratedAgents: [],
            selectedAgent: null,
            selectedFlow: null,
            selectedIntegration: null,
            updateAgentLoading: false,
            disableAgentLoading: false
        },
        user: {
            user: 'test@example.com',
            isWhatsAppIntegrated: true,
            isAgentBuilderIntegrated: false,
            userData: null,
            accountData: null,
            loadingWhatsAppIntegration: false,
            whatsAppError: null
        }
    }
});

describe("AgentBuilder Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = () =>
        render(
            <BrowserRouter>
                <Provider store={mockStore}>
                    <AgentBuilder />
                </Provider>
            </BrowserRouter>
        );

    it("renders the form fields", () => {
        renderComponent();
        expect(screen.getByLabelText("agent.setup.forms.name")).toBeInTheDocument();
        expect(screen.getByLabelText("agent.setup.forms.knowledge.title")).toBeInTheDocument();
        expect(screen.getByLabelText("agent.setup.forms.occupation.title")).toBeInTheDocument();
        expect(screen.getByLabelText("agent.setup.forms.objective.title")).toBeInTheDocument();
    });

    it("shows validation errors on empty form submission", () => {
        renderComponent();
        fireEvent.click(screen.getByText("common.create"));
        expect(screen.getAllByText("agent.setup.forms.error.empty_input")).toHaveLength(2);
    });

    it("opens terms dialog when form is valid", () => {
        renderComponent();
        fireEvent.change(screen.getByLabelText("agent.setup.forms.name"), { target: { value: "Test Bot" } });
        fireEvent.change(screen.getByLabelText("agent.setup.forms.knowledge.title"), { target: { value: "https://example.com" } });
        fireEvent.click(screen.getByText("common.create"));
        expect(screen.getByTestId("terms-and-conditions-modal"))?.toBeInTheDocument();
    });

    it("validates URL format correctly", () => {
        renderComponent();
        const knowledgeInput = screen.getByLabelText("agent.setup.forms.knowledge.title");

        fireEvent.change(knowledgeInput, { target: { value: "not-a-url" } });
        fireEvent.click(screen.getByText("common.create"));
        expect(screen.getByText("agent.setup.forms.error.valid_url")).toBeInTheDocument();

        fireEvent.change(knowledgeInput, { target: { value: "https://example.com" } });
        fireEvent.click(screen.getByText("common.create"));
        expect(screen.queryByText("agent.setup.forms.error.valid_url")).not.toBeInTheDocument();
    });

    it("handles form submission with valid data", async () => {
        renderComponent();
        
        fireEvent.change(screen.getByLabelText("agent.setup.forms.name"), { target: { value: "Test Bot" } });
        fireEvent.change(screen.getByLabelText("agent.setup.forms.knowledge.title"), { target: { value: "https://example.com" } });
        fireEvent.change(screen.getByLabelText("agent.setup.forms.occupation.title"), { target: { value: "Customer Service" } });
        fireEvent.change(screen.getByLabelText("agent.setup.forms.objective.title"), { target: { value: "Help customers" } });

        fireEvent.click(screen.getByText("common.create"));
        
        await waitFor(() => {
            const modal = screen.getByTestId("terms-and-conditions-modal");
            expect(modal).toBeInTheDocument();
            expect(modal).toBeVisible();
        }, { timeout: 2000 });

        fireEvent.click(screen.getByTestId("terms-and-conditions-approve"));

        await waitFor(() => {
            expect(mockBuildAgent).toHaveBeenCalledWith({
                name: "Test Bot",
                knowledge: "https://example.com",
                occupation: "Customer Service",
                objective: "Help customers",
                channel: "agent.setup.forms.channel.default"
            });
        });
    });

    it("disables form fields when agent is integrated", () => {
        const storeWithIntegratedAgent = configureStore({
            reducer: { 
                project: projectReducer as Reducer<ProjectState, any>, 
                user: userReducer as Reducer<UserState, any> 
            },  
            preloadedState: {
                project: {
                    project_uuid: '',
                    wpp_cloud_app_uuid: '',
                    flows_channel_uuid: '',
                    setupError: false,
                    agentBuilder: {
                        name: '',
                        links: [''],
                        occupation: '',
                        objective: '',
                        channel: ''
                    },
                    loadingSetup: false,
                    agentBuilderLoading: false,
                    wppLoading: false,
                    agentsLoading: [],
                    agents: [],
                    integratedAgents: [],
                    selectedAgent: null,
                    selectedFlow: null,
                    selectedIntegration: null,
                    updateAgentLoading: false,
                    disableAgentLoading: false
                },
                user: {
                    user: 'test@example.com',
                    isWhatsAppIntegrated: true,
                    isAgentBuilderIntegrated: true,
                    userData: null,
                    accountData: null,
                    loadingWhatsAppIntegration: false,
                    whatsAppError: null
                }
            }
        });

        render(
            <BrowserRouter>
                <Provider store={storeWithIntegratedAgent}>
                    <AgentBuilder />
                </Provider>
            </BrowserRouter>
        );

        expect(screen.getByLabelText("agent.setup.forms.name")).toBeDisabled();
        expect(screen.getByLabelText("agent.setup.forms.knowledge.title")).toBeDisabled();
        expect(screen.getByLabelText("agent.setup.forms.occupation.title")).toBeDisabled();
        expect(screen.getByLabelText("agent.setup.forms.objective.title")).toBeDisabled();
    });
});
