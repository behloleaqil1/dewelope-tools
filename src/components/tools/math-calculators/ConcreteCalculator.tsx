'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function ConcreteCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [depth, setDepth] = useState('');
  const [unit, setUnit] = useState<'feet' | 'meters'>('feet');
  const [result, setResult] = useState('');

  const calculate = () => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const d = parseFloat(depth);
    if (isNaN(l) || isNaN(w) || isNaN(d)) return;
    let volumeCubicFt: number;
    if (unit === 'feet') {
      volumeCubicFt = l * w * (d / 12); // depth in inches
    } else {
      volumeCubicFt = l * w * d * 35.3147; // m³ to ft³
    }
    const cubicYards = volumeCubicFt / 27;
    const cubicMeters = volumeCubicFt * 0.0283168;
    const bags60lb = Math.ceil(cubicYards * 60);
    const bags80lb = Math.ceil(cubicYards * 45);
    setResult(`Volume: ${volumeCubicFt.toFixed(2)} ft³\nCubic Yards: ${cubicYards.toFixed(2)}\nCubic Meters: ${cubicMeters.toFixed(2)}\n\nEstimated bags needed:\n60 lb bags: ~${bags60lb}\n80 lb bags: ~${bags80lb}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">Unit System</label>
        <select id={`${toolId}-unit`} value={unit} onChange={(e) => setUnit(e.target.value as typeof unit)} aria-label={`Unit for ${toolName}`} className="input-field">
          <option value="feet">Feet (depth in inches)</option>
          <option value="meters">Meters</option>
        </select>
      </InputArea>
      <div className="grid grid-cols-3 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-l`} className="block text-sm font-medium text-gray-700 mb-1">Length</label>
          <input id={`${toolId}-l`} type="text" inputMode="decimal" value={length} onChange={(e) => setLength(e.target.value)} placeholder="10" aria-label={`Length for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-w`} className="block text-sm font-medium text-gray-700 mb-1">Width</label>
          <input id={`${toolId}-w`} type="text" inputMode="decimal" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="10" aria-label={`Width for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-d`} className="block text-sm font-medium text-gray-700 mb-1">Depth{unit === 'feet' ? ' (in)' : ' (m)'}</label>
          <input id={`${toolId}-d`} type="text" inputMode="decimal" value={depth} onChange={(e) => setDepth(e.target.value)} placeholder="4" aria-label={`Depth for ${toolName}`} className="input-field" />
        </InputArea>
      </div>
      <button onClick={calculate} className="btn-primary" aria-label="Calculate concrete">Calculate</button>
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
