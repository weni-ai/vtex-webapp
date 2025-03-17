import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import { PreferencesAbandonedCartActive } from "../../../components/settings/AbandonedCartActive";
import { SettingsContext } from "../../../components/settings/SettingsContainer/SettingsContext";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "../../../store/projectSlice";
import { expect, vi, describe, it } from "vitest";

const mockStore = configureStore({ reducer: { project: projectReducer } });

vi.mock('your-i18n-library', () => ({
    t: (key: string) => {
        const translations = {
            'agents.categories.active.abandoned_cart.settings.restriction.monday_until_friday': 'Monday until Friday',
            'agents.categories.active.abandoned_cart.settings.restriction.saturday': 'Saturday'
        };
        return translations[key as keyof typeof translations] || key;
    }
}));

const renderComponent = (contextValue = {}) => {
    const setFormData = vi.fn();
    const defaultContext = {
        setFormData,
        ...contextValue,
    };

    return render(
        <Provider store={mockStore}>
            <SettingsContext.Provider value={defaultContext}>
                <PreferencesAbandonedCartActive />
            </SettingsContext.Provider>
        </Provider>
    );
};

describe("PreferencesAbandonedCartActive", () => {
    it("should render the checkbox correctly", () => {
        renderComponent();
        expect(
            screen.getByRole("checkbox", {
                name: /agents.active.abandoned_cart.settings.restriction.description/i,
            })
        ).toBeInTheDocument();
    });

    it("should toggle the checkbox and display time fields", () => {
        renderComponent();
        const checkbox = screen.getByRole("checkbox");
        fireEvent.click(checkbox);
        expect(screen.getByText("agents.categories.active.abandoned_cart.settings.restriction.monday_until_friday")).toBeDefined();
        expect(screen.getByText("agents.categories.active.abandoned_cart.settings.restriction.saturday")).toBeDefined();
    });

    it("should call setFormData when values change", () => {
        const setFormData = vi.fn();
        renderComponent({ setFormData });
        const checkbox = screen.getByRole("checkbox");
        fireEvent.click(checkbox);
        expect(setFormData).toHaveBeenCalled();
    });

    it("should update time values when inputs change", () => {
        const setFormData = vi.fn();
        renderComponent({ setFormData });
        fireEvent.click(screen.getByRole("checkbox"));
        expect(setFormData).toHaveBeenCalledWith(expect.objectContaining({
            messageTimeRestriction: expect.objectContaining({
                isActive: true,
                periods: expect.any(Object)
            })
        }));
    });
});