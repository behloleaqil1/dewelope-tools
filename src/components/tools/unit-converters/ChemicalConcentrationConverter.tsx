'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ChemicalConcentrationConverter - Convert between molarity, ppm, ppb, mg/L, and percent.
 */
export default function ChemicalConcentrationConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('ppm');
  const [molarMass, setMolarMass] = useState('18.015');
  const [result, setResult] = useState<{ unit: string; value: string }[] | null>(null);
  const [error, setError] = useState('');

  function convert() {
    setError('');
    setResult(null);
    const num = parseFloat(value);
    const mm = parseFloat(molarMass);
    if (!value.trim() || isNaN(num)) { setError('Please enter a valid number'); return; }
    if (isNaN(mm) || mm <= 0) { setError('Please enter a valid molar mass'); return; }

    // Convert to mg/L first (ppm ≈ mg/L for dilute aqueous solutions)
    let mgL: number;
    switch (fromUnit) {
      case 'ppm': mgL = num; break;
      case 'ppb': mgL = num / 1000; break;
      case 'ppt': mgL = num / 1000000; break;
      case 'mgL': mgL = num; break;
      case 'gL': mgL = num * 1000; break;
      case 'molL': mgL = num * mm * 1000; break;
      case 'mmolL': mgL = num * mm; break;
      case 'percent': mgL = num * 10000; break;
      default: mgL = num;
    }

    const results = [
      { unit: 'ppm (mg/kg)', value: mgL.toLocaleString(undefined, { maximumFractionDigits: 6 }) },
      { unit: 'ppb (μg/kg)', value: (mgL * 1000).toLocaleString(undefined, { maximumFractionDigits: 6 }) },
      { unit: 'ppt (ng/kg)', value: (mgL * 1000000).toLocaleString(undefined, { maximumFractionDigits: 6 }) },
      { unit: 'mg/L', value: mgL.toLocaleString(undefined, { maximumFractionDigits: 6 }) },
      { unit: 'g/L', value: (mgL / 1000).toLocaleString(undefined, { maximumFractionDigits: 8 }) },
      { unit: 'mol/L (M)', value: (mgL / (mm * 1000)).toLocaleString(undefined, { maximumFractionDigits: 8 }) },
      { unit: 'mmol/L (mM)', value: (mgL / mm).toLocaleString(undefined, { maximumFractionDigits: 6 }) },
      { unit: '% (w/v)', value: (mgL / 10000).toLocaleString(undefined, { maximumFractionDigits: 8 }) },
    ];
    setResult(results);
  }

  const copyText = result ? result.map(r => `${r.unit}: ${r.value}`).join('\n') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
            <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter concentration" aria-label={`Concentration for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-from`} className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
            <select id={`${toolId}-from`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label="Concentration unit" className="input-field">
              <option value="ppm">ppm</option>
              <option value="ppb">ppb</option>
              <option value="ppt">ppt</option>
              <option value="mgL">mg/L</option>
              <option value="gL">g/L</option>
              <option value="molL">mol/L (M)</option>
              <option value="mmolL">mmol/L (mM)</option>
              <option value="percent">% (w/v)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-mm`} className="block text-sm font-medium text-gray-700 mb-1">Molar Mass (g/mol)</label>
            <input id={`${toolId}-mm`} type="text" inputMode="decimal" value={molarMass} onChange={(e) => setMolarMass(e.target.value)} aria-label="Molar mass" className="input-field" />
          </div>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert concentration" className="btn-primary">Convert</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {result.map(r => (
                <div key={r.unit} className="bg-gray-50 p-2 rounded border border-gray-200 text-sm">
                  <span className="text-gray-500">{r.unit}:</span> <span className="font-mono font-medium">{r.value}</span>
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
