'use client';

import { ToolEngineProps } from '@/types';
import { weightMassUnits } from '@/lib/converters';
import UnitConverter from './UnitConverter';

/**
 * WeightMassConverter - Wrapper component that passes weight/mass unit data
 * to the shared UnitConverter component.
 * Requirements: 3.1
 */
export default function WeightMassConverter({ toolId: _toolId, toolName: _toolName }: ToolEngineProps) {
  return <UnitConverter unitCategory={weightMassUnits} />;
}
