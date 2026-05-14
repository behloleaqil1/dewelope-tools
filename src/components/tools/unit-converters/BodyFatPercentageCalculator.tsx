'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BodyFatPercentageCalculator - Estimate body fat percentage using US Navy method.
 */
export default function BodyFatPercentageCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [gender, setGender] = useState('male');
  const [waist, setWaist] = useState('');
  const [neck, setNeck] = useState('');
  const [height, setHeight] = useState('');
  const [hip, setHip] = useState('');

  const calculate = (): string => {
    const w = parseFloat(waist);
    const n = parseFloat(neck);
    const h = parseFloat(height);
    const hi = parseFloat(hip);

    if (isNaN(w) || isNaN(n) || isNaN(h)) return '';
    if (gender === 'female' && isNaN(hi)) return '';

    let bodyFat: number;
    if (gender === 'male') {
      // US Navy formula for men (cm)
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
    } else {
      // US Navy formula for women (cm)
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(w + hi - n) + 0.22100 * Math.log10(h)) - 450;
    }

    let category: string;
    if (gender === 'male') {
      if (bodyFat < 6) category = 'Essential fat';
      else if (bodyFat < 14) category = 'Athletes';
      else if (bodyFat < 18) category = 'Fitness';
      else if (bodyFat < 25) category = 'Average';
      else category = 'Above average';
    } else {
      if (bodyFat < 14) category = 'Essential fat';
      else if (bodyFat < 21) category = 'Athletes';
      else if (bodyFat < 25) category = 'Fitness';
      else if (bodyFat < 32) category = 'Average';
      else category = 'Above average';
    }

    return `Body Fat: ${bodyFat.toFixed(1)}%\nCategory: ${category}\n\nMethod: US Navy Formula\nGender: ${gender}\nMeasurements (cm): Waist ${w}, Neck ${n}, Height ${h}${gender === 'female' ? `, Hip ${hi}` : ''}`;
  };

  const result = calculate();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-gender`} className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
        <select id={`${toolId}-gender`} value={gender} onChange={(e) => setGender(e.target.value)} aria-label={`Gender for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${toolId}-waist`} className="block text-sm font-medium text-gray-700 mb-1">Waist (cm)</label>
          <input id={`${toolId}-waist`} type="number" value={waist} onChange={(e) => setWaist(e.target.value)} placeholder="85" aria-label={`Waist for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor={`${toolId}-neck`} className="block text-sm font-medium text-gray-700 mb-1">Neck (cm)</label>
          <input id={`${toolId}-neck`} type="number" value={neck} onChange={(e) => setNeck(e.target.value)} placeholder="38" aria-label={`Neck for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
          <input id={`${toolId}-height`} type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="175" aria-label={`Height for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        {gender === 'female' && (
          <div>
            <label htmlFor={`${toolId}-hip`} className="block text-sm font-medium text-gray-700 mb-1">Hip (cm)</label>
            <input id={`${toolId}-hip`} type="number" value={hip} onChange={(e) => setHip(e.target.value)} placeholder="95" aria-label={`Hip for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        )}
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
