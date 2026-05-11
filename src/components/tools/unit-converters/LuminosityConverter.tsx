'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * LuminosityConverter - Convert between candela, lumen, lux, and watt (at 555nm).
 * Uses standard photometric relationships.
 */
export default function LuminosityConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('candela');
  const [toUnit, setToUnit] = useState('lumen');
  const [solidAngle, setSolidAngle] = useState('1');
  const [area, setArea] = useState('1');
  const [distance, setDistance] = useState('1');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ value: number; formula: string } | null>(null);

  const units = [
    { value: 'candela', label: 'Candela (cd)' },
    { value: 'lumen', label: 'Lumen (lm)' },
    { value: 'lux', label: 'Lux (lx)' },
    { value: 'watt', label: 'Watt (W) at 555nm' },
  ];

  const calculate = () => {
    const val = parseFloat(value);
    const sr = parseFloat(solidAngle);
    const a = parseFloat(area);
    const d = parseFloat(distance);

    if (isNaN(val) || val < 0) {
      setError('Please enter a valid non-negative number.');
      setResult(null);
      return;
    }

    setError('');
    const LUMINOUS_EFFICACY = 683; // lm/W at 555nm

    // Convert to lumens first as intermediate
    let lumens: number;
    let formula = '';

    switch (fromUnit) {
      case 'candela':
        lumens = val * (isNaN(sr) || sr <= 0 ? 1 : sr);
        formula = `${val} cd × ${sr} sr = ${lumens.toFixed(4)} lm`;
        break;
      case 'lumen':
        lumens = val;
        formula = `${val} lm`;
        break;
      case 'lux':
        lumens = val * (isNaN(a) || a <= 0 ? 1 : a);
        formula = `${val} lx × ${a} m² = ${lumens.toFixed(4)} lm`;
        break;
      case 'watt':
        lumens = val * LUMINOUS_EFFICACY;
        formula = `${val} W × 683 lm/W = ${lumens.toFixed(4)} lm`;
        break;
      default:
        lumens = val;
    }

    // Convert from lumens to target
    let output: number;
    switch (toUnit) {
      case 'candela':
        output = lumens / (isNaN(sr) || sr <= 0 ? 1 : sr);
        formula += ` → ${output.toFixed(6)} cd`;
        break;
      case 'lumen':
        output = lumens;
        formula += ` → ${output.toFixed(6)} lm`;
        break;
      case 'lux':
        const distSq = (isNaN(d) || d <= 0 ? 1 : d) ** 2;
        output = lumens / (4 * Math.PI * distSq);
        formula += ` → ${output.toFixed(6)} lx (at ${d}m)`;
        break;
      case 'watt':
        output = lumens / LUMINOUS_EFFICACY;
        formula += ` → ${output.toFixed(6)} W`;
        break;
      default:
        output = lumens;
    }

    setResult({ value: output, formula });
  };

  const copyText = result ? `${result.value.toFixed(6)} ${units.find(u => u.value === toUnit)?.label || toUnit}\n${result.formula}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
            <input
              id={`${toolId}-value`}
              type="text"
              inputMode="decimal"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. 100"
              aria-label={`Value for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-from`} className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <select id={`${toolId}-from`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label={`Source unit for ${toolName}`} className="input-field">
              {units.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-to`} className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <select id={`${toolId}-to`} value={toUnit} onChange={(e) => setToUnit(e.target.value)} aria-label={`Target unit for ${toolName}`} className="input-field">
              {units.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label htmlFor={`${toolId}-sr`} className="block text-sm font-medium text-gray-700 mb-1">Solid Angle (sr)</label>
            <input id={`${toolId}-sr`} type="text" inputMode="decimal" value={solidAngle} onChange={(e) => setSolidAngle(e.target.value)} placeholder="1" aria-label={`Solid angle for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-area`} className="block text-sm font-medium text-gray-700 mb-1">Area (m²)</label>
            <input id={`${toolId}-area`} type="text" inputMode="decimal" value={area} onChange={(e) => setArea(e.target.value)} placeholder="1" aria-label={`Area for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-distance`} className="block text-sm font-medium text-gray-700 mb-1">Distance (m)</label>
            <input id={`${toolId}-distance`} type="text" inputMode="decimal" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="1" aria-label={`Distance for ${toolName}`} className="input-field" />
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} className="btn-primary" aria-label="Convert luminosity">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{result.value.toFixed(6)}</div>
              <div className="text-xs text-gray-500 mt-1">{units.find(u => u.value === toUnit)?.label}</div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              {result.formula}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
