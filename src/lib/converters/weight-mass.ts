/**
 * Weight and Mass unit definitions.
 * Base unit: Kilogram
 */
import { Unit, UnitCategory } from './units';

const kilogram: Unit = {
  id: 'kilogram',
  name: 'Kilogram',
  symbol: 'kg',
  toBase: (value) => value,
  fromBase: (value) => value,
};

const gram: Unit = {
  id: 'gram',
  name: 'Gram',
  symbol: 'g',
  toBase: (value) => value / 1000,
  fromBase: (value) => value * 1000,
};

const milligram: Unit = {
  id: 'milligram',
  name: 'Milligram',
  symbol: 'mg',
  toBase: (value) => value / 1_000_000,
  fromBase: (value) => value * 1_000_000,
};

const metricTon: Unit = {
  id: 'metric-ton',
  name: 'Metric Ton',
  symbol: 't',
  toBase: (value) => value * 1000,
  fromBase: (value) => value / 1000,
};

const pound: Unit = {
  id: 'pound',
  name: 'Pound',
  symbol: 'lb',
  toBase: (value) => value * 0.45359237,
  fromBase: (value) => value / 0.45359237,
};

const ounce: Unit = {
  id: 'ounce',
  name: 'Ounce',
  symbol: 'oz',
  toBase: (value) => value * 0.028349523125,
  fromBase: (value) => value / 0.028349523125,
};

const stone: Unit = {
  id: 'stone',
  name: 'Stone',
  symbol: 'st',
  toBase: (value) => value * 6.35029318,
  fromBase: (value) => value / 6.35029318,
};

const usTon: Unit = {
  id: 'us-ton',
  name: 'US Ton',
  symbol: 'ton',
  toBase: (value) => value * 907.18474,
  fromBase: (value) => value / 907.18474,
};

export const weightMassUnits: UnitCategory = {
  id: 'weight-mass',
  name: 'Weight and Mass',
  units: [kilogram, gram, milligram, metricTon, pound, ounce, stone, usTon],
};
