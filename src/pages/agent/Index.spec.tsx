import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AgentIndex } from './Index';

const mocks = vi.hoisted(() => ({
  agentCLI: vi.fn(),
  updateAgentGlobalRule: vi.fn(),
  useParams: vi.fn().mockReturnValue({
    assignedAgentUuid: '1234',
  }),
  navigate: vi.fn(),
  toastSuccess: vi.fn(),
  toastCritical: vi.fn(),
  storeGetState: vi.fn(),
}));

vi.mock('@vtex/shoreline', async () => {
  const actual = await vi.importActual('@vtex/shoreline');

  return {
    ...actual,
    toast: {
      success: mocks.toastSuccess,
      critical: mocks.toastCritical,
    },
  };
});

vi.mock('react-router-dom', () => ({
  useNavigate: () => mocks.navigate,
  useParams: mocks.useParams,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
      changeLanguage: () => new Promise(() => { }),
    },
  }),
}));

vi.mock('../../services/agent.service', () => ({
  agentCLI: mocks.agentCLI,
  updateAgentGlobalRule: mocks.updateAgentGlobalRule,
}));

vi.mock('../../store/provider.store', () => ({
  default: {
    getState: mocks.storeGetState,
  },
}));

vi.mock('../../components/TemplateCard', () => ({
  TemplateCard: ({ name, description, status, loadAgentDetails }: any) => (
    <div data-testid={`template-card-${name}`}>
      <div data-testid={`template-name-${name}`}>{name}</div>
      <div data-testid={`template-description-${name}`}>{description}</div>
      <div data-testid={`template-status-${name}`}>{status}</div>
      <button data-testid={`template-card-load-agent-details-event-${name}`} onClick={loadAgentDetails}>
        Reload
      </button>
    </div>
  ),
  TemplateCardContainer: ({ children }: any) => (
    <div data-testid="template-card-container">{children}</div>
  ),
  TemplateCardSkeleton: ({ count }: any) => (
    <div data-testid="template-card-skeleton" data-count={count}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} data-testid={`skeleton-${i}`}>Loading...</div>
      ))}
    </div>
  ),
}));

vi.mock('../../components/agent/DescriptiveStatus', () => ({
  AgentDescriptiveStatus: ({ status, showLabel }: any) => (
    <div data-testid="agent-descriptive-status" data-status={status} data-show-label={showLabel}>
      Agent Status: {status}
    </div>
  ),
}));

vi.mock('../../components/agent/modals/Publish', () => ({
  PublishModal: ({ open, onClose, onPublish }: any) => (
    open ? (
      <div data-testid="publish-modal">
        <button data-testid="publish-modal-close" onClick={onClose}>Close</button>
        <button data-testid="publish-modal-publish" onClick={onPublish}>Publish</button>
      </div>
    ) : null
  ),
}));

vi.mock('../../components/agent/modals/SwitchToTestMode', () => ({
  SwitchToTestModeModal: ({ open, onClose, onTest }: any) => (
    open ? (
      <div data-testid="switch-to-test-modal">
        <button data-testid="switch-to-test-modal-close" onClick={onClose}>Close</button>
        <button data-testid="switch-to-test-modal-test" onClick={onTest}>Switch to Test</button>
      </div>
    ) : null
  ),
}));

vi.mock('../template/modals/Process', () => ({
  ProcessModal: ({ open, onClose, errorText, successText }: any) => (
    open ? (
      <div data-testid="process-modal">
        <div data-testid="process-modal-error-text">{errorText}</div>
        <div data-testid="process-modal-success-text">{successText}</div>
        <button data-testid="process-modal-on-close-event" onClick={onClose}>Close</button>
      </div>
    ) : null
  ),
}));

describe('AgentIndex', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.storeGetState.mockReturnValue({
      project: {
        agents: [
          {
            origin: 'CLI',
            assignedAgentUuid: '1234',
            name: 'Test Agent',
            description: 'Test Agent Description',
          },
        ],
      },
    });

    mocks.agentCLI.mockResolvedValue({
      webhookUrl: 'https://webhook.example.com',
      contactPercentage: 50,
      globalRule: 'Test global rule',
      hasDeliveredOrderTemplates: false,
      deliveredOrderTrackingConfig: {
        isEnabled: false,
        webhookUrl: 'https://webhook.example.com',
      },
      templates: [
        {
          uuid: 'template-1',
          name: 'Template 1',
          status: 'active',
          metadata: { body: 'Template 1 description' },
        },
        {
          uuid: 'template-2',
          name: 'Template 2',
          status: 'pending',
          metadata: { body: 'Template 2 description' },
        },
      ],
    });
  });

  describe('initialization', () => {
    it('should load agent details on mount', async () => {
      render(<AgentIndex />);

      await waitFor(() => {
        expect(mocks.agentCLI).toHaveBeenCalledWith({
          agentUuid: '1234',
          forceUpdate: false,
        });
      });
    });

    it('should display agent name in header and description', async () => {
      render(<AgentIndex />);

      await waitFor(() => {
        expect(screen.getByText('Test Agent')).toBeInTheDocument();
        expect(screen.getByText('Test Agent Description')).toBeInTheDocument();
      });
    });
  });

  describe('template list', () => {
    it('should display templates when loaded', async () => {
      render(<AgentIndex />);

      await waitFor(() => {
        expect(screen.getByTestId('template-card-Template 1')).toBeInTheDocument();
        expect(screen.getByTestId('template-card-Template 2')).toBeInTheDocument();
      });
    });

    it('should show loading skeleton when loading', () => {
      mocks.agentCLI.mockImplementation(() => new Promise(() => { }));

      render(<AgentIndex />);

      expect(screen.getByTestId('template-card-skeleton')).toBeInTheDocument();
    });

    it('should navigate to template creation page when the create custom template button is clicked', async () => {
      render(<AgentIndex />);

      await waitFor(() => {
        const addButton = screen.getByTestId('create-custom-template-button');
        fireEvent.click(addButton);
      });

      expect(mocks.navigate).toHaveBeenCalledWith('/agents/1234/templates/create');
    });

    it('should reload templates when template card reload event is triggered', async () => {
      render(<AgentIndex />);

      await waitFor(() => {
        const reloadButton = screen.getByTestId('template-card-load-agent-details-event-Template 1');
        fireEvent.click(reloadButton);
      });

      expect(mocks.agentCLI).toHaveBeenCalledTimes(2);
    });
  });

  describe('settings tab', () => {

    it('should display webhook URL', async () => {
      render(<AgentIndex />);

      const settingsTab = screen.getByText('agents.details.settings.title');
      fireEvent.click(settingsTab);

      await waitFor(() => {
        expect(screen.getByTestId('webhook-url-input')).toHaveValue('https://webhook.example.com');
      });
    });

    it('should display contact percentage', async () => {
      render(<AgentIndex />);

      const settingsTab = screen.getByText('agents.details.settings.title');
      fireEvent.click(settingsTab);

      await waitFor(() => {
        const percentageInput = screen.getByTestId('contact-percentage-input');
        expect(percentageInput).toHaveValue(50);
      });
    });

    it('should display global rule', async () => {
      render(<AgentIndex />);

      const settingsTab = screen.getByText('agents.details.settings.title');
      fireEvent.click(settingsTab);

      await waitFor(() => {
        const globalRuleTextarea = screen.getByTestId('global-rule-textarea');
        expect(globalRuleTextarea).toHaveValue('Test global rule');
      });
    });

    it('should update contact percentage when changed', async () => {
      render(<AgentIndex />);

      const settingsTab = screen.getByText('agents.details.settings.title');
      fireEvent.click(settingsTab);

      await waitFor(() => {
        const percentageInput = screen.getByTestId('contact-percentage-input');
        fireEvent.change(percentageInput, { target: { value: 75 } });
      });

      expect(screen.getByTestId('contact-percentage-input')).toHaveValue(75);

      const percentageInput = screen.getByTestId('contact-percentage-input');
      fireEvent.blur(percentageInput, { target: { value: 80 } });

      expect(percentageInput).toHaveValue(80);
    });

    it('should limit percentage to 100', async () => {
      render(<AgentIndex />);

      const settingsTab = screen.getByText('agents.details.settings.title');
      fireEvent.click(settingsTab);

      await waitFor(() => {
        const percentageInput = screen.getByTestId('contact-percentage-input');
        fireEvent.change(percentageInput, { target: { value: '150' } });
      });

      expect(screen.getByTestId('contact-percentage-input')).toHaveValue(100);
    });

    it('should save settings when save button is clicked', async () => {
      mocks.updateAgentGlobalRule.mockResolvedValue({});

      render(<AgentIndex />);

      const settingsTab = screen.getByText('agents.details.settings.title');
      fireEvent.click(settingsTab);

      await waitFor(() => {
        const percentageInput = screen.getByTestId('contact-percentage-input');
        fireEvent.change(percentageInput, { target: { value: 75 } });
      });

      const saveButton = screen.getByTestId('save-settings-button');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mocks.updateAgentGlobalRule).toHaveBeenCalledWith({
          agentUuid: '1234',
          contactPercentage: 75,
        });
      });

      expect(mocks.toastSuccess).toHaveBeenCalledWith('agents.details.settings.actions.save.success');
    });

    it('should show process modal when global rule is changed', async () => {
      mocks.updateAgentGlobalRule.mockResolvedValue({});

      render(<AgentIndex />);

      const settingsTab = screen.getByText('agents.details.settings.title');
      fireEvent.click(settingsTab);

      await waitFor(() => {
        const globalRuleTextarea = screen.getByTestId('global-rule-textarea');
        fireEvent.change(globalRuleTextarea, { target: { value: 'Updated global rule' } });
      });

      const saveButton = screen.getByTestId('save-settings-button');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByTestId('process-modal')).toBeInTheDocument();
      });

      expect(mocks.updateAgentGlobalRule).toHaveBeenCalledWith({
        agentUuid: '1234',
        globalRule: 'Updated global rule',
      });

      expect(screen.getByTestId('process-modal-success-text')).toHaveTextContent('agents.details.settings.actions.save.success');

      const closeButton = screen.getByTestId('process-modal-on-close-event');
      fireEvent.click(closeButton);

      expect(screen.queryByTestId('process-modal')).not.toBeInTheDocument();
    });

    it('should show error on process modal when save fails', async () => {
      mocks.updateAgentGlobalRule.mockRejectedValue(new Error('Save failed'));

      render(<AgentIndex />);

      const settingsTab = screen.getByText('agents.details.settings.title');
      fireEvent.click(settingsTab);

      await waitFor(() => {
        const globalRuleTextarea = screen.getByTestId('global-rule-textarea');
        fireEvent.change(globalRuleTextarea, { target: { value: 'Updated global rule' } });
      });

      const saveButton = screen.getByTestId('save-settings-button');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByTestId('process-modal')).toBeInTheDocument();
      });

      expect(mocks.updateAgentGlobalRule).toHaveBeenCalledWith({
        agentUuid: '1234',
        globalRule: 'Updated global rule',
      });

      expect(screen.getByTestId('error-alert')).toBeInTheDocument();
      expect(screen.getByTestId('error-alert')).toHaveTextContent('Save failed');
    });

    it('should show error when save fails', async () => {
      mocks.updateAgentGlobalRule.mockRejectedValue(new Error('Save failed'));

      render(<AgentIndex />);

      const settingsTab = screen.getByText('agents.details.settings.title');
      fireEvent.click(settingsTab);

      await waitFor(() => {
        const percentageInput = screen.getByTestId('contact-percentage-input');
        fireEvent.change(percentageInput, { target: { value: 75 } });
      });

      const saveButton = screen.getByTestId('save-settings-button');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mocks.toastCritical).toHaveBeenCalledWith('Save failed');
      });
    });

    it('should disable save button when no changes are made', async () => {
      render(<AgentIndex />);

      const settingsTab = screen.getByText('agents.details.settings.title');
      fireEvent.click(settingsTab);

      await waitFor(() => {
        const saveButton = screen.getByTestId('save-settings-button');
        expect(saveButton).toBeDisabled();
      });
    });
  });

  describe('navigation', () => {
    it('should navigate back to dashboard when back button is clicked', async () => {
      await act(async () => {
        render(<AgentIndex />);
      });

      const backButton = screen.getByTestId('back-button');
      fireEvent.click(backButton);

      expect(mocks.navigate).toHaveBeenCalledWith('/dash');
    });
  });

  describe('error handling', () => {
    it('should handle agentCLI error gracefully', async () => {
      mocks.agentCLI.mockRejectedValue(new Error('Failed to load agent'));

      render(<AgentIndex />);

      await waitFor(() => {
        expect(mocks.toastCritical).toHaveBeenCalledWith('common.errors.unexpected_error');
      });
    });

    it('should not call agentCLI when no agent is found', async () => {
      mocks.storeGetState.mockReturnValue({
        project: {
          agents: [],
        },
      });

      render(<AgentIndex />);

      expect(mocks.agentCLI).not.toHaveBeenCalled();
    });
  });

  describe('template status filtering', () => {
    it('should filter out templates with invalid status', async () => {
      mocks.agentCLI.mockResolvedValue({
        webhookUrl: 'https://webhook.example.com',
        contactPercentage: 50,
        globalRule: 'Test global rule',
        hasDeliveredOrderTemplates: false,
        deliveredOrderTrackingConfig: {
          isEnabled: false,
          webhookUrl: 'https://webhook.example.com',
        },
        templates: [
          {
            uuid: 'template-1',
            name: 'Template 1',
            status: 'active',
            metadata: { body: 'Template 1 description' },
          },
          {
            uuid: 'template-2',
            name: 'Template 2',
            status: 'invalid-status',
            metadata: { body: 'Template 2 description' },
          },
        ],
      });

      render(<AgentIndex />);

      await waitFor(() => {
        expect(screen.getByTestId('template-card-Template 1')).toBeInTheDocument();
        expect(screen.queryByTestId('template-card-Template 2')).not.toBeInTheDocument();
      });
    });
  });

  describe('pending templates verification', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should verify pending templates after 5 seconds', async () => {
      mocks.agentCLI.mockResolvedValueOnce({
        webhookUrl: 'https://webhook.example.com',
        contactPercentage: 50,
        globalRule: 'Test global rule',
        hasDeliveredOrderTemplates: false,
        deliveredOrderTrackingConfig: {
          isEnabled: false,
          webhookUrl: 'https://webhook.example.com',
        },
        templates: [
          {
            uuid: 'template-1',
            name: 'Template 1',
            status: 'pending',
            metadata: { body: 'Template 1 description' },
          },
        ],
      });

      mocks.agentCLI.mockResolvedValueOnce({
        webhookUrl: 'https://webhook.example.com',
        contactPercentage: 50,
        globalRule: 'Test global rule',
        hasDeliveredOrderTemplates: false,
        deliveredOrderTrackingConfig: {
          isEnabled: false,
          webhookUrl: 'https://webhook.example.com',
        },
        templates: [
          {
            uuid: 'template-1',
            name: 'Template 1',
            status: 'active',
            metadata: { body: 'Template 1 description' },
          },
        ],
      });

      render(<AgentIndex />);

      expect(mocks.agentCLI).toHaveBeenCalledTimes(1);

      await act(async () => {
        vi.advanceTimersByTime(5000);
      });

      await act(async () => {
        vi.runAllTimersAsync();
        vi.runOnlyPendingTimers();
      });

      await waitFor(() => {
        expect(mocks.agentCLI).toHaveBeenCalledTimes(2);
      });
    });
  });
});
