import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import { PreferencesOrderStatusActive } from "../../../components/settings/OrderStatusActive";
import { SettingsContext } from "../../../components/settings/SettingsContainer/SettingsContext";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "../../../store/projectSlice";
import { expect, vi, describe, it } from "vitest";

const mockStore = configureStore({ reducer: { project: projectReducer } });

describe("PreferencesOrderStatusActive", () => {
    it("updates input value when typing", async () => {
        renderComponent({ formData: { order_status_restriction: { phone_numbers: "" } } });
        const checkbox = screen.getByTestId("is-test-contact-number");
        fireEvent.click(checkbox);
        const input = await screen.findByTestId("test-contact-number");
        fireEvent.change(input, { target: { value: "5511999999999" } });
        expect(input).toHaveValue("+55 11 99999-9999");
    });
});

vi.mock('your-i18n-library', () => ({
    t: (key: string) => {
        const translations = {
            'agents.categories.active.order_status.settings.is_test_contact_number.title': 'Enable test contact number',
            'agents.categories.active.order_status.settings.is_test_contact_number.description': 'This number will be used for testing purposes.',
            'agents.categories.active.order_status.settings.test_contact_number.label': 'Test Contact Number'
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
                <PreferencesOrderStatusActive />
            </SettingsContext.Provider>
        </Provider>
    );
};

describe("PreferencesOrderStatusActive", () => {
    it("renders the checkbox correctly", () => {
        renderComponent();
        expect(
            screen.getByTestId("is-test-contact-number")
        ).toBeInTheDocument();
    });

    it("toggles the checkbox and displays input field", async () => {
        renderComponent();
        const checkbox = screen.getByTestId("is-test-contact-number");
        fireEvent.click(checkbox);
        const input = await screen.findByTestId("test-contact-number");
        expect(input).toBeInTheDocument();
    });

    it("calls setFormData when values change", () => {
        const setFormData = vi.fn();
        renderComponent({ setFormData });
        const checkbox = screen.getByTestId("is-test-contact-number");
        fireEvent.click(checkbox);
        expect(setFormData).toHaveBeenCalled();
    });

    it("updates input value when typing", async () => {
        renderComponent();
        const checkbox = screen.getByTestId("is-test-contact-number");
        fireEvent.click(checkbox);
        const input = await screen.findByTestId("test-contact-number");
        fireEvent.change(input, { target: { value: "+5511999999999" } });
        expect(input).toHaveValue("+55 11 99999-9999");
    });
});