'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BatteryLifeCalculator - Calculate battery life from capacity and drain.
 * Battery Life (hours) = Capacity (mAh) / Current Drain (mA)
 */
export default function BatteryLifeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [capacity, setCapacity] = useState('');
  const [drain, setDrain] = useState('');
  const [efficiency, setEfficiency] = useState('85');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function calculate() {
    setError('');
    setOutput('');

    const cap = parseFloat(capacity);
    const drn = parseFloat(drain);
    const eff = parseFloat(efficiency) / 100;

    if (isNaN(cap) || cap <= 0) {
      setError('Please enter a valid battery capacity (> 0 mAh).');
      return;
    }
    if (isNaN(drn) || drn <= 0) {
      setError('Please enter a valid current drain (> 0 mA).');
      return;
    }
    if (isNaN(eff) || eff <= 0 || eff > 1) {
      setError('Efficiency must be between 1% and 100%.');
      return;
    }

    const idealHours = cap / drn;
    const actualHours = idealHours * eff;
    const days = actualHours / 24;
    const minutes = actualHours * 60;

    const lines: string[] = [];
    lines.push('Battery Life Calculation');
    lines.push('========================');
    lines.push(`Battery Capacity: ${cap} mAh`);
    lines.push(`Current Drain: ${drn} mA`);
    lines.push(`Efficiency Factor: ${(eff * 100).toFixed(0)}%`);
    lines.push('');
    lines.push('Formula: Life = (Capacity / Drain) × Efficiency');
    lines.push(`Life = (${cap} / ${drn}) × ${eff.toFixed(2)}`);
    lines.push('');
    lines.push(`Ideal Battery Life: ${idealHours.toFixed(2)} hours`);
    lines.push(`✓ Estimated Battery Life: ${actualHours.toFixed(2)} hours`);
    lines.push('');
    lines.push(`  ≈ ${days.toFixed(2)} days`);
    lines.push(`  ≈ ${minutes.toFixed(0)} minutes`);
    if (actualHours >= 24) {
      const d = Math.floor(actualHours / 24);
      const h = Math.floor(actualHours % 24);
      const m = Math.round((actualHours % 1) * 60);
      lines.push(`  ≈ ${d} day${d !== 1 ? 's' : ''} ${h} hour${h !== 1 ? 's' : ''} ${m} min`);
    }

    setOutput(lines.join('\n'));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-cap`} className="block text-sm font-medium text-gray-700 mb-1">
          Battery Capacity (mAh)
        </label>
        <input
          id={`${toolId}-cap`}
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          placeholder="e.g. 3000"
          aria-label={`Battery capacity for ${toolName}`}
          className="input-field mb-3"
          min="0"
          step="any"
        />
        <label htmlFor={`${toolId}-drain`} className="block text-sm font-medium text-gray-700 mb-1">
          Current Drain (mA)
        </label>
        <input
          id={`${toolId}-drain`}
          type="number"
          value={drain}
          onChange={(e) => setDrain(e.target.value)}
          placeholder="e.g. 150"
          aria-label="Current drain in mA"
          className="input-field mb-3"
          min="0"
          step="any"
        />
        <label htmlFor={`${toolId}-eff`} className="block text-sm font-medium text-gray-700 mb-1">
          Efficiency (%, default 85%)
        </label>
        <input
          id={`${toolId}-eff`}
          type="number"
          value={efficiency}
          onChange={(e) => setEfficiency(e.target.value)}
          placeholder="85"
          aria-label="Battery efficiency percentage"
          className="input-field mb-3"
          min="1"
          max="100"
          step="1"
        />
        <button onClick={calculate} className="btn-primary mt-2">Calculate Battery Life</button>
      </InputArea>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
