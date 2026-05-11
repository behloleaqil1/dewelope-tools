'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ElectricVehicleRange - Calculate EV range based on battery capacity and efficiency.
 */
export default function ElectricVehicleRange({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [batteryCapacity, setBatteryCapacity] = useState('');
  const [efficiency, setEfficiency] = useState('');
  const [chargeLevel, setChargeLevel] = useState('100');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ range: number; rangeAtCharge: number; costPer100: number } | null>(null);

  function handleCalculate() {
    const newErrors: Record<string, string> = {};
    const battery = parseFloat(batteryCapacity);
    const eff = parseFloat(efficiency);
    const charge = parseFloat(chargeLevel);

    if (!batteryCapacity.trim() || isNaN(battery) || battery <= 0) {
      newErrors.battery = 'Enter a valid battery capacity in kWh';
    }
    if (!efficiency.trim() || isNaN(eff) || eff <= 0) {
      newErrors.efficiency = 'Enter a valid efficiency in Wh/km or Wh/mi';
    }
    if (isNaN(charge) || charge < 0 || charge > 100) {
      newErrors.charge = 'Enter a valid charge level (0-100%)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    const fullRange = (battery * 1000) / eff;
    const rangeAtCharge = fullRange * (charge / 100);
    const costPer100 = (eff / 10) * 0.12; // Assuming $0.12/kWh average

    setResult({ range: fullRange, rangeAtCharge, costPer100 });
  }

  const copyText = result
    ? `Full Range: ${result.range.toFixed(1)} km\nRange at ${chargeLevel}%: ${result.rangeAtCharge.toFixed(1)} km\nEstimated cost per 100 km: $${result.costPer100.toFixed(2)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={errors.battery}>
          <label htmlFor={`${toolId}-battery`} className="block text-sm font-medium text-gray-700 mb-1">
            Battery Capacity (kWh)
          </label>
          <input
            id={`${toolId}-battery`}
            type="text"
            inputMode="decimal"
            value={batteryCapacity}
            onChange={(e) => { setBatteryCapacity(e.target.value); if (errors.battery) setErrors((prev) => ({ ...prev, battery: '' })); }}
            placeholder="e.g. 75"
            aria-label={`Battery capacity for ${toolName}`}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
          />
        </InputArea>

        <InputArea error={errors.efficiency}>
          <label htmlFor={`${toolId}-efficiency`} className="block text-sm font-medium text-gray-700 mb-1">
            Energy Consumption (Wh/km)
          </label>
          <input
            id={`${toolId}-efficiency`}
            type="text"
            inputMode="decimal"
            value={efficiency}
            onChange={(e) => { setEfficiency(e.target.value); if (errors.efficiency) setErrors((prev) => ({ ...prev, efficiency: '' })); }}
            placeholder="e.g. 150"
            aria-label={`Efficiency for ${toolName}`}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
          />
        </InputArea>

        <InputArea error={errors.charge}>
          <label htmlFor={`${toolId}-charge`} className="block text-sm font-medium text-gray-700 mb-1">
            Current Charge Level (%)
          </label>
          <input
            id={`${toolId}-charge`}
            type="text"
            inputMode="numeric"
            value={chargeLevel}
            onChange={(e) => { setChargeLevel(e.target.value); if (errors.charge) setErrors((prev) => ({ ...prev, charge: '' })); }}
            placeholder="e.g. 80"
            aria-label={`Charge level for ${toolName}`}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
          />
        </InputArea>
      </div>

      <button
        onClick={handleCalculate}
        aria-label="Calculate EV range"
        className="px-6 py-3 text-sm font-medium rounded-md min-h-[44px] bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Calculate Range
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                <div className="text-2xl font-bold text-green-700">{result.range.toFixed(0)}</div>
                <div className="text-xs text-green-600 mt-1">Full Range (km)</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                <div className="text-2xl font-bold text-blue-700">{result.rangeAtCharge.toFixed(0)}</div>
                <div className="text-xs text-blue-600 mt-1">Range at {chargeLevel}%</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-700">${result.costPer100.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Cost/100km</div>
              </div>
            </div>
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              * Cost estimate based on average electricity rate of $0.12/kWh
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
