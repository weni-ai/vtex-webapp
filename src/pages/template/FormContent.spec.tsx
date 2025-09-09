import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FormContent } from './FormContent';

const mocks = vi.hoisted(() => ({
  useSelector: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: () => new Promise(() => { }),
    },
  }),
}));

vi.mock('react-redux', () => ({
  useSelector: mocks.useSelector,
}));

vi.mock('./FormContent', async () => {
  const actual = await vi.importActual('./FormContent');
  return {
    ...actual,
    fileToBase64: vi.fn(),
  };
});

vi.mock('./TextareaClone', () => ({
  TextareaClone: React.forwardRef<HTMLDivElement>((props, ref) => {
    return <div ref={ref} data-testid="textarea-clone" {...props} />;
  }),
  calculateCursorPosition: vi.fn().mockReturnValue({ x: 10, y: 10 }),
}));

describe('FormContent', () => {
  const defaultProps = {
    status: 'active' as const,
    content: {
      header: undefined,
      content: '',
      footer: undefined,
      button: undefined,
    },
    setContent: vi.fn(),
    prefilledContent: {
      header: undefined,
      content: '',
      footer: undefined,
      button: undefined,
    },
    canChangeButton: true,
    isHeaderEditable: true,
    isFooterEditable: true,
    isButtonEditable: true,
    totalVariables: 0,
    addEmptyVariables: vi.fn(),
    openNewVariableModal: vi.fn(),
    variables: [],
    contentError: undefined,
    canCreateVariable: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mocks.useSelector.mockImplementation((selector) => {
      if (selector.name === 'selectDesignSystem') {
        return 'shoreline';
      }
    });
  });

  describe('content textarea', () => {
    it('should handle variable creation when canCreateVariable is true and organize variables', async () => {
      const addEmptyVariables = vi.fn();

      await act(async () => {
        render(<FormContent {...defaultProps} addEmptyVariables={addEmptyVariables} />);
      });

      const contentTextarea = screen.getByTestId('content-textarea');
      fireEvent.input(contentTextarea, { target: { value: 'Test {{2}} {{3}}' } });

      await waitFor(() => {
        expect(addEmptyVariables).toHaveBeenCalledWith(2);
        expect(contentTextarea).toHaveValue('Test {{1}} {{2}}');
      });
    });

    it('should not handle variable creation when canCreateVariable is false and keep the variables in the correct order', async () => {
      const addEmptyVariables = vi.fn();

      await act(async () => {
        render(<FormContent {...defaultProps} canCreateVariable={false} addEmptyVariables={addEmptyVariables} />);
      });

      const contentTextarea = screen.getByTestId('content-textarea');
      fireEvent.input(contentTextarea, { target: { value: 'Test {{2}} {{3}}' } });

      await waitFor(() => {
        expect(addEmptyVariables).not.toHaveBeenCalled();
        expect(contentTextarea).toHaveValue('Test {{2}} {{3}}');
      });
    });

    it('should not change variable order when the variable is already created', async () => {
      const addEmptyVariables = vi.fn();

      await act(async () => {
        render(<FormContent {...defaultProps} variables={['1', '2']} totalVariables={2} addEmptyVariables={addEmptyVariables} />);
      });

      const contentTextarea = screen.getByTestId('content-textarea');
      fireEvent.input(contentTextarea, { target: { value: 'Test {{1}} {{2}}' } });

      await waitFor(() => {
        expect(addEmptyVariables).toHaveBeenCalledWith(0);
        expect(contentTextarea).toHaveValue('Test {{1}} {{2}}');
      });
    });
  });

  describe('button functionality', () => {
    it('should handle button URL input', async () => {
      const prefilledContent = {
        header: undefined,
        content: '',
        footer: undefined,
        button: {
          text: 'Click here',
          url: '',
          urlExample: 'https://example.com',
        },
      };

      await act(async () => {
        render(<FormContent {...defaultProps} prefilledContent={prefilledContent} />);
      });

      const buttonUrlInput = screen.getByTestId('button-url-input');
      fireEvent.input(buttonUrlInput, { target: { value: 'https://example.com' } });

      const buttonUrlExampleInput = screen.getByTestId('button-url-example-input');
      fireEvent.input(buttonUrlExampleInput, { target: { value: 'https://example.com/test' } });

      await waitFor(() => {
        expect(buttonUrlInput).toHaveValue('example.com');
        expect(buttonUrlExampleInput).toHaveValue('example.com/test');
      });
    });
  });

  describe('element removal', () => {
    it.each([
      {
        element: 'header',
        title: 'template.form.fields.content.header.title',
      },
      {
        element: 'footer',
        title: 'template.form.fields.content.footer.title',
      },
      {
        element: 'button',
        title: 'template.form.fields.content.button.title',
      },
    ])('should allow removing $element section', async ({ element, title }) => {
      await act(async () => {
        render(<FormContent {...defaultProps} />);
      });

      const addButton = screen.getByTestId(`add-element-${element}-button`);
      await act(async () => {
        addButton.click();
      });

      const headerOption = screen.getByTestId(`add-element-${element}-button`);
      await act(async () => {
        headerOption.click();
      });

      expect(screen.queryByText(title)).toBeInTheDocument();

      const removeButton = screen.getByTestId(`add-element-${element}-remove-button`);
      await act(async () => {
        removeButton.click();
      });

      await waitFor(() => {
        expect(screen.queryByText(title)).not.toBeInTheDocument();
      });
    });
  });

  describe('variable suggestions', () => {
    it('should select variable when the user types {{', async () => {
      const variables = ['Variable 1', 'Variable 2'];

      await act(async () => {
        render(<FormContent {...defaultProps} variables={variables} />);
      });

      const contentTextarea = screen.getByTestId('content-textarea');
      fireEvent.input(contentTextarea, { target: { value: 'Test {{' } });

      await waitFor(() => {
        expect(screen.getByText('{{1}} Variable 1')).toBeInTheDocument();
        expect(screen.getByText('{{2}} Variable 2')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('{{2}} Variable 2'));

      expect(contentTextarea).toHaveValue('Test {{2}}');
    });

    it('should allow creating new variables', async () => {
      const openNewVariableModal = vi.fn();

      await act(async () => {
        render(<FormContent {...defaultProps} openNewVariableModal={openNewVariableModal} />);
      });

      const contentTextarea = screen.getByTestId('content-textarea');
      fireEvent.input(contentTextarea, { target: { value: 'Test {{' } });

      fireEvent.click(screen.getByTestId('add-variable-button'));

      await waitFor(() => {
        expect(openNewVariableModal).toHaveBeenCalled();
      });
    });
  });

  describe('prefilled content', () => {
    it('should populate fields with prefilled content', async () => {
      const prefilledContent = {
        header: { type: 'text' as const, text: 'Prefilled header' },
        content: 'Prefilled content',
        footer: 'Prefilled footer',
        button: { text: 'Prefilled button', url: 'https://example.com', urlExample: undefined },
      };

      await act(async () => {
        render(<FormContent {...defaultProps} prefilledContent={prefilledContent} />);
      });

      await waitFor(() => {
        expect(screen.getByDisplayValue('Prefilled header')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Prefilled content')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Prefilled footer')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Prefilled button')).toBeInTheDocument();
        expect(screen.getByDisplayValue('example.com')).toBeInTheDocument();
      });
    });
  });

  describe('file handling', () => {
    it('should handle file upload for media header', async () => {
      await act(async () => {
        render(<FormContent {...defaultProps} />);
      });

      const addButton = screen.getByTestId('add-element-button');
      await act(async () => {
        addButton.click();
      });

      const headerOption = screen.getByTestId('add-element-header-button');
      await act(async () => {
        headerOption.click();
      });

      const mediaRadio = screen.getByTestId('add-element-header-media-button');
      await act(async () => {
        mediaRadio.click();
      });

      const fileInput = screen.getByTestId('file-input');
      const fileInputClickSpy = vi.spyOn(fileInput, 'click');

      const uploadButton = screen.getByTestId('upload-file-button');
      await act(async () => {
        uploadButton.click();
      });

      await waitFor(() => {
        expect(fileInputClickSpy).toHaveBeenCalled();
      });

      fireEvent.change(fileInput, { target: { files: [new File([''], 'test.jpg', { type: 'image/jpeg' })] } });

      await waitFor(() => {
        expect(screen.getByText('test.jpg')).toBeInTheDocument();
      });
    });

    it('should handle file removal', async () => {
      const prefilledContent = {
        header: {
          type: 'media' as const,
          file: new File([''], 'test.jpg', { type: 'image/jpeg' }),
          previewSrc: 'data:image/jpeg;base64,test'
        },
        content: 'Prefilled content',
        footer: undefined,
        button: undefined,
      };

      await act(async () => {
        render(<FormContent {...defaultProps} prefilledContent={prefilledContent} />);
      });

      expect(screen.getByText('test.jpg')).toBeInTheDocument();

      const removeButton = screen.getByTestId('remove-file-button');
      await act(async () => {
        removeButton.click();
      });

      expect(screen.queryByText('test.jpg')).not.toBeInTheDocument();
    });

    it('should truncate file name if it is too long', async () => {
      const prefilledContent = {
        header: {
          type: 'media' as const,
          file: new File([''], 'a long very long very long very long very long very long file name.jpg', { type: 'image/jpeg' }),
          previewSrc: 'data:image/jpeg;base64,test'
        },
        content: 'Prefilled content',
        footer: undefined,
        button: undefined,
      };

      await act(async () => {
        render(<FormContent {...defaultProps} prefilledContent={prefilledContent} />);
      });

      const fileName = screen.getByTestId('file-name');

      expect(fileName.textContent).toBe('a long very long very long very long very long...jpg');
    });
  });
});
