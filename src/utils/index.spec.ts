import { describe, it, expect } from 'vitest';
import { cleanURL, getPeriodDates } from './index';

describe('utils/index', () => {
  describe('cleanURL', () => {
    it('should remove http:// prefix from URL', () => {
      const input = 'http://example.com';
      const expected = 'example.com';
      expect(cleanURL(input)).toBe(expected);
    });

    it('should remove https:// prefix from URL', () => {
      const input = 'https://example.com';
      const expected = 'example.com';
      expect(cleanURL(input)).toBe(expected);
    });

    it('should remove http:// prefix and trim whitespace', () => {
      const input = '  http://example.com  ';
      const expected = 'example.com';
      expect(cleanURL(input)).toBe(expected);
    });

    it('should remove https:// prefix and trim whitespace', () => {
      const input = '  https://example.com  ';
      const expected = 'example.com';
      expect(cleanURL(input)).toBe(expected);
    });

    it('should return URL without protocol unchanged', () => {
      const input = 'example.com';
      const expected = 'example.com';
      expect(cleanURL(input)).toBe(expected);
    });

    it('should handle URL with path', () => {
      const input = 'https://example.com/path/to/resource';
      const expected = 'example.com/path/to/resource';
      expect(cleanURL(input)).toBe(expected);
    });

    it('should handle URL with query parameters', () => {
      const input = 'http://example.com?param=value&other=123';
      const expected = 'example.com?param=value&other=123';
      expect(cleanURL(input)).toBe(expected);
    });

    it('should handle URL with port', () => {
      const input = 'https://example.com:8080';
      const expected = 'example.com:8080';
      expect(cleanURL(input)).toBe(expected);
    });
  });

  describe('getPeriodDates', () => {
    it('should return correct dates for today', () => {
      const result = getPeriodDates('today');
      const today = new Date();
      const expectedStartDate = today.toISOString().split('T')[0];
      const expectedEndDate = today.toISOString().split('T')[0];

      expect(result).toHaveProperty('startDate');
      expect(result).toHaveProperty('endDate');
      expect(result.startDate).toBe(expectedStartDate);
      expect(result.endDate).toBe(expectedEndDate);
    });

    it('should return correct dates for yesterday', () => {
      const result = getPeriodDates('yesterday');
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const expectedDate = yesterday.toISOString().split('T')[0];

      expect(result).toHaveProperty('startDate');
      expect(result).toHaveProperty('endDate');
      expect(result.startDate).toBe(expectedDate);
      expect(result.endDate).toBe(expectedDate);
    });

    it('should return correct dates for last 7 days', () => {
      const result = getPeriodDates('last 7 days');
      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);
      const expectedStartDate = sevenDaysAgo.toISOString().split('T')[0];
      const expectedEndDate = today.toISOString().split('T')[0];

      expect(result).toHaveProperty('startDate');
      expect(result).toHaveProperty('endDate');
      expect(result.startDate).toBe(expectedStartDate);
      expect(result.endDate).toBe(expectedEndDate);
    });

    it('should return correct dates for last 28 days', () => {
      const result = getPeriodDates('last 28 days');
      const today = new Date();
      const twentyEightDaysAgo = new Date();
      twentyEightDaysAgo.setDate(today.getDate() - 28);
      const expectedStartDate = twentyEightDaysAgo.toISOString().split('T')[0];
      const expectedEndDate = today.toISOString().split('T')[0];

      expect(result).toHaveProperty('startDate');
      expect(result).toHaveProperty('endDate');
      expect(result.startDate).toBe(expectedStartDate);
      expect(result.endDate).toBe(expectedEndDate);
    });

    it('should return dates in ISO format (YYYY-MM-DD)', () => {
      const result = getPeriodDates('today');
      const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

      expect(result.startDate).toMatch(isoDateRegex);
      expect(result.endDate).toMatch(isoDateRegex);
    });

    it('should handle different periods consistently', () => {
      const periods = ['today', 'yesterday', 'last 7 days', 'last 28 days'] as const;

      periods.forEach(period => {
        const result = getPeriodDates(period);
        expect(result).toHaveProperty('startDate');
        expect(result).toHaveProperty('endDate');
        expect(typeof result.startDate).toBe('string');
        expect(typeof result.endDate).toBe('string');
      });
    });

    it('should return startDate before or equal to endDate', () => {
      const periods = ['today', 'yesterday', 'last 7 days', 'last 28 days'] as const;

      periods.forEach(period => {
        const result = getPeriodDates(period);
        const startDate = new Date(result.startDate);
        const endDate = new Date(result.endDate);

        expect(startDate.getTime()).toBeLessThanOrEqual(endDate.getTime());
      });
    });

    it('should handle edge case of month/year boundary', () => {
      const mockDate = new Date('2024-01-01');
      const originalDate = global.Date;

      global.Date = class extends Date {
        constructor() {
          super();
          return mockDate;
        }
      } as any;

      const result = getPeriodDates('yesterday');
      expect(result.startDate).toBe('2023-12-31');
      expect(result.endDate).toBe('2023-12-31');

      global.Date = originalDate;
    });

    it('should handle leap year correctly', () => {
      const mockDate = new Date('2024-03-01');
      const originalDate = global.Date;

      global.Date = class extends Date {
        constructor() {
          super();
          return mockDate;
        }
      } as any;

      const result = getPeriodDates('yesterday');
      expect(result.startDate).toBe('2024-02-29');
      expect(result.endDate).toBe('2024-02-29');

      global.Date = originalDate;
    });
  });
});
