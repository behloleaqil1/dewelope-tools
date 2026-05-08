/**
 * Data Storage unit definitions.
 * Base unit: Byte
 */
import { Unit, UnitCategory } from './units';

const byte: Unit = {
  id: 'byte',
  name: 'Byte',
  symbol: 'B',
  toBase: (value) => value,
  fromBase: (value) => value,
};

const kilobyte: Unit = {
  id: 'kilobyte',
  name: 'Kilobyte',
  symbol: 'KB',
  toBase: (value) => value * 1000,
  fromBase: (value) => value / 1000,
};

const megabyte: Unit = {
  id: 'megabyte',
  name: 'Megabyte',
  symbol: 'MB',
  toBase: (value) => value * 1_000_000,
  fromBase: (value) => value / 1_000_000,
};

const gigabyte: Unit = {
  id: 'gigabyte',
  name: 'Gigabyte',
  symbol: 'GB',
  toBase: (value) => value * 1_000_000_000,
  fromBase: (value) => value / 1_000_000_000,
};

const terabyte: Unit = {
  id: 'terabyte',
  name: 'Terabyte',
  symbol: 'TB',
  toBase: (value) => value * 1_000_000_000_000,
  fromBase: (value) => value / 1_000_000_000_000,
};

const kibibyte: Unit = {
  id: 'kibibyte',
  name: 'Kibibyte',
  symbol: 'KiB',
  toBase: (value) => value * 1024,
  fromBase: (value) => value / 1024,
};

const mebibyte: Unit = {
  id: 'mebibyte',
  name: 'Mebibyte',
  symbol: 'MiB',
  toBase: (value) => value * 1_048_576,
  fromBase: (value) => value / 1_048_576,
};

const gibibyte: Unit = {
  id: 'gibibyte',
  name: 'Gibibyte',
  symbol: 'GiB',
  toBase: (value) => value * 1_073_741_824,
  fromBase: (value) => value / 1_073_741_824,
};

const tebibyte: Unit = {
  id: 'tebibyte',
  name: 'Tebibyte',
  symbol: 'TiB',
  toBase: (value) => value * 1_099_511_627_776,
  fromBase: (value) => value / 1_099_511_627_776,
};

const bit: Unit = {
  id: 'bit',
  name: 'Bit',
  symbol: 'b',
  toBase: (value) => value / 8,
  fromBase: (value) => value * 8,
};

export const dataStorageUnits: UnitCategory = {
  id: 'data-storage',
  name: 'Data Storage',
  units: [byte, kilobyte, megabyte, gigabyte, terabyte, kibibyte, mebibyte, gibibyte, tebibyte, bit],
};
