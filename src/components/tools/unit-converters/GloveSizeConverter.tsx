'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * GloveSizeConverter - Convert glove sizes between US, EU, and cm.
 */
export default function GloveSizeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromSystem, setFromSystem] = useState('us');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ us: string; eu: string; cm: string; label: string } | null>(null);

  const systems = [
    { value: 'us', label: 'US (numeric)' },
    { value: 'eu', label: 'EU (numeric)' },
    { value: 'cm', label: 'Hand Circumference (cm)' },
  ];

  const convert = () => {
    setError('');
    setResult(null);
    const num = parseFloat(value);
    if (!value.trim() || isNaN(num) || num <= 0) {
      setError('Enter a valid positive number');
      return;
    }

    // Convert to cm (hand circumference) as base
    let cm: number;
    switch (fromSystem) {
      case 'us': cm = num * 2.54; break; // US size ≈ inches, convert to cm
      case 'eu': cm = num; break; // EU size is roughly cm
      case 'cm': cm = num; break;
      default: cm = num;
    }

    // Convert from cm to all systems
    const us = cm / 2.54;
    const eu = cm;

    // Determine size label
    let label = '';
    if (cm < 17.8) label = 'XS';
    else if (cm < 19) label = 'S';
    else if (cm < 20.3) label = 'M';
    else if (cm < 21.6) label = 'L';
    else if (cm < 22.9) label = 'XL';
    else label = 'XXL';

    setResult({
      us: us.toFixed(1),
      eu: eu.toFixed(1),
      cm: cm.toFixed(1),
      label,
    });
  };

  const copyText = result
    ? `US Size: ${result.us}\nEU Size: ${result.eu}\nHand Circumference: ${result.cm} cm\nSize Label: ${result.label}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Glove Size</label>
          <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 8" aria-label={`Glove size for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-system`} className="block text-sm font-medium text-gray-700 mb-1">From System</label>
          <select id={`${toolId}-system`} value={fromSystem} onChange={(e) => setFromSystem(e.target.value)} aria-label={`Size system for ${toolName}`} className="input-field">
            {systems.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </InputArea>
      </div>

      <button onClick={convert} aria-label="Convert glove size" className="btn-primary">
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
                <div className="text-xs text-gray-500 mt-1">Circumference</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-700">{result.label}</div>
                <div className="text-xs text-gray-500 mt-1">Size Label</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
