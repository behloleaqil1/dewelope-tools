/**
 * Speed unit definitions.
 * Base unit: Meters per second (m/s)
 */
import { Unit, UnitCategory } from './units';

const metersPerSecond: Unit = {
  id: 'meters-per-second',
  name: 'Meters per Second',
  symbol: 'm/s',
  toBase: (value) => value,
  fromBase: (value) => value,
};

const kilometersPerHour: Unit = {
  id: 'kilometers-per-hour',
  name: 'Kilometers per Hour',
  symbol: 'km/h',
  toBase: (value) => value / 3.6,
  fromBase: (value) => value * 3.6,
};

const milesPerHour: Unit = {
  id: 'miles-per-hour',
  name: 'Miles per Hour',
  symbol: 'mph',
  toBase: (value) => value * 0.44704,
  fromBase: (value) => value / 0.44704,
};

const knot: Unit = {
  id: 'knot',
  name: 'Knot',
  symbol: 'kn',
  toBase: (value) => value * (1852 / 3600),
  fromBase: (value) => value / (1852 / 3600),
};

const feetPerSecond: Unit = {
  id: 'feet-per-second',
  name: 'Feet per Second',
  symbol: 'ft/s',
  toBase: (value) => value * 0.3048,
  fromBase: (value) => value / 0.3048,
};

const mach: Unit = {
  id: 'mach',
  name: 'Mach',
  symbol: 'Ma',
  toBase: (value) => value * 343,
  fromBase: (value) => value / 343,
};

export const speedUnits: UnitCategory = {
  id: 'speed',
  name: 'Speed',
  units: [metersPerSecond, kilometersPerHour, milesPerHour, knot, feetPerSecond, mach],
};
