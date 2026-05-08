'use client';

import { ToolEngineProps } from '@/types';
import { areaUnits } from '@/lib/converters';
import UnitConverter from './UnitConverter';

/**
 * AreaConverter - Wrapper component that passes area unit data
 * to the shared UnitConverter component.
 * Requirements: 3.1
 */
export default function AreaConverter({ toolId: _toolId, toolName: _toolName }: ToolEngineProps) {
  return <UnitConverter unitCategory={areaUnits} />;
}
