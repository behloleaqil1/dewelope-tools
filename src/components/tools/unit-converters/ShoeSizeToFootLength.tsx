'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ShoeSizeToFootLength - Converts shoe sizes to actual foot length in cm/inches.
 * Supports US, EU, and UK sizing systems for men and women.
 */
export default function ShoeSizeToFootLength({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [size, setSize] = useState('');
  const [system, setSystem] = useState('us-men');
  const [result, setResult] = useState<{ cm: number; inches: number } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    const s = parseFloat(size);
    if (!size || isNaN(s) || s <= 0) {
      setError('Please enter a valid shoe size');
      setResult(null);
      return;
    }
    setError('');

    let lengthCm = 0;

    switch (system) {
      case 'us-men':
        // US Men: length (cm) = (size + 23) * 0.847 (Brannock formula approximation)
        lengthCm = (s * 0.847) + 19.46;
        break;
      case 'us-women':
        // US Women: typically 1.5 sizes smaller than men
        lengthCm = ((s - 1.5) * 0.847) + 19.46;
        break;
      case 'eu':
        // EU: length (cm) = size * 2/3 (Paris point = 6.67mm)
        lengthCm = s * 0.667;
        break;
      case 'uk':
        // UK: similar to US men but offset by 0.5
        lengthCm = ((s + 0.5) * 0.847) + 19.46;
        break;
      default:
        lengthCm = s * 0.667;
    }

    const inches = lengthCm / 2.54;
    setResult({ cm: lengthCm, inches });
  };

  const copyText = result
    ? `Shoe Size: ${size} (${system.replace('-', ' ').toUpperCase()})\nFoot Length: ${result.cm.toFixed(1)} cm / ${result.inches.toFixed(2)} inches`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-system`} className="block text-sm font-medium text-gray-700 mb-1">
            Sizing System
          </label>
          <select
            id={`${toolId}-system`}
            value={system}
            onChange={(e) => setSystem(e.target.value)}
            aria-label={`Sizing system for ${toolName}`}
            className="input-field"
          >
            <option value="us-men">US Men</option>
            <option value="us-women">US Women</option>
            <option value="eu">EU (European)</option>
            <option value="uk">UK</option>
          </select>
        </InputArea>

        <InputArea error={error}>
          <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">
            Shoe Size
          </label>
          <input
            id={`${toolId}-size`}
            type="text"
            inputMode="decimal"
            value={size}
            onChange={(e) => { setSize(e.target.value); if (error) setError(''); }}
            placeholder="e.g. 10"
            aria-label={`Shoe size for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Convert shoe size" className="btn-primary">
        Convert to Foot Length
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.cm.toFixed(1)}</div>
                <div className="text-xs text-gray-500 mt-1">Centimeters</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.inches.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Inches</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
              Size {size} ({system.replace('-', ' ').toUpperCase()}) ≈ {result.cm.toFixed(1)} cm foot length
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
