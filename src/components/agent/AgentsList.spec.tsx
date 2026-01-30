import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AgentsList } from './AgentsList';
import { ABANDONED_CART_CODES } from '../../constants/abandonedCart';

const mocks = vi.hoisted(() => ({
  useSelector: vi.fn(),
  onAssign: vi.fn(),
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

vi.mock('../AgentBox', () => ({
  AgentBox: ({ name, description, uuid, onAssign }: any) => (
    <div data-testid={`agent-box-${uuid}`}>
      <div data-testid={`agent-name-${uuid}`}>{name}</div>
      <div data-testid={`agent-description-${uuid}`}>{description}</div>
      <button data-testid={`assign-agent-${uuid}`} onClick={() => onAssign(uuid)}>
        Assign {name}
      </button>
    </div>
  ),
  AgentBoxContainer: ({ children }: any) => (
    <div data-testid="agent-box-container">{children}</div>
  ),
  AgentBoxSkeleton: ({ count }: any) => (
    <div data-testid="agent-box-skeleton" data-count={count}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} data-testid={`skeleton-${i}`}>Loading...</div>
      ))}
    </div>
  ),
}));

describe('AgentsList', () => {
  const mockAgents = [
    {
      uuid: 'agent-1',
      name: 'Active Official Agent',
      description: 'Active Official Agent Description',
      notificationType: 'active',
      isOfficial: true,
      isAssigned: false,
      origin: 'CLI',
      code: 'order_status',
      isInTest: false,
      isConfiguring: false,
      skills: ['skill1'],
    },
    {
      uuid: 'agent-2',
      name: 'Passive Custom Agent',
      description: 'Passive Custom Agent Description',
      notificationType: 'passive',
      isOfficial: false,
      isAssigned: false,
      origin: 'CLI',
      code: 'order_status',
      isInTest: false,
      isConfiguring: false,
      skills: ['skill1'],
    },
    {
      uuid: 'agent-3',
      name: 'Passive Official Agent',
      description: 'Passive Official Agent Description',
      notificationType: 'passive',
      isOfficial: true,
      isAssigned: false,
      origin: 'nexus',
      code: ABANDONED_CART_CODES.LEGACY,
      isInTest: false,
      isConfiguring: false,
      skills: ['skill2'],
    },
    {
      uuid: 'agent-4',
      name: 'Active Custom Agent',
      description: 'Active Custom Agent Description',
      notificationType: 'active',
      isOfficial: true,
      isAssigned: false,
      origin: 'commerce',
      code: 'order_status',
      isInTest: false,
      isConfiguring: false,
      skills: ['skill3'],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basic rendering', () => {
    beforeEach(() => {
      mocks.useSelector.mockImplementation((selector) => {
        if (selector.name === 'agentsSelector') {
          return mockAgents;
        }
        if (selector.name === 'hasTheFirstLoadOfTheAgentsHappenedSelector') {
          return true;
        }
        return null;
      });
    });

    it('should render agents list when agents are available', () => {
      render(<AgentsList onAssign={mocks.onAssign} />);

      expect(screen.getByTestId('agent-box-container')).toBeInTheDocument();
      expect(screen.getByTestId('agent-box-agent-1')).toBeInTheDocument();
      expect(screen.getByTestId('agent-box-agent-2')).toBeInTheDocument();
      expect(screen.getByTestId('agent-box-agent-3')).toBeInTheDocument();
    });

    it('should display agent information correctly', () => {
      render(<AgentsList onAssign={mocks.onAssign} />);

      expect(screen.getByTestId('agent-name-agent-1')).toHaveTextContent('Active Official Agent');
      expect(screen.getByTestId('agent-description-agent-1')).toHaveTextContent('Active Official Agent Description');
      expect(screen.getByTestId('agent-name-agent-2')).toHaveTextContent('Passive Custom Agent');
      expect(screen.getByTestId('agent-description-agent-2')).toHaveTextContent('Passive Custom Agent Description');
    });

    it('should call onAssign when assign button is clicked', () => {
      render(<AgentsList onAssign={mocks.onAssign} />);

      const assignButton = screen.getByTestId('assign-agent-agent-1');
      fireEvent.click(assignButton);

      expect(mocks.onAssign).toHaveBeenCalledWith('agent-1');
    });

    it('should show empty state when no agents are available', () => {
      mocks.useSelector.mockImplementation((selector) => {
        if (selector.name === 'agentsSelector') {
          return [];
        }
        if (selector.name === 'hasTheFirstLoadOfTheAgentsHappenedSelector') {
          return true;
        }
        return null;
      });

      render(<AgentsList onAssign={mocks.onAssign} />);

      expect(screen.getByText('agents.modals.gallery.list.empty.title')).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('should show skeleton when agents are not loaded yet', () => {
      mocks.useSelector.mockImplementation((selector) => {
        if (selector.name === 'agentsSelector') {
          return mockAgents;
        }
        if (selector.name === 'hasTheFirstLoadOfTheAgentsHappenedSelector') {
          return false;
        }
        return null;
      });

      render(<AgentsList onAssign={mocks.onAssign} />);

      expect(screen.getByTestId('agent-box-skeleton')).toBeInTheDocument();
      expect(screen.getByTestId('skeleton-0')).toBeInTheDocument();
      expect(screen.getByTestId('skeleton-1')).toBeInTheDocument();
    });
  });

  describe('category filtering', () => {
    beforeEach(() => {
      mocks.useSelector.mockImplementation((selector) => {
        if (selector.name === 'agentsSelector') {
          return mockAgents;
        }
        if (selector.name === 'hasTheFirstLoadOfTheAgentsHappenedSelector') {
          return true;
        }
        return null;
      });
    });

    it('should show category filter dropdown', () => {
      render(<AgentsList onAssign={mocks.onAssign} />);

      expect(screen.getByTestId('dropdown-menu-categories-trigger')).toBeInTheDocument();
    });

    it('should filter by active category', async () => {
      render(<AgentsList onAssign={mocks.onAssign} />);

      const categoryButton = screen.getByTestId('dropdown-menu-categories-trigger');
      fireEvent.click(categoryButton);

      const activeCheckbox = screen.getByText('agents.categories.active.title');
      fireEvent.click(activeCheckbox);

      const applyButton = screen.getByTestId('dropdown-menu-categories-apply-button');
      fireEvent.click(applyButton);

      await waitFor(() => {
        expect(screen.queryByTestId('agent-box-agent-1')).toBeInTheDocument();
        expect(screen.queryByTestId('agent-box-agent-2')).not.toBeInTheDocument();
        expect(screen.queryByTestId('agent-box-agent-3')).not.toBeInTheDocument();
      });
    });

    it('should filter by passive category', async () => {
      render(<AgentsList onAssign={mocks.onAssign} />);

      const categoryButton = screen.getByTestId('dropdown-menu-categories-trigger');
      fireEvent.click(categoryButton);

      const passiveCheckbox = screen.getByText('agents.categories.passive.title');
      fireEvent.click(passiveCheckbox);

      const applyButton = screen.getByTestId('dropdown-menu-categories-apply-button');
      fireEvent.click(applyButton);

      await waitFor(() => {
        expect(screen.queryByTestId('agent-box-agent-2')).toBeInTheDocument();
        expect(screen.queryByTestId('agent-box-agent-1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('agent-box-agent-3')).toBeInTheDocument();
      });
    });

    it('should clear category filter', async () => {
      render(<AgentsList onAssign={mocks.onAssign} />);

      const categoryButton = screen.getByTestId('dropdown-menu-categories-trigger');
      fireEvent.click(categoryButton);

      const activeCheckbox = screen.getByText('agents.categories.active.title');
      fireEvent.click(activeCheckbox);

      const applyButton = screen.getByTestId('dropdown-menu-categories-apply-button');
      fireEvent.click(applyButton);

      fireEvent.click(categoryButton);
      const clearButton = screen.getByTestId('dropdown-menu-categories-clear-button');
      fireEvent.click(clearButton);

      const applyButton2 = screen.getByTestId('dropdown-menu-categories-apply-button');
      fireEvent.click(applyButton2);

      await waitFor(() => {
        expect(screen.getByTestId('agent-box-agent-1')).toBeInTheDocument();
        expect(screen.getByTestId('agent-box-agent-2')).toBeInTheDocument();
        expect(screen.getByTestId('agent-box-agent-3')).toBeInTheDocument();
      });
    });

    it('should show "none selected" when no categories are selected', () => {
      render(<AgentsList onAssign={mocks.onAssign} />);

      const categoryButton = screen.getByTestId('dropdown-menu-categories-trigger');
      expect(categoryButton).toHaveTextContent('agents.modals.gallery.filters.categories.none_selected');
    });

    it('should show selected categories in button text', async () => {
      render(<AgentsList onAssign={mocks.onAssign} />);

      const categoryButton = screen.getByTestId('dropdown-menu-categories-trigger');
      fireEvent.click(categoryButton);

      const activeCheckbox = screen.getByText('agents.categories.active.title');
      fireEvent.click(activeCheckbox);

      const applyButton = screen.getByTestId('dropdown-menu-categories-apply-button');
      fireEvent.click(applyButton);

      await waitFor(() => {
        expect(categoryButton).toHaveTextContent('agents.categories.active.title');
      });
    });
  });

  describe('agent type filtering', () => {
    beforeEach(() => {
      mocks.useSelector.mockImplementation((selector) => {
        if (selector.name === 'agentsSelector') {
          return mockAgents;
        }
        if (selector.name === 'hasTheFirstLoadOfTheAgentsHappenedSelector') {
          return true;
        }
        return null;
      });
    });

    it('should show agent type filter when both official and custom agents exist', () => {
      render(<AgentsList onAssign={mocks.onAssign} />);

      expect(screen.getByTestId('dropdown-menu-agents-trigger')).toBeInTheDocument();
    });

    it('should not show agent type filter when only one type exists', () => {
      const singleTypeAgents = [
        {
          uuid: 'agent-1',
          name: 'Official Agent',
          description: 'Official Agent Description',
          notificationType: 'active',
          isOfficial: true,
          isAssigned: false,
          origin: 'CLI',
          code: 'order_status',
          isInTest: false,
          isConfiguring: false,
          skills: ['skill1'],
        },
      ];

      mocks.useSelector.mockImplementation((selector) => {
        if (selector.name === 'agentsSelector') {
          return singleTypeAgents;
        }
        if (selector.name === 'hasTheFirstLoadOfTheAgentsHappenedSelector') {
          return true;
        }
        return null;
      });

      render(<AgentsList onAssign={mocks.onAssign} />);

      expect(screen.queryByText('agents.modals.gallery.filters.agents.title')).not.toBeInTheDocument();
    });

    it('should filter by official agents', async () => {
      render(<AgentsList onAssign={mocks.onAssign} />);

      const agentTypeButton = screen.getByTestId('dropdown-menu-agents-trigger');
      fireEvent.click(agentTypeButton);

      const officialCheckbox = screen.getByText('agents.modals.gallery.filters.agents.options.official');
      fireEvent.click(officialCheckbox);

      const applyButton = screen.getByTestId('dropdown-menu-agents-apply-button');
      fireEvent.click(applyButton);

      await waitFor(() => {
        expect(screen.queryByTestId('agent-box-agent-1')).toBeInTheDocument();
        expect(screen.queryByTestId('agent-box-agent-2')).not.toBeInTheDocument();
        expect(screen.queryByTestId('agent-box-agent-3')).toBeInTheDocument();
      });
    });

    it('should filter by custom agents', async () => {
      render(<AgentsList onAssign={mocks.onAssign} />);

      const agentTypeButton = screen.getByTestId('dropdown-menu-agents-trigger');
      fireEvent.click(agentTypeButton);

      const customCheckbox = screen.getByText('agents.modals.gallery.filters.agents.options.custom');
      fireEvent.click(customCheckbox);

      const applyButton = screen.getByTestId('dropdown-menu-agents-apply-button');
      fireEvent.click(applyButton);

      await waitFor(() => {
        expect(screen.queryByTestId('agent-box-agent-1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('agent-box-agent-2')).toBeInTheDocument();
        expect(screen.queryByTestId('agent-box-agent-3')).not.toBeInTheDocument();
      });
    });
  });

  describe('combined filtering', () => {
    beforeEach(() => {
      mocks.useSelector.mockImplementation((selector) => {
        if (selector.name === 'agentsSelector') {
          return [
            {
              uuid: 'agent-1',
              name: 'Active Official Agent',
              description: 'Active Official Agent Description',
              notificationType: 'active',
              isOfficial: true,
              isAssigned: false,
              origin: 'CLI',
              code: 'order_status',
              isInTest: false,
              isConfiguring: false,
              skills: ['skill1'],
            },
            {
              uuid: 'agent-2',
              name: 'Passive Custom Agent',
              description: 'Passive Custom Agent Description',
              notificationType: 'active',
              isOfficial: false,
              isAssigned: false,
              origin: 'CLI',
              code: 'order_status',
              isInTest: false,
              isConfiguring: false,
              skills: ['skill1'],
            },
            {
              uuid: 'agent-3',
              name: 'Passive Official Agent',
              description: 'Passive Official Agent Description',
              notificationType: 'passive',
              isOfficial: true,
              isAssigned: false,
              origin: 'CLI',
              code: 'order_status',
              isInTest: false,
              isConfiguring: false,
              skills: ['skill1'],
            },
          ];
        }
        if (selector.name === 'hasTheFirstLoadOfTheAgentsHappenedSelector') {
          return false;
        }
        return null;
      });
    });

    it('should filter by both category and agent type', async () => {
      render(<AgentsList onAssign={mocks.onAssign} />);

      const categoryButton = screen.getByTestId('dropdown-menu-categories-trigger');
      fireEvent.click(categoryButton);
      const activeCheckbox = screen.getByText('agents.categories.active.title');
      fireEvent.click(activeCheckbox);
      const applyCategoryButton = screen.getByTestId('dropdown-menu-categories-apply-button');
      fireEvent.click(applyCategoryButton);

      const agentTypeButton = screen.getByTestId('dropdown-menu-agents-trigger');
      fireEvent.click(agentTypeButton);
      const customCheckbox = screen.getByText('agents.modals.gallery.filters.agents.options.custom');
      fireEvent.click(customCheckbox);
      const applyAgentTypeButton = screen.getByTestId('dropdown-menu-agents-apply-button');
      fireEvent.click(applyAgentTypeButton);

      await waitFor(() => {
        expect(screen.queryByTestId('agent-box-agent-1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('agent-box-agent-2')).toBeInTheDocument();
        expect(screen.queryByTestId('agent-box-agent-3')).not.toBeInTheDocument();
      });
    });

    it('should show empty state when no agents match combined filters', async () => {
      mocks.useSelector.mockImplementation((selector) => {
        if (selector.name === 'agentsSelector') {
          return [
            {
              uuid: 'agent-1',
              name: 'Active Official Agent',
              description: 'Active Official Agent Description',
              notificationType: 'active',
              isOfficial: true,
              isAssigned: false,
              origin: 'CLI',
              code: 'order_status',
              isInTest: false,
              isConfiguring: false,
              skills: ['skill1'],
            },
            {
              uuid: 'agent-2',
              name: 'Passive Custom Agent',
              description: 'Passive Custom Agent Description',
              notificationType: 'passive',
              isOfficial: false,
              isAssigned: false,
              origin: 'CLI',
              code: 'order_status',
              isInTest: false,
              isConfiguring: false,
              skills: ['skill1'],
            },
          ];
        }
        if (selector.name === 'hasTheFirstLoadOfTheAgentsHappenedSelector') {
          return true;
        }
        return null;
      });

      render(<AgentsList onAssign={mocks.onAssign} />);

      const agentTypeButton = screen.getByTestId('dropdown-menu-agents-trigger');
      fireEvent.click(agentTypeButton);
      const officialCheckbox = screen.getByText('agents.modals.gallery.filters.agents.options.official');
      fireEvent.click(officialCheckbox);
      const applyAgentTypeButton = screen.getByTestId('dropdown-menu-agents-apply-button');
      fireEvent.click(applyAgentTypeButton);

      const categoryButton = screen.getByTestId('dropdown-menu-categories-trigger');
      fireEvent.click(categoryButton);
      const passiveCheckbox = screen.getByText('agents.categories.passive.title');
      fireEvent.click(passiveCheckbox);
      const applyCategoryButton = screen.getByTestId('dropdown-menu-categories-apply-button');
      fireEvent.click(applyCategoryButton);

      await waitFor(() => {
        expect(screen.getByText('agents.modals.gallery.list.empty.title')).toBeInTheDocument();
      });
    });
  });

  describe('dropdown interactions', () => {
    beforeEach(() => {
      mocks.useSelector.mockImplementation((selector) => {
        if (selector.name === 'agentsSelector') {
          return mockAgents;
        }
        if (selector.name === 'hasTheFirstLoadOfTheAgentsHappenedSelector') {
          return true;
        }
        return null;
      });
    });

    it('should enable apply button when options are selected', () => {
      render(<AgentsList onAssign={mocks.onAssign} />);

      const categoryButton = screen.getByTestId('dropdown-menu-categories-trigger');
      fireEvent.click(categoryButton);

      const applyButton = screen.getByTestId('dropdown-menu-categories-apply-button');
      expect(applyButton).toBeDisabled();

      const activeCheckbox = screen.getByText('agents.categories.active.title');
      fireEvent.click(activeCheckbox);

      expect(applyButton).not.toBeDisabled();
    });

    it('should enable clear button when options are selected', () => {
      render(<AgentsList onAssign={mocks.onAssign} />);

      const categoryButton = screen.getByTestId('dropdown-menu-categories-trigger');
      fireEvent.click(categoryButton);

      const clearButton = screen.getByTestId('dropdown-menu-categories-clear-button');
      expect(clearButton).toBeDisabled();

      const activeCheckbox = screen.getByText('agents.categories.active.title');
      fireEvent.click(activeCheckbox);

      expect(clearButton).not.toBeDisabled();
    });

    it('should close dropdown when apply is clicked', async () => {
      render(<AgentsList onAssign={mocks.onAssign} />);

      const categoryButton = screen.getByTestId('dropdown-menu-categories-trigger');
      fireEvent.click(categoryButton);

      const activeCheckbox = screen.getByText('agents.categories.active.title');
      fireEvent.click(activeCheckbox);

      const applyButton = screen.getByTestId('dropdown-menu-categories-apply-button');
      fireEvent.click(applyButton);

      await waitFor(() => {
        expect(screen.queryByTestId('dropdown-menu-categories-popover')).not.toBeVisible();
      });
    });
  });

  describe('assigned agents filtering', () => {
    it('should not show assigned agents', () => {
      const agentsWithAssigned = [
        {
          uuid: 'agent-1',
          name: 'Unassigned Agent',
          description: 'Unassigned Agent Description',
          notificationType: 'active',
          isOfficial: true,
          isAssigned: false,
          origin: 'CLI',
          code: 'order_status',
          isInTest: false,
          isConfiguring: false,
          skills: ['skill1'],
        },
        {
          uuid: 'agent-2',
          name: 'Assigned Agent',
          description: 'Assigned Agent Description',
          notificationType: 'active',
          isOfficial: true,
          isAssigned: true,
          origin: 'CLI',
          code: 'order_status',
          isInTest: false,
          isConfiguring: false,
          skills: ['skill1'],
        },
      ];

      mocks.useSelector.mockImplementation((selector) => {
        if (selector.name === 'agentsSelector') {
          return agentsWithAssigned;
        }
        if (selector.name === 'hasTheFirstLoadOfTheAgentsHappenedSelector') {
          return true;
        }
        return null;
      });

      render(<AgentsList onAssign={mocks.onAssign} />);

      expect(screen.getByTestId('agent-box-agent-1')).toBeInTheDocument();
      expect(screen.queryByTestId('agent-box-agent-2')).not.toBeInTheDocument();
    });
  });
});
