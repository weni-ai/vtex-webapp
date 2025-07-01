import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest'
import { TagType } from './TagType';

describe('TagType', () => {
  describe.each([
    ['active' as const, 'blue'],
    ['passive' as const, 'purple'],
  ])('when type is %s', (type, color) => {
    it('should render the tag type', () => {
      render(<TagType type={type} />)

      expect(screen.getByTestId('tag-type')).toHaveAttribute('data-color', color)
    })
  })
});
