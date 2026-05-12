'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PaperWeightConverter - Convert between GSM, basis weight, lb bond, and lb cover.
 */
export default function PaperWeightConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('gsm');
  const [result, setResult] = useState<{ gsm: string; lbBond: string; lbCover: string; lbText: string } | null>(null);
  const [error, setError] = useState('');

  const units = [
    { value: 'gsm', label: 'GSM (g/m²)' },
    { value: 'lb-bond', label: 'lb Bond (Writing)' },
    { value: 'lb-cover', label: 'lb Cover (Card)' },
    { value: 'lb-text', label: 'lb Text (Book)' },
  ];

  // Conversion factors to GSM
  const toGsm = (val: number, unit: string): number => {
    switch (unit) {
      case 'gsm': return val;
      case 'lb-bond': return val * 3.7597;  // 1 lb bond = 3.7597 gsm
      case 'lb-cover': return val * 2.7080;  // 1 lb cover = 2.7080 gsm
      case 'lb-text': return val * 1.4802;  // 1 lb text = 1.4802 gsm
      default: return val;
    }
  };

  const convert = () => {
    setError('');
    setResult(null);

    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
      setError('Please enter a valid positive number.');
      return;
    }

    const gsm = toGsm(num, fromUnit);

    setResult({
      gsm: gsm.toFixed(2),
      lbBond: (gsm / 3.7597).toFixed(2),
      lbCover: (gsm / 2.7080).toFixed(2),
      lbText: (gsm / 1.4802).toFixed(2),
    });
  };

  const copyText = result
    ? `GSM: ${result.gsm} g/m²\nlb Bond: ${result.lbBond}\nlb Cover: ${result.lbCover}\nlb Text: ${result.lbText}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Paper Weight Value</label>
              <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 80" aria-label={`Paper weight value for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-from`} className="block text-sm font-medium text-gray-700 mb-1">From Unit</label>
              <select id={`${toolId}-from`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label="Source paper weight unit" className="input-field">
                {units.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      </InputArea>

      <button onClick={convert} className="btn-primary" aria-label="Convert paper weight">Convert</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600 font-mono">{result.gsm}</div>
                <div className="text-xs text-gray-500 mt-1">GSM (g/m²)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-green-600 font-mono">{result.lbBond}</div>
                <div className="text-xs text-gray-500 mt-1">lb Bond</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-purple-600 font-mono">{result.lbCover}</div>
                <div className="text-xs text-gray-500 mt-1">lb Cover</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-orange-600 font-mono">{result.lbText}</div>
                <div className="text-xs text-gray-500 mt-1">lb Text</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <strong>Common equivalents:</strong> 80 GSM ≈ 20 lb Bond (copy paper), 120 GSM ≈ 32 lb Bond, 300 GSM ≈ 110 lb Cover (card stock)
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
