import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AgentAssignModal } from './Assign';

const mocks = vi.hoisted(() => ({
  useSelector: vi.fn(),
  onClose: vi.fn(),
  onViewAgentsGallery: vi.fn(),
  onAssign: vi.fn(),
}));

vi.mock('react-redux', () => ({
  useSelector: mocks.useSelector,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (key === 'agents.modals.assign.title') {
        return `Assign ${options?.name || 'Agent'}`;
      }
      if (key === 'agents.modals.assign.steps') {
        return `Step ${options?.currentPage} of ${options?.totalPages}`;
      }
      return key;
    },
    i18n: {
      language: 'en',
      changeLanguage: () => new Promise(() => { }),
    },
  }),
}));

vi.mock('@vtex/shoreline', async () => {
  const actual = await vi.importActual('@vtex/shoreline');

  return {
    ...actual,
    Modal: ({ children, open, onClose, size }: any) => (
      open ? (
        <div data-testid="modal" data-open={open} data-size={size}>
          {children}
          <button data-testid="modal-on-close-event" onClick={onClose}>Close</button>
        </div>
      ) : null
    ),
  };
});

vi.mock('./AssignAbout', () => ({
  AssignAbout: ({ description, notificationType, templates }: any) => (
    <div data-testid="assign-about">
      <div data-testid="description">{description}</div>
      <div data-testid="notification-type">{notificationType}</div>
      <div data-testid="templates-count">{templates.length}</div>
    </div>
  ),
}));

vi.mock('./AssignSelectTemplate', () => ({
  AssignSelectTemplate: ({ templates, selectedTemplatesUuids, setSelectedTemplatesUuids }: any) => (
    <div data-testid="assign-select-template">
      {templates.map((template: any) => (
        <div key={template.uuid} data-testid={`template-${template.uuid}`}>
          <input
            type="checkbox"
            checked={selectedTemplatesUuids.includes(template.uuid)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedTemplatesUuids([...selectedTemplatesUuids, template.uuid]);
              } else {
                setSelectedTemplatesUuids(selectedTemplatesUuids.filter((id: string) => id !== template.uuid));
              }
            }}
          />
          <span>{template.name}</span>
        </div>
      ))}
    </div>
  ),
}));

vi.mock('./AssignCredentials', () => ({
  AssignCredentials: ({ credentials, setCredentials }: any) => (
    <div data-testid="assign-credentials">
      {credentials.map((credential: any, index: number) => (
        <div key={index} data-testid={`credential-${credential.name}`}>
          <input
            data-testid={`credential-input-${credential.name}`}
            value={credential.value}
            onChange={(e) => {
              const newCredentials = [...credentials];
              newCredentials[index] = { ...credential, value: e.target.value };
              setCredentials(newCredentials);
            }}
            placeholder={credential.placeholder}
          />
        </div>
      ))}
    </div>
  ),
}));

vi.mock('./AssignWhatsAppRequired', () => ({
  AssignWhatsAppRequired: () => (
    <div data-testid="assign-whatsapp-required">
      <div>WhatsApp integration required</div>
    </div>
  ),
}));

vi.mock('../ModalPassiveDetails', () => ({
  AgentPassiveAbout: ({ description, skills, type }: any) => (
    <div data-testid="agent-passive-about">
      <div data-testid="passive-description">{description}</div>
      <div data-testid="passive-skills-count">{skills.length}</div>
      <div data-testid="passive-type">{type}</div>
    </div>
  ),
}));

describe('AgentAssignModal', () => {
  const defaultProps = {
    open: true,
    onClose: mocks.onClose,
    agentUuid: 'test-uuid',
    onViewAgentsGallery: mocks.onViewAgentsGallery,
    onAssign: mocks.onAssign,
    isAssigningAgent: false,
    changeNextButtonTextOnLastPage: true,
  };

  const mockCLIAgent = {
    uuid: 'test-uuid',
    name: 'Test CLI Agent',
    description: 'Test CLI Agent Description',
    origin: 'CLI',
    notificationType: 'active',
    templates: [
      { uuid: 'template-1', name: 'Template 1' },
      { uuid: 'template-2', name: 'Template 2' },
    ],
    credentials: {
      apiKey: { label: 'API Key', placeholder: 'Enter API Key' },
      secretKey: { label: 'Secret Key', placeholder: 'Enter Secret Key' },
    },
  };

  const mockNexusAgent = {
    uuid: 'test-uuid',
    name: 'Test Nexus Agent',
    description: 'Test Nexus Agent Description',
    origin: 'nexus',
    notificationType: 'passive',
    skills: ['skill1', 'skill2'],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('CLI agent flow', () => {
    beforeEach(() => {
      mocks.useSelector.mockImplementation((selector) => {
        if (selector.name === 'isWppIntegratedSelector') {
          return true;
        }
        return mockCLIAgent;
      });
    });

    it('should render modal with CLI agent information', () => {
      render(<AgentAssignModal {...defaultProps} />);

      expect(screen.getByText('Assign Test CLI Agent')).toBeInTheDocument();
      expect(screen.getByTestId('assign-about')).toBeInTheDocument();
      expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
    });

    it('should show about page initially for CLI agent', () => {
      render(<AgentAssignModal {...defaultProps} />);

      expect(screen.getByTestId('assign-about')).toBeInTheDocument();
      expect(screen.getByTestId('description')).toHaveTextContent('Test CLI Agent Description');
      expect(screen.getByTestId('notification-type')).toHaveTextContent('active');
      expect(screen.getByTestId('templates-count')).toHaveTextContent('2');
    });

    it('should navigate to template selection page', async () => {
      render(<AgentAssignModal {...defaultProps} />);

      const nextButton = screen.getByTestId('next-button');
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByTestId('assign-select-template')).toBeInTheDocument();
        expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
      });
    });

    it('should allow template selection', async () => {
      render(<AgentAssignModal {...defaultProps} />);

      const nextButton = screen.getByTestId('next-button');
      fireEvent.click(nextButton);

      expect(screen.getByTestId('template-template-1').querySelector('input')).toBeChecked();

      await waitFor(() => {
        const template1Checkbox = screen.getByTestId('template-template-1').querySelector('input');
        fireEvent.click(template1Checkbox!);
      });

      expect(screen.getByTestId('template-template-1').querySelector('input')).not.toBeChecked();
    });

    it('should disable next button when no templates are selected', async () => {
      render(<AgentAssignModal {...defaultProps} />);

      const nextButton = screen.getByTestId('next-button');
      fireEvent.click(nextButton);

      const template1Checkbox = screen.getByTestId('template-template-1').querySelector('input');
      fireEvent.click(template1Checkbox!);

      const template2Checkbox = screen.getByTestId('template-template-2').querySelector('input');
      fireEvent.click(template2Checkbox!);

      await waitFor(() => {
        expect(nextButton).toBeDisabled();
      });
    });

    it('should enable next button when templates are selected', async () => {
      render(<AgentAssignModal {...defaultProps} />);

      const nextButton = screen.getByTestId('next-button');
      fireEvent.click(nextButton);

      await waitFor(() => {
        const template1Checkbox = screen.getByTestId('template-template-1').querySelector('input');
        fireEvent.click(template1Checkbox!);
      });

      const nextButtonInTemplatePage = screen.getByTestId('next-button');
      expect(nextButtonInTemplatePage).not.toBeDisabled();
    });

    it('should navigate to credentials page', async () => {
      render(<AgentAssignModal {...defaultProps} />);

      const nextButton = screen.getByTestId('next-button');
      fireEvent.click(nextButton);

      await waitFor(() => {
        const template1Checkbox = screen.getByTestId('template-template-1').querySelector('input');
        fireEvent.click(template1Checkbox!);
      });

      const nextButtonInTemplatePage = screen.getByTestId('next-button');
      fireEvent.click(nextButtonInTemplatePage);

      await waitFor(() => {
        expect(screen.getByTestId('assign-credentials')).toBeInTheDocument();
        expect(screen.getByText('Step 3 of 3')).toBeInTheDocument();
      });
    });

    it('should handle credentials input', async () => {
      render(<AgentAssignModal {...defaultProps} />);

      const nextButton = screen.getByTestId('next-button');
      fireEvent.click(nextButton);

      await waitFor(() => {
        const template1Checkbox = screen.getByTestId('template-template-1').querySelector('input');
        fireEvent.click(template1Checkbox!);
      });

      const nextButtonInTemplatePage = screen.getByTestId('next-button');
      fireEvent.click(nextButtonInTemplatePage);

      await waitFor(() => {
        const apiKeyInput = screen.getByTestId('credential-input-apiKey');
        fireEvent.change(apiKeyInput, { target: { value: 'test-api-key' } });
        expect(apiKeyInput).toHaveValue('test-api-key');
      });
    });

    it('should disable next button when credentials are empty', async () => {
      render(<AgentAssignModal {...defaultProps} />);

      const nextButton = screen.getByTestId('next-button');
      fireEvent.click(nextButton);

      await waitFor(() => {
        const template1Checkbox = screen.getByTestId('template-template-1').querySelector('input');
        fireEvent.click(template1Checkbox!);
      });

      const nextButtonInTemplatePage = screen.getByTestId('next-button');
      fireEvent.click(nextButtonInTemplatePage);

      await waitFor(() => {
        const nextButtonInCredentialsPage = screen.getByTestId('next-button');
        expect(nextButtonInCredentialsPage).toBeDisabled();
      });
    });

    it('should enable next button when credentials are filled', async () => {
      render(<AgentAssignModal {...defaultProps} />);

      const nextButton = screen.getByTestId('next-button');
      fireEvent.click(nextButton);

      await waitFor(() => {
        const template1Checkbox = screen.getByTestId('template-template-1').querySelector('input');
        fireEvent.click(template1Checkbox!);
      });

      const nextButtonInTemplatePage = screen.getByTestId('next-button');
      fireEvent.click(nextButtonInTemplatePage);

      await waitFor(() => {
        const apiKeyInput = screen.getByTestId('credential-input-apiKey');
        const secretKeyInput = screen.getByTestId('credential-input-secretKey');

        fireEvent.change(apiKeyInput, { target: { value: 'test-api-key' } });
        fireEvent.change(secretKeyInput, { target: { value: 'test-secret-key' } });
      });

      const nextButtonInCredentialsPage = screen.getByTestId('next-button');
      expect(nextButtonInCredentialsPage).not.toBeDisabled();
    });

    it('should call onAssign with correct data when finished', async () => {
      render(<AgentAssignModal {...defaultProps} />);

      const nextButton = screen.getByTestId('next-button');
      fireEvent.click(nextButton);

      const template2Checkbox = screen.getByTestId('template-template-2').querySelector('input');
      fireEvent.click(template2Checkbox!);

      const nextButtonInTemplatePage = screen.getByTestId('next-button');
      fireEvent.click(nextButtonInTemplatePage);

      await waitFor(() => {
        const apiKeyInput = screen.getByTestId('credential-input-apiKey');
        const secretKeyInput = screen.getByTestId('credential-input-secretKey');

        fireEvent.change(apiKeyInput, { target: { value: 'test-api-key' } });
        fireEvent.change(secretKeyInput, { target: { value: 'test-secret-key' } });
      });

      const finishButton = screen.getByTestId('next-button');
      fireEvent.click(finishButton);

      await waitFor(() => {
        expect(mocks.onAssign).toHaveBeenCalledWith({
          uuid: 'test-uuid',
          type: 'active',
          templatesUuids: ['template-1'],
          credentials: {
            apiKey: 'test-api-key',
            secretKey: 'test-secret-key',
          },
        });
      });
    });

    it('should show loading state when isAssigningAgent is true', () => {
      render(<AgentAssignModal {...defaultProps} isAssigningAgent={true} />);

      const nextButton = screen.getByTestId('next-button');
      expect(nextButton).toHaveAttribute('data-loading', 'true');
    });
  });

  describe('Nexus agent flow', () => {
    beforeEach(() => {
      mocks.useSelector.mockImplementation((selector) => {
        if (selector.name === 'isWppIntegratedSelector') {
          return true;
        }
        return mockNexusAgent;
      });
    });

    it('should render modal with Nexus agent information', () => {
      render(<AgentAssignModal {...defaultProps} />);

      expect(screen.getByText('Assign Test Nexus Agent')).toBeInTheDocument();
      expect(screen.getByTestId('agent-passive-about')).toBeInTheDocument();
    });

    it('should show passive about page for Nexus agent', () => {
      render(<AgentAssignModal {...defaultProps} />);

      expect(screen.getByTestId('agent-passive-about')).toBeInTheDocument();
      expect(screen.getByTestId('passive-description')).toHaveTextContent('Test Nexus Agent Description');
      expect(screen.getByTestId('passive-skills-count')).toHaveTextContent('2');
      expect(screen.getByTestId('passive-type')).toHaveTextContent('passive');
    });

    it('should call onAssign immediately for passive Nexus agent', async () => {
      render(<AgentAssignModal {...defaultProps} />);

      const finishButton = screen.getByTestId('next-button');
      fireEvent.click(finishButton);

      await waitFor(() => {
        expect(mocks.onAssign).toHaveBeenCalledWith({
          uuid: 'test-uuid',
          type: 'passive',
          templatesUuids: [],
          credentials: {},
        });
      });
    });
  });

  describe('WhatsApp integration flow', () => {
    beforeEach(() => {
      mocks.useSelector.mockImplementation((selector) => {
        if (selector.name === 'isWppIntegratedSelector') {
          return false;
        }
        return mockCLIAgent;
      });
    });

    it('should show WhatsApp required page when WhatsApp is not integrated', async () => {
      render(<AgentAssignModal {...defaultProps} />);

      const nextButton = screen.getByTestId('next-button');
      fireEvent.click(nextButton);

      await waitFor(() => {
        const template1Checkbox = screen.getByTestId('template-template-1').querySelector('input');
        fireEvent.click(template1Checkbox!);
      });

      const nextButtonInTemplatePage = screen.getByTestId('next-button');
      fireEvent.click(nextButtonInTemplatePage);

      await waitFor(() => {
        expect(screen.getByTestId('step-tag')).toHaveTextContent('Step 3 of 4');
        expect(screen.getByTestId('assign-whatsapp-required')).toBeInTheDocument();
      });
    });

    it('should disable next button on WhatsApp required page', async () => {
      render(<AgentAssignModal {...defaultProps} />);

      const nextButton = screen.getByTestId('next-button');
      fireEvent.click(nextButton);

      await waitFor(() => {
        const template1Checkbox = screen.getByTestId('template-template-1').querySelector('input');
        fireEvent.click(template1Checkbox!);
      });

      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(nextButton).toBeDisabled();
      });
    });
  });

  describe('navigation', () => {
    beforeEach(() => {
      mocks.useSelector.mockImplementation((selector) => {
        if (selector.name === 'isWppIntegratedSelector') {
          return true;
        }
        return mockCLIAgent;
      });
    });

    it('should navigate back to previous page', async () => {
      render(<AgentAssignModal {...defaultProps} />);

      const nextButton = screen.getByTestId('next-button');
      fireEvent.click(nextButton);

      await waitFor(() => {
        const backButton = screen.getByTestId('back-button');
        fireEvent.click(backButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('assign-about')).toBeInTheDocument();
        expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
      });
    });

    it('should call onViewAgentsGallery when back button is clicked on first page', () => {
      render(<AgentAssignModal {...defaultProps} />);

      const backButton = screen.getByTestId('back-button');
      fireEvent.click(backButton);

      expect(mocks.onViewAgentsGallery).toHaveBeenCalled();
    });

    it('should close modal when dismiss button is clicked', () => {
      render(<AgentAssignModal {...defaultProps} />);

      const dismissButton = screen.getByTestId('modal-on-close-event');
      fireEvent.click(dismissButton);

      expect(mocks.onClose).toHaveBeenCalled();
    });
  });

  describe('button text changes', () => {
    beforeEach(() => {
      mocks.useSelector.mockImplementation((selector) => {
        if (selector.name === 'isWppIntegratedSelector') {
          return true;
        }
        return mockCLIAgent;
      });
    });

    it('should show "Next" button on non-last pages', () => {
      render(<AgentAssignModal {...defaultProps} />);

      expect(screen.getByTestId('next-button')).toBeInTheDocument();
    });
  });

  describe('modal state management', () => {
    it('should not render when open is false', () => {
      render(<AgentAssignModal {...defaultProps} open={false} />);

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('should reset state when modal opens', () => {
      const { rerender } = render(<AgentAssignModal {...defaultProps} open={false} />);

      rerender(<AgentAssignModal {...defaultProps} open={true} />);

      expect(screen.getByTestId('assign-about')).toBeInTheDocument();
      expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
    });
  });
});
