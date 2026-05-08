/**
 * Volume unit definitions.
 * Base unit: Liter
 */
import { Unit, UnitCategory } from './units';

const liter: Unit = {
  id: 'liter',
  name: 'Liter',
  symbol: 'L',
  toBase: (value) => value,
  fromBase: (value) => value,
};

const milliliter: Unit = {
  id: 'milliliter',
  name: 'Milliliter',
  symbol: 'mL',
  toBase: (value) => value / 1000,
  fromBase: (value) => value * 1000,
};

const cubicMeter: Unit = {
  id: 'cubic-meter',
  name: 'Cubic Meter',
  symbol: 'm³',
  toBase: (value) => value * 1000,
  fromBase: (value) => value / 1000,
};

const usGallon: Unit = {
  id: 'us-gallon',
  name: 'US Gallon',
  symbol: 'gal',
  toBase: (value) => value * 3.785411784,
  fromBase: (value) => value / 3.785411784,
};

const usQuart: Unit = {
  id: 'us-quart',
  name: 'US Quart',
  symbol: 'qt',
  toBase: (value) => value * 0.946352946,
  fromBase: (value) => value / 0.946352946,
};

const usPint: Unit = {
  id: 'us-pint',
  name: 'US Pint',
  symbol: 'pt',
  toBase: (value) => value * 0.473176473,
  fromBase: (value) => value / 0.473176473,
};

const usCup: Unit = {
  id: 'us-cup',
  name: 'US Cup',
  symbol: 'cup',
  toBase: (value) => value * 0.2365882365,
  fromBase: (value) => value / 0.2365882365,
};

const usFluidOunce: Unit = {
  id: 'us-fluid-ounce',
  name: 'US Fluid Ounce',
  symbol: 'fl oz',
  toBase: (value) => value * 0.0295735295625,
  fromBase: (value) => value / 0.0295735295625,
};

const imperialGallon: Unit = {
  id: 'imperial-gallon',
  name: 'Imperial Gallon',
  symbol: 'imp gal',
  toBase: (value) => value * 4.54609,
  fromBase: (value) => value / 4.54609,
};

const cubicFoot: Unit = {
  id: 'cubic-foot',
  name: 'Cubic Foot',
  symbol: 'ft³',
  toBase: (value) => value * 28.316846592,
  fromBase: (value) => value / 28.316846592,
};

export const volumeUnits: UnitCategory = {
  id: 'volume',
  name: 'Volume',
  units: [liter, milliliter, cubicMeter, usGallon, usQuart, usPint, usCup, usFluidOunce, imperialGallon, cubicFoot],
};
