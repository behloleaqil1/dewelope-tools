'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const COMMON_SIZES = [
  { mm: 14, label: '14mm' },
  { mm: 16, label: '16mm' },
  { mm: 18, label: '18mm' },
  { mm: 19, label: '19mm' },
  { mm: 20, label: '20mm' },
  { mm: 21, label: '21mm' },
  { mm: 22, label: '22mm' },
  { mm: 23, label: '23mm' },
  { mm: 24, label: '24mm' },
  { mm: 26, label: '26mm' },
];

/**
 * WatchBandSizeConverter - Convert watch band sizes between mm and inches.
 * Also shows common watch band widths and wrist circumference conversions.
 */
export default function WatchBandSizeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState<'mm' | 'inches'>('mm');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    mm: number;
    inches: number;
    cm: number;
    nearestCommon: string;
  } | null>(null);

  function convert() {
    const newErrors: Record<string, string> = {};
    const val = parseFloat(value);

    if (!value.trim() || isNaN(val) || val <= 0) {
      newErrors.value = 'Enter a positive number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    let mm: number;
    if (fromUnit === 'mm') {
      mm = val;
    } else {
      mm = val * 25.4;
    }

    const inches = mm / 25.4;
    const cm = mm / 10;

    // Find nearest common size
    let nearest = COMMON_SIZES[0];
    let minDiff = Math.abs(mm - nearest.mm);
    for (const size of COMMON_SIZES) {
      const diff = Math.abs(mm - size.mm);
      if (diff < minDiff) {
        minDiff = diff;
        nearest = size;
      }
    }

    setResult({ mm, inches, cm, nearestCommon: nearest.label });
  }

  const copyText = result
    ? `Watch Band Size:\n${result.mm.toFixed(2)} mm\n${result.inches.toFixed(4)} inches\n${result.cm.toFixed(2)} cm\nNearest common size: ${result.nearestCommon}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={errors.value}>
        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">
          Band Width
        </label>
        <div className="flex gap-2">
          <input
            id={`${toolId}-value`}
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(e) => { setValue(e.target.value); if (errors.value) setErrors({}); }}
            placeholder="e.g. 22"
            aria-label={`Watch band size for ${toolName}`}
            className="input-field w-32"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value as 'mm' | 'inches')}
            aria-label={`Unit for ${toolName}`}
            className="input-field w-32"
          >
            <option value="mm">mm</option>
            <option value="inches">inches</option>
          </select>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert watch band size" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600">{result.mm.toFixed(2)}</div>
                <div className="text-xs text-gray-500">mm</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-green-600">{result.inches.toFixed(4)}</div>
                <div className="text-xs text-gray-500">inches</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-purple-600">{result.cm.toFixed(2)}</div>
                <div className="text-xs text-gray-500">cm</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-orange-600">{result.nearestCommon}</div>
                <div className="text-xs text-gray-500">Nearest Common</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>

      <details className="bg-gray-50 rounded-lg border border-gray-200">
        <summary className="px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 rounded-lg">
          Common Watch Band Sizes
        </summary>
        <div className="px-4 pb-3 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          {COMMON_SIZES.map((size) => (
            <div key={size.mm} className="text-center p-1 bg-white rounded border">
              <span className="font-bold text-blue-600">{size.mm}mm</span>
              <span className="text-gray-500 block">{(size.mm / 25.4).toFixed(3)}&quot;</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
