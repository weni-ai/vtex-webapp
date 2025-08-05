import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ProcessModal } from './Process';

const mocks = vi.hoisted(() => ({
  onClose: vi.fn(),
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

vi.mock('@vtex/shoreline', async () => {
  const actual = await vi.importActual('@vtex/shoreline');

  return {
    ...actual,
    Modal: ({ children, open, onClose }: any) => (
      open ? (
        <div data-testid="modal" data-open={open}>
          {children}
          <button data-testid="modal-on-close-event" onClick={onClose}>Close</button>
        </div>
      ) : null
    ),
  };
});

vi.mock('react-markdown', () => ({
  default: ({ children }: any) => (
    <div data-testid="markdown">{children}</div>
  ),
}));

describe('ProcessModal', () => {
  const defaultProps = {
    open: true,
    onClose: mocks.onClose,
    processingText: 'Processing template...',
    steps: [
      'step1',
      'step2',
      'step3',
    ],
    errorText: '',
    successText: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('basic rendering', () => {
    it('should render modal when open is true', () => {
      render(<ProcessModal {...defaultProps} />);

      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    it('should not render modal when open is false', () => {
      render(<ProcessModal {...defaultProps} open={false} />);

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('should display processing title', () => {
      render(<ProcessModal {...defaultProps} />);

      expect(screen.getByText('template.modals.create.steps.processing.title')).toBeInTheDocument();
    });

    it('should display processing text', () => {
      render(<ProcessModal {...defaultProps} />);

      expect(screen.getByText('Processing template...')).toBeInTheDocument();
    });

    it('should display all steps initially as pending', () => {
      render(<ProcessModal {...defaultProps} />);

      expect(screen.getByText('template.modals.create.steps.processing.items.step1')).toBeInTheDocument();
      expect(screen.getByText('template.modals.create.steps.processing.items.step2')).toBeInTheDocument();
      expect(screen.getByText('template.modals.create.steps.processing.items.step3')).toBeInTheDocument();
    });
  });

  describe('step progression', () => {
    it('should progress through steps automatically', async () => {
      render(<ProcessModal {...defaultProps} />);
      
      expect(screen.getByText('template.modals.create.steps.processing.items.step1')).toBeInTheDocument();
      expect(screen.getByText('template.modals.create.steps.processing.items.step2')).toBeInTheDocument();
      expect(screen.getByText('template.modals.create.steps.processing.items.step3')).toBeInTheDocument();

      expect(screen.queryAllByTestId('icon-check')).toHaveLength(0);

      await act(async () => {
        vi.advanceTimersByTime(1000);
        vi.advanceTimersByTime(1);
        vi.advanceTimersByTime(1000);
        vi.advanceTimersByTime(1);
      });

      expect(screen.queryAllByTestId('icon-check')).toHaveLength(2);
      expect(screen.queryAllByTestId('icon-spinner')).toHaveLength(1);
    });

    it('should complete all steps after progression', async () => {
      const { rerender } = render(<ProcessModal {...defaultProps} />);

      await act(async () => {
        rerender(<ProcessModal {...defaultProps} successText="Success!" />);
      });

      expect(screen.queryAllByTestId('icon-check')).toHaveLength(3);
    });
  });

  describe('button states', () => {
    it('should disable proceed button when steps are not finished', () => {
      render(<ProcessModal {...defaultProps} />);

      const proceedButton = screen.getByTestId('button-proceed');
      expect(proceedButton).toBeDisabled();
    });

    it('should enable proceed button when all steps are completed', async () => {
      const { rerender } = render(<ProcessModal {...defaultProps} />);
      
      rerender(<ProcessModal {...defaultProps} successText="Success!" />);

      const proceedButton = screen.getByTestId('button-proceed');
      expect(proceedButton).not.toBeDisabled();
    });

    it('should show cancel button during processing', () => {
      render(<ProcessModal {...defaultProps} />);

      const cancelButton = screen.getByTestId('button-cancel');
      expect(cancelButton).toBeInTheDocument();
    });
  });

  describe('completion page', () => {
    it('should show completion page when proceed is clicked', async () => {
      const { rerender } = render(<ProcessModal {...defaultProps} />);
      
      rerender(<ProcessModal {...defaultProps} successText="Success!" />);

      const proceedButton = screen.getByTestId('button-proceed');
      expect(proceedButton).not.toBeDisabled();

      fireEvent.click(proceedButton);

      expect(screen.getByText('template.modals.create.steps.completed.title')).toBeInTheDocument();
    });

    it('should show success message when successText is provided', async () => {
      const { rerender } = render(<ProcessModal {...defaultProps} />);
      
      rerender(<ProcessModal {...defaultProps} successText="Template created successfully!" />);

      const proceedButton = screen.getByTestId('button-proceed');
      expect(proceedButton).not.toBeDisabled();

      fireEvent.click(proceedButton);

      expect(screen.getByTestId('alert-completed')).toHaveTextContent('Template created successfully!');
    });

    it('should automatically show completion page when errorText is provided', () => {
      const { rerender } = render(<ProcessModal {...defaultProps} />);
      
      rerender(<ProcessModal {...defaultProps} errorText="Failed to create template." />);

      expect(screen.getByText('template.modals.create.steps.completed.title')).toBeInTheDocument();
      expect(screen.getByText('Failed to create template.')).toBeInTheDocument();
    });
  });

  describe('completion page buttons', () => {
    it('should show finish button when success', () => {
      const { rerender } = render(<ProcessModal {...defaultProps} />);
      
      rerender(<ProcessModal {...defaultProps} successText="Success!" />);

      const proceedButton = screen.getByTestId('button-proceed');
      fireEvent.click(proceedButton);

      const finishButton = screen.getByTestId('button-finish');
      expect(finishButton).toBeInTheDocument();
    });

    it('should show cancel and return buttons when error', () => {
      const { rerender } = render(<ProcessModal {...defaultProps} />);
      
      rerender(<ProcessModal {...defaultProps} errorText="Error!" />);

      const cancelButton = screen.getByTestId('button-cancel');
      const returnButton = screen.getByTestId('button-return-and-fix');

      expect(cancelButton).toBeInTheDocument();
      expect(returnButton).toBeInTheDocument();
    });
  });

  describe('modal interactions', () => {
    it('should call onClose when cancel button is clicked', () => {
      render(<ProcessModal {...defaultProps} />);

      const cancelButton = screen.getByTestId('button-cancel');
      fireEvent.click(cancelButton);

      expect(mocks.onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when finish button is clicked', () => {
      const { rerender } = render(<ProcessModal {...defaultProps} />);
      
      rerender(<ProcessModal {...defaultProps} successText="Success!" />);

      const proceedButton = screen.getByTestId('button-proceed');
      fireEvent.click(proceedButton);

      const finishButton = screen.getByTestId('button-finish');
      fireEvent.click(finishButton);

      expect(mocks.onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when return button is clicked', () => {
      const { rerender } = render(<ProcessModal {...defaultProps} />);
      
      rerender(<ProcessModal {...defaultProps} errorText="Error!" />);

      const returnButton = screen.getByTestId('button-return-and-fix');
      fireEvent.click(returnButton);

      expect(mocks.onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when modal close event is triggered', () => {
      render(<ProcessModal {...defaultProps} />);

      const closeButton = screen.getByTestId('modal-on-close-event');
      fireEvent.click(closeButton);

      expect(mocks.onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when modal close event is triggered', () => {
      render(<ProcessModal {...defaultProps} />);

      const closeButton = screen.getByTestId('modal-on-close-event');
      fireEvent.click(closeButton);

      expect(mocks.onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('state management', () => {
    it('should reset to processing page when modal opens', () => {
      const { rerender } = render(<ProcessModal {...defaultProps} open={false} />);

      rerender(<ProcessModal {...defaultProps} open={true} />);

      expect(screen.getByText('template.modals.create.steps.processing.title')).toBeInTheDocument();
    });

    it('should initialize steps when modal opens', () => {
      const { rerender } = render(<ProcessModal {...defaultProps} open={false} />);

      rerender(<ProcessModal {...defaultProps} open={true} />);

      expect(screen.getByText('template.modals.create.steps.processing.items.step1')).toBeInTheDocument();
      expect(screen.getByText('template.modals.create.steps.processing.items.step2')).toBeInTheDocument();
      expect(screen.getByText('template.modals.create.steps.processing.items.step3')).toBeInTheDocument();
    });

    it('should clear timeouts when modal closes', () => {
      const { rerender } = render(<ProcessModal {...defaultProps} />);

      vi.advanceTimersByTime(500);

      rerender(<ProcessModal {...defaultProps} open={false} />);

      vi.advanceTimersByTime(1000);

      expect(vi.getTimerCount()).toBe(0);
    });
  });
});
