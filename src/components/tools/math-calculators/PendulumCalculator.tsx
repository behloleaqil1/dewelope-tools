'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PendulumCalculator - Calculate pendulum period and frequency from length and gravity.
 */
export default function PendulumCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [length, setLength] = useState('');
  const [gravity, setGravity] = useState('9.81');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const L = parseFloat(length);
    const g = parseFloat(gravity);

    if (isNaN(L) || L <= 0 || isNaN(g) || g <= 0) {
      setOutput('Please enter valid positive values for length and gravity.');
      return;
    }

    const period = 2 * Math.PI * Math.sqrt(L / g);
    const frequency = 1 / period;
    const angularFreq = 2 * Math.PI * frequency;

    const lines = [
      `Pendulum Length: ${L} m`,
      `Gravity: ${g} m/s²`,
      ``,
      `Period (T): ${period.toFixed(6)} s`,
      `Frequency (f): ${frequency.toFixed(6)} Hz`,
      `Angular Frequency (ω): ${angularFreq.toFixed(6)} rad/s`,
      ``,
      `Formula: T = 2π√(L/g)`,
      `T = 2π√(${L}/${g}) = ${period.toFixed(6)} s`,
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-length`} className="block text-sm font-medium text-gray-700 mb-1">Pendulum Length (meters)</label>
            <input id={`${toolId}-length`} type="number" value={length} onChange={e => setLength(e.target.value)} placeholder="1.0" step="any" min="0" aria-label={`Pendulum length for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-gravity`} className="block text-sm font-medium text-gray-700 mb-1">Gravity (m/s²)</label>
            <input id={`${toolId}-gravity`} type="number" value={gravity} onChange={e => setGravity(e.target.value)} placeholder="9.81" step="any" min="0" aria-label="Gravitational acceleration" className="input-field" />
          </div>
          <button onClick={calculate} className="btn-primary w-full">Calculate Period & Frequency</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-md">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
