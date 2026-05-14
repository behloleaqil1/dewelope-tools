'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MacroNutrientRatioCalculator - Calculate grams per macronutrient from calorie target and ratio.
 */
export default function MacroNutrientRatioCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [calories, setCalories] = useState('2000');
  const [proteinPct, setProteinPct] = useState('30');
  const [carbsPct, setCarbsPct] = useState('40');
  const [fatPct, setFatPct] = useState('30');

  const calculate = (): string => {
    const cal = parseFloat(calories);
    const p = parseFloat(proteinPct);
    const c = parseFloat(carbsPct);
    const f = parseFloat(fatPct);
    if (isNaN(cal) || cal <= 0) return '';

    const total = p + c + f;
    const proteinCal = cal * (p / 100);
    const carbsCal = cal * (c / 100);
    const fatCal = cal * (f / 100);

    // 1g protein = 4 cal, 1g carbs = 4 cal, 1g fat = 9 cal
    const proteinG = proteinCal / 4;
    const carbsG = carbsCal / 4;
    const fatG = fatCal / 9;

    const warning = Math.abs(total - 100) > 0.1 ? `\n⚠️ Ratios sum to ${total}%, not 100%` : '';

    return `Daily Target: ${cal} calories\nRatio: ${p}% / ${c}% / ${f}% (P/C/F)${warning}\n\nProtein: ${proteinG.toFixed(0)}g (${proteinCal.toFixed(0)} cal)\nCarbs: ${carbsG.toFixed(0)}g (${carbsCal.toFixed(0)} cal)\nFat: ${fatG.toFixed(0)}g (${fatCal.toFixed(0)} cal)\n\nPer meal (3 meals):\n  Protein: ${(proteinG / 3).toFixed(0)}g\n  Carbs: ${(carbsG / 3).toFixed(0)}g\n  Fat: ${(fatG / 3).toFixed(0)}g`;
  };

  const result = calculate();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-cal`} className="block text-sm font-medium text-gray-700 mb-1">Daily Calories</label>
        <input id={`${toolId}-cal`} type="number" value={calories} onChange={(e) => setCalories(e.target.value)} placeholder="2000" aria-label={`Calories for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label htmlFor={`${toolId}-protein`} className="block text-sm font-medium text-gray-700 mb-1">Protein %</label>
          <input id={`${toolId}-protein`} type="number" value={proteinPct} onChange={(e) => setProteinPct(e.target.value)} min="0" max="100" aria-label={`Protein percentage for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor={`${toolId}-carbs`} className="block text-sm font-medium text-gray-700 mb-1">Carbs %</label>
          <input id={`${toolId}-carbs`} type="number" value={carbsPct} onChange={(e) => setCarbsPct(e.target.value)} min="0" max="100" aria-label={`Carbs percentage for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor={`${toolId}-fat`} className="block text-sm font-medium text-gray-700 mb-1">Fat %</label>
          <input id={`${toolId}-fat`} type="number" value={fatPct} onChange={(e) => setFatPct(e.target.value)} min="0" max="100" aria-label={`Fat percentage for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => { setProteinPct('30'); setCarbsPct('40'); setFatPct('30'); }} className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">Balanced</button>
        <button onClick={() => { setProteinPct('40'); setCarbsPct('30'); setFatPct('30'); }} className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">High Protein</button>
        <button onClick={() => { setProteinPct('20'); setCarbsPct('5'); setFatPct('75'); }} className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">Keto</button>
        <button onClick={() => { setProteinPct('20'); setCarbsPct('60'); setFatPct('20'); }} className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">High Carb</button>
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
