'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PaperWeightConverter - Converts between GSM, basis weight (bond, text, cover).
 * Uses standard conversion factors for US paper weight categories.
 */
export default function PaperWeightConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('gsm');
  const [error, setError] = useState('');
  const [result, setResult] = useState<Record<string, string> | null>(null);

  // Conversion factors: multiply basis weight by factor to get GSM
  const factors: Record<string, number> = {
    bond: 3.76,    // Bond/Writing/Ledger
    text: 1.48,    // Text/Book/Offset
    cover: 2.70,   // Cover/Bristol
    index: 1.81,   // Index
    tag: 1.63,     // Tag
  };

  const convert = () => {
    const num = parseFloat(value);
    if (!value.trim() || isNaN(num) || num <= 0) {
      setError('Please enter a valid positive number');
      setResult(null);
      return;
    }

    setError('');
    let gsm: number;

    if (fromUnit === 'gsm') {
      gsm = num;
    } else {
      gsm = num * factors[fromUnit];
    }

    const results: Record<string, string> = {
      'GSM (g/m²)': gsm.toFixed(1),
      'Bond/Writing (lb)': (gsm / factors.bond).toFixed(1),
      'Text/Book (lb)': (gsm / factors.text).toFixed(1),
      'Cover (lb)': (gsm / factors.cover).toFixed(1),
      'Index (lb)': (gsm / factors.index).toFixed(1),
      'Tag (lb)': (gsm / factors.tag).toFixed(1),
    };

    setResult(results);
  };

  const units = [
    { value: 'gsm', label: 'GSM (g/m²)' },
    { value: 'bond', label: 'Bond/Writing (lb)' },
    { value: 'text', label: 'Text/Book (lb)' },
    { value: 'cover', label: 'Cover (lb)' },
    { value: 'index', label: 'Index (lb)' },
    { value: 'tag', label: 'Tag (lb)' },
  ];

  const copyText = result
    ? Object.entries(result).map(([k, v]) => `${k}: ${v}`).join('\n')
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">
            Paper Weight Value
          </label>
          <input
            id={`${toolId}-value`}
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(e) => { setValue(e.target.value); if (error) setError(''); }}
            placeholder="e.g. 80"
            aria-label={`Paper weight value for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <div>
          <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">
            From Unit
          </label>
          <select
            id={`${toolId}-unit`}
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            aria-label={`Source unit for ${toolName}`}
            className="input-field"
          >
            {units.map((u) => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </select>
        </div>
      </div>

      <button onClick={convert} aria-label="Convert paper weight" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(result).map(([label, val]) => (
                <div key={label} className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                  <div className="text-lg font-bold text-gray-800">{val}</div>
                  <div className="text-xs text-gray-500 mt-1">{label}</div>
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
