'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const FRAME_SIZES = [
  { label: 'XXS', cmMin: 44, cmMax: 47 },
  { label: 'XS', cmMin: 47, cmMax: 50 },
  { label: 'S', cmMin: 50, cmMax: 53 },
  { label: 'M', cmMin: 53, cmMax: 56 },
  { label: 'L', cmMin: 56, cmMax: 59 },
  { label: 'XL', cmMin: 59, cmMax: 62 },
  { label: 'XXL', cmMin: 62, cmMax: 66 },
];

/**
 * BicycleFrameSizeConverter - Convert bicycle frame sizes between cm, inches, and S/M/L.
 * Shows equivalent measurements and recommended rider height.
 */
export default function BicycleFrameSizeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState<'cm' | 'inches' | 'letter'>('cm');
  const [letterSize, setLetterSize] = useState('M');
  const [bikeType, setBikeType] = useState<'road' | 'mountain' | 'hybrid'>('road');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    cm: string;
    inches: string;
    letterSize: string;
    riderHeight: string;
  } | null>(null);

  function getHeightRange(cmValue: number, type: string): string {
    // Approximate rider height based on frame size and bike type
    let heightCm: [number, number];
    if (type === 'road') {
      heightCm = [cmValue * 2.8 + 10, cmValue * 2.8 + 25];
    } else if (type === 'mountain') {
      // Mountain bikes run smaller
      heightCm = [cmValue * 2.6 + 20, cmValue * 2.6 + 35];
    } else {
      heightCm = [cmValue * 2.7 + 15, cmValue * 2.7 + 30];
    }
    const ftIn1 = `${Math.floor(heightCm[0] / 30.48)}'${Math.round((heightCm[0] % 30.48) / 2.54)}"`;
    const ftIn2 = `${Math.floor(heightCm[1] / 30.48)}'${Math.round((heightCm[1] % 30.48) / 2.54)}"`;
    return `${Math.round(heightCm[0])}-${Math.round(heightCm[1])} cm (${ftIn1} - ${ftIn2})`;
  }

  function convert() {
    const newErrors: Record<string, string> = {};

    let cmValue: number;

    if (fromUnit === 'letter') {
      const found = FRAME_SIZES.find((s) => s.label === letterSize);
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

    // Find matching letter size
    let matchedLetter = 'N/A';
    for (const size of FRAME_SIZES) {
      if (cmValue >= size.cmMin && cmValue <= size.cmMax) {
        matchedLetter = size.label;
        break;
      }
    }
    if (matchedLetter === 'N/A') {
      if (cmValue < FRAME_SIZES[0].cmMin) matchedLetter = `< ${FRAME_SIZES[0].label}`;
      else if (cmValue > FRAME_SIZES[FRAME_SIZES.length - 1].cmMax) matchedLetter = `> ${FRAME_SIZES[FRAME_SIZES.length - 1].label}`;
      else {
        let closest = FRAME_SIZES[0];
        let minDist = Math.abs(cmValue - (closest.cmMin + closest.cmMax) / 2);
        for (const size of FRAME_SIZES) {
          const mid = (size.cmMin + size.cmMax) / 2;
          const dist = Math.abs(cmValue - mid);
          if (dist < minDist) { minDist = dist; closest = size; }
        }
        matchedLetter = closest.label;
      }
    }

    setResult({
      cm: `${cmValue.toFixed(1)} cm`,
      inches: `${inches.toFixed(1)} in`,
      letterSize: matchedLetter,
      riderHeight: getHeightRange(cmValue, bikeType),
    });
  }

  const copyText = result
    ? `Bicycle Frame Size:\n${result.cm}\n${result.inches}\nLetter Size: ${result.letterSize}\nRecommended Rider Height: ${result.riderHeight}\nBike Type: ${bikeType}`
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
          <option value="cm">Centimeters (frame size)</option>
          <option value="inches">Inches (frame size)</option>
          <option value="letter">Letter Size (S/M/L)</option>
        </select>

        {fromUnit === 'letter' ? (
          <select
            value={letterSize}
            onChange={(e) => setLetterSize(e.target.value)}
            aria-label={`Letter size for ${toolName}`}
            className="input-field mb-2"
          >
            {FRAME_SIZES.map((s) => (
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
            placeholder={fromUnit === 'cm' ? 'e.g. 54' : 'e.g. 21'}
            aria-label={`Frame size for ${toolName}`}
            className="input-field mb-2"
          />
        )}

        <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">
          Bike Type
        </label>
        <select
          id={`${toolId}-type`}
          value={bikeType}
          onChange={(e) => setBikeType(e.target.value as 'road' | 'mountain' | 'hybrid')}
          aria-label={`Bike type for ${toolName}`}
          className="input-field"
        >
          <option value="road">Road Bike</option>
          <option value="mountain">Mountain Bike</option>
          <option value="hybrid">Hybrid / City Bike</option>
        </select>
      </InputArea>

      <button onClick={convert} aria-label="Convert bicycle frame size" className="btn-primary">
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
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center col-span-2 sm:col-span-1">
                <div className="text-sm font-bold text-orange-600">{result.riderHeight}</div>
                <div className="text-xs text-gray-500">Rider Height</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>

      <details className="bg-gray-50 rounded-lg border border-gray-200">
        <summary className="px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 rounded-lg">
          Frame Size Chart
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
              {FRAME_SIZES.map((s) => (
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
