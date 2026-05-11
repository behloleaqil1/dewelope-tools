'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * IdealWeightCalculator - Calculates ideal body weight using multiple formulas.
 * Supports Devine, Robinson, Miller, and Hamwi formulas for both genders.
 */
export default function IdealWeightCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [heightCm, setHeightCm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ devine: number; robinson: number; miller: number; hamwi: number } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const cm = parseFloat(heightCm);

    if (!heightCm.trim() || isNaN(cm)) {
      newErrors.height = 'Please enter a valid height';
    } else if (cm < 100 || cm > 250) {
      newErrors.height = 'Height must be between 100 and 250 cm';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    // Convert cm to inches over 5 feet
    const totalInches = cm / 2.54;
    const inchesOver60 = totalInches - 60;

    let devine: number, robinson: number, miller: number, hamwi: number;

    if (gender === 'male') {
      devine = 50 + 2.3 * inchesOver60;
      robinson = 52 + 1.9 * inchesOver60;
      miller = 56.2 + 1.41 * inchesOver60;
      hamwi = 48 + 2.7 * inchesOver60;
    } else {
      devine = 45.5 + 2.3 * inchesOver60;
      robinson = 49 + 1.7 * inchesOver60;
      miller = 53.1 + 1.36 * inchesOver60;
      hamwi = 45.5 + 2.2 * inchesOver60;
    }

    setResult({ devine, robinson, miller, hamwi });
  };

  const copyText = result
    ? `Ideal Weight (${gender}, ${heightCm} cm):\nDevine: ${result.devine.toFixed(1)} kg\nRobinson: ${result.robinson.toFixed(1)} kg\nMiller: ${result.miller.toFixed(1)} kg\nHamwi: ${result.hamwi.toFixed(1)} kg`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name={`${toolId}-gender`} value="male" checked={gender === 'male'} onChange={() => setGender('male')} />
            <span className="text-sm">Male</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name={`${toolId}-gender`} value="female" checked={gender === 'female'} onChange={() => setGender('female')} />
            <span className="text-sm">Female</span>
          </label>
        </div>
      </div>

      <InputArea error={errors.height}>
        <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">
          Height (cm)
        </label>
        <input
          id={`${toolId}-height`}
          type="text"
          inputMode="decimal"
          value={heightCm}
          onChange={(e) => { setHeightCm(e.target.value); if (errors.height) setErrors({}); }}
          placeholder="e.g. 175"
          aria-label={`Height input for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate ideal weight" className="btn-primary">
        Calculate Ideal Weight
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.devine.toFixed(1)} kg</div>
                <div className="text-xs text-gray-500 mt-1">Devine Formula</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{result.robinson.toFixed(1)} kg</div>
                <div className="text-xs text-gray-500 mt-1">Robinson Formula</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-purple-600">{result.miller.toFixed(1)} kg</div>
                <div className="text-xs text-gray-500 mt-1">Miller Formula</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-orange-600">{result.hamwi.toFixed(1)} kg</div>
                <div className="text-xs text-gray-500 mt-1">Hamwi Formula</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p>Average: <strong>{((result.devine + result.robinson + result.miller + result.hamwi) / 4).toFixed(1)} kg</strong></p>
              <p className="text-xs mt-1 text-gray-500">Note: These are estimates. Consult a healthcare professional for personalized advice.</p>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
