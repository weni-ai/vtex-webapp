import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import { Channel } from "../../pages/Channel";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "../../store/projectSlice";
import { expect, vi, describe, it } from "vitest";
import { startFacebookLogin } from "../../utils/facebook/login";

vi.mock("../../utils/facebook/login", () => ({
    startFacebookLogin: vi.fn()
}));

const mockStore = (wppLoadingState = false) => configureStore({ 
    reducer: { project: projectReducer },
    preloadedState: { 
        project: { 
            wppLoading: wppLoadingState,
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
            agents: [],
            setupError: false,
            agentBuilderLoading: false,
            agentsLoading: [],
            integratedAgents: [],
            selectedAgent: null,
            selectedFlow: null,
            selectedIntegration: null,
            updateAgentLoading: false,
            disableAgentLoading: false,
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
        } 
    }
});

const renderComponent = (isIntegrated = false, wppLoading = false) => {
    return render(  
        <Provider store={mockStore(wppLoading)}>
            <Channel isIntegrated={isIntegrated}/>
        </Provider>
    );
};

describe("Channel Component", () => {
    it("renders the WhatsApp integration title and description", () => {
        renderComponent();
        expect(screen.getByText("integration.channels.whatsapp.title")).toBeInTheDocument();
        expect(screen.getByText("integration.channels.whatsapp.description")).toBeInTheDocument();
    });

    it("shows the integrate button when not integrated", () => {
        renderComponent(false);
        expect(screen.getByText("integration.buttons.integrate")).toBeInTheDocument();
    });

    it("calls startFacebookLogin when the integrate button is clicked", () => {
        renderComponent(false);
        fireEvent.click(screen.getByTestId("integrate-button"));
        expect(startFacebookLogin).toHaveBeenCalled();
    });

    it("shows the integrated status when already integrated", () => {
        renderComponent(true);
        expect(screen.getByText("integration.buttons.integrated")).toBeInTheDocument();
    });

    it("shows a loading spinner when WhatsApp integration is in progress", () => {
        renderComponent(false, true);
        expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });
});