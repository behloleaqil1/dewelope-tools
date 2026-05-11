'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PercentageOfPercentage - Calculate what percentage one number is of another.
 * Formula: (Part / Whole) × 100 = Percentage
 */
export default function PercentageOfPercentage({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [part, setPart] = useState('');
  const [whole, setWhole] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const partNum = parseFloat(part);
    const wholeNum = parseFloat(whole);

    if (!part.trim() || isNaN(partNum)) newErrors.part = 'Please enter a valid number';
    if (!whole.trim() || isNaN(wholeNum)) newErrors.whole = 'Please enter a valid number';
    else if (wholeNum === 0) newErrors.whole = 'Whole value cannot be zero';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    setResult((partNum / wholeNum) * 100);
  };

  const copyText = result !== null
    ? `${parseFloat(part)} is ${result.toFixed(4)}% of ${parseFloat(whole)}\nFormula: (${part} / ${whole}) × 100 = ${result.toFixed(4)}%`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea error={errors.part}>
          <label htmlFor={`${toolId}-part`} className="block text-sm font-medium text-gray-700 mb-1">Part (Value)</label>
          <input id={`${toolId}-part`} type="text" inputMode="decimal" value={part} onChange={(e) => { setPart(e.target.value); if (errors.part) setErrors((p) => ({ ...p, part: '' })); }} placeholder="e.g. 25" aria-label={`Part value for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea error={errors.whole}>
          <label htmlFor={`${toolId}-whole`} className="block text-sm font-medium text-gray-700 mb-1">Whole (Total)</label>
          <input id={`${toolId}-whole`} type="text" inputMode="decimal" value={whole} onChange={(e) => { setWhole(e.target.value); if (errors.whole) setErrors((p) => ({ ...p, whole: '' })); }} placeholder="e.g. 200" aria-label={`Whole value for ${toolName}`} className="input-field" />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate percentage" className="btn-primary">
        Calculate Percentage
      </button>

      <OutputArea hasContent={result !== null}>
        {result !== null && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-blue-600">{result.toFixed(4)}%</div>
              <div className="text-sm text-gray-500 mt-1">{part} is {result.toFixed(4)}% of {whole}</div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              Formula: ({part} / {whole}) × 100 = {result.toFixed(4)}%
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
