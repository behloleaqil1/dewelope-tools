/**
 * Length unit definitions.
 * Base unit: Meter
 */
import { Unit, UnitCategory } from './units';

const meter: Unit = {
  id: 'meter',
  name: 'Meter',
  symbol: 'm',
  toBase: (value) => value,
  fromBase: (value) => value,
};

const kilometer: Unit = {
  id: 'kilometer',
  name: 'Kilometer',
  symbol: 'km',
  toBase: (value) => value * 1000,
  fromBase: (value) => value / 1000,
};

const centimeter: Unit = {
  id: 'centimeter',
  name: 'Centimeter',
  symbol: 'cm',
  toBase: (value) => value / 100,
  fromBase: (value) => value * 100,
};

const millimeter: Unit = {
  id: 'millimeter',
  name: 'Millimeter',
  symbol: 'mm',
  toBase: (value) => value / 1000,
  fromBase: (value) => value * 1000,
};

const mile: Unit = {
  id: 'mile',
  name: 'Mile',
  symbol: 'mi',
  toBase: (value) => value * 1609.344,
  fromBase: (value) => value / 1609.344,
};

const yard: Unit = {
  id: 'yard',
  name: 'Yard',
  symbol: 'yd',
  toBase: (value) => value * 0.9144,
  fromBase: (value) => value / 0.9144,
};

const foot: Unit = {
  id: 'foot',
  name: 'Foot',
  symbol: 'ft',
  toBase: (value) => value * 0.3048,
  fromBase: (value) => value / 0.3048,
};

const inch: Unit = {
  id: 'inch',
  name: 'Inch',
  symbol: 'in',
  toBase: (value) => value * 0.0254,
  fromBase: (value) => value / 0.0254,
};

const nauticalMile: Unit = {
  id: 'nautical-mile',
  name: 'Nautical Mile',
  symbol: 'nmi',
  toBase: (value) => value * 1852,
  fromBase: (value) => value / 1852,
};

const micrometer: Unit = {
  id: 'micrometer',
  name: 'Micrometer',
  symbol: 'μm',
  toBase: (value) => value / 1_000_000,
  fromBase: (value) => value * 1_000_000,
};

export const lengthUnits: UnitCategory = {
  id: 'length',
  name: 'Length',
  units: [meter, kilometer, centimeter, millimeter, mile, yard, foot, inch, nauticalMile, micrometer],
};
