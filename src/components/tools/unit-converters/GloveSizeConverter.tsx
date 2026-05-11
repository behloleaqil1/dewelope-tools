'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * GloveSizeConverter - Convert between S/M/L/XL and hand circumference in cm/inches.
 * Includes reference chart for men's and women's glove sizes.
 */
export default function GloveSizeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [measurement, setMeasurement] = useState('');
  const [unit, setUnit] = useState<'cm' | 'inches'>('cm');
  const [gender, setGender] = useState<'men' | 'women'>('men');
  const [result, setResult] = useState<{ size: string; numericSize: string; cm: number; inches: number } | null>(null);

  const sizeChart = {
    men: [
      { size: 'XS', numeric: '7', minCm: 17.8, maxCm: 19.0 },
      { size: 'S', numeric: '7.5-8', minCm: 19.0, maxCm: 20.3 },
      { size: 'M', numeric: '8.5-9', minCm: 20.3, maxCm: 22.9 },
      { size: 'L', numeric: '9.5-10', minCm: 22.9, maxCm: 24.1 },
      { size: 'XL', numeric: '10.5-11', minCm: 24.1, maxCm: 25.4 },
      { size: '2XL', numeric: '11.5-12', minCm: 25.4, maxCm: 27.9 },
    ],
    women: [
      { size: 'XS', numeric: '6', minCm: 15.2, maxCm: 16.5 },
      { size: 'S', numeric: '6.5-7', minCm: 16.5, maxCm: 17.8 },
      { size: 'M', numeric: '7.5', minCm: 17.8, maxCm: 19.0 },
      { size: 'L', numeric: '8', minCm: 19.0, maxCm: 20.3 },
      { size: 'XL', numeric: '8.5-9', minCm: 20.3, maxCm: 21.6 },
      { size: '2XL', numeric: '9.5-10', minCm: 21.6, maxCm: 23.0 },
    ],
  };

  const convert = () => {
    const val = parseFloat(measurement);
    if (isNaN(val) || val <= 0) {
      setResult(null);
      return;
    }

    const cm = unit === 'cm' ? val : val * 2.54;
    const inches = unit === 'inches' ? val : val / 2.54;

    const chart = sizeChart[gender];
    let matched = chart[chart.length - 1];
    for (const entry of chart) {
      if (cm <= entry.maxCm) {
        matched = entry;
        break;
      }
    }

    setResult({ size: matched.size, numericSize: matched.numeric, cm, inches });
  };

  const copyText = result
    ? `Glove Size: ${result.size} (Numeric: ${result.numericSize})\nHand Circumference: ${result.cm.toFixed(1)} cm / ${result.inches.toFixed(1)} inches\nGender: ${gender === 'men' ? 'Men' : 'Women'}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-measurement`} className="block text-sm font-medium text-gray-700 mb-1">Hand Circumference</label>
          <input id={`${toolId}-measurement`} type="text" inputMode="decimal" value={measurement} onChange={(e) => setMeasurement(e.target.value)} placeholder="e.g. 21" aria-label={`Hand circumference for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
          <select id={`${toolId}-unit`} value={unit} onChange={(e) => setUnit(e.target.value as 'cm' | 'inches')} className="input-field" aria-label="Measurement unit">
            <option value="cm">Centimeters</option>
            <option value="inches">Inches</option>
          </select>
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-gender`} className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select id={`${toolId}-gender`} value={gender} onChange={(e) => setGender(e.target.value as 'men' | 'women')} className="input-field" aria-label="Gender sizing">
            <option value="men">Men</option>
            <option value="women">Women</option>
          </select>
        </InputArea>
      </div>

      <button onClick={convert} aria-label="Convert glove size" className="btn-primary">
        Find Glove Size
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
              <div className="text-3xl font-bold text-blue-700">{result.size}</div>
              <div className="text-sm text-blue-600 mt-1">Numeric: {result.numericSize}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.cm.toFixed(1)} cm</div>
                <div className="text-xs text-gray-500">Circumference</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.inches.toFixed(1)}&quot;</div>
                <div className="text-xs text-gray-500">Circumference</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>

      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">{gender === 'men' ? "Men's" : "Women's"} Size Chart</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-3 py-2 text-left">Size</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Numeric</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Circumference (cm)</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Circumference (in)</th>
              </tr>
            </thead>
            <tbody>
              {sizeChart[gender].map((row) => (
                <tr key={row.size} className={result && result.size === row.size ? 'bg-blue-50' : ''}>
                  <td className="border border-gray-200 px-3 py-2 font-medium">{row.size}</td>
                  <td className="border border-gray-200 px-3 py-2">{row.numeric}</td>
                  <td className="border border-gray-200 px-3 py-2">{row.minCm.toFixed(1)} – {row.maxCm.toFixed(1)}</td>
                  <td className="border border-gray-200 px-3 py-2">{(row.minCm / 2.54).toFixed(1)} – {(row.maxCm / 2.54).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
