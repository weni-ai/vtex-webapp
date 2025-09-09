import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PreferencesOrderStatusActive } from './OrderStatusActive';

const mocks = vi.hoisted(() => ({
  useSelector: vi.fn(),
  setFormData: vi.fn(),
}));

vi.mock('react-redux', () => ({
  useSelector: mocks.useSelector,
}));

vi.mock('react', async () => {
  const actual = await vi.importActual('react');

  return {
    ...actual,
    useContext: () => {
      return {
        setFormData: mocks.setFormData,
        formData: {
          order_status_restriction: {
            is_active: false,
            phone_numbers: '',
            sellers: [],
          },
        },
      };
    },
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
      changeLanguage: () => new Promise(() => { }),
    },
  }),
}));

describe('PreferencesOrderStatusActive', () => {
  const mockOrderStatusAgent = {
    uuid: 'order-status-agent',
    name: 'Order Status Agent',
    origin: 'commerce',
    code: 'order_status',
    restrictTestContact: {
      phoneNumber: '',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basic rendering', () => {
    beforeEach(() => {
      mocks.useSelector.mockImplementation((selector) => {
        if (selector.name === 'selectDesignSystem') {
          return 'shoreline';
        }

        return [mockOrderStatusAgent];
      });
    });

    it('should render component when order status agent exists', () => {
      render(
        <PreferencesOrderStatusActive />
      );

      expect(screen.getByText('agents.categories.active.order_status.settings.is_test_contact_number.title')).toBeInTheDocument();
      expect(screen.getByText('agents.categories.active.order_status.settings.is_test_contact_number.description')).toBeInTheDocument();
    });

    it('should not show phone number input when checkbox is disabled', () => {
      render(
        <PreferencesOrderStatusActive />
      );

      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });
  });

  describe('checkbox interactions', () => {
    beforeEach(() => {
      mocks.useSelector.mockImplementation((selector) => {
        if (selector.name === 'selectDesignSystem') {
          return 'shoreline';
        }

        return [mockOrderStatusAgent];
      });
    });

    it('should toggle test contact number when checkbox is clicked', () => {
      render(
        <PreferencesOrderStatusActive />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();

      fireEvent.click(checkbox);

      expect(checkbox).toBeChecked();
    });

    it('should show phone number input when checkbox is enabled', () => {
      render(
        <PreferencesOrderStatusActive />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByText('agents.categories.active.order_status.settings.test_contact_number.label')).toBeInTheDocument();
    });

    it('should hide phone number input when checkbox is disabled', () => {
      render(
        <PreferencesOrderStatusActive />
      );

      const checkbox = screen.getByRole('checkbox');

      fireEvent.click(checkbox);
      expect(screen.getByRole('textbox')).toBeInTheDocument();

      fireEvent.click(checkbox);
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });
  });

  describe('phone number input handling', () => {
    beforeEach(() => {
      mocks.useSelector.mockImplementation((selector) => {
        if (selector.name === 'selectDesignSystem') {
          return 'shoreline';
        }

        return [mockOrderStatusAgent];
      });
    });

    it('should handle phone number input change', () => {
      render(
        <PreferencesOrderStatusActive />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      const phoneInput = screen.getByTestId('contact-number-input');
      fireEvent.change(phoneInput, { target: { value: '5511999999999' } });

      expect(phoneInput).toHaveValue('+55 11 99999-9999');
    });

    it('should format Brazilian phone numbers correctly', () => {
      render(
        <PreferencesOrderStatusActive />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      const phoneInput = screen.getByTestId('contact-number-input');
      fireEvent.change(phoneInput, { target: { value: '5511999999999' } });

      expect(phoneInput).toHaveValue('+55 11 99999-9999');
    });

    it('should handle non-Brazilian phone numbers', () => {
      render(
        <PreferencesOrderStatusActive />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      const phoneInput = screen.getByTestId('contact-number-input');
      fireEvent.change(phoneInput, { target: { value: '1234567890' } });

      expect(phoneInput).toHaveValue('1234567890');
    });

    it('should handle phone number with special characters', () => {
      render(
        <PreferencesOrderStatusActive />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      const phoneInput = screen.getByTestId('contact-number-input');
      fireEvent.change(phoneInput, { target: { value: '55 11 99999-9999' } });

      expect(phoneInput).toHaveValue('+55 11 99999-9999');
    });
  });

  describe('form data updates', () => {
    beforeEach(() => {
      mocks.useSelector.mockImplementation((selector) => {
        if (selector.name === 'selectDesignSystem') {
          return 'shoreline';
        }

        return [mockOrderStatusAgent];
      });
    });

    it('should call setFormData when checkbox is toggled', () => {
      render(
        <PreferencesOrderStatusActive />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(mocks.setFormData).toHaveBeenCalledWith({
        order_status_restriction: {
          is_active: true,
          phone_numbers: '',
          sellers: []
        }
      });
    });

    it('should call setFormData when phone number changes', () => {
      render(
        <PreferencesOrderStatusActive />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      const phoneInput = screen.getByTestId('contact-number-input');
      fireEvent.change(phoneInput, { target: { value: '5511999999999' } });

      expect(mocks.setFormData).toHaveBeenCalled();
    });

    it('should update form data with correct structure', () => {
      render(
        <PreferencesOrderStatusActive />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      const lastCall = mocks.setFormData.mock.calls[mocks.setFormData.mock.calls.length - 1][0];
      expect(lastCall).toHaveProperty('order_status_restriction');
      expect(lastCall.order_status_restriction).toHaveProperty('is_active');
      expect(lastCall.order_status_restriction).toHaveProperty('phone_numbers');
      expect(lastCall.order_status_restriction).toHaveProperty('sellers');
    });

    it('should set phone_numbers to empty when checkbox is disabled', () => {
      render(
        <PreferencesOrderStatusActive />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      const lastCall = mocks.setFormData.mock.calls[mocks.setFormData.mock.calls.length - 1][0];
      expect(lastCall.order_status_restriction.phone_numbers).toBe('');
    });
  });

  describe('initial state with existing phone number', () => {
    const mockAgentWithPhone = {
      ...mockOrderStatusAgent,
      restrictTestContact: {
        phoneNumber: '+55 11 99999-9999',
      },
    };

    beforeEach(() => {
      mocks.useSelector.mockImplementation((selector) => {
        if (selector.name === 'selectDesignSystem') {
          return 'shoreline';
        }

        return [mockAgentWithPhone];
      });
    });

    it('should show checkbox as checked when phone number exists', () => {
      render(
        <PreferencesOrderStatusActive />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('should show phone number input when phone number exists', () => {
      render(
        <PreferencesOrderStatusActive />
      );

      expect(screen.getByTestId('contact-number-input')).toBeInTheDocument();
      expect(screen.getByText('agents.categories.active.order_status.settings.test_contact_number.label')).toBeInTheDocument();
    });

    it('should display existing phone number in input', () => {
      render(
        <PreferencesOrderStatusActive />
      );

      const phoneInput = screen.getByTestId('contact-number-input');
      expect(phoneInput).toHaveValue('+55 11 99999-9999');
    });
  });

  describe('agent not found scenarios', () => {
    it('should render component when order status agent is not found', () => {
      mocks.useSelector.mockReturnValue([]);

      render(
        <PreferencesOrderStatusActive />
      );

      expect(screen.getByText('agents.categories.active.order_status.settings.is_test_contact_number.title')).toBeInTheDocument();
    });

    it('should initialize with checkbox unchecked when agent not found', () => {
      mocks.useSelector.mockImplementation((selector) => {
        if (selector.name === 'selectDesignSystem') {
          return 'shoreline';
        }

        return [];
      });

      render(
        <PreferencesOrderStatusActive />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('should not show phone number input when agent not found', () => {
      mocks.useSelector.mockReturnValue([]);

      render(
        <PreferencesOrderStatusActive />
      );

      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    beforeEach(() => {
      mocks.useSelector.mockImplementation((selector) => {
        if (selector.name === 'selectDesignSystem') {
          return 'shoreline';
        }

        return [mockOrderStatusAgent];
      });
    });

    it('should have proper aria-label for checkbox', () => {
      render(
        <PreferencesOrderStatusActive />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-label', 'agents.categories.active.order_status.settings.is_test_contact_number.title');
    });

    it('should have proper label for phone number input', () => {
      render(
        <PreferencesOrderStatusActive />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(screen.getByText('agents.categories.active.order_status.settings.test_contact_number.label')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it.each([
      {
        agent: {
          ...mockOrderStatusAgent,
          restrictTestContact: undefined,
        },
      },
      {
        agent: {
          ...mockOrderStatusAgent,
          restrictTestContact: {
            phoneNumber: '',
          },
        },
      },
      {
        agent: {
          ...mockOrderStatusAgent,
          restrictTestContact: {
            phoneNumber: null,
          },
        },
      },
    ])('should handle agent with no restrictTestContact property', ({ agent }) => {
      mocks.useSelector.mockImplementation((selector) => {
        if (selector.name === 'selectDesignSystem') {
          return 'shoreline';
        }

        return [agent];
      });

      render(
        <PreferencesOrderStatusActive />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });
  });

  describe('phone number formatting edge cases', () => {
    beforeEach(() => {
      mocks.useSelector.mockImplementation((selector) => {
        if (selector.name === 'selectDesignSystem') {
          return 'shoreline';
        }

        return [mockOrderStatusAgent];
      });
    });

    it('should handle incomplete Brazilian phone numbers', () => {
      render(
        <PreferencesOrderStatusActive />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      const phoneInput = screen.getByTestId('contact-number-input');
      fireEvent.change(phoneInput, { target: { value: '5511' } });

      expect(phoneInput).toHaveValue('+55 11');
    });

    it('should handle phone numbers with letters', () => {
      render(
        <PreferencesOrderStatusActive />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      const phoneInput = screen.getByTestId('contact-number-input');
      fireEvent.change(phoneInput, { target: { value: '55abc11def999999999' } });

      expect(phoneInput).toHaveValue('+55 11 99999-9999');
    });

    it('should handle very long phone numbers', () => {
      render(
        <PreferencesOrderStatusActive />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      const phoneInput = screen.getByTestId('contact-number-input');
      fireEvent.change(phoneInput, { target: { value: '551199999999999999999999' } });

      expect(phoneInput).toHaveValue('+55 11 99999-9999');
    });
  });
});
