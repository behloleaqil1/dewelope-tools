'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BeltSizeConverter - Convert belt sizes between US, EU, and cm.
 */
export default function BeltSizeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromSystem, setFromSystem] = useState('us');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ us: string; eu: string; cm: string; inches: string } | null>(null);

  const systems = [
    { value: 'us', label: 'US (inches)' },
    { value: 'eu', label: 'EU (cm)' },
    { value: 'cm', label: 'Waist cm' },
    { value: 'inches', label: 'Waist inches' },
  ];

  const convert = () => {
    setError('');
    setResult(null);
    const num = parseFloat(value);
    if (!value.trim() || isNaN(num) || num <= 0) {
      setError('Enter a valid positive number');
      return;
    }

    // Convert to cm as base (waist measurement)
    let cm: number;
    switch (fromSystem) {
      case 'us':
        // US belt sizes are in inches, typically waist + 2 inches
        cm = num * 2.54;
        break;
      case 'eu':
        // EU sizes are in cm
        cm = num;
        break;
      case 'cm':
        cm = num;
        break;
      case 'inches':
        cm = num * 2.54;
        break;
      default:
        cm = num;
    }

    const inches = cm / 2.54;
    // US belt size is typically the waist measurement in inches (rounded to even)
    const usSize = Math.round(inches / 2) * 2;
    // EU belt size is the cm measurement (rounded to nearest 5)
    const euSize = Math.round(cm / 5) * 5;

    setResult({
      us: usSize.toString(),
      eu: euSize.toString(),
      cm: cm.toFixed(1),
      inches: inches.toFixed(1),
    });
  };

  const copyText = result
    ? `US Belt Size: ${result.us}\nEU Belt Size: ${result.eu}\nWaist: ${result.cm} cm (${result.inches} in)`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Belt Size</label>
          <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 34" aria-label={`Belt size for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-system`} className="block text-sm font-medium text-gray-700 mb-1">From System</label>
          <select id={`${toolId}-system`} value={fromSystem} onChange={(e) => setFromSystem(e.target.value)} aria-label={`Size system for ${toolName}`} className="input-field">
            {systems.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </InputArea>
      </div>

      <button onClick={convert} aria-label="Convert belt size" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.us}</div>
                <div className="text-xs text-gray-500 mt-1">US Size</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-green-600">{result.eu}</div>
                <div className="text-xs text-gray-500 mt-1">EU Size</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-purple-600">{result.cm} cm</div>
                <div className="text-xs text-gray-500 mt-1">Waist (cm)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-700">{result.inches}&quot;</div>
                <div className="text-xs text-gray-500 mt-1">Waist (inches)</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
