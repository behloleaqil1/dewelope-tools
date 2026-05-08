'use client';

import { ToolEngineProps } from '@/types';
import { speedUnits } from '@/lib/converters';
import UnitConverter from './UnitConverter';

/**
 * SpeedConverter - Wrapper component that passes speed unit data
 * to the shared UnitConverter component.
 * Requirements: 3.1
 */
export default function SpeedConverter({ toolId: _toolId, toolName: _toolName }: ToolEngineProps) {
  return <UnitConverter unitCategory={speedUnits} />;
}
