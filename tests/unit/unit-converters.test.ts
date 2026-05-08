import { describe, it, expect } from 'vitest';
import {
  convert,
  formatResult,
  swap,
  temperatureUnits,
  lengthUnits,
  weightMassUnits,
  speedUnits,
  volumeUnits,
  areaUnits,
  dataStorageUnits,
  pressureUnits,
  allUnitCategories,
} from '@/lib/converters';
import type { ConverterState } from '@/lib/converters';

describe('Unit Conversion Engine', () => {
  describe('convert()', () => {
    it('converts Celsius to Fahrenheit correctly', () => {
      const celsius = temperatureUnits.units.find(u => u.id === 'celsius')!;
      const fahrenheit = temperatureUnits.units.find(u => u.id === 'fahrenheit')!;
      expect(convert(0, celsius, fahrenheit)).toBeCloseTo(32, 6);
      expect(convert(100, celsius, fahrenheit)).toBeCloseTo(212, 6);
      expect(convert(-40, celsius, fahrenheit)).toBeCloseTo(-40, 6);
    });

    it('converts Celsius to Kelvin correctly', () => {
      const celsius = temperatureUnits.units.find(u => u.id === 'celsius')!;
      const kelvin = temperatureUnits.units.find(u => u.id === 'kelvin')!;
      expect(convert(0, celsius, kelvin)).toBeCloseTo(273.15, 6);
      expect(convert(100, celsius, kelvin)).toBeCloseTo(373.15, 6);
    });

    it('converts meters to feet correctly', () => {
      const meter = lengthUnits.units.find(u => u.id === 'meter')!;
      const foot = lengthUnits.units.find(u => u.id === 'foot')!;
      expect(convert(1, meter, foot)).toBeCloseTo(3.28084, 4);
    });

    it('converts kilometers to miles correctly', () => {
      const km = lengthUnits.units.find(u => u.id === 'kilometer')!;
      const mile = lengthUnits.units.find(u => u.id === 'mile')!;
      expect(convert(1, km, mile)).toBeCloseTo(0.621371, 4);
    });

    it('converts kilograms to pounds correctly', () => {
      const kg = weightMassUnits.units.find(u => u.id === 'kilogram')!;
      const lb = weightMassUnits.units.find(u => u.id === 'pound')!;
      expect(convert(1, kg, lb)).toBeCloseTo(2.20462, 4);
    });

    it('converts km/h to mph correctly', () => {
      const kmh = speedUnits.units.find(u => u.id === 'kilometers-per-hour')!;
      const mph = speedUnits.units.find(u => u.id === 'miles-per-hour')!;
      expect(convert(100, kmh, mph)).toBeCloseTo(62.1371, 3);
    });

    it('converts liters to US gallons correctly', () => {
      const liter = volumeUnits.units.find(u => u.id === 'liter')!;
      const gallon = volumeUnits.units.find(u => u.id === 'us-gallon')!;
      expect(convert(1, liter, gallon)).toBeCloseTo(0.264172, 4);
    });

    it('converts hectares to acres correctly', () => {
      const hectare = areaUnits.units.find(u => u.id === 'hectare')!;
      const acre = areaUnits.units.find(u => u.id === 'acre')!;
      expect(convert(1, hectare, acre)).toBeCloseTo(2.47105, 4);
    });

    it('converts megabytes to gigabytes correctly', () => {
      const mb = dataStorageUnits.units.find(u => u.id === 'megabyte')!;
      const gb = dataStorageUnits.units.find(u => u.id === 'gigabyte')!;
      expect(convert(1024, mb, gb)).toBeCloseTo(1.024, 6);
    });

    it('converts atmospheres to psi correctly', () => {
      const atm = pressureUnits.units.find(u => u.id === 'atmosphere')!;
      const psiUnit = pressureUnits.units.find(u => u.id === 'psi')!;
      expect(convert(1, atm, psiUnit)).toBeCloseTo(14.696, 2);
    });

    it('handles zero value', () => {
      const meter = lengthUnits.units.find(u => u.id === 'meter')!;
      const foot = lengthUnits.units.find(u => u.id === 'foot')!;
      expect(convert(0, meter, foot)).toBe(0);
    });

    it('handles negative values', () => {
      const celsius = temperatureUnits.units.find(u => u.id === 'celsius')!;
      const fahrenheit = temperatureUnits.units.find(u => u.id === 'fahrenheit')!;
      expect(convert(-40, celsius, fahrenheit)).toBeCloseTo(-40, 6);
    });

    it('converts same unit to itself (identity)', () => {
      const meter = lengthUnits.units.find(u => u.id === 'meter')!;
      expect(convert(42, meter, meter)).toBeCloseTo(42, 6);
    });
  });

  describe('formatResult()', () => {
    it('formats integers without trailing zeros', () => {
      expect(formatResult(42)).toBe('42');
    });

    it('formats decimals with up to 6 places', () => {
      expect(formatResult(3.14159265)).toBe('3.141593');
    });

    it('removes trailing zeros', () => {
      expect(formatResult(1.5)).toBe('1.5');
      expect(formatResult(2.0)).toBe('2');
    });

    it('handles zero', () => {
      expect(formatResult(0)).toBe('0');
    });

    it('handles negative numbers', () => {
      expect(formatResult(-3.14)).toBe('-3.14');
    });

    it('handles very small numbers', () => {
      const result = formatResult(0.000001);
      expect(result).toBe('0.000001');
    });

    it('rounds numbers beyond 6 decimal places', () => {
      expect(formatResult(1.1234567)).toBe('1.123457');
    });

    it('handles Infinity', () => {
      expect(formatResult(Infinity)).toBe('Infinity');
    });

    it('handles NaN', () => {
      expect(formatResult(NaN)).toBe('NaN');
    });
  });

  describe('swap()', () => {
    it('exchanges source and target units', () => {
      const meter = lengthUnits.units.find(u => u.id === 'meter')!;
      const foot = lengthUnits.units.find(u => u.id === 'foot')!;

      const state: ConverterState = { value: 10, fromUnit: meter, toUnit: foot };
      const swapped = swap(state);

      expect(swapped.fromUnit.id).toBe('foot');
      expect(swapped.toUnit.id).toBe('meter');
      expect(swapped.value).toBe(10);
    });

    it('double swap returns to original state', () => {
      const celsius = temperatureUnits.units.find(u => u.id === 'celsius')!;
      const kelvin = temperatureUnits.units.find(u => u.id === 'kelvin')!;

      const state: ConverterState = { value: 25, fromUnit: celsius, toUnit: kelvin };
      const doubleSwapped = swap(swap(state));

      expect(doubleSwapped.fromUnit.id).toBe(state.fromUnit.id);
      expect(doubleSwapped.toUnit.id).toBe(state.toUnit.id);
      expect(doubleSwapped.value).toBe(state.value);
    });
  });

  describe('Unit Categories', () => {
    it('provides all 8 unit categories', () => {
      expect(allUnitCategories).toHaveLength(8);
    });

    it('each category has at least 4 units', () => {
      for (const category of allUnitCategories) {
        expect(category.units.length).toBeGreaterThanOrEqual(4);
      }
    });

    it('each unit has required properties', () => {
      for (const category of allUnitCategories) {
        for (const unit of category.units) {
          expect(unit.id).toBeTruthy();
          expect(unit.name).toBeTruthy();
          expect(unit.symbol).toBeTruthy();
          expect(typeof unit.toBase).toBe('function');
          expect(typeof unit.fromBase).toBe('function');
        }
      }
    });

    it('unit IDs are unique within each category', () => {
      for (const category of allUnitCategories) {
        const ids = category.units.map(u => u.id);
        expect(new Set(ids).size).toBe(ids.length);
      }
    });
  });
});
