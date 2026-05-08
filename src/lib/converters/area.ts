/**
 * Area unit definitions.
 * Base unit: Square Meter
 */
import { Unit, UnitCategory } from './units';

const squareMeter: Unit = {
  id: 'square-meter',
  name: 'Square Meter',
  symbol: 'm²',
  toBase: (value) => value,
  fromBase: (value) => value,
};

const squareKilometer: Unit = {
  id: 'square-kilometer',
  name: 'Square Kilometer',
  symbol: 'km²',
  toBase: (value) => value * 1_000_000,
  fromBase: (value) => value / 1_000_000,
};

const squareCentimeter: Unit = {
  id: 'square-centimeter',
  name: 'Square Centimeter',
  symbol: 'cm²',
  toBase: (value) => value / 10_000,
  fromBase: (value) => value * 10_000,
};

const squareMillimeter: Unit = {
  id: 'square-millimeter',
  name: 'Square Millimeter',
  symbol: 'mm²',
  toBase: (value) => value / 1_000_000,
  fromBase: (value) => value * 1_000_000,
};

const hectare: Unit = {
  id: 'hectare',
  name: 'Hectare',
  symbol: 'ha',
  toBase: (value) => value * 10_000,
  fromBase: (value) => value / 10_000,
};

const acre: Unit = {
  id: 'acre',
  name: 'Acre',
  symbol: 'ac',
  toBase: (value) => value * 4046.8564224,
  fromBase: (value) => value / 4046.8564224,
};

const squareMile: Unit = {
  id: 'square-mile',
  name: 'Square Mile',
  symbol: 'mi²',
  toBase: (value) => value * 2_589_988.110336,
  fromBase: (value) => value / 2_589_988.110336,
};

const squareYard: Unit = {
  id: 'square-yard',
  name: 'Square Yard',
  symbol: 'yd²',
  toBase: (value) => value * 0.83612736,
  fromBase: (value) => value / 0.83612736,
};

const squareFoot: Unit = {
  id: 'square-foot',
  name: 'Square Foot',
  symbol: 'ft²',
  toBase: (value) => value * 0.09290304,
  fromBase: (value) => value / 0.09290304,
};

const squareInch: Unit = {
  id: 'square-inch',
  name: 'Square Inch',
  symbol: 'in²',
  toBase: (value) => value * 0.00064516,
  fromBase: (value) => value / 0.00064516,
};

export const areaUnits: UnitCategory = {
  id: 'area',
  name: 'Area',
  units: [squareMeter, squareKilometer, squareCentimeter, squareMillimeter, hectare, acre, squareMile, squareYard, squareFoot, squareInch],
};
