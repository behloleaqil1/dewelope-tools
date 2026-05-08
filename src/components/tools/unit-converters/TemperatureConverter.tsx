'use client';

import { ToolEngineProps } from '@/types';
import { temperatureUnits } from '@/lib/converters';
import UnitConverter from './UnitConverter';

/**
 * TemperatureConverter - Wrapper component that passes temperature unit data
 * to the shared UnitConverter component.
 * Requirements: 3.1
 */
export default function TemperatureConverter({ toolId: _toolId, toolName: _toolName }: ToolEngineProps) {
  return <UnitConverter unitCategory={temperatureUnits} />;
}
