'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PhScaleCalculator - Convert between pH, H+ concentration, and pOH.
 * pH = -log10([H+]), pOH = 14 - pH, [H+] = 10^(-pH)
 */
export default function PhScaleCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'ph' | 'h' | 'poh'>('ph');
  const [input, setInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ ph: number; poh: number; hConc: number; ohConc: number; nature: string } | null>(null);

  const getNature = (ph: number): string => {
    if (ph < 7) return 'Acidic';
    if (ph > 7) return 'Basic (Alkaline)';
    return 'Neutral';
  };

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const val = parseFloat(input);

    if (!input.trim() || isNaN(val)) {
      newErrors.input = 'Please enter a valid number';
      setErrors(newErrors);
      setResult(null);
      return;
    }

    let ph: number;

    if (mode === 'ph') {
      if (val < 0 || val > 14) {
        newErrors.input = 'pH must be between 0 and 14';
        setErrors(newErrors);
        setResult(null);
        return;
      }
      ph = val;
    } else if (mode === 'h') {
      if (val <= 0) {
        newErrors.input = 'H+ concentration must be positive';
        setErrors(newErrors);
        setResult(null);
        return;
      }
      ph = -Math.log10(val);
    } else {
      if (val < 0 || val > 14) {
        newErrors.input = 'pOH must be between 0 and 14';
        setErrors(newErrors);
        setResult(null);
        return;
      }
      ph = 14 - val;
    }

    const poh = 14 - ph;
    const hConc = Math.pow(10, -ph);
    const ohConc = Math.pow(10, -poh);

    setErrors({});
    setResult({ ph, poh, hConc, ohConc, nature: getNature(ph) });
  };

  const formatScientific = (n: number): string => {
    if (n === 0) return '0';
    return n.toExponential(4);
  };

  const copyText = result
    ? `pH: ${result.ph.toFixed(4)}\npOH: ${result.poh.toFixed(4)}\n[H+]: ${formatScientific(result.hConc)} mol/L\n[OH-]: ${formatScientific(result.ohConc)} mol/L\nNature: ${result.nature}`
    : '';

  const getPhColor = (ph: number): string => {
    if (ph < 3) return 'text-red-700';
    if (ph < 6) return 'text-orange-600';
    if (ph < 7) return 'text-yellow-600';
    if (ph === 7) return 'text-green-600';
    if (ph < 9) return 'text-teal-600';
    if (ph < 12) return 'text-blue-600';
    return 'text-purple-700';
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-4 flex-wrap">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" checked={mode === 'ph'} onChange={() => setMode('ph')} className="text-blue-600" />
          <span className="text-sm text-gray-700">From pH</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" checked={mode === 'h'} onChange={() => setMode('h')} className="text-blue-600" />
          <span className="text-sm text-gray-700">From [H+] mol/L</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" checked={mode === 'poh'} onChange={() => setMode('poh')} className="text-blue-600" />
          <span className="text-sm text-gray-700">From pOH</span>
        </label>
      </div>

      <InputArea error={errors.input}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'ph' ? 'pH Value (0–14)' : mode === 'h' ? 'H+ Concentration (mol/L)' : 'pOH Value (0–14)'}
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          inputMode="decimal"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (errors.input) setErrors({});
          }}
          placeholder={mode === 'ph' ? 'e.g. 7' : mode === 'h' ? 'e.g. 0.001' : 'e.g. 7'}
          aria-label={`${mode} input for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate pH values" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className={`text-2xl font-bold ${getPhColor(result.ph)}`}>{result.ph.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">pH</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.poh.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">pOH</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-1">
              <p><strong>[H+]:</strong> {formatScientific(result.hConc)} mol/L</p>
              <p><strong>[OH-]:</strong> {formatScientific(result.ohConc)} mol/L</p>
              <p><strong>Nature:</strong> {result.nature}</p>
              <p className="text-xs text-gray-400 mt-2">pH + pOH = 14 (at 25°C)</p>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
