'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

// Hat size conversion table (approximate)
// US sizes are in 1/8 increments, UK same as US, EU is cm circumference
const HAT_SIZES: { us: string; uk: string; eu: number; cm: number }[] = [
  { us: '6 3/4', uk: '6 3/4', eu: 54, cm: 54 },
  { us: '6 7/8', uk: '6 7/8', eu: 55, cm: 55 },
  { us: '7', uk: '6 7/8', eu: 56, cm: 56 },
  { us: '7 1/8', uk: '7', eu: 57, cm: 57 },
  { us: '7 1/4', uk: '7 1/8', eu: 58, cm: 58 },
  { us: '7 3/8', uk: '7 1/4', eu: 59, cm: 59 },
  { us: '7 1/2', uk: '7 3/8', eu: 60, cm: 60 },
  { us: '7 5/8', uk: '7 1/2', eu: 61, cm: 61 },
  { us: '7 3/4', uk: '7 5/8', eu: 62, cm: 62 },
  { us: '7 7/8', uk: '7 3/4', eu: 63, cm: 63 },
  { us: '8', uk: '7 7/8', eu: 64, cm: 64 },
  { us: '8 1/8', uk: '8', eu: 65, cm: 65 },
];

/**
 * HatSizeConverter - Convert hat sizes between US, UK, EU, and cm.
 */
export default function HatSizeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromSystem, setFromSystem] = useState('cm');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ us: string; uk: string; eu: string; cm: string } | null>(null);

  const systems = [
    { value: 'us', label: 'US' },
    { value: 'uk', label: 'UK' },
    { value: 'eu', label: 'EU (cm circumference)' },
    { value: 'cm', label: 'Head Circumference (cm)' },
  ];

  function convert() {
    setError('');
    setResult(null);

    if (!value.trim()) {
      setError('Enter a hat size value');
      return;
    }

    if (fromSystem === 'cm' || fromSystem === 'eu') {
      const num = parseFloat(value);
      if (isNaN(num) || num <= 0) {
        setError('Enter a valid positive number');
        return;
      }

      // Find closest match
      let closest = HAT_SIZES[0];
      let minDiff = Math.abs(num - closest.cm);
      for (const size of HAT_SIZES) {
        const diff = Math.abs(num - size.cm);
        if (diff < minDiff) {
          minDiff = diff;
          closest = size;
        }
      }

      setResult({ us: closest.us, uk: closest.uk, eu: String(closest.eu), cm: String(closest.cm) });
    } else {
      // US or UK - match string
      const normalized = value.trim().toLowerCase();
      const match = HAT_SIZES.find((s) => {
        if (fromSystem === 'us') return s.us.toLowerCase() === normalized;
        return s.uk.toLowerCase() === normalized;
      });

      if (!match) {
        // Try numeric approximation
        const num = parseFloat(value);
        if (isNaN(num)) {
          setError('Enter a valid hat size (e.g. 7 1/4)');
          return;
        }
        // Convert US numeric to cm: approximate formula
        const approxCm = Math.round(num * 8 + 1);
        let closest = HAT_SIZES[0];
        let minDiff = Math.abs(approxCm - closest.cm);
        for (const size of HAT_SIZES) {
          const diff = Math.abs(approxCm - size.cm);
          if (diff < minDiff) {
            minDiff = diff;
            closest = size;
          }
        }
        setResult({ us: closest.us, uk: closest.uk, eu: String(closest.eu), cm: String(closest.cm) });
      } else {
        setResult({ us: match.us, uk: match.uk, eu: String(match.eu), cm: String(match.cm) });
      }
    }
  }

  const copyText = result
    ? `US: ${result.us}\nUK: ${result.uk}\nEU: ${result.eu}\nCircumference: ${result.cm} cm`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Hat Size</label>
          <input id={`${toolId}-value`} type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder={fromSystem === 'cm' || fromSystem === 'eu' ? 'e.g. 58' : 'e.g. 7 1/4'} aria-label={`Hat size for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-system`} className="block text-sm font-medium text-gray-700 mb-1">From System</label>
          <select id={`${toolId}-system`} value={fromSystem} onChange={(e) => setFromSystem(e.target.value)} aria-label={`Size system for ${toolName}`} className="input-field">
            {systems.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </InputArea>
      </div>

      <button onClick={convert} aria-label="Convert hat size" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.us}</div>
                <div className="text-xs text-gray-500 mt-1">US</div>
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
                <div className="text-xs text-gray-500 mt-1">Circumference</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
