import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest'
import { TagType } from './TagType';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

const initialState = {
  app: {
    embeddedWithin: 'VTEX App',
    designSystem: 'shoreline',
  },
};

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

describe('TagType', () => {
  describe.each([
    ['active' as const, 'blue'],
    ['passive' as const, 'purple'],
  ])('when type is %s', (type, color) => {
    it('should render the tag type', () => {
      renderWithProviders(<TagType type={type} />)

      expect(screen.getByTestId('tag-type')).toHaveAttribute('data-color', color)
    })
  })
});
