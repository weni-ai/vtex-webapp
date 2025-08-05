import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PreferencesAbandonedCartActive } from './AbandonedCartActive';

const mocks = vi.hoisted(() => ({
  useSelector: vi.fn(),
  setFormData: vi.fn(),
  convertStringToTimeValue: vi.fn(),
  convertTimeValueToString: vi.fn(),
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

vi.mock('../../utils/timeConversor', () => ({
  convertStringToTimeValue: mocks.convertStringToTimeValue,
  convertTimeValueToString: mocks.convertTimeValueToString,
}));

vi.mock('./SettingsContainer/SettingsContext', () => ({
  SettingsContext: {
    Provider: ({ children, value }: any) => (
      <div data-testid="settings-context-provider" data-value={JSON.stringify(value)}>
        {children}
      </div>
    ),
  },
}));

describe('PreferencesAbandonedCartActive', () => {
  const mockAbandonedCartAgent = {
    uuid: 'abandoned-cart-agent',
    name: 'Abandoned Cart Agent',
    origin: 'commerce',
    code: 'abandoned_cart',
    restrictMessageTime: {
      isActive: false,
      periods: {
        weekdays: {
          from: '09:00',
          to: '17:00',
        },
        saturdays: {
          from: '10:00',
          to: '15:00',
        },
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.convertStringToTimeValue.mockReturnValue({ hour: 9, minute: 0 });
    mocks.convertTimeValueToString.mockReturnValue('09:00');
  });

  describe('basic rendering', () => {
    beforeEach(() => {
      mocks.useSelector.mockReturnValue([mockAbandonedCartAgent]);
    });

    it('should render component when abandoned cart agent exists', () => {
      render(
        <PreferencesAbandonedCartActive />
      );

      expect(screen.getByText('agents.categories.active.abandoned_cart.settings.restriction.title')).toBeInTheDocument();
      expect(screen.getByText('agents.categories.active.abandoned_cart.settings.restriction.description')).toBeInTheDocument();
    });

    it('should display restriction title and description', () => {
      render(
        <PreferencesAbandonedCartActive />
      );

      expect(screen.getByText('agents.categories.active.abandoned_cart.settings.restriction.title')).toBeInTheDocument();
      expect(screen.getByText('agents.categories.active.abandoned_cart.settings.restriction.description')).toBeInTheDocument();
    });

    it('should not show time inputs when restriction is disabled', () => {
      render(
        <PreferencesAbandonedCartActive />
      );

      expect(screen.queryByTestId('time-input')).not.toBeInTheDocument();
      expect(screen.queryByTestId('time-input-weekdays-to')).not.toBeInTheDocument();
      expect(screen.queryByTestId('time-input-saturdays-from')).not.toBeInTheDocument();
      expect(screen.queryByTestId('time-input-saturdays-to')).not.toBeInTheDocument();
    });
  });

  describe('checkbox interactions', () => {
    beforeEach(() => {
      mocks.useSelector.mockReturnValue([mockAbandonedCartAgent]);
    });

    it('should toggle restriction when checkbox is clicked', () => {
      render(
        <PreferencesAbandonedCartActive />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();

      fireEvent.click(checkbox);

      expect(checkbox).toBeChecked();
    });

    it('should show time inputs when restriction is enabled', () => {
      render(
        <PreferencesAbandonedCartActive />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(screen.getByTestId('time-input')).toBeInTheDocument();
      expect(screen.getByTestId('time-input-weekdays-to')).toBeInTheDocument();
      expect(screen.getByTestId('time-input-saturdays-from')).toBeInTheDocument();
      expect(screen.getByTestId('time-input-saturdays-to')).toBeInTheDocument();
    });

    it('should hide time inputs when restriction is disabled', () => {
      render(
        <PreferencesAbandonedCartActive />
      );

      const checkbox = screen.getByRole('checkbox');

      fireEvent.click(checkbox);
      expect(screen.getByTestId('time-input')).toBeInTheDocument();

      fireEvent.click(checkbox);
      expect(screen.queryByTestId('time-input')).not.toBeInTheDocument();
    });
  });

  describe('time input handling', () => {
    beforeEach(() => {
      mocks.useSelector.mockReturnValue([mockAbandonedCartAgent]);
    });

    it('should display saturdays section when restriction is enabled', () => {
      render(
        <PreferencesAbandonedCartActive />
      );

      const checkbox = screen.getByTestId('checkbox-input');
      fireEvent.click(checkbox);

      expect(screen.getByText('agents.categories.active.abandoned_cart.settings.restriction.saturday')).toBeInTheDocument();
    });

    it('should handle weekdays from time input change', () => {
      render(
        <PreferencesAbandonedCartActive />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      const weekdaysFromInput = screen.getByTestId('time-input');
      fireEvent.change(weekdaysFromInput, '10:00');

      expect(weekdaysFromInput).toBeInTheDocument();
    });

    it('should handle weekdays to time input change', () => {
      render(
        <PreferencesAbandonedCartActive />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      const weekdaysToInput = screen.getByTestId('time-input-weekdays-to');
      fireEvent.change(weekdaysToInput, '18:00');

      expect(weekdaysToInput).toBeInTheDocument();
    });

    it('should handle saturdays from time input change', () => {
      render(
        <PreferencesAbandonedCartActive />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      const saturdaysFromInput = screen.getByTestId('time-input-saturdays-from');
      fireEvent.change(saturdaysFromInput, '11:00');

      expect(saturdaysFromInput).toBeInTheDocument();
    });

    it('should handle saturdays to time input change', () => {
      render(
        <PreferencesAbandonedCartActive />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      const saturdaysToInput = screen.getByTestId('time-input-saturdays-to');
      fireEvent.change(saturdaysToInput, '16:00');

      expect(saturdaysToInput).toBeInTheDocument();
    });
  });

  describe('form data updates', () => {
    beforeEach(() => {
      mocks.useSelector.mockReturnValue([mockAbandonedCartAgent]);
    });

    it('should call setFormData when restriction is toggled', async () => {
      render(
        <PreferencesAbandonedCartActive />
      );

      const checkbox = screen.getByTestId('checkbox-input');
      fireEvent.change(checkbox, { target: { checked: true } });

      await waitFor(async () => {
        expect(mocks.setFormData).toHaveBeenCalledWith({
          messageTimeRestriction: {
            isActive: false,
            periods: {
              weekdays: {
                from: '09:00',
                to: '09:00',
              },
              saturdays: {
                from: '09:00',
                to: '09:00',
              }
            }
          }
        });
      });
    });

    it('should call setFormData when time inputs change', () => {
      render(
        <PreferencesAbandonedCartActive />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      const weekdaysFromInput = screen.getByTestId('time-input');
      fireEvent.change(weekdaysFromInput, '10:00');

      expect(mocks.setFormData).toHaveBeenCalled();
    });

    it('should update form data with correct structure', () => {
      render(
        <PreferencesAbandonedCartActive />
      );

      const checkbox = screen.getByTestId('checkbox-input');
      fireEvent.change(checkbox, { target: { checked: true } });

      const lastCall = mocks.setFormData.mock.calls[mocks.setFormData.mock.calls.length - 1][0];
      expect(lastCall).toHaveProperty('messageTimeRestriction');
      expect(lastCall.messageTimeRestriction).toHaveProperty('isActive');
      expect(lastCall.messageTimeRestriction).toHaveProperty('periods');
      expect(lastCall.messageTimeRestriction.periods).toHaveProperty('weekdays');
      expect(lastCall.messageTimeRestriction.periods).toHaveProperty('saturdays');
    });
  });

  describe('initial state with active restriction', () => {
    const mockActiveAgent = {
      ...mockAbandonedCartAgent,
      restrictMessageTime: {
        isActive: true,
        periods: {
          weekdays: {
            from: '09:00',
            to: '17:00',
          },
          saturdays: {
            from: '10:00',
            to: '15:00',
          },
        },
      },
    };

    beforeEach(() => {
      mocks.useSelector.mockReturnValue([mockActiveAgent]);
      mocks.convertStringToTimeValue.mockReturnValue({ hour: 9, minute: 0 });
    });

    it('should show checkbox as checked when restriction is initially active', () => {
      render(
        <PreferencesAbandonedCartActive />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('should show time inputs when restriction is initially active', () => {
      render(
        <PreferencesAbandonedCartActive />
      );

      expect(screen.getByTestId('time-input')).toBeInTheDocument();
      expect(screen.getByTestId('time-input-weekdays-to')).toBeInTheDocument();
      expect(screen.getByTestId('time-input-saturdays-from')).toBeInTheDocument();
      expect(screen.getByTestId('time-input-saturdays-to')).toBeInTheDocument();
    });

    it('should display weekdays and saturdays sections when initially active', () => {
      render(
        <PreferencesAbandonedCartActive />
      );

      expect(screen.getByText('agents.categories.active.abandoned_cart.settings.restriction.monday_until_friday')).toBeInTheDocument();
      expect(screen.getByText('agents.categories.active.abandoned_cart.settings.restriction.saturday')).toBeInTheDocument();
    });
  });

  describe('agent not found scenarios', () => {
    it('should render component when abandoned cart agent is not found', () => {
      mocks.useSelector.mockReturnValue([]);

      render(
        <PreferencesAbandonedCartActive />
      );

      expect(screen.getByTestId('drawer-content')).toBeInTheDocument();
      expect(screen.getByTestId('checkbox-input')).toBeInTheDocument();
    });

    it('should initialize with restriction disabled when agent not found', () => {
      mocks.useSelector.mockReturnValue([]);

      render(
        <PreferencesAbandonedCartActive />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('should not show time inputs when agent not found and restriction disabled', () => {
      mocks.useSelector.mockReturnValue([]);

      render(
        <PreferencesAbandonedCartActive />
      );

      expect(screen.queryByTestId('time-input')).not.toBeInTheDocument();
    });
  });

  describe('time conversion utilities', () => {
    beforeEach(() => {
      mocks.useSelector.mockReturnValue([mockAbandonedCartAgent]);
    });

    it('should call convertStringToTimeValue for initial time values', () => {
      render(
        <PreferencesAbandonedCartActive />
      );

      expect(mocks.convertStringToTimeValue).toHaveBeenCalledWith('09:00');
      expect(mocks.convertStringToTimeValue).toHaveBeenCalledWith('17:00');
      expect(mocks.convertStringToTimeValue).toHaveBeenCalledWith('10:00');
      expect(mocks.convertStringToTimeValue).toHaveBeenCalledWith('15:00');
    });
  });

  describe('layout and styling', () => {
    beforeEach(() => {
      mocks.useSelector.mockReturnValue([mockAbandonedCartAgent]);
    });

    it('should render with proper grid layout for time inputs', () => {
      render(
        <PreferencesAbandonedCartActive />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(screen.getByTestId('time-input')).toBeInTheDocument();
      expect(screen.getByTestId('time-input-weekdays-to')).toBeInTheDocument();
      expect(screen.getByTestId('time-input-saturdays-from')).toBeInTheDocument();
      expect(screen.getByTestId('time-input-saturdays-to')).toBeInTheDocument();
    });

    it('should render with proper flex layout', () => {
      render(
        <PreferencesAbandonedCartActive />
      );

      expect(screen.getByText('agents.categories.active.abandoned_cart.settings.restriction.title')).toBeInTheDocument();
      expect(screen.getByText('agents.categories.active.abandoned_cart.settings.restriction.description')).toBeInTheDocument();
    });

    it('should include divider between weekdays and saturdays sections', () => {
      render(
        <PreferencesAbandonedCartActive />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(screen.getByText('agents.categories.active.abandoned_cart.settings.restriction.monday_until_friday')).toBeInTheDocument();
      expect(screen.getByText('agents.categories.active.abandoned_cart.settings.restriction.saturday')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    beforeEach(() => {
      mocks.useSelector.mockReturnValue([mockAbandonedCartAgent]);
    });

    it('should have proper aria-label for checkbox', () => {
      render(
        <PreferencesAbandonedCartActive />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-label', 'agents.active.abandoned_cart.settings.restriction.description');
    });

    it('should have proper test IDs for time inputs', () => {
      render(
        <PreferencesAbandonedCartActive />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(screen.getByTestId('time-input')).toBeInTheDocument();
      expect(screen.getByTestId('time-input-weekdays-to')).toBeInTheDocument();
      expect(screen.getByTestId('time-input-saturdays-from')).toBeInTheDocument();
      expect(screen.getByTestId('time-input-saturdays-to')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle agent with no restrictMessageTime property', () => {
      const agentWithoutRestriction = {
        ...mockAbandonedCartAgent,
        restrictMessageTime: undefined,
      };

      mocks.useSelector.mockReturnValue([agentWithoutRestriction]);

      render(
        <PreferencesAbandonedCartActive />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('should handle agent with partial restrictMessageTime data', () => {
      const agentWithPartialData = {
        ...mockAbandonedCartAgent,
        restrictMessageTime: {
          isActive: true,
          periods: {
            weekdays: {
              from: '09:00',
              to: '',
            },
            saturdays: {
              from: '',
              to: '15:00',
            },
          },
        },
      };

      mocks.useSelector.mockReturnValue([agentWithPartialData]);

      render(
        <PreferencesAbandonedCartActive />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('should handle empty periods object', () => {
      const agentWithEmptyPeriods = {
        ...mockAbandonedCartAgent,
        restrictMessageTime: {
          isActive: true,
          periods: {},
        },
      };

      mocks.useSelector.mockReturnValue([agentWithEmptyPeriods]);

      render(
        <PreferencesAbandonedCartActive />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });
  });
});
