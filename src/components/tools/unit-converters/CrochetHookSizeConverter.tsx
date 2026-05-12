'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CrochetHookSizeConverter - Convert crochet hook sizes between US letter, metric mm, and UK systems.
 */
export default function CrochetHookSizeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [inputSystem, setInputSystem] = useState<'us' | 'metric' | 'uk'>('us');
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState<{ us: string; metric: string; uk: string } | null>(null);
  const [error, setError] = useState('');

  const sizeChart: { us: string; metric: number; uk: string }[] = [
    { us: 'B/1', metric: 2.25, uk: '13' },
    { us: 'C/2', metric: 2.75, uk: '12' },
    { us: 'D/3', metric: 3.25, uk: '10' },
    { us: 'E/4', metric: 3.5, uk: '9' },
    { us: 'F/5', metric: 3.75, uk: '9' },
    { us: 'G/6', metric: 4.0, uk: '8' },
    { us: '7', metric: 4.5, uk: '7' },
    { us: 'H/8', metric: 5.0, uk: '6' },
    { us: 'I/9', metric: 5.5, uk: '5' },
    { us: 'J/10', metric: 6.0, uk: '4' },
    { us: 'K/10.5', metric: 6.5, uk: '3' },
    { us: 'L/11', metric: 8.0, uk: '0' },
    { us: 'M/13', metric: 9.0, uk: '00' },
    { us: 'N/15', metric: 10.0, uk: '000' },
    { us: 'P/16', metric: 11.5, uk: '-' },
    { us: 'Q', metric: 15.0, uk: '-' },
    { us: 'S', metric: 19.0, uk: '-' },
  ];

  const convert = () => {
    setError('');
    setResult(null);

    if (!inputValue.trim()) {
      setError('Please enter a hook size');
      return;
    }

    let match: (typeof sizeChart)[0] | undefined;

    if (inputSystem === 'us') {
      match = sizeChart.find((s) => s.us.toLowerCase() === inputValue.trim().toLowerCase());
    } else if (inputSystem === 'metric') {
      const val = parseFloat(inputValue);
      if (isNaN(val)) {
        setError('Enter a valid number for metric size');
        return;
      }
      match = sizeChart.find((s) => Math.abs(s.metric - val) < 0.01);
      if (!match) {
        // Find closest
        match = sizeChart.reduce((prev, curr) =>
          Math.abs(curr.metric - val) < Math.abs(prev.metric - val) ? curr : prev
        );
      }
    } else {
      match = sizeChart.find((s) => s.uk === inputValue.trim());
    }

    if (!match) {
      setError('Size not found in reference chart. Check the chart below for valid sizes.');
      return;
    }

    setResult({ us: match.us, metric: `${match.metric} mm`, uk: match.uk });
  };

  const copyText = result ? `US: ${result.us}\nMetric: ${result.metric}\nUK: ${result.uk}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label className="block text-sm font-medium text-gray-700 mb-1">Input System</label>
        <div className="flex gap-4 mb-3">
          <label className="inline-flex items-center text-sm">
            <input type="radio" checked={inputSystem === 'us'} onChange={() => setInputSystem('us')} className="mr-1" />
            US Letter
          </label>
          <label className="inline-flex items-center text-sm">
            <input type="radio" checked={inputSystem === 'metric'} onChange={() => setInputSystem('metric')} className="mr-1" />
            Metric (mm)
          </label>
          <label className="inline-flex items-center text-sm">
            <input type="radio" checked={inputSystem === 'uk'} onChange={() => setInputSystem('uk')} className="mr-1" />
            UK
          </label>
        </div>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Hook Size ({inputSystem === 'us' ? 'e.g. H/8' : inputSystem === 'metric' ? 'e.g. 5.0' : 'e.g. 6'})
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={inputSystem === 'us' ? 'H/8' : inputSystem === 'metric' ? '5.0' : '6'}
          className="input-field"
          aria-label={`Hook size input for ${toolName}`}
        />
      </InputArea>

      <button onClick={convert} aria-label="Convert hook size" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.us}</div>
                <div className="text-xs text-gray-500 mt-1">US</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-green-600">{result.metric}</div>
                <div className="text-xs text-gray-500 mt-1">Metric</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-purple-600">{result.uk}</div>
                <div className="text-xs text-gray-500 mt-1">UK</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>

      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Reference Chart</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-2 py-1">US</th>
                <th className="border border-gray-200 px-2 py-1">Metric (mm)</th>
                <th className="border border-gray-200 px-2 py-1">UK</th>
              </tr>
            </thead>
            <tbody>
              {sizeChart.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-2 py-1 text-center">{row.us}</td>
                  <td className="border border-gray-200 px-2 py-1 text-center">{row.metric}</td>
                  <td className="border border-gray-200 px-2 py-1 text-center">{row.uk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
