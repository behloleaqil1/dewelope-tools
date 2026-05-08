'use client';

import { ToolEngineProps } from '@/types';
import { pressureUnits } from '@/lib/converters';
import UnitConverter from './UnitConverter';

/**
 * PressureConverter - Wrapper component that passes pressure unit data
 * to the shared UnitConverter component.
 * Requirements: 3.1
 */
export default function PressureConverter({ toolId: _toolId, toolName: _toolName }: ToolEngineProps) {
  return <UnitConverter unitCategory={pressureUnits} />;
}
