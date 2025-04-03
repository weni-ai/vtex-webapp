 
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { Channel } from "../../pages/Channel";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "../../store/projectSlice";
import userReducer from "../../store/userSlice";
import { expect, describe, it } from "vitest";
import { UserState } from "src/interfaces/Store";

const mockStore = (isWppLoading = false) => configureStore({ 
    reducer: { project: projectReducer, user: userReducer },
    preloadedState: {
        project: { 
            agents: [], 
            integratedAgents: [], 
            selectProject: "test-project",
            project_uuid: 'test-uuid',
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
            wppLoading: isWppLoading,
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
                channel: ''
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

const renderComponent = (isIntegrated = false, isWppLoading = false) => {
    return render(
        <Provider store={mockStore(isWppLoading)}>
            <Channel isIntegrated={isIntegrated} />
        </Provider>
    );
};

describe("Channel Component", () => {
    it("renders the WhatsApp integration section", () => {
        renderComponent();
        expect(screen.getByText("integration.channels.whatsapp.title")).toBeInTheDocument();
        expect(screen.getByText("integration.channels.whatsapp.description")).toBeInTheDocument();
    });

    it("renders the integrate button when not integrated", () => {
        renderComponent(false);
        expect(screen.getByTestId("integrate-button")).toBeInTheDocument();
        expect(screen.queryByText("integration.buttons.integrated")).not.toBeInTheDocument();
    });

    it("renders the integrated status when integrated", () => {
        renderComponent(true);
        expect(screen.getByText("integration.buttons.integrated")).toBeInTheDocument();
        expect(screen.queryByTestId("integrate-button")).not.toBeInTheDocument();
    });

    it("shows loading spinner when wppLoading is true", () => {
        renderComponent(false, true);
        expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });
});
