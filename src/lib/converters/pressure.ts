/**
 * Pressure unit definitions.
 * Base unit: Pascal (Pa)
 */
import { Unit, UnitCategory } from './units';

const pascal: Unit = {
  id: 'pascal',
  name: 'Pascal',
  symbol: 'Pa',
  toBase: (value) => value,
  fromBase: (value) => value,
};

const kilopascal: Unit = {
  id: 'kilopascal',
  name: 'Kilopascal',
  symbol: 'kPa',
  toBase: (value) => value * 1000,
  fromBase: (value) => value / 1000,
};

const bar: Unit = {
  id: 'bar',
  name: 'Bar',
  symbol: 'bar',
  toBase: (value) => value * 100_000,
  fromBase: (value) => value / 100_000,
};

const atmosphere: Unit = {
  id: 'atmosphere',
  name: 'Atmosphere',
  symbol: 'atm',
  toBase: (value) => value * 101_325,
  fromBase: (value) => value / 101_325,
};

const psi: Unit = {
  id: 'psi',
  name: 'Pounds per Square Inch',
  symbol: 'psi',
  toBase: (value) => value * 6894.757293168,
  fromBase: (value) => value / 6894.757293168,
};

const torr: Unit = {
  id: 'torr',
  name: 'Torr',
  symbol: 'Torr',
  toBase: (value) => value * (101_325 / 760),
  fromBase: (value) => value / (101_325 / 760),
};

const mmHg: Unit = {
  id: 'mmhg',
  name: 'Millimeters of Mercury',
  symbol: 'mmHg',
  toBase: (value) => value * 133.322387415,
  fromBase: (value) => value / 133.322387415,
};

const megapascal: Unit = {
  id: 'megapascal',
  name: 'Megapascal',
  symbol: 'MPa',
  toBase: (value) => value * 1_000_000,
  fromBase: (value) => value / 1_000_000,
};

export const pressureUnits: UnitCategory = {
  id: 'pressure',
  name: 'Pressure',
  units: [pascal, kilopascal, megapascal, bar, atmosphere, psi, torr, mmHg],
};
