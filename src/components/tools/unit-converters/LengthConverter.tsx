'use client';

import { ToolEngineProps } from '@/types';
import { lengthUnits } from '@/lib/converters';
import UnitConverter from './UnitConverter';

/**
 * LengthConverter - Wrapper component that passes length unit data
 * to the shared UnitConverter component.
 * Requirements: 3.1
 */
export default function LengthConverter({ toolId: _toolId, toolName: _toolName }: ToolEngineProps) {
  return <UnitConverter unitCategory={lengthUnits} />;
}
