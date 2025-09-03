import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AgentBox, AgentBoxContainer, AgentBoxEmpty, AgentBoxSkeleton } from './AgentBox';

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  useSelector: vi.fn(),
  storeGetState: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mocks.navigate,
}));

vi.mock('react-redux', () => ({
  useSelector: mocks.useSelector,
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

vi.mock('../store/provider.store', () => ({
  default: {
    getState: mocks.storeGetState,
  },
}));

vi.mock('./AboutAgent', () => ({
  AboutAgent: ({ open, toggleModal }: any) => (
    open ? (
      <div data-testid="about-agent-modal">
        <button data-testid="close-about-agent-modal" onClick={toggleModal}>Close</button>
      </div>
    ) : null
  ),
}));

vi.mock('./settings/SettingsContainer/SettingsContainer', () => ({
  SettingsContainer: ({ open, toggleOpen }: any) => (
    open ? (
      <div data-testid="settings-container-modal">
        <button data-testid="close-settings-modal" onClick={toggleOpen}>Close</button>
      </div>
    ) : null
  ),
}));

vi.mock('./DisableAgent', () => ({
  DisableAgent: ({ open, toggleModal }: any) => (
    open ? (
      <div data-testid="disable-agent-modal">
        <button data-testid="close-disable-agent-modal" onClick={toggleModal}>Close</button>
      </div>
    ) : null
  ),
}));

vi.mock('./AddAbandonedCart', () => ({
  AddAbandonedCart: ({ open, toggleModal, confirm }: any) => (
    open ? (
      <div data-testid="add-abandoned-cart-modal">
        <button data-testid="close-abandoned-cart-modal" onClick={toggleModal}>Close</button>
        <button data-testid="confirm-abandoned-cart" onClick={confirm}>Confirm</button>
      </div>
    ) : null
  ),
}));

vi.mock('./agent/ModalPassiveDetails', () => ({
  ModalAgentPassiveDetails: ({ open, onClose }: any) => (
    open ? (
      <div data-testid="passive-details-modal">
        <button data-testid="close-passive-details-modal" onClick={onClose}>Close</button>
      </div>
    ) : null
  ),
}));

vi.mock('./agent/DescriptiveStatus', () => ({
  AgentDescriptiveStatus: ({ status }: any) => (
    <div data-testid={`agent-status-${status}`}>Status: {status}</div>
  ),
}));

vi.mock('./TagType', () => ({
  TagType: ({ type }: any) => (
    <div data-testid={`tag-type-${type}`}>Type: {type}</div>
  ),
}));

describe('AgentBox', () => {
  const defaultProps = {
    origin: 'commerce' as const,
    name: 'Test Agent',
    description: 'Test Agent Description',
    uuid: 'test-uuid',
    code: 'abandoned_cart' as const,
    type: 'active' as const,
    isIntegrated: false,
    isInTest: false,
    isConfiguring: false,
    skills: ['skill1', 'skill2'],
    onAssign: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mocks.useSelector.mockImplementation((selector) => {
      if (selector.name === 'agentsLoading') {
        return [];
      }
      if (selector.name === 'isWhatsAppIntegrated') {
        return true;
      }
      if (selector.name === 'selectDesignSystem') {
        return 'shoreline';
      }
      return [];
    });

    mocks.storeGetState.mockReturnValue({
      project: {
        agents: [
          {
            uuid: 'test-uuid',
            origin: 'CLI',
            assignedAgentUuid: 'assigned-uuid',
          },
        ],
      },
    });
  });

  describe('basic rendering', () => {
    it('should render agent name and description', () => {
      render(<AgentBox {...defaultProps} />);

      expect(screen.getByText('Test Agent')).toBeInTheDocument();
      expect(screen.getByText('Test Agent Description')).toBeInTheDocument();
    });

    it('should render agent type tag', () => {
      render(<AgentBox {...defaultProps} />);

      expect(screen.getByTestId('tag-type-active')).toBeInTheDocument();
    });

    it('should display PT-BR language indicator', () => {
      render(<AgentBox {...defaultProps} />);

      expect(screen.getByText('PT-BR')).toBeInTheDocument();
    });
  });

  describe('agent status', () => {
    it('should show "Add" button when agent is not integrated', () => {
      render(<AgentBox {...defaultProps} />);

      expect(screen.getByText('agents.common.add')).toBeInTheDocument();
    });

    it('should show "View" button when agent is integrated', () => {
      render(<AgentBox {...defaultProps} origin="CLI" isIntegrated={true} />);

      expect(screen.getByTestId('agent-view-button')).toBeInTheDocument();
    });

    it.each([{
      prop: 'isIntegrated',
      name: 'integrated',
    }, {
      prop: 'isInTest',
      name: 'test',
    }, {
      prop: 'isConfiguring',
      name: 'configuring',
    }])('should show $name status when agent is $prop', ({ prop, name }) => {
      render(<AgentBox {...defaultProps} origin="CLI" {...{ [prop]: true }} />);

      expect(screen.getByTestId(`agent-status-${name}`)).toBeInTheDocument();
    });

    it('should show loading state when agent is updating', () => {
      mocks.useSelector.mockImplementation((selector) => {
        if (selector.name === 'agentsLoading') {
          return [{ agent_uuid: 'test-uuid', isLoading: true }];
        } else if (selector.name === 'selectDesignSystem') {
          return 'shoreline';
        }
        return [];
      });

      render(<AgentBox {...defaultProps} isIntegrated={true} />);

      expect(screen.getByTestId('agent-add-button')).toHaveAttribute('data-loading', 'true');
    });
  });

  describe('agent integration', () => {
    it('should call onAssign when "Add" button is clicked for commerce agent', async () => {
      render(<AgentBox {...defaultProps} origin="CLI" />);

      const addButton = screen.getByTestId('agent-add-button');
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(defaultProps.onAssign).toHaveBeenCalledWith('test-uuid');
      });
    });

    it('should open abandoned cart modal for commerce abandoned_cart agent', () => {
      render(<AgentBox {...defaultProps} />);

      const addButton = screen.getByTestId('agent-add-button');
      fireEvent.click(addButton);

      expect(screen.getByTestId('add-abandoned-cart-modal')).toBeInTheDocument();
    });

    it('should call onAssign directly for non-abandoned_cart agents', () => {
      render(<AgentBox {...defaultProps} code="order_status" />);

      const addButton = screen.getByTestId('agent-add-button');
      fireEvent.click(addButton);

      expect(defaultProps.onAssign).toHaveBeenCalledWith('test-uuid');
      expect(screen.queryByTestId('add-abandoned-cart-modal')).not.toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('should navigate to agent details for CLI agents', () => {
      render(<AgentBox {...defaultProps} origin="CLI" isIntegrated={true} />);

      const viewButton = screen.getByTestId('agent-view-button');
      fireEvent.click(viewButton);

      expect(mocks.navigate).toHaveBeenCalledWith('/agents/assigned-uuid');
    });

    it('should open passive details modal for passive agents', () => {
      render(<AgentBox {...defaultProps} type="passive" isIntegrated={true} />);

      const viewButton = screen.getByTestId('agent-view-button');
      fireEvent.click(viewButton);

      expect(screen.getByTestId('passive-details-modal')).toBeInTheDocument();
    });

    it('should not show view button for non-integrated agents', () => {
      render(<AgentBox {...defaultProps} isIntegrated={false} />);

      expect(screen.queryByTestId('agent-view-button')).not.toBeInTheDocument();
    });
  });

  describe('menu options', () => {
    it('should show menu options for commerce agents', () => {
      render(<AgentBox {...defaultProps} isIntegrated={true} />);

      const menuButton = screen.getByLabelText('Actions');
      fireEvent.click(menuButton);

      expect(screen.getByTestId('agent-details-button')).toBeInTheDocument();
    });

    it('should open about agent modal when details is clicked', () => {
      render(<AgentBox {...defaultProps} isIntegrated={true} />);

      const menuButton = screen.getByLabelText('Actions');
      fireEvent.click(menuButton);

      const detailsOption = screen.getByTestId('agent-details-button');
      fireEvent.click(detailsOption);

      expect(screen.getByTestId('about-agent-modal')).toBeInTheDocument();
    });

    it('should show settings option for integrated agents', () => {
      render(<AgentBox {...defaultProps} isIntegrated={true} />);

      const menuButton = screen.getByLabelText('Actions');
      fireEvent.click(menuButton);

      expect(screen.getByTestId('agent-manage-settings-button')).toBeInTheDocument();
    });

    it('should open settings modal when settings is clicked', () => {
      render(<AgentBox {...defaultProps} isIntegrated={true} />);

      const menuButton = screen.getByLabelText('Actions');
      fireEvent.click(menuButton);

      const settingsOption = screen.getByTestId('agent-manage-settings-button');
      fireEvent.click(settingsOption);

      expect(screen.getByTestId('settings-container-modal')).toBeInTheDocument();
    });

    it('should show remove option for integrated agents', () => {
      render(<AgentBox {...defaultProps} isIntegrated={true} />);

      const menuButton = screen.getByLabelText('Actions');
      fireEvent.click(menuButton);

      expect(screen.getByTestId('agent-remove-button')).toBeInTheDocument();
    });

    it('should open disable modal when remove is clicked', () => {
      render(<AgentBox {...defaultProps} isIntegrated={true} />);

      const menuButton = screen.getByLabelText('Actions');
      fireEvent.click(menuButton);

      const removeOption = screen.getByTestId('agent-remove-button');
      fireEvent.click(removeOption);

      expect(screen.getByTestId('disable-agent-modal')).toBeInTheDocument();
    });

    it('should not show menu for non-integrated agents', () => {
      render(<AgentBox {...defaultProps} origin="nexus" isIntegrated={false} />);

      expect(screen.queryByTestId('agent-actions-button')).not.toBeInTheDocument();
    });
  });

  describe('modal interactions', () => {
    it('should close about agent modal', () => {
      render(<AgentBox {...defaultProps} isIntegrated={true} />);

      const menuButton = screen.getByLabelText('Actions');
      fireEvent.click(menuButton);
      const detailsOption = screen.getByText('common.details');
      fireEvent.click(detailsOption);

      const closeButton = screen.getByTestId('close-about-agent-modal');
      fireEvent.click(closeButton);

      expect(screen.queryByTestId('about-agent-modal')).not.toBeInTheDocument();
    });

    it('should close settings modal', () => {
      render(<AgentBox {...defaultProps} isIntegrated={true} />);

      const menuButton = screen.getByLabelText('Actions');
      fireEvent.click(menuButton);
      const settingsOption = screen.getByText('common.manage_settings');
      fireEvent.click(settingsOption);

      const closeButton = screen.getByTestId('close-settings-modal');
      fireEvent.click(closeButton);

      expect(screen.queryByTestId('settings-container-modal')).not.toBeInTheDocument();
    });

    it('should close disable agent modal', () => {
      render(<AgentBox {...defaultProps} isIntegrated={true} />);

      const menuButton = screen.getByLabelText('Actions');
      fireEvent.click(menuButton);
      const removeOption = screen.getByText('agents.buttons.remove');
      fireEvent.click(removeOption);

      const closeButton = screen.getByTestId('close-disable-agent-modal');
      fireEvent.click(closeButton);

      expect(screen.queryByTestId('disable-agent-modal')).not.toBeInTheDocument();
    });

    it('should close abandoned cart modal', () => {
      render(<AgentBox {...defaultProps} />);

      const addButton = screen.getByTestId('agent-add-button');
      fireEvent.click(addButton);

      const closeButton = screen.getByTestId('close-abandoned-cart-modal');
      fireEvent.click(closeButton);

      expect(screen.queryByTestId('add-abandoned-cart-modal')).not.toBeInTheDocument();
    });

    it('should confirm abandoned cart integration', () => {
      render(<AgentBox {...defaultProps} />);

      const addButton = screen.getByTestId('agent-add-button');
      fireEvent.click(addButton);

      const confirmButton = screen.getByTestId('confirm-abandoned-cart');
      fireEvent.click(confirmButton);

      expect(defaultProps.onAssign).toHaveBeenCalledWith('test-uuid');
      expect(screen.queryByTestId('add-abandoned-cart-modal')).not.toBeInTheDocument();
    });

    it('should close passive details modal', () => {
      render(<AgentBox {...defaultProps} type="passive" isIntegrated={true} />);

      const viewButton = screen.getByText('agents.common.view');
      fireEvent.click(viewButton);

      const closeButton = screen.getByTestId('close-passive-details-modal');
      fireEvent.click(closeButton);

      expect(screen.queryByTestId('passive-details-modal')).not.toBeInTheDocument();
    });
  });

  describe('agent name and description', () => {
    it('should use translated name when available', () => {
      render(<AgentBox {...defaultProps} name="Custom Name" />);

      expect(screen.getByText('Custom Name')).toBeInTheDocument();
    });

    it('should use translated description when available', () => {
      render(<AgentBox {...defaultProps} description="Custom Description" />);

      expect(screen.getByText('Custom Description')).toBeInTheDocument();
    });

    it('should truncate long descriptions', () => {
      const longDescription = 'A'.repeat(200);
      render(<AgentBox {...defaultProps} description={longDescription} />);

      const descriptionElement = screen.getByTestId('agent-description');

      expect(descriptionElement).toHaveStyle({
        display: '-webkit-box',
        WebkitLineClamp: '2',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      });
    });
  });

  describe('agent visibility', () => {
    it('should not show view button for non-integrated agents', () => {
      render(<AgentBox {...defaultProps} isIntegrated={false} />);

      expect(screen.queryByTestId('agent-view-button')).not.toBeInTheDocument();
    });

    it('should show view button for integrated passive agents', () => {
      render(<AgentBox {...defaultProps} type="passive" isIntegrated={true} />);

      expect(screen.getByTestId('agent-view-button')).toBeInTheDocument();
    });

    it('should show view button for integrated CLI agents', () => {
      render(<AgentBox {...defaultProps} origin="CLI" isIntegrated={true} />);

      expect(screen.getByTestId('agent-view-button')).toBeInTheDocument();
    });
  });
});

describe('AgentBoxContainer', () => {
  it('should render children in a grid layout', () => {
    render(
      <AgentBoxContainer>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </AgentBoxContainer>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });
});

describe('AgentBoxSkeleton', () => {
  it('should render the specified number of skeleton items', () => {
    render(<AgentBoxSkeleton count={3} />);

    const skeletons = screen.getAllByTestId('agent-box-skeleton');
    expect(skeletons).toHaveLength(3);
  });
});

describe('AgentBoxEmpty', () => {
  it('should render empty state with icon and message', () => {
    render(<AgentBoxEmpty />);

    expect(screen.getByText('agents.list.empty.title')).toBeInTheDocument();
  });
});
