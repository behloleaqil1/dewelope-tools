'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HatSizeConverter - Convert between US, UK, EU hat sizes and head circumference.
 * Provides a reference table and bidirectional conversion.
 */
export default function HatSizeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [circumference, setCircumference] = useState('');
  const [unit, setUnit] = useState<'cm' | 'inches'>('cm');
  const [result, setResult] = useState<{ us: string; uk: string; eu: number; cm: number; inches: number } | null>(null);

  const sizeChart = [
    { us: '6 5/8', uk: '6 1/2', eu: 53, cm: 53, inches: 20.9 },
    { us: '6 3/4', uk: '6 5/8', eu: 54, cm: 54, inches: 21.3 },
    { us: '6 7/8', uk: '6 3/4', eu: 55, cm: 55, inches: 21.7 },
    { us: '7', uk: '6 7/8', eu: 56, cm: 56, inches: 22.0 },
    { us: '7 1/8', uk: '7', eu: 57, cm: 57, inches: 22.4 },
    { us: '7 1/4', uk: '7 1/8', eu: 58, cm: 58, inches: 22.8 },
    { us: '7 3/8', uk: '7 1/4', eu: 59, cm: 59, inches: 23.2 },
    { us: '7 1/2', uk: '7 3/8', eu: 60, cm: 60, inches: 23.6 },
    { us: '7 5/8', uk: '7 1/2', eu: 61, cm: 61, inches: 24.0 },
    { us: '7 3/4', uk: '7 5/8', eu: 62, cm: 62, inches: 24.4 },
    { us: '7 7/8', uk: '7 3/4', eu: 63, cm: 63, inches: 24.8 },
    { us: '8', uk: '7 7/8', eu: 64, cm: 64, inches: 25.2 },
  ];

  const convert = () => {
    const val = parseFloat(circumference);
    if (isNaN(val) || val <= 0) return;

    const cm = unit === 'cm' ? val : val * 2.54;

    // Find closest size
    let closest = sizeChart[0];
    let minDiff = Math.abs(cm - closest.cm);
    for (const size of sizeChart) {
      const diff = Math.abs(cm - size.cm);
      if (diff < minDiff) {
        minDiff = diff;
        closest = size;
      }
    }

    setResult({
      us: closest.us,
      uk: closest.uk,
      eu: closest.eu,
      cm: closest.cm,
      inches: closest.inches,
    });
  };

  const copyText = result
    ? `Hat Size Conversion:\nHead Circumference: ${result.cm} cm (${result.inches}" )\nUS Size: ${result.us}\nUK Size: ${result.uk}\nEU Size: ${result.eu}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-circ`} className="block text-sm font-medium text-gray-700 mb-1">
          Head Circumference
        </label>
        <div className="flex gap-3">
          <input
            id={`${toolId}-circ`}
            type="text"
            inputMode="decimal"
            value={circumference}
            onChange={(e) => setCircumference(e.target.value)}
            placeholder={unit === 'cm' ? 'e.g. 57' : 'e.g. 22.4'}
            aria-label={`Head circumference for ${toolName}`}
            className="input-field flex-1"
          />
          <select value={unit} onChange={(e) => setUnit(e.target.value as 'cm' | 'inches')} aria-label={`Unit for ${toolName}`} className="input-field w-28">
            <option value="cm">cm</option>
            <option value="inches">inches</option>
          </select>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert hat size" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-800">{result.us}</div>
                <div className="text-xs text-gray-500 mt-1">US Size</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-800">{result.uk}</div>
                <div className="text-xs text-gray-500 mt-1">UK Size</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-800">{result.eu}</div>
                <div className="text-xs text-gray-500 mt-1">EU Size</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-800">{result.cm} cm</div>
                <div className="text-xs text-gray-500 mt-1">{result.inches}&quot;</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>

      <div className="mt-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Size Reference Chart</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2 font-medium text-gray-700">US</th>
                <th className="text-left py-2 px-2 font-medium text-gray-700">UK</th>
                <th className="text-center py-2 px-2 font-medium text-gray-700">EU</th>
                <th className="text-center py-2 px-2 font-medium text-gray-700">cm</th>
                <th className="text-center py-2 px-2 font-medium text-gray-700">inches</th>
              </tr>
            </thead>
            <tbody>
              {sizeChart.map((s, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-1.5 px-2">{s.us}</td>
                  <td className="py-1.5 px-2">{s.uk}</td>
                  <td className="text-center py-1.5 px-2">{s.eu}</td>
                  <td className="text-center py-1.5 px-2 font-mono">{s.cm}</td>
                  <td className="text-center py-1.5 px-2 font-mono">{s.inches}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
