'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MetricPrefixConverter - Convert between metric prefixes (nano, micro, milli, kilo, mega, giga).
 */
export default function MetricPrefixConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromPrefix, setFromPrefix] = useState('base');
  const [toPrefix, setToPrefix] = useState('kilo');
  const [result, setResult] = useState<{ converted: string; formula: string } | null>(null);
  const [error, setError] = useState('');

  const prefixes: { value: string; label: string; exponent: number }[] = [
    { value: 'pico', label: 'Pico (p) - 10⁻¹²', exponent: -12 },
    { value: 'nano', label: 'Nano (n) - 10⁻⁹', exponent: -9 },
    { value: 'micro', label: 'Micro (μ) - 10⁻⁶', exponent: -6 },
    { value: 'milli', label: 'Milli (m) - 10⁻³', exponent: -3 },
    { value: 'centi', label: 'Centi (c) - 10⁻²', exponent: -2 },
    { value: 'deci', label: 'Deci (d) - 10⁻¹', exponent: -1 },
    { value: 'base', label: 'Base unit (1)', exponent: 0 },
    { value: 'deca', label: 'Deca (da) - 10¹', exponent: 1 },
    { value: 'hecto', label: 'Hecto (h) - 10²', exponent: 2 },
    { value: 'kilo', label: 'Kilo (k) - 10³', exponent: 3 },
    { value: 'mega', label: 'Mega (M) - 10⁶', exponent: 6 },
    { value: 'giga', label: 'Giga (G) - 10⁹', exponent: 9 },
    { value: 'tera', label: 'Tera (T) - 10¹²', exponent: 12 },
  ];

  const convert = () => {
    setError('');
    setResult(null);

    const num = parseFloat(value);
    if (isNaN(num)) {
      setError('Please enter a valid number.');
      return;
    }

    const from = prefixes.find(p => p.value === fromPrefix);
    const to = prefixes.find(p => p.value === toPrefix);

    if (!from || !to) {
      setError('Invalid prefix selection.');
      return;
    }

    const exponentDiff = from.exponent - to.exponent;
    const converted = num * Math.pow(10, exponentDiff);

    const fromLabel = from.label.split(' ')[0];
    const toLabel = to.label.split(' ')[0];
    const formula = `${num} ${fromLabel} = ${num} × 10^(${exponentDiff}) ${toLabel} = ${converted}`;

    setResult({
      converted: converted.toPrecision(10).replace(/\.?0+$/, ''),
      formula,
    });
  };

  const copyText = result ? `${value} ${fromPrefix} = ${result.converted} ${toPrefix}\n${result.formula}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
            <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="1000" aria-label={`Value for ${toolName}`} className="input-field" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-from`} className="block text-sm font-medium text-gray-700 mb-1">From Prefix</label>
              <select id={`${toolId}-from`} value={fromPrefix} onChange={(e) => setFromPrefix(e.target.value)} aria-label="Source metric prefix" className="input-field">
                {prefixes.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-to`} className="block text-sm font-medium text-gray-700 mb-1">To Prefix</label>
              <select id={`${toolId}-to`} value={toPrefix} onChange={(e) => setToPrefix(e.target.value)} aria-label="Target metric prefix" className="input-field">
                {prefixes.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      </InputArea>

      <button onClick={convert} className="btn-primary" aria-label="Convert metric prefix">Convert</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600 font-mono">{result.converted}</div>
              <div className="text-xs text-gray-500 mt-1">{toPrefix} units</div>
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
