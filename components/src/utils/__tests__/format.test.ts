import { describe, it, expect } from 'vitest';
import { formatNumber, formatCurrency, formatDate } from '../format';

describe('Formatting utilities', () => {
  describe('formatNumber', () => {
    it('should format basic number with Norwegian separators', () => {
      expect(formatNumber(1234.56)).toBe('1 234,56');
    });

    it('should format zero', () => {
      expect(formatNumber(0)).toBe('0,00');
    });

    it('should format large numbers', () => {
      expect(formatNumber(1234567.89)).toBe('1 234 567,89');
    });

    it('should format small decimals', () => {
      expect(formatNumber(0.5)).toBe('0,50');
    });

    it('should format negative numbers', () => {
      expect(formatNumber(-1234.56)).toBe('-1 234,56');
    });

    it('should handle whole numbers', () => {
      expect(formatNumber(1000)).toBe('1 000,00');
    });

    it('should handle very large numbers', () => {
      expect(formatNumber(999999999.99)).toBe('999 999 999,99');
    });

    it('should always show two decimal places', () => {
      expect(formatNumber(100)).toBe('100,00');
      expect(formatNumber(100.1)).toBe('100,10');
    });

    it('should handle edge case of one', () => {
      expect(formatNumber(1)).toBe('1,00');
    });

    it('should round to two decimals', () => {
      expect(formatNumber(1.234)).toBe('1,23');
      expect(formatNumber(1.235)).toBe('1,24');
    });

    it('should handle negative zero', () => {
      expect(formatNumber(-0)).toBe('0,00');
    });

    it('should format millions', () => {
      expect(formatNumber(5000000)).toBe('5 000 000,00');
    });

    it('should format thousands with decimals', () => {
      expect(formatNumber(12345.67)).toBe('12 345,67');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency with kr suffix', () => {
      expect(formatCurrency(1234.56)).toBe('1 234,56 kr');
    });

    it('should format zero currency', () => {
      expect(formatCurrency(0)).toBe('0,00 kr');
    });

    it('should format large amounts', () => {
      expect(formatCurrency(1000000)).toBe('1 000 000,00 kr');
    });

    it('should format negative amounts', () => {
      expect(formatCurrency(-500)).toBe('-500,00 kr');
    });

    it('should have space before kr', () => {
      expect(formatCurrency(100)).toBe('100,00 kr');
      expect(formatCurrency(100).endsWith(' kr')).toBe(true);
    });

    it('should format portfolio values', () => {
      expect(formatCurrency(250000.50)).toBe('250 000,50 kr');
    });

    it('should format debt values (negative)', () => {
      expect(formatCurrency(-150000)).toBe('-150 000,00 kr');
    });

    it('should format monthly salary', () => {
      expect(formatCurrency(65000)).toBe('65 000,00 kr');
    });

    it('should format small amounts', () => {
      expect(formatCurrency(50)).toBe('50,00 kr');
    });

    it('should format annual values', () => {
      expect(formatCurrency(780000)).toBe('780 000,00 kr');
    });
  });

  describe('formatDate', () => {
    it('should format date in dd.MM.yyyy format', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toBe('15.01.2024');
    });

    it('should handle single digit days with leading zero', () => {
      const date = new Date('2024-01-05');
      expect(formatDate(date)).toBe('05.01.2024');
    });

    it('should handle single digit months with leading zero', () => {
      const date = new Date('2024-03-15');
      expect(formatDate(date)).toBe('15.03.2024');
    });

    it('should handle new year date', () => {
      const date = new Date('2024-01-01');
      expect(formatDate(date)).toBe('01.01.2024');
    });

    it('should handle end of year date', () => {
      const date = new Date('2024-12-31');
      expect(formatDate(date)).toBe('31.12.2024');
    });

    it('should handle leap year date', () => {
      const date = new Date('2024-02-29');
      expect(formatDate(date)).toBe('29.02.2024');
    });

    it('should format different years', () => {
      const date2023 = new Date('2023-06-15');
      const date2025 = new Date('2025-06-15');
      expect(formatDate(date2023)).toBe('15.06.2023');
      expect(formatDate(date2025)).toBe('15.06.2025');
    });

    it('should format all months correctly', () => {
      for (let month = 1; month <= 12; month++) {
        const date = new Date(`2024-${month.toString().padStart(2, '0')}-15`);
        const formatted = formatDate(date);
        expect(formatted).toMatch(/^\d{2}\.\d{2}\.2024$/);
      }
    });

    it('should handle date created from string', () => {
      const date = new Date('2024-11-28T10:30:00');
      expect(formatDate(date)).toBe('28.11.2024');
    });

    it('should format date for portfolio snapshots', () => {
      const date = new Date('2024-06-01');
      expect(formatDate(date)).toBe('01.06.2024');
    });
  });

  describe('edge cases', () => {
    it('should handle Infinity gracefully', () => {
      // Note: This tests actual behavior - Infinity will format as "Infinity"
      expect(formatNumber(Infinity).toLowerCase()).toContain('infinity');
    });

    it('should handle NaN gracefully', () => {
      // Note: NaN will format as "NaN"
      expect(formatNumber(NaN).toUpperCase()).toContain('NAN');
    });

    it('should format very small positive numbers', () => {
      expect(formatNumber(0.01)).toBe('0,01');
      expect(formatNumber(0.001)).toBe('0,00');
    });

    it('should format very small negative numbers', () => {
      expect(formatNumber(-0.01)).toBe('-0,01');
    });
  });

  describe('Norwegian locale specifics', () => {
    it('should use comma as decimal separator', () => {
      const formatted = formatNumber(123.45);
      expect(formatted).toContain(',');
      expect(formatted).not.toContain('.');
    });

    it('should use space as thousands separator', () => {
      const formatted = formatNumber(1234.56);
      expect(formatted).toContain(' ');
      expect(formatted.split(' ').length).toBeGreaterThan(1);
    });

    it('should format date with dots', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      expect(formatted).toContain('.');
      expect(formatted.split('.').length).toBe(3);
    });
  });

  describe('financial use cases', () => {
    it('should format portfolio net worth', () => {
      expect(formatCurrency(1500000)).toBe('1 500 000,00 kr');
    });

    it('should format savings total', () => {
      expect(formatCurrency(250000.50)).toBe('250 000,50 kr');
    });

    it('should format debt total', () => {
      expect(formatCurrency(-200000)).toBe('-200 000,00 kr');
    });

    it('should format monthly salary', () => {
      expect(formatCurrency(65000)).toBe('65 000,00 kr');
    });

    it('should format monthly savings', () => {
      expect(formatCurrency(15000)).toBe('15 000,00 kr');
    });

    it('should format FIRE number', () => {
      expect(formatCurrency(12000000)).toBe('12 000 000,00 kr');
    });

    it('should format single asset value', () => {
      expect(formatCurrency(125000.75)).toBe('125 000,75 kr');
    });

    it('should format account balances', () => {
      const accounts = [100000, 50000, 75000, -150000];
      const formatted = accounts.map(formatCurrency);
      expect(formatted).toEqual([
        '100 000,00 kr',
        '50 000,00 kr',
        '75 000,00 kr',
        '-150 000,00 kr',
      ]);
    });
  });
});
