'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WaistToHipRatio - Calculates waist-to-hip ratio with health risk assessment.
 * Formula: WHR = Waist Circumference / Hip Circumference
 */
export default function WaistToHipRatio({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ ratio: number; risk: string; category: string } | null>(null);

  const getRiskCategory = (ratio: number, isMale: boolean): { risk: string; category: string } => {
    if (isMale) {
      if (ratio < 0.90) return { risk: 'Low', category: 'Excellent' };
      if (ratio <= 0.99) return { risk: 'Moderate', category: 'Average' };
      return { risk: 'High', category: 'At Risk' };
    } else {
      if (ratio < 0.80) return { risk: 'Low', category: 'Excellent' };
      if (ratio <= 0.84) return { risk: 'Moderate', category: 'Average' };
      return { risk: 'High', category: 'At Risk' };
    }
  };

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const waistVal = parseFloat(waist);
    const hipVal = parseFloat(hip);

    if (!waist.trim() || isNaN(waistVal) || waistVal <= 0) {
      newErrors.waist = 'Please enter a valid waist measurement';
    }
    if (!hip.trim() || isNaN(hipVal) || hipVal <= 0) {
      newErrors.hip = 'Please enter a valid hip measurement';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    const ratio = waistVal / hipVal;
    const { risk, category } = getRiskCategory(ratio, gender === 'male');
    setResult({ ratio, risk, category });
  };

  const riskColor = result?.risk === 'Low' ? 'text-green-600' : result?.risk === 'Moderate' ? 'text-yellow-600' : 'text-red-600';

  const copyText = result
    ? `Waist-to-Hip Ratio: ${result.ratio.toFixed(3)}\nHealth Risk: ${result.risk}\nCategory: ${result.category}\nGender: ${gender}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
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

        <InputArea error={errors.waist}>
          <label htmlFor={`${toolId}-waist`} className="block text-sm font-medium text-gray-700 mb-1">
            Waist Circumference (cm)
          </label>
          <input
            id={`${toolId}-waist`}
            type="text"
            inputMode="decimal"
            value={waist}
            onChange={(e) => { setWaist(e.target.value); if (errors.waist) setErrors((prev) => ({ ...prev, waist: '' })); }}
            placeholder="e.g. 80"
            aria-label={`Waist circumference for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.hip}>
          <label htmlFor={`${toolId}-hip`} className="block text-sm font-medium text-gray-700 mb-1">
            Hip Circumference (cm)
          </label>
          <input
            id={`${toolId}-hip`}
            type="text"
            inputMode="decimal"
            value={hip}
            onChange={(e) => { setHip(e.target.value); if (errors.hip) setErrors((prev) => ({ ...prev, hip: '' })); }}
            placeholder="e.g. 95"
            aria-label={`Hip circumference for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate waist-to-hip ratio" className="btn-primary">
        Calculate WHR
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-800">{result.ratio.toFixed(3)}</div>
                <div className="text-xs text-gray-500 mt-1">WHR</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className={`text-2xl font-bold ${riskColor}`}>{result.risk}</div>
                <div className="text-xs text-gray-500 mt-1">Health Risk</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className={`text-2xl font-bold ${riskColor}`}>{result.category}</div>
                <div className="text-xs text-gray-500 mt-1">Category</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p><strong>WHO Guidelines ({gender === 'male' ? 'Male' : 'Female'}):</strong></p>
              <p>Low risk: &lt; {gender === 'male' ? '0.90' : '0.80'} | Moderate: {gender === 'male' ? '0.90–0.99' : '0.80–0.84'} | High: ≥ {gender === 'male' ? '1.00' : '0.85'}</p>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
