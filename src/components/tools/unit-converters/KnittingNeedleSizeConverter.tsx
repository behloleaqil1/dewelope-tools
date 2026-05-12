'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * KnittingNeedleSizeConverter - Convert knitting needle sizes between US, UK, and metric (mm).
 * Includes a comprehensive reference chart for all standard sizes.
 */
export default function KnittingNeedleSizeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [system, setSystem] = useState<'us' | 'uk' | 'metric'>('us');
  const [inputSize, setInputSize] = useState('');
  const [result, setResult] = useState<{ us: string; uk: string; metric: string } | null>(null);

  // Comprehensive needle size chart: [metric mm, US size, UK/Canadian size]
  const sizeChart: [number, string, string][] = [
    [2.0, '0', '14'],
    [2.25, '1', '13'],
    [2.75, '2', '12'],
    [3.0, '2.5', '11'],
    [3.25, '3', '10'],
    [3.5, '4', '-'],
    [3.75, '5', '9'],
    [4.0, '6', '8'],
    [4.5, '7', '7'],
    [5.0, '8', '6'],
    [5.5, '9', '5'],
    [6.0, '10', '4'],
    [6.5, '10.5', '3'],
    [7.0, '-', '2'],
    [7.5, '-', '1'],
    [8.0, '11', '0'],
    [9.0, '13', '00'],
    [10.0, '15', '000'],
    [12.75, '17', '-'],
    [15.0, '19', '-'],
    [19.0, '35', '-'],
    [25.0, '50', '-'],
  ];

  const convert = () => {
    const val = inputSize.trim();
    if (!val) {
      setResult(null);
      return;
    }

    let found: [number, string, string] | undefined;

    switch (system) {
      case 'metric': {
        const mm = parseFloat(val);
        found = sizeChart.find(row => Math.abs(row[0] - mm) < 0.01);
        if (!found) {
          // Find closest
          found = sizeChart.reduce((prev, curr) =>
            Math.abs(curr[0] - mm) < Math.abs(prev[0] - mm) ? curr : prev
          );
        }
        break;
      }
      case 'us':
        found = sizeChart.find(row => row[1] === val);
        break;
      case 'uk':
        found = sizeChart.find(row => row[2] === val);
        break;
    }

    if (found) {
      setResult({
        metric: `${found[0]} mm`,
        us: found[1] === '-' ? 'N/A' : `US ${found[1]}`,
        uk: found[2] === '-' ? 'N/A' : `UK ${found[2]}`,
      });
    } else {
      setResult(null);
    }
  };

  const copyText = result
    ? `Knitting Needle Size Conversion\nMetric: ${result.metric}\nUS Size: ${result.us}\nUK Size: ${result.uk}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-system`} className="block text-sm font-medium text-gray-700 mb-1">
          Input System
        </label>
        <select
          id={`${toolId}-system`}
          value={system}
          onChange={(e) => setSystem(e.target.value as 'us' | 'uk' | 'metric')}
          aria-label={`Sizing system for ${toolName}`}
          className="input-field"
        >
          <option value="us">US Size</option>
          <option value="uk">UK/Canadian Size</option>
          <option value="metric">Metric (mm)</option>
        </select>
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">
          Needle Size
        </label>
        <input
          id={`${toolId}-size`}
          type="text"
          value={inputSize}
          onChange={(e) => setInputSize(e.target.value)}
          placeholder={system === 'metric' ? 'e.g., 4.0' : system === 'us' ? 'e.g., 8' : 'e.g., 6'}
          aria-label={`Needle size for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={convert} aria-label="Convert needle size" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.metric}</div>
                <div className="text-xs text-gray-500 mt-1">Metric</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-green-600">{result.us}</div>
                <div className="text-xs text-gray-500 mt-1">US</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-purple-600">{result.uk}</div>
                <div className="text-xs text-gray-500 mt-1">UK/Canadian</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Reference Chart</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-2 py-1">Metric (mm)</th>
                <th className="border border-gray-200 px-2 py-1">US</th>
                <th className="border border-gray-200 px-2 py-1">UK</th>
              </tr>
            </thead>
            <tbody>
              {sizeChart.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-2 py-1 text-center">{row[0]}</td>
                  <td className="border border-gray-200 px-2 py-1 text-center">{row[1]}</td>
                  <td className="border border-gray-200 px-2 py-1 text-center">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
