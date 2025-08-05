import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Onboarding } from './Onboarding';

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  useSelector: vi.fn(),
  storeGetState: vi.fn(),
  storeDispatch: vi.fn(),
  assignAgentCLI: vi.fn(),
  integrateAgent: vi.fn(),
  buildAgent: vi.fn(),
  initializeUser: vi.fn(),
  toastCritical: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mocks.navigate,
}));

vi.mock('react-redux', () => ({
  useSelector: mocks.useSelector,
}));

vi.mock('@vtex/shoreline', async () => {
  const actual = await vi.importActual('@vtex/shoreline');

  return {
    ...actual,
    toast: {
      critical: mocks.toastCritical,
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

vi.mock('../store/provider.store', () => ({
  default: {
    getState: mocks.storeGetState,
    dispatch: mocks.storeDispatch,
  },
}));

vi.mock('../services/agent.service', () => ({
  assignAgentCLI: mocks.assignAgentCLI,
  integrateAgent: mocks.integrateAgent,
}));

vi.mock('./setup/useAgentBuilderSetup', () => ({
  useAgentBuilderSetup: () => ({
    buildAgent: mocks.buildAgent,
  }),
}));

vi.mock('./setup/useUserSetup', () => ({
  useUserSetup: () => ({
    initializeUser: mocks.initializeUser,
  }),
}));

vi.mock('../components/agent/AgentsList', () => ({
  AgentsList: ({ onAssign }: any) => (
    <div data-testid="agents-list">
      <button data-testid="assign-cli-agent" onClick={() => onAssign('cli-uuid')}>
        Assign CLI Agent
      </button>
      <button data-testid="assign-nexus-agent" onClick={() => onAssign('nexus-uuid')}>
        Assign Nexus Agent
      </button>
      <button data-testid="assign-commerce-agent" onClick={() => onAssign('commerce-uuid')}>
        Assign Commerce Agent
      </button>
    </div>
  ),
}));

vi.mock('./agent/AgentBuilder', () => ({
  AgentBuilder: ({ form, setForm, errors }: any) => (
    <div data-testid="agent-builder">
      <input
        data-testid="name-input"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        data-testid="knowledge-input"
        value={form.knowledge}
        onChange={(e) => setForm({ ...form, knowledge: e.target.value })}
      />
      <input
        data-testid="occupation-input"
        value={form.occupation}
        onChange={(e) => setForm({ ...form, occupation: e.target.value })}
      />
      <input
        data-testid="objective-input"
        value={form.objective}
        onChange={(e) => setForm({ ...form, objective: e.target.value })}
      />
      <div data-testid="name-error">{errors.name}</div>
      <div data-testid="knowledge-error">{errors.knowledge}</div>
    </div>
  ),
}));

vi.mock('../components/agent/modals/Assign', () => ({
  AgentAssignModal: ({ agentUuid, selectedTemplatesUuids, open, onClose, onAssign, isAssigningAgent }: any) => (
    open ? (
      <div data-testid="agent-assign-modal">
        <button data-testid="close-assign-modal" onClick={onClose}>Close</button>
        <button
          data-testid="assign-agent-button"
          onClick={() => onAssign({
            uuid: agentUuid,
            templatesUuids: selectedTemplatesUuids || [],
            credentials: { key: 'value' },
          })}
          disabled={isAssigningAgent}
        >
          Assign Agent
        </button>
      </div>
    ) : null
  ),
}));

vi.mock('../components/agent/modals/WhatsAppRequired', () => ({
  WhatsAppRequiredModal: ({ open, onClose, onConfirm }: any) => (
    open ? (
      <div data-testid="whatsapp-required-modal">
        <button data-testid="close-whatsapp-modal" onClick={onClose}>Close</button>
        <button data-testid="confirm-whatsapp" onClick={onConfirm}>Confirm</button>
      </div>
    ) : null
  ),
}));

const useSelectorMockDefault = (selector: any) => {
  if (selector.name === 'isWhatsAppIntegrated') {
    return true;
  }
  if (selector.name === 'agents') {
    return [
      {
        uuid: 'cli-uuid',
        origin: 'CLI',
        name: 'CLI Agent',
        notificationType: 'active',
      },
      {
        uuid: 'nexus-uuid',
        origin: 'nexus',
        name: 'Nexus Agent',
        notificationType: 'active',
      },
      {
        uuid: 'commerce-uuid',
        origin: 'commerce',
        name: 'Commerce Agent',
        notificationType: 'active',
      },
    ];
  }
  if (selector.name === 'getAgentBuilder') {
    return {
      name: 'Test Agent',
      links: ['https://example.com'],
      occupation: 'Developer',
      objective: 'Test Objective',
    };
  }
  if (selector.name === 'selectAccount') {
    return {
      accountName: 'Test Account',
    };
  }
  if (selector.name === 'projectUuidSelector') {
    return 'test-project-uuid';
  }
  return null;
}

describe('Onboarding', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.useSelector.mockImplementation((selector) => {
      return useSelectorMockDefault(selector);
    });

    mocks.storeGetState.mockReturnValue({
      project: {
        project_uuid: 'test-project-uuid',
      },
      user: {
        isWhatsAppIntegrated: true,
      }
    });
  });

  describe('initialization', () => {
    it('should initialize user on mount', async () => {
      render(<Onboarding />);

      await waitFor(() => {
        expect(mocks.initializeUser).toHaveBeenCalled();
      });
    });

    it('should show select agent page initially', () => {
      render(<Onboarding />);

      expect(screen.getByText('onboarding.select_agent.title')).toBeInTheDocument();
      expect(screen.getByTestId('agents-list')).toBeInTheDocument();
    });

    it('should display step indicator', () => {
      render(<Onboarding />);

      expect(screen.getByText('agents.modals.assign.steps')).toBeInTheDocument();
    });
  });

  describe('page navigation', () => {
    it('should navigate to next page when skip button is clicked', async () => {
      render(<Onboarding />);

      const skipButton = screen.getByTestId('next-button');
      fireEvent.click(skipButton);

      await waitFor(() => {
        expect(screen.getByText('onboarding.build_manager.title')).toBeInTheDocument();
        expect(screen.getByTestId('agent-builder')).toBeInTheDocument();
      });
    });

    it('should show back button on second page', async () => {
      render(<Onboarding />);

      const skipButton = screen.getByTestId('next-button');
      fireEvent.click(skipButton);

      await waitFor(() => {
        expect(screen.getByTestId('back-button')).toBeInTheDocument();
      });
    });

    it('should navigate back to previous page when back button is clicked', async () => {
      render(<Onboarding />);

      const skipButton = screen.getByTestId('next-button');
      fireEvent.click(skipButton);

      await waitFor(() => {
        const backButton = screen.getByTestId('back-button');
        fireEvent.click(backButton);
      });

      await waitFor(() => {
        expect(screen.getByText('onboarding.select_agent.title')).toBeInTheDocument();
        expect(screen.getByTestId('agents-list')).toBeInTheDocument();
      });
    });

    it('should not show back button on first page', () => {
      render(<Onboarding />);

      expect(screen.queryByLabelText('common.return')).not.toBeInTheDocument();
    });
  });

  describe('agent assignment', () => {
    it.each([
      { origin: 'cli' },
      { origin: 'nexus' },
    ])('should open assign modal for $origin agents', ({ origin }) => {
      render(<Onboarding />);

      const assignButton = screen.getByTestId(`assign-${origin}-agent`);
      fireEvent.click(assignButton);

      expect(screen.getByTestId('agent-assign-modal')).toBeInTheDocument();
    });

    it('should integrate commerce agents directly when WhatsApp is integrated', async () => {
      mocks.integrateAgent.mockResolvedValue({ error: false });

      render(<Onboarding />);

      const assignButton = screen.getByTestId('assign-commerce-agent');
      fireEvent.click(assignButton);

      await waitFor(() => {
        expect(mocks.integrateAgent).toHaveBeenCalledWith('commerce-uuid', 'test-project-uuid');
      });
    });

    it('should open WhatsApp required modal for commerce agents when WhatsApp is not integrated', () => {
      mocks.useSelector.mockImplementation((selector) => {
        if (selector.name === 'isWhatsAppIntegrated') {
          return false;
        }
        return useSelectorMockDefault(selector);
      });

      render(<Onboarding />);

      const assignButton = screen.getByTestId('assign-commerce-agent');
      fireEvent.click(assignButton);

      expect(screen.getByTestId('whatsapp-required-modal')).toBeInTheDocument();
    });
  });

  describe('agent builder form', () => {
    it('should display form fields on build manager page', async () => {
      render(<Onboarding />);

      const skipButton = screen.getByTestId('next-button');
      fireEvent.click(skipButton);

      await waitFor(() => {
        expect(screen.getByTestId('name-input')).toBeInTheDocument();
        expect(screen.getByTestId('knowledge-input')).toBeInTheDocument();
        expect(screen.getByTestId('occupation-input')).toBeInTheDocument();
        expect(screen.getByTestId('objective-input')).toBeInTheDocument();
      });
    });

    it('should pre-populate form with agent builder data', async () => {
      render(<Onboarding />);

      const skipButton = screen.getByTestId('next-button');
      fireEvent.click(skipButton);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Agent')).toBeInTheDocument();
        expect(screen.getByDisplayValue('https://example.com')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Developer')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test Objective')).toBeInTheDocument();
      });
    });

    it('should update form when inputs change', async () => {
      render(<Onboarding />);

      const skipButton = screen.getByTestId('next-button');
      fireEvent.click(skipButton);

      await waitFor(() => {
        const nameInput = screen.getByTestId('name-input');
        fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
        expect(screen.getByDisplayValue('Updated Name')).toBeInTheDocument();
      });
    });
  });

  describe('form validation', () => {
    it('should show error for empty name field', async () => {
      render(<Onboarding />);

      const skipButton = screen.getByTestId('next-button');
      fireEvent.click(skipButton);

      await waitFor(() => {
        const nameInput = screen.getByTestId('name-input');
        fireEvent.change(nameInput, { target: { value: '' } });

        const finishButton = screen.getByTestId('next-button');
        fireEvent.click(finishButton);

        expect(screen.getByTestId('name-error')).toHaveTextContent('agent.setup.forms.error.empty_input');
      });
    });

    it('should show error for empty knowledge field', async () => {
      render(<Onboarding />);

      const skipButton = screen.getByTestId('next-button');
      fireEvent.click(skipButton);

      await waitFor(() => {
        const knowledgeInput = screen.getByTestId('knowledge-input');
        fireEvent.change(knowledgeInput, { target: { value: '' } });

        const finishButton = screen.getByText('common.finish');
        fireEvent.click(finishButton);

        expect(screen.getByTestId('knowledge-error')).toHaveTextContent('agent.setup.forms.error.empty_input');
      });
    });

    it('should show error for invalid URL in knowledge field', async () => {
      render(<Onboarding />);

      const skipButton = screen.getByTestId('next-button');
      fireEvent.click(skipButton);

      await waitFor(() => {
        const knowledgeInput = screen.getByTestId('knowledge-input');
        fireEvent.change(knowledgeInput, { target: { value: 'invalid-url' } });

        const finishButton = screen.getByTestId('next-button');
        fireEvent.click(finishButton);

        expect(screen.getByTestId('knowledge-error')).toHaveTextContent('agent.setup.forms.error.valid_url');
      });
    });

    it('should call buildAgent when form is valid', async () => {
      render(<Onboarding />);

      const skipButton = screen.getByTestId('next-button');
      fireEvent.click(skipButton);

      await waitFor(() => {
        const finishButton = screen.getByTestId('next-button');
        fireEvent.click(finishButton);

        expect(mocks.buildAgent).toHaveBeenCalled();
      });
    });
  });

  describe('modal interactions', () => {
    it('should close agent assign modal', () => {
      render(<Onboarding />);

      const assignButton = screen.getByTestId('assign-cli-agent');
      fireEvent.click(assignButton);

      const closeButton = screen.getByTestId('close-assign-modal');
      fireEvent.click(closeButton);

      expect(screen.queryByTestId('agent-assign-modal')).not.toBeInTheDocument();
    });

    it('should close WhatsApp required modal', () => {
      mocks.useSelector.mockImplementation((selector) => {
        if (selector.name === 'isWhatsAppIntegrated') {
          return false;
        }
        return useSelectorMockDefault(selector);
      });

      render(<Onboarding />);

      const assignButton = screen.getByTestId('assign-commerce-agent');
      fireEvent.click(assignButton);

      const closeButton = screen.getByTestId('close-whatsapp-modal');
      fireEvent.click(closeButton);

      expect(screen.queryByTestId('whatsapp-required-modal')).not.toBeInTheDocument();
    });

    it('should confirm WhatsApp integration', async () => {
      mocks.useSelector.mockImplementation((selector) => {
        if (selector.name === 'isWhatsAppIntegrated') {
          return false;
        }
        return useSelectorMockDefault(selector);
      });

      mocks.integrateAgent.mockResolvedValue({ error: false });

      render(<Onboarding />);

      const assignButton = screen.getByTestId('assign-commerce-agent');
      fireEvent.click(assignButton);

      const confirmButton = screen.getByTestId('confirm-whatsapp');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mocks.integrateAgent).toHaveBeenCalledWith('commerce-uuid', 'test-project-uuid');
        expect(screen.queryByTestId('whatsapp-required-modal')).not.toBeInTheDocument();
      });
    });
  });

  describe('CLI agent assignment', () => {
    it('should assign CLI agent successfully', async () => {
      mocks.assignAgentCLI.mockResolvedValue({});

      render(<Onboarding />);

      const assignButton = screen.getByTestId('assign-cli-agent');
      fireEvent.click(assignButton);

      const assignAgentButton = screen.getByTestId('assign-agent-button');
      fireEvent.click(assignAgentButton);

      await waitFor(() => {
        expect(mocks.assignAgentCLI).toHaveBeenCalledWith({
          uuid: 'cli-uuid',
          templatesUuids: [],
          credentials: { key: 'value' },
        });

        expect(screen.queryByTestId('agent-assign-modal')).not.toBeInTheDocument();
      });
    });

    it('should handle CLI agent assignment error', async () => {
      mocks.assignAgentCLI.mockRejectedValue(new Error('Assignment failed'));

      render(<Onboarding />);

      const assignButton = screen.getByTestId('assign-cli-agent');
      fireEvent.click(assignButton);

      const assignAgentButton = screen.getByTestId('assign-agent-button');
      fireEvent.click(assignAgentButton);

      await waitFor(() => {
        expect(mocks.toastCritical).toHaveBeenCalledWith('Assignment failed');
      });
    });

    it('should assign passive CLI agent', async () => {
      mocks.useSelector.mockImplementation((selector) => {
        if (selector.name === 'isWhatsAppIntegrated') {
          return true;
        }
        if (selector.name === 'agents') {
          return [
            {
              uuid: 'nexus-uuid',
              origin: 'nexus',
              name: 'Nexus Agent',
              notificationType: 'passive',
            },
          ];
        }
        if (selector.name === 'getAgentBuilder') {
          return {
            name: 'Test Agent',
            links: ['https://example.com'],
            occupation: 'Developer',
            objective: 'Test Objective',
          };
        }
        if (selector.name === 'selectAccount') {
          return {
            accountName: 'Test Account',
          };
        }
        if (selector.name === 'project_uuid') {
          return 'test-project-uuid';
        }
        return useSelectorMockDefault(selector);
      });

      mocks.integrateAgent.mockResolvedValue({ error: false });

      render(<Onboarding />);

      const assignButton = screen.getByTestId('assign-nexus-agent');
      fireEvent.click(assignButton);

      const assignAgentButton = screen.getByTestId('assign-agent-button');
      fireEvent.click(assignAgentButton);

      await waitFor(() => {
        expect(screen.queryByTestId('agent-assign-modal')).not.toBeInTheDocument();
      });
    });
  });

  describe('integration error handling', () => {
    it('should show error toast when integration fails', async () => {
      mocks.integrateAgent.mockResolvedValue({ error: true });

      await act(async () => {
        render(<Onboarding />);
      });

      const assignButton = screen.getByTestId('assign-commerce-agent');
      fireEvent.click(assignButton);

      await waitFor(() => {
        expect(mocks.toastCritical).toHaveBeenCalledWith('integration.error');
      });
    });
  });

  describe('button text changes', () => {
    it('should show "Finish" button on last page', async () => {
      render(<Onboarding />);

      const skipButton = screen.getByTestId('next-button');
      fireEvent.click(skipButton);

      await waitFor(() => {
        expect(screen.getByText('common.finish')).toBeInTheDocument();
      });
    });

    it('should show "Skip" button on first page', () => {
      render(<Onboarding />);

      expect(screen.getByText('common.skip')).toBeInTheDocument();
    });
  });
});
