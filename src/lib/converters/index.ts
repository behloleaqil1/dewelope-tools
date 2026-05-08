/**
 * Unit converters module - exports all unit categories and core conversion utilities.
 */
export { convert, formatResult, swap } from './units';
export type { Unit, UnitCategory, ConverterState } from './units';

export { temperatureUnits } from './temperature';
export { lengthUnits } from './length';
export { weightMassUnits } from './weight-mass';
export { speedUnits } from './speed';
export { volumeUnits } from './volume';
export { areaUnits } from './area';
export { dataStorageUnits } from './data-storage';
export { pressureUnits } from './pressure';

import { temperatureUnits } from './temperature';
import { lengthUnits } from './length';
import { weightMassUnits } from './weight-mass';
import { speedUnits } from './speed';
import { volumeUnits } from './volume';
import { areaUnits } from './area';
import { dataStorageUnits } from './data-storage';
import { pressureUnits } from './pressure';
import { UnitCategory } from './units';

/**
 * All unit categories available in the application.
 */
export const allUnitCategories: UnitCategory[] = [
  temperatureUnits,
  lengthUnits,
  weightMassUnits,
  speedUnits,
  volumeUnits,
  areaUnits,
  dataStorageUnits,
  pressureUnits,
];
