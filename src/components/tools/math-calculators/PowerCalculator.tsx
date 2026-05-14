'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PowerCalculator - Calculates power from voltage/current or work/time.
 */
export default function PowerCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'electrical' | 'mechanical'>('electrical');
  const [voltage, setVoltage] = useState('');
  const [current, setCurrent] = useState('');
  const [work, setWork] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{ watts: number; kw: number; hp: number; btu: number; formula: string } | null>(null);

  const calculate = () => {
    setError(undefined);
    setResult(null);

    let watts: number;
    let formula: string;

    if (mode === 'electrical') {
      const v = parseFloat(voltage);
      const i = parseFloat(current);
      if (isNaN(v) || v < 0) { setError('Enter a valid voltage'); return; }
      if (isNaN(i) || i < 0) { setError('Enter a valid current'); return; }
      watts = v * i;
      formula = `P = V × I = ${v} × ${i} = ${watts.toFixed(4)} W`;
    } else {
      const w = parseFloat(work);
      const t = parseFloat(time);
      if (isNaN(w) || w < 0) { setError('Enter a valid work value'); return; }
      if (isNaN(t) || t <= 0) { setError('Enter a valid time greater than 0'); return; }
      watts = w / t;
      formula = `P = W / t = ${w} / ${t} = ${watts.toFixed(4)} W`;
    }

    setResult({
      watts,
      kw: watts / 1000,
      hp: watts / 745.7,
      btu: watts * 3.412,
      formula,
    });
  };

  const copyText = result ? `Power: ${result.watts.toFixed(4)} W\nPower: ${result.kw.toFixed(6)} kW\nHorsepower: ${result.hp.toFixed(4)} hp\nBTU/h: ${result.btu.toFixed(4)}\n\n${result.formula}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">Calculation Mode</label>
            <select id={`${toolId}-mode`} value={mode} onChange={(e) => setMode(e.target.value as typeof mode)} aria-label={`Power calculation mode for ${toolName}`} className="input-field">
              <option value="electrical">Electrical (P = V × I)</option>
              <option value="mechanical">Mechanical (P = W / t)</option>
            </select>
          </div>
          {mode === 'electrical' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor={`${toolId}-voltage`} className="block text-sm font-medium text-gray-700 mb-1">Voltage (V)</label>
                <input id={`${toolId}-voltage`} type="number" value={voltage} onChange={(e) => setVoltage(e.target.value)} placeholder="120" aria-label="Voltage in volts" className="input-field" />
              </div>
              <div>
                <label htmlFor={`${toolId}-current`} className="block text-sm font-medium text-gray-700 mb-1">Current (A)</label>
                <input id={`${toolId}-current`} type="number" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="2" aria-label="Current in amperes" className="input-field" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor={`${toolId}-work`} className="block text-sm font-medium text-gray-700 mb-1">Work (J)</label>
                <input id={`${toolId}-work`} type="number" value={work} onChange={(e) => setWork(e.target.value)} placeholder="1000" aria-label="Work in joules" className="input-field" />
              </div>
              <div>
                <label htmlFor={`${toolId}-time`} className="block text-sm font-medium text-gray-700 mb-1">Time (s)</label>
                <input id={`${toolId}-time`} type="number" value={time} onChange={(e) => setTime(e.target.value)} placeholder="5" aria-label="Time in seconds" className="input-field" />
              </div>
            </div>
          )}
        </div>
      </InputArea>
      <button onClick={calculate} aria-label="Calculate power" className="btn-primary">Calculate</button>
      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 text-center">
              <div className="text-xs text-gray-500 mb-1">{result.formula}</div>
              <div className="text-2xl font-bold text-purple-700">{result.watts.toFixed(4)} W</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.kw.toFixed(6)}</div>
                <div className="text-xs text-gray-500">kW</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.hp.toFixed(4)}</div>
                <div className="text-xs text-gray-500">Horsepower</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.btu.toFixed(4)}</div>
                <div className="text-xs text-gray-500">BTU/h</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
