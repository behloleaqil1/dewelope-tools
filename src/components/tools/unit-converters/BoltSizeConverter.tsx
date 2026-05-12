'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BoltSizeConverter - Convert bolt/screw sizes between metric (M) and imperial (inches).
 */

interface BoltSize {
  metric: string;
  diameter_mm: number;
  imperial: string;
  diameter_in: number;
  tpi: number; // threads per inch (coarse)
  pitch_mm: number; // metric coarse pitch
}

const BOLT_TABLE: BoltSize[] = [
  { metric: 'M1.6', diameter_mm: 1.6, imperial: '#0', diameter_in: 0.060, tpi: 80, pitch_mm: 0.35 },
  { metric: 'M2', diameter_mm: 2.0, imperial: '#1', diameter_in: 0.073, tpi: 64, pitch_mm: 0.40 },
  { metric: 'M2.5', diameter_mm: 2.5, imperial: '#3', diameter_in: 0.099, tpi: 48, pitch_mm: 0.45 },
  { metric: 'M3', diameter_mm: 3.0, imperial: '#4', diameter_in: 0.112, tpi: 40, pitch_mm: 0.50 },
  { metric: 'M3.5', diameter_mm: 3.5, imperial: '#6', diameter_in: 0.138, tpi: 32, pitch_mm: 0.60 },
  { metric: 'M4', diameter_mm: 4.0, imperial: '#8', diameter_in: 0.164, tpi: 32, pitch_mm: 0.70 },
  { metric: 'M5', diameter_mm: 5.0, imperial: '#10', diameter_in: 0.190, tpi: 24, pitch_mm: 0.80 },
  { metric: 'M6', diameter_mm: 6.0, imperial: '1/4"', diameter_in: 0.250, tpi: 20, pitch_mm: 1.00 },
  { metric: 'M8', diameter_mm: 8.0, imperial: '5/16"', diameter_in: 0.3125, tpi: 18, pitch_mm: 1.25 },
  { metric: 'M10', diameter_mm: 10.0, imperial: '3/8"', diameter_in: 0.375, tpi: 16, pitch_mm: 1.50 },
  { metric: 'M12', diameter_mm: 12.0, imperial: '1/2"', diameter_in: 0.500, tpi: 13, pitch_mm: 1.75 },
  { metric: 'M14', diameter_mm: 14.0, imperial: '9/16"', diameter_in: 0.5625, tpi: 12, pitch_mm: 2.00 },
  { metric: 'M16', diameter_mm: 16.0, imperial: '5/8"', diameter_in: 0.625, tpi: 11, pitch_mm: 2.00 },
  { metric: 'M20', diameter_mm: 20.0, imperial: '3/4"', diameter_in: 0.750, tpi: 10, pitch_mm: 2.50 },
  { metric: 'M24', diameter_mm: 24.0, imperial: '1"', diameter_in: 1.000, tpi: 8, pitch_mm: 3.00 },
];

export default function BoltSizeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromSystem, setFromSystem] = useState<'metric' | 'imperial'>('metric');
  const [error, setError] = useState('');
  const [results, setResults] = useState<BoltSize[]>([]);

  const convert = () => {
    setError('');
    setResults([]);

    const query = value.trim().toLowerCase();
    if (!query) {
      setError('Please enter a bolt size (e.g., M8, 3/8, #10, 5)');
      return;
    }

    let matches: BoltSize[] = [];

    if (fromSystem === 'metric') {
      // Search by metric designation or diameter
      const numVal = parseFloat(query.replace('m', ''));
      matches = BOLT_TABLE.filter(b =>
        b.metric.toLowerCase().includes(query) ||
        (!isNaN(numVal) && Math.abs(b.diameter_mm - numVal) < 0.5)
      );
    } else {
      // Search by imperial designation or diameter
      matches = BOLT_TABLE.filter(b =>
        b.imperial.toLowerCase().includes(query) ||
        b.imperial.toLowerCase().replace('"', '').includes(query)
      );
      if (matches.length === 0) {
        const numVal = parseFloat(query);
        if (!isNaN(numVal)) {
          matches = BOLT_TABLE.filter(b => Math.abs(b.diameter_in - numVal) < 0.02);
        }
      }
    }

    if (matches.length === 0) {
      setError('No matching bolt size found. Try a different value.');
      return;
    }

    setResults(matches);
  };

  const copyText = results.map(r =>
    `${r.metric} (${r.diameter_mm}mm) ↔ ${r.imperial} (${r.diameter_in}") | Pitch: ${r.pitch_mm}mm | TPI: ${r.tpi}`
  ).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">
            Bolt/Screw Size
          </label>
          <input
            id={`${toolId}-value`}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={fromSystem === 'metric' ? 'e.g. M8 or 8' : 'e.g. 3/8 or #10'}
            aria-label={`Bolt size for ${toolName}`}
            className="input-field"
          />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-system`} className="block text-sm font-medium text-gray-700 mb-1">
            From System
          </label>
          <select
            id={`${toolId}-system`}
            value={fromSystem}
            onChange={(e) => setFromSystem(e.target.value as 'metric' | 'imperial')}
            aria-label={`Size system for ${toolName}`}
            className="input-field"
          >
            <option value="metric">Metric (M)</option>
            <option value="imperial">Imperial (inches/#)</option>
          </select>
        </InputArea>
      </div>

      <button onClick={convert} aria-label="Convert bolt size" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={results.length > 0}>
        {results.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Conversion Results</label>
              <CopyToClipboard text={copyText} />
            </div>
            {results.map((r, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">{r.metric}</div>
                    <div className="text-xs text-gray-500">Metric</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">{r.imperial}</div>
                    <div className="text-xs text-gray-500">Imperial</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">{r.diameter_mm}mm</div>
                    <div className="text-xs text-gray-500">Diameter</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-600">{r.diameter_in}&quot;</div>
                    <div className="text-xs text-gray-500">Diameter</div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600 text-center">
                  Metric pitch: {r.pitch_mm}mm | Imperial TPI (coarse): {r.tpi}
                </div>
              </div>
            ))}
          </div>
        )}
      </OutputArea>
    </div>
  );
}
