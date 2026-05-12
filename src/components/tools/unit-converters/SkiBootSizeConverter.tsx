'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SkiBootSizeConverter - Convert ski boot sizes between Mondo point, US, and EU.
 * Mondo point (mm) is the standard for ski boots; this converts to/from common shoe sizes.
 */
export default function SkiBootSizeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromSystem, setFromSystem] = useState('mondo');
  const [gender, setGender] = useState('men');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ mondo: string; usMen: string; usWomen: string; eu: string; uk: string; cm: string } | null>(null);

  const systems = [
    { value: 'mondo', label: 'Mondo Point (mm)' },
    { value: 'us-men', label: 'US Men' },
    { value: 'us-women', label: 'US Women' },
    { value: 'eu', label: 'EU' },
    { value: 'uk', label: 'UK' },
  ];

  const convert = () => {
    setError('');
    setResult(null);
    const num = parseFloat(value);
    if (!value.trim() || isNaN(num) || num <= 0) {
      setError('Enter a valid positive number');
      return;
    }

    // Convert everything to Mondo point (mm) first
    let mondo: number;
    switch (fromSystem) {
      case 'mondo': mondo = num; break;
      case 'us-men': mondo = (num + 18.5) * 10; break; // Approximate: US Men = (Mondo/10) - 18.5
      case 'us-women': mondo = (num + 17) * 10; break;
      case 'eu': mondo = (num - 1) * 6.67; break; // Approximate: EU = (Mondo/6.67) + 1
      case 'uk': mondo = (num + 19) * 10; break;
      default: mondo = num;
    }

    // Correct Mondo-based conversions (standard ski boot sizing)
    // Mondo = foot length in mm (typically 220-320 range)
    const mondoVal = Math.round(mondo * 2) / 2; // Round to nearest 0.5
    const usMen = (mondoVal / 10) - 18.5;
    const usWomen = (mondoVal / 10) - 17;
    const eu = (mondoVal / 6.67) + 1;
    const uk = (mondoVal / 10) - 19;

    setResult({
      mondo: mondoVal.toFixed(0),
      usMen: usMen.toFixed(1),
      usWomen: usWomen.toFixed(1),
      eu: eu.toFixed(1),
      uk: uk.toFixed(1),
      cm: (mondoVal / 10).toFixed(1),
    });
  };

  const copyText = result
    ? `Ski Boot Size Conversion\nMondo Point: ${result.mondo} mm\nUS Men: ${result.usMen}\nUS Women: ${result.usWomen}\nEU: ${result.eu}\nUK: ${result.uk}\nFoot Length: ${result.cm} cm`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Size Value</label>
          <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 270" aria-label={`Size value for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-system`} className="block text-sm font-medium text-gray-700 mb-1">From System</label>
          <select id={`${toolId}-system`} value={fromSystem} onChange={(e) => setFromSystem(e.target.value)} aria-label={`Size system for ${toolName}`} className="input-field">
            {systems.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-gender`} className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select id={`${toolId}-gender`} value={gender} onChange={(e) => setGender(e.target.value)} aria-label={`Gender for ${toolName}`} className="input-field">
            <option value="men">Men</option>
            <option value="women">Women</option>
          </select>
        </InputArea>
      </div>

      <button onClick={convert} aria-label="Convert ski boot size" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.mondo} mm</div>
                <div className="text-xs text-gray-500 mt-1">Mondo Point</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-green-600">{result.usMen}</div>
                <div className="text-xs text-gray-500 mt-1">US Men</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-pink-600">{result.usWomen}</div>
                <div className="text-xs text-gray-500 mt-1">US Women</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-purple-600">{result.eu}</div>
                <div className="text-xs text-gray-500 mt-1">EU</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-orange-600">{result.uk}</div>
                <div className="text-xs text-gray-500 mt-1">UK</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-700">{result.cm} cm</div>
                <div className="text-xs text-gray-500 mt-1">Foot Length</div>
              </div>
            </div>
            <p className="text-xs text-gray-500">Mondo point is the international standard for ski boot sizing, measured in millimeters of foot length.</p>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
