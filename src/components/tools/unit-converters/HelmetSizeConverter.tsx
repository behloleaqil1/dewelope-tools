'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const HELMET_SIZES = [
  { label: 'XXS', cmMin: 51, cmMax: 52 },
  { label: 'XS', cmMin: 53, cmMax: 54 },
  { label: 'S', cmMin: 55, cmMax: 56 },
  { label: 'M', cmMin: 57, cmMax: 58 },
  { label: 'L', cmMin: 59, cmMax: 60 },
  { label: 'XL', cmMin: 61, cmMax: 62 },
  { label: 'XXL', cmMin: 63, cmMax: 64 },
  { label: 'XXXL', cmMin: 65, cmMax: 66 },
];

/**
 * HelmetSizeConverter - Convert helmet sizes between S/M/L, cm, and inches.
 * Shows equivalent sizes across different measurement systems.
 */
export default function HelmetSizeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState<'cm' | 'inches' | 'letter'>('cm');
  const [letterSize, setLetterSize] = useState('M');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    cm: string;
    inches: string;
    letterSize: string;
    hatSize: string;
  } | null>(null);

  function convert() {
    const newErrors: Record<string, string> = {};

    let cmValue: number;

    if (fromUnit === 'letter') {
      const found = HELMET_SIZES.find((s) => s.label === letterSize);
      if (!found) {
        newErrors.value = 'Invalid letter size';
        setErrors(newErrors);
        setResult(null);
        return;
      }
      cmValue = (found.cmMin + found.cmMax) / 2;
    } else {
      const val = parseFloat(value);
      if (!value.trim() || isNaN(val) || val <= 0) {
        newErrors.value = 'Enter a positive number';
        setErrors(newErrors);
        setResult(null);
        return;
      }
      cmValue = fromUnit === 'inches' ? val * 2.54 : val;
    }

    setErrors({});

    const inches = cmValue / 2.54;
    const hatSize = (inches / 3.14159).toFixed(1);

    // Find matching letter size
    let matchedLetter = 'N/A';
    for (const size of HELMET_SIZES) {
      if (cmValue >= size.cmMin - 0.5 && cmValue <= size.cmMax + 0.5) {
        matchedLetter = size.label;
        break;
      }
    }
    if (matchedLetter === 'N/A') {
      if (cmValue < HELMET_SIZES[0].cmMin) matchedLetter = `< ${HELMET_SIZES[0].label}`;
      else if (cmValue > HELMET_SIZES[HELMET_SIZES.length - 1].cmMax) matchedLetter = `> ${HELMET_SIZES[HELMET_SIZES.length - 1].label}`;
      else {
        // Find closest
        let closest = HELMET_SIZES[0];
        let minDist = Math.abs(cmValue - (closest.cmMin + closest.cmMax) / 2);
        for (const size of HELMET_SIZES) {
          const mid = (size.cmMin + size.cmMax) / 2;
          const dist = Math.abs(cmValue - mid);
          if (dist < minDist) { minDist = dist; closest = size; }
        }
        matchedLetter = closest.label;
      }
    }

    setResult({
      cm: `${cmValue.toFixed(1)} cm`,
      inches: `${inches.toFixed(2)} in`,
      letterSize: matchedLetter,
      hatSize: hatSize,
    });
  }

  const copyText = result
    ? `Helmet Size:\n${result.cm}\n${result.inches}\nLetter Size: ${result.letterSize}\nHat Size: ${result.hatSize}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={errors.value}>
        <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">
          Convert From
        </label>
        <select
          id={`${toolId}-unit`}
          value={fromUnit}
          onChange={(e) => setFromUnit(e.target.value as 'cm' | 'inches' | 'letter')}
          aria-label={`Unit selection for ${toolName}`}
          className="input-field mb-2"
        >
          <option value="cm">Centimeters (head circumference)</option>
          <option value="inches">Inches (head circumference)</option>
          <option value="letter">Letter Size (S/M/L)</option>
        </select>

        {fromUnit === 'letter' ? (
          <select
            value={letterSize}
            onChange={(e) => setLetterSize(e.target.value)}
            aria-label={`Letter size for ${toolName}`}
            className="input-field"
          >
            {HELMET_SIZES.map((s) => (
              <option key={s.label} value={s.label}>{s.label} ({s.cmMin}-{s.cmMax} cm)</option>
            ))}
          </select>
        ) : (
          <input
            id={`${toolId}-value`}
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(e) => { setValue(e.target.value); if (errors.value) setErrors({}); }}
            placeholder={fromUnit === 'cm' ? 'e.g. 57' : 'e.g. 22.4'}
            aria-label={`Head circumference for ${toolName}`}
            className="input-field"
          />
        )}
      </InputArea>

      <button onClick={convert} aria-label="Convert helmet size" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600">{result.cm}</div>
                <div className="text-xs text-gray-500">Centimeters</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-green-600">{result.inches}</div>
                <div className="text-xs text-gray-500">Inches</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-purple-600">{result.letterSize}</div>
                <div className="text-xs text-gray-500">Letter Size</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-orange-600">{result.hatSize}</div>
                <div className="text-xs text-gray-500">Hat Size</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>

      <details className="bg-gray-50 rounded-lg border border-gray-200">
        <summary className="px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 rounded-lg">
          Helmet Size Chart
        </summary>
        <div className="px-4 pb-3">
          <table className="w-full text-xs text-gray-700">
            <thead>
              <tr className="border-b">
                <th className="py-1 text-left">Size</th>
                <th className="py-1 text-left">CM</th>
                <th className="py-1 text-left">Inches</th>
              </tr>
            </thead>
            <tbody>
              {HELMET_SIZES.map((s) => (
                <tr key={s.label} className="border-b border-gray-100">
                  <td className="py-1 font-bold">{s.label}</td>
                  <td className="py-1">{s.cmMin}-{s.cmMax}</td>
                  <td className="py-1">{(s.cmMin / 2.54).toFixed(1)}-{(s.cmMax / 2.54).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
