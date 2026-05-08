import { describe, it, expect } from 'vitest';
import {
  calculatePercentage,
  calculateBMI,
  calculateLoan,
  calculateTip,
  calculateDiscount,
  calculateAge,
  convertNumberBase,
} from '@/lib/calculators';

describe('calculatePercentage', () => {
  it('calculates 10% of 200', () => {
    const result = calculatePercentage(200, 10);
    expect(result.result).toBe(20);
    expect(result.formula).toContain('10%');
    expect(result.formula).toContain('200');
  });

  it('calculates 50% of 100', () => {
    const result = calculatePercentage(100, 50);
    expect(result.result).toBe(50);
  });

  it('handles 0% correctly', () => {
    const result = calculatePercentage(500, 0);
    expect(result.result).toBe(0);
  });

  it('handles 100% correctly', () => {
    const result = calculatePercentage(75, 100);
    expect(result.result).toBe(75);
  });
});

describe('calculateBMI', () => {
  it('calculates normal weight BMI', () => {
    const result = calculateBMI(70, 175);
    expect(result.bmi).toBeCloseTo(22.86, 1);
    expect(result.category).toBe('Normal weight');
    expect(result.formula).toContain('BMI');
  });

  it('classifies underweight', () => {
    const result = calculateBMI(45, 170);
    expect(result.category).toBe('Underweight');
  });

  it('classifies overweight', () => {
    const result = calculateBMI(85, 175);
    expect(result.category).toBe('Overweight');
  });

  it('classifies obese', () => {
    const result = calculateBMI(110, 170);
    expect(result.category).toBe('Obese');
  });
});

describe('calculateLoan', () => {
  it('calculates monthly payment for a standard loan', () => {
    const result = calculateLoan(200000, 5, 30);
    expect(result.monthlyPayment).toBeCloseTo(1073.64, 1);
    expect(result.totalPayment).toBeGreaterThan(200000);
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.formula).toContain('P=200000');
  });

  it('handles 0% interest rate', () => {
    const result = calculateLoan(12000, 0, 1);
    expect(result.monthlyPayment).toBe(1000);
    expect(result.totalPayment).toBe(12000);
    expect(result.totalInterest).toBe(0);
  });

  it('total payment equals monthly payment times number of months', () => {
    const result = calculateLoan(100000, 4, 15);
    expect(result.totalPayment).toBeCloseTo(result.monthlyPayment * 180, 0);
  });
});

describe('calculateTip', () => {
  it('calculates tip for a single person', () => {
    const result = calculateTip(100, 15, 1);
    expect(result.tipAmount).toBe(15);
    expect(result.totalAmount).toBe(115);
    expect(result.perPerson).toBe(115);
  });

  it('splits bill among multiple people', () => {
    const result = calculateTip(100, 20, 4);
    expect(result.tipAmount).toBe(20);
    expect(result.totalAmount).toBe(120);
    expect(result.perPerson).toBe(30);
  });

  it('handles 0% tip', () => {
    const result = calculateTip(50, 0, 2);
    expect(result.tipAmount).toBe(0);
    expect(result.totalAmount).toBe(50);
    expect(result.perPerson).toBe(25);
  });

  it('treats people < 1 as 1', () => {
    const result = calculateTip(100, 10, 0);
    expect(result.perPerson).toBe(110);
  });
});

describe('calculateDiscount', () => {
  it('calculates 20% discount on $100', () => {
    const result = calculateDiscount(100, 20);
    expect(result.discountAmount).toBe(20);
    expect(result.finalPrice).toBe(80);
    expect(result.formula).toContain('20%');
  });

  it('handles 0% discount', () => {
    const result = calculateDiscount(50, 0);
    expect(result.discountAmount).toBe(0);
    expect(result.finalPrice).toBe(50);
  });

  it('handles 100% discount', () => {
    const result = calculateDiscount(75, 100);
    expect(result.discountAmount).toBe(75);
    expect(result.finalPrice).toBe(0);
  });
});

describe('calculateAge', () => {
  it('calculates age correctly', () => {
    // Use a fixed known date relative to today
    const today = new Date();
    const birthDate = new Date(
      today.getFullYear() - 25,
      today.getMonth(),
      today.getDate()
    );
    const result = calculateAge(birthDate);
    expect(result.years).toBe(25);
    expect(result.months).toBe(0);
    expect(result.days).toBe(0);
  });

  it('returns totalDays as a positive number for past dates', () => {
    const birthDate = new Date(2000, 0, 1);
    const result = calculateAge(birthDate);
    expect(result.totalDays).toBeGreaterThan(0);
  });

  it('handles birth date being today', () => {
    const today = new Date();
    const result = calculateAge(today);
    expect(result.years).toBe(0);
    expect(result.months).toBe(0);
    expect(result.days).toBe(0);
    expect(result.totalDays).toBe(0);
  });
});

describe('convertNumberBase', () => {
  it('converts decimal 255 to all bases', () => {
    const result = convertNumberBase('255', 10);
    expect(result.binary).toBe('11111111');
    expect(result.octal).toBe('377');
    expect(result.decimal).toBe('255');
    expect(result.hexadecimal).toBe('FF');
  });

  it('converts binary to all bases', () => {
    const result = convertNumberBase('1010', 2);
    expect(result.decimal).toBe('10');
    expect(result.hexadecimal).toBe('A');
    expect(result.octal).toBe('12');
  });

  it('converts hex to all bases', () => {
    const result = convertNumberBase('FF', 16);
    expect(result.decimal).toBe('255');
    expect(result.binary).toBe('11111111');
  });

  it('converts octal to all bases', () => {
    const result = convertNumberBase('17', 8);
    expect(result.decimal).toBe('15');
    expect(result.binary).toBe('1111');
    expect(result.hexadecimal).toBe('F');
  });

  it('handles zero', () => {
    const result = convertNumberBase('0', 10);
    expect(result.binary).toBe('0');
    expect(result.octal).toBe('0');
    expect(result.decimal).toBe('0');
    expect(result.hexadecimal).toBe('0');
  });

  it('handles maximum value (2^64 - 1)', () => {
    const result = convertNumberBase('18446744073709551615', 10);
    expect(result.binary).toBe('1111111111111111111111111111111111111111111111111111111111111111');
    expect(result.hexadecimal).toBe('FFFFFFFFFFFFFFFF');
  });

  it('throws for values exceeding 2^64 - 1', () => {
    expect(() => convertNumberBase('18446744073709551616', 10)).toThrow(RangeError);
  });

  it('throws for negative values', () => {
    expect(() => convertNumberBase('-1', 10)).toThrow();
  });
});
