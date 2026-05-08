'use client';

import { ToolEngineProps } from '@/types';
import { dataStorageUnits } from '@/lib/converters';
import UnitConverter from './UnitConverter';

/**
 * DataStorageConverter - Wrapper component that passes data storage unit data
 * to the shared UnitConverter component.
 * Requirements: 3.1
 */
export default function DataStorageConverter({ toolId: _toolId, toolName: _toolName }: ToolEngineProps) {
  return <UnitConverter unitCategory={dataStorageUnits} />;
}
