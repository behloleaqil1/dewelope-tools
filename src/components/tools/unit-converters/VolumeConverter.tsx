'use client';

import { ToolEngineProps } from '@/types';
import { volumeUnits } from '@/lib/converters';
import UnitConverter from './UnitConverter';

/**
 * VolumeConverter - Wrapper component that passes volume unit data
 * to the shared UnitConverter component.
 * Requirements: 3.1
 */
export default function VolumeConverter({ toolId: _toolId, toolName: _toolName }: ToolEngineProps) {
  return <UnitConverter unitCategory={volumeUnits} />;
}
