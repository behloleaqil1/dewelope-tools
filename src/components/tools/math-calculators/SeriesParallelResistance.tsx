'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SeriesParallelResistance - Calculates total resistance for series and parallel configurations.
 */
export default function SeriesParallelResistance({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [resistors, setResistors] = useState('');
  const [config, setConfig] = useState<'series' | 'parallel'>('series');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{ total: number; values: number[]; formula: string } | null>(null);

  const calculate = () => {
    setError(undefined);
    setResult(null);
    const values = resistors.split(/[,\s]+/).map(s => parseFloat(s.trim())).filter(n => !isNaN(n));

    if (values.length < 2) { setError('Enter at least 2 resistor values (comma or space separated)'); return; }
    if (values.some(v => v <= 0)) { setError('All resistor values must be greater than 0'); return; }

    let total: number;
    let formula: string;

    if (config === 'series') {
      total = values.reduce((sum, v) => sum + v, 0);
      formula = `R_total = ${values.join(' + ')} = ${total.toFixed(4)} Ω`;
    } else {
      const reciprocalSum = values.reduce((sum, v) => sum + (1 / v), 0);
      total = 1 / reciprocalSum;
      formula = `1/R_total = ${values.map(v => `1/${v}`).join(' + ')} = ${reciprocalSum.toFixed(6)}\nR_total = ${total.toFixed(4)} Ω`;
    }

    setResult({ total, values, formula });
  };

  const copyText = result ? `Configuration: ${config}\nResistors: ${result.values.join(', ')} Ω\nTotal Resistance: ${result.total.toFixed(4)} Ω\n\n${result.formula}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-config`} className="block text-sm font-medium text-gray-700 mb-1">Configuration</label>
            <select id={`${toolId}-config`} value={config} onChange={(e) => setConfig(e.target.value as typeof config)} aria-label={`Resistor configuration for ${toolName}`} className="input-field">
              <option value="series">Series (R₁ + R₂ + ...)</option>
              <option value="parallel">Parallel (1/R₁ + 1/R₂ + ...)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-values`} className="block text-sm font-medium text-gray-700 mb-1">Resistor Values (Ω)</label>
            <input id={`${toolId}-values`} type="text" value={resistors} onChange={(e) => setResistors(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && calculate()} placeholder="100, 200, 330" aria-label="Resistor values comma separated" className="input-field font-mono" />
            <p className="text-xs text-gray-500 mt-1">Separate values with commas or spaces</p>
          </div>
        </div>
      </InputArea>
      <button onClick={calculate} aria-label="Calculate total resistance" className="btn-primary">Calculate</button>
      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-center">
              <div className="text-xs text-gray-500 mb-1">{config === 'series' ? 'Series' : 'Parallel'} Total Resistance</div>
              <div className="text-2xl font-bold text-yellow-700">{result.total.toFixed(4)} Ω</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Formula</div>
              <div className="text-sm font-mono text-gray-800 whitespace-pre-wrap">{result.formula}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.values.map((v, i) => (
                <span key={i} className="bg-blue-50 text-blue-700 text-sm px-2 py-1 rounded border border-blue-200 font-mono">R{i + 1} = {v}Ω</span>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
