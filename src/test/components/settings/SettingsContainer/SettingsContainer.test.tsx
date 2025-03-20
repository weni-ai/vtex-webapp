/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import { SettingsContainer, SettingsContainerProps } from "../../../../components/settings/SettingsContainer/SettingsContainer";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "../../../../store/projectSlice";
import { expect, vi, describe, it, beforeEach } from "vitest";
import { updateAgentSettings } from "../../../../services/agent.service";
import { toast } from "@vtex/shoreline";

const mockStore = configureStore({ reducer: { project: projectReducer } });

vi.mock("../../../../services/agent.service", () => ({
    updateAgentSettings: vi.fn().mockResolvedValue({ success: true, data: { message: '', error: '' } })
}));

vi.mock("@vtex/shoreline", async (importOriginal) => {
    const actual : any = await importOriginal();
    return {
        ...actual,
        toast: { critical: vi.fn(), success: vi.fn() }
    };
});

const renderComponent = (props: SettingsContainerProps) => {
    return render(
        <Provider store={mockStore}>
            <SettingsContainer {...props} />
        </Provider>
    );
};

describe("SettingsContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the settings drawer correctly", () => {
        renderComponent({ open: true, toggleOpen: vi.fn(), code: 'abandoned_cart', agentUuid: 'test-agent' });
        expect(screen.getByText("common.manage_settings")).toBeInTheDocument();
    });

    it("closes the drawer when the cancel button is clicked", () => {
        const toggleOpen = vi.fn();
        renderComponent({ open: true, toggleOpen, code: 'order_status', agentUuid: 'test-agent' });
        fireEvent.click(screen.getByTestId("cancel-button"));
        expect(toggleOpen).toHaveBeenCalled();
    });

    it("calls updateAgent when the save button is clicked", async () => {
        const toggleOpen = vi.fn();
        vi.mocked(updateAgentSettings).mockResolvedValue({ success: true, data: { message: '', error: '' } });

        renderComponent({ open: true, toggleOpen, code: 'abandoned_cart', agentUuid: 'test-agent' });
        fireEvent.click(screen.getByTestId("save-button"));

        await waitFor(() => {
            expect(toggleOpen).toHaveBeenCalled();
        });
    });

    it("shows an error toast if updateAgentSettings fails", async () => {
        const toggleOpen = vi.fn();
        vi.mocked(updateAgentSettings).mockResolvedValue({ success: false, error: {} });

        renderComponent({ open: true, toggleOpen, code: 'abandoned_cart', agentUuid: 'test-agent' });
        fireEvent.click(screen.getByTestId("save-button"));

        await waitFor(() => {
            expect(toast.critical).toHaveBeenCalledWith("agents.common.configure.error");
        });
    });

    it("shows a success toast if updateAgentSettings succeeds", async () => {
        const toggleOpen = vi.fn();
        vi.mocked(updateAgentSettings).mockResolvedValue({ success: true, data: { message: '', error: '' } });

        renderComponent({ open: true, toggleOpen, code: 'abandoned_cart', agentUuid: 'test-agent' });
        fireEvent.click(screen.getByTestId("save-button"));

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith("agents.common.configure.success");
        });
    });
});
