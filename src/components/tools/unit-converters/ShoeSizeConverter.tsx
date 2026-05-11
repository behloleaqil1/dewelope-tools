'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ShoeSizeConverter - Convert between US, UK, EU shoe sizes.
 */
export default function ShoeSizeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromSystem, setFromSystem] = useState('us-men');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ usMen: string; usWomen: string; uk: string; eu: string; cm: string } | null>(null);

  const systems = [
    { value: 'us-men', label: 'US Men' },
    { value: 'us-women', label: 'US Women' },
    { value: 'uk', label: 'UK' },
    { value: 'eu', label: 'EU' },
    { value: 'cm', label: 'cm (foot length)' },
  ];

  const convert = () => {
    setError('');
    setResult(null);
    const num = parseFloat(value);
    if (!value.trim() || isNaN(num) || num <= 0) {
      setError('Enter a valid positive number');
      return;
    }

    // Convert to cm (foot length) first as base
    let cm: number;
    switch (fromSystem) {
      case 'us-men': cm = (num + 23.5) * 0.847; break;
      case 'us-women': cm = (num + 22) * 0.847; break;
      case 'uk': cm = (num + 23) * 0.847; break;
      case 'eu': cm = (num + 2) * 0.667; break;
      case 'cm': cm = num; break;
      default: cm = num;
    }

    // Convert from cm to all systems
    const usMen = (cm / 0.847) - 23.5;
    const usWomen = (cm / 0.847) - 22;
    const uk = (cm / 0.847) - 23;
    const eu = (cm / 0.667) - 2;

    setResult({
      usMen: usMen.toFixed(1),
      usWomen: usWomen.toFixed(1),
      uk: uk.toFixed(1),
      eu: eu.toFixed(1),
      cm: cm.toFixed(1),
    });
  };

  const copyText = result
    ? `US Men: ${result.usMen}\nUS Women: ${result.usWomen}\nUK: ${result.uk}\nEU: ${result.eu}\nFoot Length: ${result.cm} cm`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Shoe Size</label>
          <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 10" aria-label={`Shoe size for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-system`} className="block text-sm font-medium text-gray-700 mb-1">From System</label>
          <select id={`${toolId}-system`} value={fromSystem} onChange={(e) => setFromSystem(e.target.value)} aria-label={`Size system for ${toolName}`} className="input-field">
            {systems.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </InputArea>
      </div>

      <button onClick={convert} aria-label="Convert shoe size" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.usMen}</div>
                <div className="text-xs text-gray-500 mt-1">US Men</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-pink-600">{result.usWomen}</div>
                <div className="text-xs text-gray-500 mt-1">US Women</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-green-600">{result.uk}</div>
                <div className="text-xs text-gray-500 mt-1">UK</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-purple-600">{result.eu}</div>
                <div className="text-xs text-gray-500 mt-1">EU</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-700">{result.cm} cm</div>
                <div className="text-xs text-gray-500 mt-1">Foot Length</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
