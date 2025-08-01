import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as agentService from '../../services/agent.service';
import { Template } from './Template';

const mocks = vi.hoisted(() => ({
  agentCLI: vi.fn(),
  assignedAgentTemplate: vi.fn(),
  createAssignedAgentTemplate: vi.fn(),
  saveAgentButtonTemplate: vi.fn(),
  updateAgentTemplate: vi.fn(),
  useParams: vi.fn().mockReturnValue({
    assignedAgentUuid: '1234',
    templateUuid: undefined,
  }),
  navigate: vi.fn(),
  toastSuccess: vi.fn(),
  toastCritical: vi.fn(),
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
  assignedAgentTemplate: mocks.assignedAgentTemplate,
  createAssignedAgentTemplate: mocks.createAssignedAgentTemplate,
  saveAgentButtonTemplate: mocks.saveAgentButtonTemplate,
  updateAgentTemplate: mocks.updateAgentTemplate,
}));

vi.mock('./FormContent', () => ({
  FormContent: ({ content, setContent, addEmptyVariables, openNewVariableModal, contentError }: any) => (
    <div data-testid="form-content">
      <textarea
        data-testid="content-textarea"
        value={content.content}
        onChange={(e) => setContent({ ...content, content: e.target.value })}
      />

      <button
        data-testid="trigger-add-empty-variables"
        onClick={() => addEmptyVariables(2)}
      >
        Add empty variables
      </button>

      <button
        data-testid="trigger-open-new-variable-modal"
        onClick={() => openNewVariableModal('Test {{toBeReplaced')}
      >
        Open new variable modal
      </button>

      <div data-testid="form-content-error">{contentError}</div>
    </div>
  ),
}));

vi.mock('./FormVariables', () => ({
  FormVariables: ({ variables, setVariables, openAddingVariableModal }: any) => (
    <div data-testid="form-variables">
      {variables.map((variable: any, index: number) => (
        <div key={index} data-testid={`variable-${index}`}>
          <input
            data-testid={`variable-${index}-definition`}
            value={variable.definition}
            onChange={(e) => {
              const newVariables = [...variables];
              newVariables[index] = { ...variable, definition: e.target.value };
              setVariables(newVariables);
            }}
          />
        </div>
      ))}

      <button
        data-testid="form-variables-open-adding-variable-modal-event"
        onClick={() => openAddingVariableModal()}
      >
        Open adding variable modal
      </button>
    </div>
  ),
}));

vi.mock('./MessagePreview', () => ({
  MessagePreview: ({ contentText }: any) => (
    <div data-testid="message-preview">
      <div data-testid="preview-content">{contentText}</div>
    </div>
  ),
}));

vi.mock('./modals/AddingVariable', () => ({
  AddingVariableModal: ({ open, onClose, addVariable }: any) => (
    open ? <div data-testid="adding-variable-modal">
      <button data-testid="close-adding-variable-modal" onClick={onClose}>Close</button>
      <button data-testid="trigger-add-variable" onClick={() => addVariable({ definition: 'Test', fallbackText: 'Test' })}>Add variable</button>
    </div> : null
  ),
}));

vi.mock('./modals/Process', () => ({
  ProcessModal: ({ open, errorText, successText, onClose }: any) => (
    open ? (
      <div data-testid="process-modal">
        <div data-testid="process-modal-error-text">{errorText}</div>
        <div data-testid="process-modal-success-text">{successText}</div>
        <button data-testid="process-modal-on-close-event" onClick={onClose}>Close</button>
      </div>
    ) : null
  ),
}));

vi.mock('../../components/TemplateCard', () => ({
  TemplateStatusTag: ({ status }: any) => (
    <div data-testid={`status-tag-${status}`}>{status}</div>
  ),
}));

describe('Template', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('variables', () => {
    it('should open and close adding variable modal when trigger button is clicked', async () => {
      render(<Template />);

      expect(screen.queryByTestId('adding-variable-modal')).not.toBeInTheDocument();

      const openAddingVariableModalButton = screen.getByTestId('form-variables-open-adding-variable-modal-event');
      fireEvent.click(openAddingVariableModalButton);

      await waitFor(() => {
        expect(screen.getByTestId('adding-variable-modal')).toBeInTheDocument();
      });

      const closeAddingVariableModalButton = screen.getByTestId('close-adding-variable-modal');
      fireEvent.click(closeAddingVariableModalButton);

      await waitFor(() => {
        expect(screen.queryByTestId('adding-variable-modal')).not.toBeInTheDocument();
      });
    });
  });

  describe('template content', () => {
    it('should add empty variables when trigger button is clicked', async () => {
      render(<Template />);

      const addEmptyVariablesButton = screen.getByTestId('trigger-add-empty-variables');
      fireEvent.click(addEmptyVariablesButton);

      await waitFor(() => {
        expect(screen.getByTestId('variable-0')).toBeInTheDocument();
        expect(screen.getByTestId('variable-1')).toBeInTheDocument();
      });
    });

    it('should add variable when add variable button is clicked', async () => {
      render(<Template />);

      expect(screen.queryByTestId('adding-variable-modal')).not.toBeInTheDocument();

      const openNewVariableModalButton = screen.getByTestId('trigger-open-new-variable-modal');
      fireEvent.click(openNewVariableModalButton);

      await waitFor(() => {
        expect(screen.getByTestId('adding-variable-modal')).toBeInTheDocument();
      });

      const addVariableButton = screen.getByTestId('trigger-add-variable');
      fireEvent.click(addVariableButton);

      await waitFor(() => {
        const variable0 = screen.getByTestId('variable-0');
        expect(variable0).toBeInTheDocument();
      });
    });

    it('should show variables errors when variables are not defined', async () => {
      render(<Template />);

      const contentTextarea = screen.getByTestId('content-textarea');
      fireEvent.change(contentTextarea, { target: { value: 'Test {{1}}' } });

      await waitFor(() => {
        expect(screen.getByTestId('form-content-error')).toHaveTextContent('Template.form.fields.errors.undefined_variable');
      });
    });
  });

  describe('template creation', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should create template when save button is clicked', async () => {
      agentService.assignedAgentTemplate.mockResolvedValue({});
      agentService.createAssignedAgentTemplate.mockResolvedValue({});

      render(<Template />);

      const nameInput = screen.getByTestId('name-input');
      const startConditionInput = screen.getByTestId('start-condition-input');
      const contentTextarea = screen.getByTestId('content-textarea');

      fireEvent.change(nameInput, { target: { value: 'New Template' } });
      fireEvent.change(startConditionInput, { target: { value: 'new condition' } });
      fireEvent.change(contentTextarea, { target: { value: 'New content' } });

      const saveButton = screen.getByTestId('save-button');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(agentService.createAssignedAgentTemplate).toHaveBeenCalled();
      });

      expect(screen.queryByTestId('process-modal')).toBeInTheDocument();

      const processModalOnCloseEvent = screen.getByTestId('process-modal-on-close-event');
      fireEvent.click(processModalOnCloseEvent);

      await waitFor(() => {
        expect(screen.queryByTestId('process-modal')).not.toBeInTheDocument();
        expect(mocks.navigate).toHaveBeenCalledWith('/agents/1234');
      });
    });

    it('should show error message when template is not valid', async () => {
      agentService.createAssignedAgentTemplate.mockRejectedValue(new Error('Template is not valid'));

      render(<Template />);

      const nameInput = screen.getByTestId('name-input');
      const startConditionInput = screen.getByTestId('start-condition-input');
      const contentTextarea = screen.getByTestId('content-textarea');

      fireEvent.change(nameInput, { target: { value: 'New Template' } });
      fireEvent.change(startConditionInput, { target: { value: 'new condition' } });
      fireEvent.change(contentTextarea, { target: { value: 'New content' } });

      expect(screen.queryByTestId('template-alert')).not.toBeInTheDocument();

      const saveButton = screen.getByTestId('save-button');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(agentService.createAssignedAgentTemplate).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(screen.getByTestId('template-alert')).toBeInTheDocument();
        expect(screen.getByTestId('template-alert')).toHaveTextContent('Template is not valid');
      });
    });

    it.each([{
      inputToChangeBefore: 'name-input',
      inputToChangeAfter: 'start-condition-input',
      value: 'Name changed',
    }, {
      inputToChangeBefore: 'start-condition-input',
      inputToChangeAfter: 'name-input',
      value: 'Start condition changed',
    }])('should show validation errors for empty required fields and clear them when input is changed', async ({ inputToChangeBefore, inputToChangeAfter, value }) => {
      render(<Template />);

      const inputBefore = screen.getByTestId(inputToChangeBefore);
      fireEvent.change(inputBefore, { target: { value } });

      const saveButton = screen.getByTestId('save-button');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.queryByText('agent.setup.forms.error.empty_input')).toBeInTheDocument();
      });

      const inputAfter = screen.getByTestId(inputToChangeAfter);
      fireEvent.change(inputAfter, { target: { value } });

      await waitFor(() => {
        expect(screen.queryByText('agent.setup.forms.error.empty_input')).not.toBeInTheDocument();
      });
    });
  });

  describe('needs-editing template editing', () => {
    beforeEach(() => {
      mocks.useParams.mockReturnValue({
        assignedAgentUuid: '1234',
        templateUuid: '2222',
      });

      agentService.assignedAgentTemplate.mockResolvedValue({
        status: 'needs-editing',
        name: 'Test Template',
        isCustom: true,
        startCondition: 'Start condition',
        metadata: {
          body: 'Test content',
          body_params: ['param1', 'param2'],
        },
      });
    });

    it('should save needs-editing template when save button is clicked', async () => {
      await act(async () => {
        render(<Template />);
      });

      const nameInput = screen.getByTestId('name-input');
      const startConditionInput = screen.getByTestId('start-condition-input');
      const contentTextarea = screen.getByTestId('content-textarea');

      fireEvent.change(nameInput, { target: { value: 'New Template' } });
      fireEvent.change(startConditionInput, { target: { value: 'new condition' } });
      fireEvent.change(contentTextarea, { target: { value: 'New content' } });

      const saveButton = screen.getByTestId('save-button');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(agentService.saveAgentButtonTemplate).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(mocks.navigate).toHaveBeenCalledWith('/agents/1234');
      });
    });

    it('should show error message when save fails', async () => {
      agentService.saveAgentButtonTemplate.mockRejectedValue(new Error('Update failed'));

      await act(async () => {
        render(<Template />);
      });

      const nameInput = screen.getByTestId('name-input');
      const startConditionInput = screen.getByTestId('start-condition-input');
      const contentTextarea = screen.getByTestId('content-textarea');

      fireEvent.change(nameInput, { target: { value: 'New Template' } });
      fireEvent.change(startConditionInput, { target: { value: 'new condition' } });
      fireEvent.change(contentTextarea, { target: { value: 'New content' } });

      const saveButton = screen.getByTestId('save-button');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mocks.toastCritical).toHaveBeenCalledWith('error.title! error.description');
      });
    });
  });

  describe('template editing', () => {
    beforeEach(() => {
      mocks.useParams.mockReturnValue({
        assignedAgentUuid: '1234',
        templateUuid: '2222',
      });

      agentService.assignedAgentTemplate.mockResolvedValue({
        status: 'active',
        name: 'Test Template',
        isCustom: true,
        startCondition: 'Start condition',
        metadata: {
          body: 'Test content',
          body_params: ['param1', 'param2'],
        },
      });
    });

    describe('when it needs to be processed by AI', () => {
      it('should update template when save button is clicked', async () => {
        agentService.updateAgentTemplate.mockResolvedValue({});

        await act(async () => {
          render(<Template />);
        });

        await waitFor(() => {
          expect(screen.getByDisplayValue('Test Template')).toBeInTheDocument();
        });

        const contentTextarea = screen.getByTestId('content-textarea');
        fireEvent.change(contentTextarea, { target: { value: 'Updated content' } });

        const startConditionInput = screen.getByTestId('start-condition-input');
        fireEvent.change(startConditionInput, { target: { value: 'new condition' } });

        const saveButton = screen.getByText('template.form.create.buttons.save');
        fireEvent.click(saveButton);

        await waitFor(() => {
          expect(agentService.updateAgentTemplate).toHaveBeenCalledWith({
            templateUuid: '2222',
            template: {
              content: 'Updated content',
              startCondition: 'new condition',
              variables: [],
            },
          });
        });

        expect(screen.getByTestId('process-modal')).toBeInTheDocument();
        expect(screen.getByTestId('process-modal-success-text')).toHaveTextContent('agent.actions.edit_template.success');
      });

      it('should show error message when save fails', async () => {
        agentService.updateAgentTemplate.mockRejectedValue(new Error('Update failed'));

        render(<Template />);

        const contentTextarea = screen.getByTestId('content-textarea');
        fireEvent.change(contentTextarea, { target: { value: 'Updated content' } });

        const startConditionInput = screen.getByTestId('start-condition-input');
        fireEvent.change(startConditionInput, { target: { value: 'new condition' } });

        const saveButton = screen.getByText('template.form.create.buttons.save');
        fireEvent.click(saveButton);

        await waitFor(() => {
          expect(agentService.updateAgentTemplate).toHaveBeenCalled();
        });

        expect(screen.getByTestId('process-modal')).toBeInTheDocument();
        expect(screen.getByTestId('process-modal-error-text')).toHaveTextContent('Update failed');
      });
    });

    describe('when it does not need to be processed by AI', () => {
      it('should update template when save button is clicked', async () => {
        agentService.updateAgentTemplate.mockResolvedValue({});

        render(<Template />);

        await waitFor(() => {
          expect(screen.getByDisplayValue('Test Template')).toBeInTheDocument();
        });

        const contentTextarea = screen.getByTestId('content-textarea');
        fireEvent.change(contentTextarea, { target: { value: 'Updated content' } });

        const saveButton = screen.getByText('template.form.create.buttons.save');
        fireEvent.click(saveButton);

        await waitFor(() => {
          expect(agentService.updateAgentTemplate).toHaveBeenCalledWith({
            templateUuid: '2222',
            template: {
              content: 'Updated content',
            },
          });
        });

        expect(mocks.toastSuccess).toHaveBeenCalledWith('agent.actions.edit_template.success');
        expect(mocks.navigate).toHaveBeenCalledWith('/agents/1234');
      });

      it('should show error message when save fails', async () => {
        agentService.updateAgentTemplate.mockRejectedValue(new Error('Update failed'));

        render(<Template />);

        const contentTextarea = screen.getByTestId('content-textarea');
        fireEvent.change(contentTextarea, { target: { value: 'Updated content' } });

        const saveButton = screen.getByText('template.form.create.buttons.save');
        fireEvent.click(saveButton);

        await waitFor(() => {
          expect(agentService.updateAgentTemplate).toHaveBeenCalled();
        });

        expect(mocks.toastCritical).toHaveBeenCalledWith('Update failed');
      });
    });
  });
});
