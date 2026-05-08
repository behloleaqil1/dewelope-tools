/**
 * Unit conversion engine for the Online Tools Hub.
 * Provides interfaces, conversion logic, swap functionality, and result formatting.
 */

/**
 * Represents a single unit of measurement with conversion functions
 * to and from a base unit within its category.
 */
export interface Unit {
  id: string;
  name: string;
  symbol: string;
  /** Convert a value in this unit to the base unit */
  toBase: (value: number) => number;
  /** Convert a value from the base unit to this unit */
  fromBase: (value: number) => number;
}

/**
 * Represents a category of units (e.g., temperature, length)
 */
export interface UnitCategory {
  id: string;
  name: string;
  units: Unit[];
}

/**
 * Represents the state of a unit converter
 */
export interface ConverterState {
  value: number;
  fromUnit: Unit;
  toUnit: Unit;
}

/**
 * Converts a numeric value from one unit to another using the base unit
 * as an intermediate representation.
 *
 * @param value - The numeric value to convert
 * @param from - The source unit
 * @param to - The target unit
 * @returns The converted numeric value
 */
export function convert(value: number, from: Unit, to: Unit): number {
  return to.fromBase(from.toBase(value));
}

/**
 * Formats a conversion result to a maximum of 6 decimal places,
 * removing trailing zeros.
 *
 * @param value - The numeric result to format
 * @returns A string representation with at most 6 decimal places and no trailing zeros
 */
export function formatResult(value: number): string {
  if (!isFinite(value)) {
    return String(value);
  }

  // Round to 6 decimal places
  const rounded = parseFloat(value.toFixed(6));
  return String(rounded);
}

/**
 * Swaps the source and target units in a converter state,
 * keeping the same input value.
 *
 * @param state - The current converter state
 * @returns A new state with source and target units exchanged
 */
export function swap(state: ConverterState): ConverterState {
  return {
    value: state.value,
    fromUnit: state.toUnit,
    toUnit: state.fromUnit,
  };
}
