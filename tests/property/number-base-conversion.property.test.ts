import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { convertNumberBase } from '@/lib/calculators/index';

/**
 * Property-based tests for number base conversion.
 *
 * Validates: Requirements 5.6
 */

describe('Feature: online-tools-hub, Property 12: Number Base Conversion Round-Trip', () => {
  // Arbitrary for BigInt in range [0, 2^64 - 1]
  const bigIntInRange = fc.bigInt({
    min: BigInt(0),
    max: BigInt('18446744073709551615'), // 2^64 - 1
  });

  it('for any integer in [0, 2^64 - 1], converting to binary and parsing back to decimal SHALL yield the original integer', () => {
    fc.assert(
      fc.property(bigIntInRange, (num: bigint) => {
        const decimalStr = num.toString(10);
        const result = convertNumberBase(decimalStr, 10);

        // Parse binary back to decimal
        const parsedFromBinary = BigInt('0b' + result.binary);
        expect(parsedFromBinary).toBe(num);
      }),
      { numRuns: 100 }
    );
  });

  it('for any integer in [0, 2^64 - 1], converting to octal and parsing back to decimal SHALL yield the original integer', () => {
    fc.assert(
      fc.property(bigIntInRange, (num: bigint) => {
        const decimalStr = num.toString(10);
        const result = convertNumberBase(decimalStr, 10);

        // Parse octal back to decimal
        const parsedFromOctal = BigInt('0o' + result.octal);
        expect(parsedFromOctal).toBe(num);
      }),
      { numRuns: 100 }
    );
  });

  it('for any integer in [0, 2^64 - 1], converting to hexadecimal and parsing back to decimal SHALL yield the original integer', () => {
    fc.assert(
      fc.property(bigIntInRange, (num: bigint) => {
        const decimalStr = num.toString(10);
        const result = convertNumberBase(decimalStr, 10);

        // Parse hexadecimal back to decimal
        const parsedFromHex = BigInt('0x' + result.hexadecimal);
        expect(parsedFromHex).toBe(num);
      }),
      { numRuns: 100 }
    );
  });

  it('for any integer in [0, 2^64 - 1], the decimal representation in the result SHALL equal the original value', () => {
    fc.assert(
      fc.property(bigIntInRange, (num: bigint) => {
        const decimalStr = num.toString(10);
        const result = convertNumberBase(decimalStr, 10);

        // The decimal field should match the original input
        expect(result.decimal).toBe(decimalStr);
      }),
      { numRuns: 100 }
    );
  });

  it('for any integer in [0, 2^64 - 1], converting from binary base SHALL produce consistent results with decimal input', () => {
    fc.assert(
      fc.property(bigIntInRange, (num: bigint) => {
        const binaryStr = num.toString(2);
        const result = convertNumberBase(binaryStr, 2);

        // All representations should parse back to the original number
        expect(BigInt('0b' + result.binary)).toBe(num);
        expect(BigInt('0o' + result.octal)).toBe(num);
        expect(result.decimal).toBe(num.toString(10));
        expect(BigInt('0x' + result.hexadecimal)).toBe(num);
      }),
      { numRuns: 100 }
    );
  });

  it('for any integer in [0, 2^64 - 1], converting from octal base SHALL produce consistent results with decimal input', () => {
    fc.assert(
      fc.property(bigIntInRange, (num: bigint) => {
        const octalStr = num.toString(8);
        const result = convertNumberBase(octalStr, 8);

        // All representations should parse back to the original number
        expect(BigInt('0b' + result.binary)).toBe(num);
        expect(BigInt('0o' + result.octal)).toBe(num);
        expect(result.decimal).toBe(num.toString(10));
        expect(BigInt('0x' + result.hexadecimal)).toBe(num);
      }),
      { numRuns: 100 }
    );
  });

  it('for any integer in [0, 2^64 - 1], converting from hexadecimal base SHALL produce consistent results with decimal input', () => {
    fc.assert(
      fc.property(bigIntInRange, (num: bigint) => {
        const hexStr = num.toString(16).toUpperCase();
        const result = convertNumberBase(hexStr, 16);

        // All representations should parse back to the original number
        expect(BigInt('0b' + result.binary)).toBe(num);
        expect(BigInt('0o' + result.octal)).toBe(num);
        expect(result.decimal).toBe(num.toString(10));
        expect(BigInt('0x' + result.hexadecimal)).toBe(num);
      }),
      { numRuns: 100 }
    );
  });
});
