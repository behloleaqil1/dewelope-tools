'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MagneticFieldConverter - Convert between Tesla, Gauss, mT, A/m and other magnetic field units.
 */
export default function MagneticFieldConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('tesla');
  const [error, setError] = useState('');
  const [results, setResults] = useState<{ unit: string; value: string }[] | null>(null);

  // Correct factors: Tesla is base
  // 1 T = 10000 Gauss, 1 T = 1000 mT, 1 T = 1e6 µT, 1 T = 1e9 nT
  // 1 Gauss = 1e-4 T, 1 mG = 1e-7 T
  // B = µ₀ * H => H(A/m) = B(T) / µ₀ where µ₀ = 4π×10⁻⁷
  // 1 Oersted = 1 Gauss in CGS (for B), but in SI: 1 Oe = (1000/(4π)) A/m
  // For simplicity, treat Oersted same as Gauss for flux density context

  const toTesla: Record<string, number> = {
    tesla: 1,
    millitesla: 1e-3,
    microtesla: 1e-6,
    nanotesla: 1e-9,
    gauss: 1e-4,
    milligauss: 1e-7,
    ampere_per_meter: 4 * Math.PI * 1e-7,
    oersted: 1e-4,
  };

  const unitLabels: Record<string, string> = {
    tesla: 'Tesla (T)',
    millitesla: 'Millitesla (mT)',
    microtesla: 'Microtesla (µT)',
    nanotesla: 'Nanotesla (nT)',
    gauss: 'Gauss (G)',
    milligauss: 'Milligauss (mG)',
    ampere_per_meter: 'Ampere/meter (A/m)',
    oersted: 'Oersted (Oe)',
  };

  const convert = () => {
    setError('');
    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) {
      setError('Please enter a valid number');
      setResults(null);
      return;
    }

    const inTesla = num * toTesla[fromUnit];
    const converted = Object.entries(toTesla).map(([unit, factor]) => ({
      unit: unitLabels[unit],
      value: (inTesla / factor).toExponential(6),
    }));

    setResults(converted);
  };

  const copyText = results ? results.map((r) => `${r.unit}: ${r.value}`).join('\n') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
          <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 1" aria-label={`Value for ${toolName}`} className="input-field" />
        </InputArea>
        <div>
          <label htmlFor={`${toolId}-from`} className="block text-sm font-medium text-gray-700 mb-1">From Unit</label>
          <select id={`${toolId}-from`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label="Source unit" className="input-field">
            {Object.entries(unitLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <button onClick={convert} aria-label="Convert magnetic field" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={results !== null}>
        {results && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Conversion Results</label>
            <div className="space-y-1">
              {results.map((r, i) => (
                <div key={i} className="flex justify-between bg-gray-50 p-2 rounded border border-gray-200">
                  <span className="text-sm text-gray-600">{r.unit}</span>
                  <span className="text-sm font-mono font-bold text-gray-800">{r.value}</span>
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
