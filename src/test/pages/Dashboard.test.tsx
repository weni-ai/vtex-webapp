/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import { Dashboard } from "../../pages/Dashboard";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "../../store/projectSlice";
import userReducer from "../../store/userSlice";
import { expect, vi, describe, it } from "vitest";

const mockStore = (initialState: any) => {
    return configureStore({
        reducer: {
            project: projectReducer,
            user: userReducer,
        },
        preloadedState: {
            project: {
                wpp_cloud_app_uuid: '',
                flows_channel_uuid: '',
                loadingSetup: false,
                setupError: null,
                agents: [
                    {
                        uuid: '1',
                        code: 'abandoned_cart',
                        isInTest: false,
                        isConfiguring: false,
                    },
                ],
                integratedAgents: [
                    {
                        uuid: '2',
                        code: 'order_status',
                        isInTest: false,
                        isConfiguring: false,
                    },
                ],
                project_uuid: 'test-uuid',
                agentsLoading: [],
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
                    channel: 'whatsapp'
                },
                agentBuilderLoading: false,
                wppLoading: false,
                updateAgentLoading: false,
                disableAgentLoading: false
            },
            user: {
                user: 'test@example.com',
                userData: null,
                accountData: null,
                loadingWhatsAppIntegration: false,
                isWhatsAppIntegrated: false,
                error: null
            },
        },
        ...initialState,
    });
};

global.open = vi.fn();

const renderComponent = () => {
    return render(
        <Provider store={mockStore({})}>
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
        renderComponent();
        const agentElements = screen.getAllByTestId("feature-box-1");
        expect(agentElements).toHaveLength(1);
    });

    it("renders the integrated agent list when agents are integrated", () => {
        renderComponent();
        const integratedElements = screen.getAllByTestId("feature-box-2");
        expect(integratedElements).toHaveLength(1);
    });
});