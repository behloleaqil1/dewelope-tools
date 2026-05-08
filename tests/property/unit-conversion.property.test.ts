import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  convert,
  formatResult,
  swap,
  allUnitCategories,
} from '@/lib/converters';
import type { Unit, UnitCategory, ConverterState } from '@/lib/converters';

/**
 * Property-based tests for unit conversion.
 *
 * Validates: Requirements 3.2, 3.3, 3.6
 */

/**
 * Helper: creates an arbitrary that picks a random unit category
 * and two distinct units from it, along with a numeric value.
 */
function unitPairWithValueArb() {
  return fc
    .integer({ min: 0, max: allUnitCategories.length - 1 })
    .chain((categoryIndex) => {
      const category = allUnitCategories[categoryIndex];
      const unitCount = category.units.length;
      return fc.tuple(
        fc.constant(category),
        fc.integer({ min: 0, max: unitCount - 1 }),
        fc.integer({ min: 0, max: unitCount - 1 }),
        // Use a reasonable range to avoid floating-point extremes
        fc.double({ min: -1e6, max: 1e6, noNaN: true, noDefaultInfinity: true })
      );
    })
    .map(([category, fromIdx, toIdx, value]) => ({
      category,
      fromUnit: category.units[fromIdx],
      toUnit: category.units[toIdx],
      value,
    }));
}

/**
 * Helper: creates an arbitrary for a converter state (value, fromUnit, toUnit).
 */
function converterStateArb() {
  return fc
    .integer({ min: 0, max: allUnitCategories.length - 1 })
    .chain((categoryIndex) => {
      const category = allUnitCategories[categoryIndex];
      const unitCount = category.units.length;
      return fc.tuple(
        fc.integer({ min: 0, max: unitCount - 1 }),
        fc.integer({ min: 0, max: unitCount - 1 }),
        fc.double({ min: -1e6, max: 1e6, noNaN: true, noDefaultInfinity: true })
      ).map(([fromIdx, toIdx, value]) => ({
        value,
        fromUnit: category.units[fromIdx],
        toUnit: category.units[toIdx],
      } as ConverterState));
    });
}

describe('Feature: online-tools-hub, Property 5: Unit Conversion Round-Trip', () => {
  it('for any numeric value and any pair of units within the same category, converting A→B→A SHALL produce the original value (within tolerance 1e-9)', () => {
    /**
     * Validates: Requirements 3.2
     */
    fc.assert(
      fc.property(
        unitPairWithValueArb(),
        ({ fromUnit, toUnit, value }) => {
          const converted = convert(value, fromUnit, toUnit);
          const roundTrip = convert(converted, toUnit, fromUnit);

          // Check within floating-point tolerance of 1e-9
          const diff = Math.abs(roundTrip - value);
          const tolerance = Math.max(1e-9, Math.abs(value) * 1e-9);
          expect(diff).toBeLessThanOrEqual(tolerance);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('converting a unit to itself SHALL return the original value', () => {
    /**
     * Validates: Requirements 3.2
     */
    fc.assert(
      fc.property(
        fc
          .integer({ min: 0, max: allUnitCategories.length - 1 })
          .chain((catIdx) => {
            const category = allUnitCategories[catIdx];
            return fc.tuple(
              fc.integer({ min: 0, max: category.units.length - 1 }).map(
                (unitIdx) => category.units[unitIdx]
              ),
              fc.double({ min: -1e6, max: 1e6, noNaN: true, noDefaultInfinity: true })
            );
          }),
        ([unit, value]) => {
          const result = convert(value, unit, unit);
          const diff = Math.abs(result - value);
          const tolerance = Math.max(1e-9, Math.abs(value) * 1e-9);
          expect(diff).toBeLessThanOrEqual(tolerance);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Feature: online-tools-hub, Property 6: Swap Involution', () => {
  it('for any converter state, applying swap twice SHALL return the state to its original configuration', () => {
    /**
     * Validates: Requirements 3.3
     */
    fc.assert(
      fc.property(
        converterStateArb(),
        (state) => {
          const doubleSwapped = swap(swap(state));

          expect(doubleSwapped.value).toBe(state.value);
          expect(doubleSwapped.fromUnit.id).toBe(state.fromUnit.id);
          expect(doubleSwapped.toUnit.id).toBe(state.toUnit.id);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('a single swap SHALL exchange fromUnit and toUnit while preserving value', () => {
    /**
     * Validates: Requirements 3.3
     */
    fc.assert(
      fc.property(
        converterStateArb(),
        (state) => {
          const swapped = swap(state);

          expect(swapped.value).toBe(state.value);
          expect(swapped.fromUnit.id).toBe(state.toUnit.id);
          expect(swapped.toUnit.id).toBe(state.fromUnit.id);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Feature: online-tools-hub, Property 8: Conversion Result Decimal Precision', () => {
  it('for any unit conversion result, the formatted output SHALL contain at most 6 digits after the decimal point', () => {
    /**
     * Validates: Requirements 3.6
     */
    fc.assert(
      fc.property(
        unitPairWithValueArb(),
        ({ fromUnit, toUnit, value }) => {
          const converted = convert(value, fromUnit, toUnit);
          const formatted = formatResult(converted);

          // Check decimal precision
          const decimalIndex = formatted.indexOf('.');
          if (decimalIndex !== -1) {
            const decimalPart = formatted.slice(decimalIndex + 1);
            expect(decimalPart.length).toBeLessThanOrEqual(6);
          }
          // If no decimal point, the property trivially holds
        }
      ),
      { numRuns: 100 }
    );
  });

  it('for any arbitrary numeric value, formatResult SHALL produce at most 6 decimal digits', () => {
    /**
     * Validates: Requirements 3.6
     */
    fc.assert(
      fc.property(
        fc.double({ min: -1e12, max: 1e12, noNaN: true, noDefaultInfinity: true }),
        (value) => {
          const formatted = formatResult(value);

          const decimalIndex = formatted.indexOf('.');
          if (decimalIndex !== -1) {
            const decimalPart = formatted.slice(decimalIndex + 1);
            expect(decimalPart.length).toBeLessThanOrEqual(6);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
