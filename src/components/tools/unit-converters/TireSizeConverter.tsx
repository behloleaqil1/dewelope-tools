'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TireSizeConverter - Convert tire sizes between metric and imperial formats.
 */
export default function TireSizeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [width, setWidth] = useState('');
  const [aspect, setAspect] = useState('');
  const [rim, setRim] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ diameter: number; sidewall: number; circumference: number; widthInches: number; revPerMile: number } | null>(null);

  const calculate = () => {
    setError('');
    setResult(null);

    const w = parseFloat(width);
    const a = parseFloat(aspect);
    const r = parseFloat(rim);

    if (isNaN(w) || isNaN(a) || isNaN(r) || w <= 0 || a <= 0 || r <= 0) {
      setError('Please enter valid positive numbers for all fields.');
      return;
    }

    // Width in mm, aspect ratio as percentage, rim in inches
    const sidewallMm = w * (a / 100);
    const sidewallInches = sidewallMm / 25.4;
    const diameterInches = (2 * sidewallInches) + r;
    const circumferenceInches = Math.PI * diameterInches;
    const widthInches = w / 25.4;
    const revPerMile = 63360 / circumferenceInches;

    setResult({
      diameter: diameterInches,
      sidewall: sidewallInches,
      circumference: circumferenceInches,
      widthInches,
      revPerMile,
    });
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <p className="text-sm text-gray-500 mb-3">Enter metric tire size (e.g., 225/45R17)</p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">Width (mm)</label>
            <input id={`${toolId}-width`} type="text" inputMode="decimal" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="225" aria-label={`Tire width for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-aspect`} className="block text-sm font-medium text-gray-700 mb-1">Aspect Ratio (%)</label>
            <input id={`${toolId}-aspect`} type="text" inputMode="decimal" value={aspect} onChange={(e) => setAspect(e.target.value)} placeholder="45" aria-label={`Aspect ratio for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-rim`} className="block text-sm font-medium text-gray-700 mb-1">Rim Diameter (in)</label>
            <input id={`${toolId}-rim`} type="text" inputMode="decimal" value={rim} onChange={(e) => setRim(e.target.value)} placeholder="17" aria-label={`Rim diameter for ${toolName}`} className="input-field" />
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} className="btn-primary" aria-label="Calculate tire dimensions">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xs text-gray-500">Overall Diameter</div>
                <div className="text-lg font-bold text-blue-600">{result.diameter.toFixed(2)}&quot;</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xs text-gray-500">Sidewall Height</div>
                <div className="text-lg font-bold text-blue-600">{result.sidewall.toFixed(2)}&quot;</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xs text-gray-500">Circumference</div>
                <div className="text-lg font-bold text-blue-600">{result.circumference.toFixed(2)}&quot;</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xs text-gray-500">Width</div>
                <div className="text-lg font-bold text-blue-600">{result.widthInches.toFixed(2)}&quot;</div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
              <div className="text-xs text-gray-500">Revolutions per Mile</div>
              <div className="text-lg font-bold text-blue-600">{Math.round(result.revPerMile)}</div>
            </div>
            <CopyToClipboard text={`Diameter: ${result.diameter.toFixed(2)}"\nSidewall: ${result.sidewall.toFixed(2)}"\nCircumference: ${result.circumference.toFixed(2)}"\nWidth: ${result.widthInches.toFixed(2)}"\nRev/mile: ${Math.round(result.revPerMile)}`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
