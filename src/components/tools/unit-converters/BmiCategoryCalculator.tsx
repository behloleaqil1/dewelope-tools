'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BmiCategoryCalculator - Calculate BMI and determine weight category.
 */
export default function BmiCategoryCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [heightUnit, setHeightUnit] = useState('cm');

  const calculate = (): string => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return '';

    // Convert to kg and meters
    const kg = weightUnit === 'lbs' ? w * 0.453592 : w;
    let meters: number;
    if (heightUnit === 'cm') meters = h / 100;
    else if (heightUnit === 'inches') meters = h * 0.0254;
    else meters = h;

    const bmi = kg / (meters * meters);

    let category: string;
    let color: string;
    if (bmi < 18.5) { category = 'Underweight'; color = '🔵'; }
    else if (bmi < 25) { category = 'Normal weight'; color = '🟢'; }
    else if (bmi < 30) { category = 'Overweight'; color = '🟡'; }
    else if (bmi < 35) { category = 'Obese (Class I)'; color = '🟠'; }
    else if (bmi < 40) { category = 'Obese (Class II)'; color = '🔴'; }
    else { category = 'Obese (Class III)'; color = '🔴'; }

    const healthyMin = (18.5 * meters * meters).toFixed(1);
    const healthyMax = (24.9 * meters * meters).toFixed(1);

    return `BMI: ${bmi.toFixed(1)}\nCategory: ${color} ${category}\n\nHealthy weight range: ${healthyMin} - ${healthyMax} kg\nYour weight: ${kg.toFixed(1)} kg\nYour height: ${meters.toFixed(2)} m`;
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">Height</label>
          <input id={`${toolId}-height`} type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="175" aria-label={`Height for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor={`${toolId}-hu`} className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
          <select id={`${toolId}-hu`} value={heightUnit} onChange={(e) => setHeightUnit(e.target.value)} aria-label={`Height unit for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm">
            <option value="cm">cm</option>
            <option value="inches">inches</option>
            <option value="meters">meters</option>
          </select>
        </div>
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
