/**
 * Temperature unit definitions.
 * Base unit: Celsius
 */
import { Unit, UnitCategory } from './units';

const celsius: Unit = {
  id: 'celsius',
  name: 'Celsius',
  symbol: '°C',
  toBase: (value) => value,
  fromBase: (value) => value,
};

const fahrenheit: Unit = {
  id: 'fahrenheit',
  name: 'Fahrenheit',
  symbol: '°F',
  toBase: (value) => (value - 32) * (5 / 9),
  fromBase: (value) => value * (9 / 5) + 32,
};

const kelvin: Unit = {
  id: 'kelvin',
  name: 'Kelvin',
  symbol: 'K',
  toBase: (value) => value - 273.15,
  fromBase: (value) => value + 273.15,
};

const rankine: Unit = {
  id: 'rankine',
  name: 'Rankine',
  symbol: '°R',
  toBase: (value) => (value - 491.67) * (5 / 9),
  fromBase: (value) => value * (9 / 5) + 491.67,
};

export const temperatureUnits: UnitCategory = {
  id: 'temperature',
  name: 'Temperature',
  units: [celsius, fahrenheit, kelvin, rankine],
};
