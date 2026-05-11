'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BodyFatCalculator - Estimate body fat percentage using the U.S. Navy method.
 * Uses neck, waist, height (and hip for females) measurements.
 */
export default function BodyFatCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [height, setHeight] = useState('');
  const [waist, setWaist] = useState('');
  const [neck, setNeck] = useState('');
  const [hip, setHip] = useState('');
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ bodyFat: number; category: string } | null>(null);

  const getCategory = (bf: number, isMale: boolean): string => {
    if (isMale) {
      if (bf < 6) return 'Essential Fat';
      if (bf < 14) return 'Athletes';
      if (bf < 18) return 'Fitness';
      if (bf < 25) return 'Average';
      return 'Obese';
    } else {
      if (bf < 14) return 'Essential Fat';
      if (bf < 21) return 'Athletes';
      if (bf < 25) return 'Fitness';
      if (bf < 32) return 'Average';
      return 'Obese';
    }
  };

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const h = parseFloat(height);
    const w = parseFloat(waist);
    const n = parseFloat(neck);
    const hp = parseFloat(hip);

    if (!height.trim() || isNaN(h) || h <= 0) newErrors.height = 'Enter a valid height';
    if (!waist.trim() || isNaN(w) || w <= 0) newErrors.waist = 'Enter a valid waist measurement';
    if (!neck.trim() || isNaN(n) || n <= 0) newErrors.neck = 'Enter a valid neck measurement';
    if (gender === 'female' && (!hip.trim() || isNaN(hp) || hp <= 0)) newErrors.hip = 'Enter a valid hip measurement';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    // Convert to cm if in inches
    const heightCm = unit === 'in' ? h * 2.54 : h;
    const waistCm = unit === 'in' ? w * 2.54 : w;
    const neckCm = unit === 'in' ? n * 2.54 : n;
    const hipCm = unit === 'in' ? hp * 2.54 : hp;

    let bodyFat: number;
    if (gender === 'male') {
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
    } else {
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450;
    }

    bodyFat = Math.max(0, bodyFat);
    const category = getCategory(bodyFat, gender === 'male');
    setResult({ bodyFat, category });
  };

  const copyText = result
    ? `Body Fat: ${result.bodyFat.toFixed(1)}%\nCategory: ${result.category}\nMethod: U.S. Navy Method`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea>
          <div className="flex gap-4 mb-3">
            <label className="flex items-center gap-2">
              <input type="radio" name={`${toolId}-gender`} checked={gender === 'male'} onChange={() => setGender('male')} className="text-blue-600" />
              <span className="text-sm text-gray-700">Male</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name={`${toolId}-gender`} checked={gender === 'female'} onChange={() => setGender('female')} className="text-blue-600" />
              <span className="text-sm text-gray-700">Female</span>
            </label>
            <select value={unit} onChange={(e) => setUnit(e.target.value as 'cm' | 'in')} className="input-field w-24 ml-auto" aria-label="Measurement unit">
              <option value="cm">cm</option>
              <option value="in">inches</option>
            </select>
          </div>
        </InputArea>

        <InputArea error={errors.height}>
          <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">Height ({unit})</label>
          <input id={`${toolId}-height`} type="text" inputMode="decimal" value={height} onChange={(e) => { setHeight(e.target.value); if (errors.height) setErrors((prev) => ({ ...prev, height: '' })); }} placeholder={unit === 'cm' ? 'e.g. 175' : 'e.g. 69'} aria-label={`Height for ${toolName}`} className="input-field" />
        </InputArea>

        <InputArea error={errors.neck}>
          <label htmlFor={`${toolId}-neck`} className="block text-sm font-medium text-gray-700 mb-1">Neck circumference ({unit})</label>
          <input id={`${toolId}-neck`} type="text" inputMode="decimal" value={neck} onChange={(e) => { setNeck(e.target.value); if (errors.neck) setErrors((prev) => ({ ...prev, neck: '' })); }} placeholder={unit === 'cm' ? 'e.g. 38' : 'e.g. 15'} aria-label="Neck circumference" className="input-field" />
        </InputArea>

        <InputArea error={errors.waist}>
          <label htmlFor={`${toolId}-waist`} className="block text-sm font-medium text-gray-700 mb-1">Waist circumference ({unit})</label>
          <input id={`${toolId}-waist`} type="text" inputMode="decimal" value={waist} onChange={(e) => { setWaist(e.target.value); if (errors.waist) setErrors((prev) => ({ ...prev, waist: '' })); }} placeholder={unit === 'cm' ? 'e.g. 85' : 'e.g. 33'} aria-label="Waist circumference" className="input-field" />
        </InputArea>

        {gender === 'female' && (
          <InputArea error={errors.hip}>
            <label htmlFor={`${toolId}-hip`} className="block text-sm font-medium text-gray-700 mb-1">Hip circumference ({unit})</label>
            <input id={`${toolId}-hip`} type="text" inputMode="decimal" value={hip} onChange={(e) => { setHip(e.target.value); if (errors.hip) setErrors((prev) => ({ ...prev, hip: '' })); }} placeholder={unit === 'cm' ? 'e.g. 95' : 'e.g. 37'} aria-label="Hip circumference" className="input-field" />
          </InputArea>
        )}
      </div>

      <button onClick={calculate} aria-label="Calculate body fat" className="btn-primary">
        Calculate Body Fat
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.bodyFat.toFixed(1)}%</div>
                <div className="text-xs text-gray-500 mt-1">Body Fat</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-700">{result.category}</div>
                <div className="text-xs text-gray-500 mt-1">Category</div>
              </div>
            </div>
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-200">
              Calculated using the U.S. Navy Method. Results are estimates and may vary from clinical measurements.
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
