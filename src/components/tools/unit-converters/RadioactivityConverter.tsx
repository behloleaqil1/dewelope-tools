'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RadioactivityConverter - Converts between Becquerel, Curie, Rutherford, and disintegrations/sec.
 * All units represent nuclear decay rate (activity).
 */
export default function RadioactivityConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('becquerel');
  const [results, setResults] = useState<{ unit: string; label: string; value: string }[] | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const units = [
    { id: 'becquerel', label: 'Becquerel (Bq)', factor: 1 },
    { id: 'kilobecquerel', label: 'Kilobecquerel (kBq)', factor: 1e3 },
    { id: 'megabecquerel', label: 'Megabecquerel (MBq)', factor: 1e6 },
    { id: 'gigabecquerel', label: 'Gigabecquerel (GBq)', factor: 1e9 },
    { id: 'curie', label: 'Curie (Ci)', factor: 3.7e10 },
    { id: 'millicurie', label: 'Millicurie (mCi)', factor: 3.7e7 },
    { id: 'microcurie', label: 'Microcurie (µCi)', factor: 3.7e4 },
    { id: 'rutherford', label: 'Rutherford (Rd)', factor: 1e6 },
    { id: 'disintegrations-per-second', label: 'Disintegrations/sec (dps)', factor: 1 },
    { id: 'disintegrations-per-minute', label: 'Disintegrations/min (dpm)', factor: 1 / 60 },
  ];

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim() || isNaN(parseFloat(value))) {
      setResults(null);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const numValue = parseFloat(value);
      const fromFactor = units.find((u) => u.id === fromUnit)?.factor || 1;
      const becquerels = numValue * fromFactor;

      const converted = units.map((u) => ({
        unit: u.id,
        label: u.label,
        value: formatNumber(becquerels / u.factor),
      }));

      setResults(converted);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, fromUnit]);

  const formatNumber = (n: number): string => {
    if (n === 0) return '0';
    if (Math.abs(n) >= 1e12 || (Math.abs(n) < 1e-6 && n !== 0)) {
      return n.toExponential(6);
    }
    return n.toLocaleString('en-US', { maximumFractionDigits: 8 });
  };

  const copyText = results
    ? results.map((r) => `${r.label}: ${r.value}`).join('\n')
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">
            Value
          </label>
          <input
            id={`${toolId}-value`}
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. 1"
            aria-label={`Value to convert for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-from`} className="block text-sm font-medium text-gray-700 mb-1">
            From Unit
          </label>
          <select
            id={`${toolId}-from`}
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            aria-label="Source radioactivity unit"
            className="input-field"
          >
            {units.map((u) => (
              <option key={u.id} value={u.id}>{u.label}</option>
            ))}
          </select>
        </InputArea>
      </div>

      <OutputArea hasContent={results !== null}>
        {results && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Converted Values</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {results.map((r) => (
                <div
                  key={r.unit}
                  className={`flex justify-between items-center p-2 rounded border ${r.unit === fromUnit ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}
                >
                  <span className="text-xs text-gray-600">{r.label}</span>
                  <span className="font-mono text-sm font-bold text-gray-800">{r.value}</span>
                </div>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
