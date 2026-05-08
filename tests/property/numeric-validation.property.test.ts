import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  validateNumeric,
  validateRange,
  validateTextLength,
} from '@/lib/validation';

/**
 * Property-based tests for input validation.
 *
 * Validates: Requirements 3.4, 3.7, 4.5, 5.4, 5.5, 8.4
 */

describe('Feature: online-tools-hub, Property 7: Numeric Input Validation', () => {
  it('for any valid integer string, the numeric validator SHALL accept it', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -999999999, max: 999999999 }),
        (num: number) => {
          const result = validateNumeric(String(num));
          expect(result.valid).toBe(true);
          expect(result.error).toBeUndefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('for any valid decimal string, the numeric validator SHALL accept it', () => {
    // Generate decimals that won't produce scientific notation strings
    // by using integers divided by a power of 10
    const decimalArb = fc.tuple(
      fc.integer({ min: -999999999, max: 999999999 }),
      fc.integer({ min: 1, max: 6 })
    ).map(([n, decimals]) => {
      const divisor = Math.pow(10, decimals);
      return (n / divisor).toFixed(decimals);
    });

    fc.assert(
      fc.property(
        decimalArb,
        (numStr: string) => {
          const result = validateNumeric(numStr);
          expect(result.valid).toBe(true);
          expect(result.error).toBeUndefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('for any valid numeric string with leading/trailing whitespace, the numeric validator SHALL accept it', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -999999999, max: 999999999 }),
        fc.integer({ min: 1, max: 5 }),
        fc.integer({ min: 1, max: 5 }),
        (num: number, leadCount: number, trailCount: number) => {
          const leadingSpaces = ' '.repeat(leadCount);
          const trailingSpaces = ' '.repeat(trailCount);
          const input = leadingSpaces + String(num) + trailingSpaces;
          const result = validateNumeric(input);
          expect(result.valid).toBe(true);
          expect(result.error).toBeUndefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('for any string containing non-numeric characters (other than single decimal, leading negative, whitespace), the numeric validator SHALL reject it', () => {
    // Generate strings that are invalid numeric representations
    const invalidNumericArb = fc.oneof(
      // Multiple decimal points
      fc.tuple(
        fc.integer({ min: 0, max: 999 }),
        fc.integer({ min: 0, max: 999 }),
        fc.integer({ min: 0, max: 999 })
      ).map(([a, b, c]) => `${a}.${b}.${c}`),
      // Multiple negative signs
      fc.integer({ min: 1, max: 999 }).map((n) => `--${n}`),
      // Negative sign not at start
      fc.integer({ min: 1, max: 999 }).map((n) => `${n}-`),
      // Letters mixed with digits
      fc.integer({ min: 0, max: 999 }).map((n) => `${n}abc`),
      fc.integer({ min: 0, max: 999 }).map((n) => `abc${n}`),
      // Scientific notation (not accepted by the validator)
      fc.integer({ min: 1, max: 99 }).map((n) => `${n}e5`),
      fc.integer({ min: 1, max: 99 }).map((n) => `${n}e-3`),
      // Common invalid inputs
      fc.constantFrom(
        'abc', '12a3', '1.2.3', '--5', '5-', '1e', 'NaN',
        'Infinity', '-Infinity', '1,000', '$100', '10%',
        '1 2 3', 'hello', '0x1F', '1e5', '2.5e10'
      )
    );

    fc.assert(
      fc.property(
        invalidNumericArb,
        (input: string) => {
          const result = validateNumeric(input);
          expect(result.valid).toBe(false);
          expect(result.error).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('empty or whitespace-only strings SHALL be rejected by the numeric validator', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('', ' ', '  ', '\t', '\n', '\r', '   ', ' \t ', '\n\r'),
        (input: string) => {
          const result = validateNumeric(input);
          expect(result.valid).toBe(false);
          expect(result.error).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Feature: online-tools-hub, Property 9: Numeric Range Boundary Validation', () => {
  it('for any numeric value outside the defined valid range [min, max], the validator SHALL reject it', () => {
    fc.assert(
      fc.property(
        // Generate a range [min, max]
        fc.integer({ min: -10000, max: 10000 }),
        fc.integer({ min: 1, max: 10000 }),
        // Generate a value that is outside the range
        fc.boolean(),
        fc.integer({ min: 1, max: 10000 }),
        (min: number, rangeSize: number, belowRange: boolean, offset: number) => {
          const max = min + rangeSize;
          // Generate a value outside [min, max]
          const value = belowRange ? min - offset : max + offset;

          const result = validateRange(value, min, max);
          expect(result.valid).toBe(false);
          expect(result.error).toBeDefined();
          // Error message SHALL contain both min and max values
          expect(result.error).toContain(String(min));
          expect(result.error).toContain(String(max));
        }
      ),
      { numRuns: 100 }
    );
  });

  it('for any numeric value within the range [min, max], the validator SHALL accept it', () => {
    fc.assert(
      fc.property(
        // Generate a range [min, max] and a value within it
        fc.integer({ min: -10000, max: 10000 }),
        fc.integer({ min: 0, max: 10000 }),
        fc.double({ min: 0, max: 1, noNaN: true, noDefaultInfinity: true }),
        (min: number, rangeSize: number, fraction: number) => {
          const max = min + rangeSize;
          // Generate a value within [min, max]
          const value = min + fraction * rangeSize;

          const result = validateRange(value, min, max);
          expect(result.valid).toBe(true);
          expect(result.error).toBeUndefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('boundary values (exactly min and exactly max) SHALL be accepted', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -10000, max: 10000 }),
        fc.integer({ min: 0, max: 10000 }),
        fc.boolean(),
        (min: number, rangeSize: number, testMin: boolean) => {
          const max = min + rangeSize;
          const value = testMin ? min : max;

          const result = validateRange(value, min, max);
          expect(result.valid).toBe(true);
          expect(result.error).toBeUndefined();
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Feature: online-tools-hub, Property 10: Text Input Length Validation', () => {
  const MAX_LENGTH = 100000;

  it('for any text input with length ≤ 100,000 characters, the tool SHALL accept it', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 1000 }),
        (input: string) => {
          // Input is guaranteed to be ≤ 1000 chars which is ≤ 100,000
          const result = validateTextLength(input, MAX_LENGTH);
          expect(result.valid).toBe(true);
          expect(result.error).toBeUndefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('for any text input with length exceeding 100,000 characters, the tool SHALL reject it', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 1000 }),
        (extraChars: number) => {
          // Create a string that exceeds the max length
          const input = 'a'.repeat(MAX_LENGTH + extraChars);
          const result = validateTextLength(input, MAX_LENGTH);
          expect(result.valid).toBe(false);
          expect(result.error).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('text input of exactly 100,000 characters SHALL be accepted', () => {
    const input = 'x'.repeat(MAX_LENGTH);
    const result = validateTextLength(input, MAX_LENGTH);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('text input of exactly 100,001 characters SHALL be rejected', () => {
    const input = 'x'.repeat(MAX_LENGTH + 1);
    const result = validateTextLength(input, MAX_LENGTH);
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });
});
