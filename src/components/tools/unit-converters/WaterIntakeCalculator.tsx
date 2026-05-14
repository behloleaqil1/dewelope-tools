'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WaterIntakeCalculator - Calculate recommended daily water intake.
 */
export default function WaterIntakeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [activity, setActivity] = useState('moderate');
  const [climate, setClimate] = useState('temperate');

  const calculate = (): string => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) return '';

    const kg = weightUnit === 'lbs' ? w * 0.453592 : w;

    // Base: 30-35ml per kg body weight
    let baseML = kg * 33;

    // Activity multiplier
    const activityMultipliers: Record<string, number> = {
      sedentary: 0.85,
      light: 0.95,
      moderate: 1.0,
      active: 1.15,
      very_active: 1.3,
    };
    baseML *= activityMultipliers[activity] || 1;

    // Climate adjustment
    const climateMultipliers: Record<string, number> = {
      cold: 0.9,
      temperate: 1.0,
      hot: 1.2,
      very_hot: 1.4,
    };
    baseML *= climateMultipliers[climate] || 1;

    const liters = baseML / 1000;
    const cups = baseML / 236.588;
    const oz = baseML / 29.574;
    const glasses = Math.ceil(baseML / 250); // 250ml glasses

    return `Recommended Daily Water Intake:\n\n${liters.toFixed(2)} liters\n${baseML.toFixed(0)} ml\n${cups.toFixed(1)} cups\n${oz.toFixed(1)} fl oz\n\n≈ ${glasses} glasses (250ml each)\n\nTip: Drink ${Math.ceil(glasses / 16 * 2)} glasses every 2 hours during waking hours.\n\nBased on: ${kg.toFixed(1)} kg, ${activity} activity, ${climate} climate`;
  };

  const result = calculate();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${toolId}-weight`} className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
          <input id={`${toolId}-weight`} type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70" aria-label={`Weight for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor={`${toolId}-wu`} className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
          <select id={`${toolId}-wu`} value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)} aria-label={`Weight unit for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm">
            <option value="kg">kg</option>
            <option value="lbs">lbs</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor={`${toolId}-activity`} className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
        <select id={`${toolId}-activity`} value={activity} onChange={(e) => setActivity(e.target.value)} aria-label={`Activity level for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="sedentary">Sedentary</option>
          <option value="light">Light Exercise</option>
          <option value="moderate">Moderate Exercise</option>
          <option value="active">Active</option>
          <option value="very_active">Very Active</option>
        </select>
      </div>
      <div>
        <label htmlFor={`${toolId}-climate`} className="block text-sm font-medium text-gray-700 mb-1">Climate</label>
        <select id={`${toolId}-climate`} value={climate} onChange={(e) => setClimate(e.target.value)} aria-label={`Climate for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="cold">Cold</option>
          <option value="temperate">Temperate</option>
          <option value="hot">Hot</option>
          <option value="very_hot">Very Hot</option>
        </select>
      </div>
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 bg-gray-50 p-3 rounded-lg">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
