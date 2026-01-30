import { configureStore, createSlice } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import { act, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AgentMetrics } from './AgentMetrics';
import { ABANDONED_CART_CODES } from '../constants/abandonedCart';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: () => new Promise(() => { }),
    },
  }),
}));

vi.mock('../utils/VTEXFetch', () => ({
  VTEXFetch: vi.fn(),
}));

import { VTEXFetch } from '../utils/VTEXFetch';

const initialState = {
  project: {
    agents: [{
      uuid: '1111',
      notificationType: 'active',
      isAssigned: false,
      name: 'Test Agent 1',
    }, {
      uuid: '2222',
      notificationType: 'active',
      isAssigned: true,
      origin: 'commerce',
      code: ABANDONED_CART_CODES.LEGACY,
      name: 'Test Agent 2',
    }, {
      uuid: '3333',
      notificationType: 'active',
      isAssigned: true,
      name: 'Test Agent 3',
    }, {
      uuid: '4444',
      notificationType: 'passive',
      isAssigned: true,
      name: 'Test Agent 4',
    }, {
      uuid: '5555',
      notificationType: 'active',
      isAssigned: true,
    }],
  },
  app: {
    embeddedWithin: 'VTEX App',
    designSystem: 'shoreline',
  },
};

const mockProjectSlice = createSlice({
  name: 'project',
  initialState: initialState.project,
  reducers: {},
});

const mockAppSlice = createSlice({
  name: 'app',
  initialState: initialState.app,
  reducers: {},
});

const renderWithProviders = (
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        project: mockProjectSlice.reducer,
        app: mockAppSlice.reducer,
      }, preloadedState
    }),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

describe('AgentMetrics', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const mockedVTEXFetch = VTEXFetch as any;

    mockedVTEXFetch.mockImplementation((url: string, options?: any) => {
      if (url.includes('/_v/get-skill-metrics')) {
        return Promise.resolve([
          { id: 'sent-messages', value: 1325, prefix: '' },
          { id: 'delivered-messages', value: 1259, prefix: '' },
          { id: 'read-messages', value: 956, prefix: '' },
          { id: 'interactions', value: 569, prefix: '' },
          { id: 'utm-revenue', value: 44566, prefix: 'R$ ' },
          { id: 'orders-placed', value: 86, prefix: '' },
        ]);
      }

      if (url.includes('/_v/proxy-request') && options?.body) {
        const body = JSON.parse(options.body);
        if (body.url && body.url.includes('/api/v3/agents/assigneds/')) {
          return Promise.resolve({
            uuid: 'test-agent-uuid',
            contact_percentage: 100,
            templates: [
              {
                uuid: 'template-1',
                name: 'Test Template',
                display_name: 'Test Template',
                start_condition: 'test condition',
                status: 'APPROVED',
                needs_button_edit: false,
                is_custom: false,
                variables: [],
                metadata: {
                  id: 'template-1',
                  body: 'Test template body',
                  name: 'Test Template',
                  topic: 'test',
                  header: {
                    header_type: 'TEXT',
                    text: 'Test Header'
                  },
                  footer: 'Test Footer',
                  buttons: []
                }
              }
            ],
            channel_uuid: 'test-channel-uuid',
            webhook_url: 'https://test-webhook.com',
            global_rule_prompt: 'Test global rule'
          });
        }

        if (body.url && body.url.includes('/api/v3/templates/template-metrics/')) {
          return Promise.resolve({
            data: {
              status_count: {
                sent: { value: 100 },
                delivered: { value: 95, percentage: 95 },
                read: { value: 80, percentage: 80 },
                clicked: { value: 50, percentage: 50 }
              }
            }
          });
        }
      }

      return Promise.resolve({});
    });
  });

  describe('Menu', () => {
    describe('agent selection', () => {
      it('should allow agent selection', async () => {
        await act(async () => {
          renderWithProviders(<AgentMetrics />);
        });

        await waitFor(() => {
          expect(screen.getByTestId('agent-selection-menu-popover')).toBeInTheDocument();
        });

        const agentSelectionMenuTrigger = screen.getByTestId('agent-selection-menu-trigger');
        expect(agentSelectionMenuTrigger).toBeInTheDocument();

        expect(agentSelectionMenuTrigger.textContent).toBe('Test Agent 2');

        await act(async () => {
          agentSelectionMenuTrigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          screen.getByTestId('agent-selection-menu-option-3333').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          screen.getByTestId('agent-selection-menu-apply-button').dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });

        expect(agentSelectionMenuTrigger.textContent).toBe('Test Agent 3');
      });
    });

    describe('period selection', () => {
      it('should allow period selection', async () => {
        await act(async () => {
          renderWithProviders(<AgentMetrics />);
        });

        await waitFor(() => {
          expect(screen.getByTestId('period-selection-menu-popover')).toBeInTheDocument();
        });

        const periodSelectionMenuTrigger = screen.getByTestId('period-selection-menu-trigger');
        expect(periodSelectionMenuTrigger).toBeInTheDocument();

        expect(periodSelectionMenuTrigger.textContent).toContain('metrics.fields.period.options.last_7_days');

        await act(async () => {
          periodSelectionMenuTrigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          screen.getByTestId('period-selection-menu-option-yesterday').dispatchEvent(new MouseEvent('click', { bubbles: true }));
          screen.getByTestId('period-selection-menu-apply-button').dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });

        expect(periodSelectionMenuTrigger.textContent).toContain('metrics.fields.period.options.yesterday');
      });
    });
  });

  describe('abandoned cart agent metrics', () => {
    describe('getSkillMetrics function', () => {
      it('should fetch template metrics and format data correctly', async () => {
        const initialStateWithCLIAgent = {
          project: {
            agents: [{
              uuid: 'abandoned-cart-agent',
              name: 'Abandoned Cart Agent',
              notificationType: 'active',
              isAssigned: true,
              origin: 'commerce',
              code: ABANDONED_CART_CODES.LEGACY,
              assignedAgentUuid: 'assigned-abandoned-cart-agent',
            }],
          },
        };

        const mockProjectSliceWithAbandonedCartAgent = createSlice({
          name: 'project',
          initialState: initialStateWithCLIAgent.project,
          reducers: {},
        });

        const renderWithProvidersWithAbandonedCartAgent = (
          ui: React.ReactElement,
          {
            preloadedState = {},
            store = configureStore({
              reducer: {
                project: mockProjectSliceWithAbandonedCartAgent.reducer,
                app: mockAppSlice.reducer,
              }, preloadedState
            }),
            ...renderOptions
          } = {}
        ) => {
          const Wrapper = ({ children }: { children: React.ReactNode }) => {
            return <Provider store={store}>{children}</Provider>;
          };
          return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
        };

        const mockedVTEXFetch = VTEXFetch as any;
        mockedVTEXFetch.mockImplementation((url: string) => {
          if (url.includes('/_v/get-skill-metrics')) {
            return Promise.resolve([
              { id: 'sent-messages', value: 1325, prefix: '' },
              { id: 'delivered-messages', value: 1259, prefix: '' },
              { id: 'read-messages', value: 956, prefix: '' },
              { id: 'interactions', value: 569, prefix: '' },
              { id: 'utm-revenue', value: 44566, prefix: 'R$' },
              { id: 'orders-placed', value: 86, prefix: '' },
              { id: 'unknown-metric', value: 23, prefix: '' },
            ]);
          }

          return Promise.resolve({});
        });

        await act(async () => {
          renderWithProvidersWithAbandonedCartAgent(<AgentMetrics />);
        });

        await waitFor(() => {
          expect(screen.getByText('1325')).toBeInTheDocument();
          expect(screen.getByText('1259')).toBeInTheDocument();
          expect(screen.getByText('956')).toBeInTheDocument();
          expect(screen.getByText('569')).toBeInTheDocument();
          expect(screen.getByText('R$ 44566')).toBeInTheDocument();
          expect(screen.getByText('86')).toBeInTheDocument();
          expect(screen.getByText('23')).toBeInTheDocument();
        });
      });
    });
  });

  describe('CLI agent metrics', () => {
    describe('fetchMetrics function', () => {
      it('should fetch template metrics and format data correctly', async () => {
        const initialStateWithCLIAgent = {
          project: {
            agents: [{
              uuid: 'cli-agent',
              name: 'CLI Agent',
              notificationType: 'active',
              isAssigned: true,
              origin: 'CLI',
              assignedAgentUuid: 'assigned-cli-agent',
            }],
          },
        };

        const mockProjectSliceWithCLI = createSlice({
          name: 'project',
          initialState: initialStateWithCLIAgent.project,
          reducers: {},
        });

        const renderWithProvidersWithCLI = (
          ui: React.ReactElement,
          {
            preloadedState = {},
            store = configureStore({
              reducer: {
                project: mockProjectSliceWithCLI.reducer,
                app: mockAppSlice.reducer,
              }, preloadedState
            }),
            ...renderOptions
          } = {}
        ) => {
          const Wrapper = ({ children }: { children: React.ReactNode }) => {
            return <Provider store={store}>{children}</Provider>;
          };
          return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
        };

        const mockedVTEXFetch = VTEXFetch as any;
        mockedVTEXFetch.mockImplementation((url: string, options?: any) => {
          if (url.includes('/_v/proxy-request') && options?.body) {
            const body = JSON.parse(options.body);
            if (body.url && body.url.includes('/api/v3/templates/template-metrics/')) {
              return Promise.resolve({
                data: {
                  status_count: {
                    sent: { value: 150 },
                    delivered: { value: 140, percentage: 93.3 },
                    read: { value: 120, percentage: 80 },
                    clicked: { value: 80, percentage: 53.3 }
                  }
                }
              });
            } else if (body.url && body.url.includes('/api/v3/agents/assigneds/')) {
              return Promise.resolve({
                uuid: 'test-agent-uuid',
                contact_percentage: 100,
                templates: [
                  {
                    uuid: 'template-1',
                    name: 'Approved Template',
                    display_name: 'Approved Template',
                    start_condition: 'test condition',
                    status: 'APPROVED',
                    needs_button_edit: false,
                    is_custom: false,
                    variables: [],
                    metadata: {
                      id: 'template-1',
                      body: 'Test template body',
                      name: 'Approved Template',
                      topic: 'test',
                      header: {
                        header_type: 'TEXT',
                        text: 'Test Header'
                      },
                      footer: 'Test Footer',
                      buttons: []
                    }
                  },
                  {
                    uuid: 'template-2',
                    name: 'Needs Editing Template',
                    display_name: 'Needs Editing Template',
                    start_condition: 'test condition',
                    status: 'needs-editing',
                    needs_button_edit: true,
                    is_custom: false,
                    variables: [],
                    metadata: {
                      id: 'template-2',
                      body: 'Test template body',
                      name: 'Needs Editing Template',
                      topic: 'test',
                      header: {
                        header_type: 'TEXT',
                        text: 'Test Header'
                      },
                      footer: 'Test Footer',
                      buttons: []
                    }
                  }
                ],
                channel_uuid: 'test-channel-uuid',
                webhook_url: 'https://test-webhook.com',
                global_rule_prompt: 'Test global rule'
              });
            }
          }
          return Promise.resolve({});
        });

        await act(async () => {
          renderWithProvidersWithCLI(<AgentMetrics />);
        });

        await waitFor(() => {
          expect(screen.getByText('150')).toBeInTheDocument();
          expect(screen.getByText('140')).toBeInTheDocument();
          expect(screen.getByText('120')).toBeInTheDocument();
          expect(screen.getByText('80')).toBeInTheDocument();
        });
      });
    });

    describe('fetchMetrics function when the template list is empty', () => {
      it('should show empty metrics', async () => {
        const initialStateWithCLIAgent = {
          project: {
            agents: [{
              uuid: 'cli-agent',
              name: 'CLI Agent',
              notificationType: 'active',
              isAssigned: true,
              origin: 'CLI',
              assignedAgentUuid: 'assigned-cli-agent',
            }],
          },
        };

        const mockProjectSliceWithCLI = createSlice({
          name: 'project',
          initialState: initialStateWithCLIAgent.project,
          reducers: {},
        });

        const renderWithProvidersWithCLI = (
          ui: React.ReactElement,
          {
            preloadedState = {},
            store = configureStore({
              reducer: {
                project: mockProjectSliceWithCLI.reducer,
              }, preloadedState
            }),
            ...renderOptions
          } = {}
        ) => {
          const Wrapper = ({ children }: { children: React.ReactNode }) => {
            return <Provider store={store}>{children}</Provider>;
          };
          return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
        };

        const mockedVTEXFetch = VTEXFetch as any;
        mockedVTEXFetch.mockImplementation((url: string, options?: any) => {
          if (url.includes('/_v/proxy-request') && options?.body) {
            const body = JSON.parse(options.body);
            if (body.url && body.url.includes('/api/v3/templates/template-metrics/')) {
              return Promise.resolve({
                data: {
                  status_count: {
                    sent: { value: 150 },
                    delivered: { value: 140, percentage: 93.3 },
                    read: { value: 120, percentage: 80 },
                    clicked: { value: 80, percentage: 53.3 }
                  }
                }
              });
            } else if (body.url && body.url.includes('/api/v3/agents/assigneds/')) {
              return Promise.resolve({
                uuid: 'test-agent-uuid',
                contact_percentage: 100,
                templates: [],
                channel_uuid: 'test-channel-uuid',
                webhook_url: 'https://test-webhook.com',
                global_rule_prompt: 'Test global rule'
              });
            }
          }
          return Promise.resolve({});
        });

        await act(async () => {
          renderWithProvidersWithCLI(<AgentMetrics />);
        });

        await waitFor(() => {
          expect(screen.getAllByText('0')).toHaveLength(4);
        });
      });
    });
  });

  describe('when assigned agents are empty', () => {
    it('should hide the header', async () => {
      const initialStateWithCLIAgent = {
        project: {
          agents: [],
        },
      };

      const mockProjectSliceWithAbandonedCartAgent = createSlice({
        name: 'project',
        initialState: initialStateWithCLIAgent.project,
        reducers: {},
      });

      const renderWithProvidersWithAbandonedCartAgent = (
        ui: React.ReactElement,
        {
          preloadedState = {},
          store = configureStore({
            reducer: {
              project: mockProjectSliceWithAbandonedCartAgent.reducer,
            }, preloadedState
          }),
          ...renderOptions
        } = {}
      ) => {
        const Wrapper = ({ children }: { children: React.ReactNode }) => {
          return <Provider store={store}>{children}</Provider>;
        };
        return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
      };

      await act(async () => {
        renderWithProvidersWithAbandonedCartAgent(<AgentMetrics />);
      });

      await waitFor(() => {
        expect(screen.queryByTestId('agent-metrics-header')).toHaveStyle({ display: 'none' });
      });
    });
  });
});
