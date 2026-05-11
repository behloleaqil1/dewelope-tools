'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function PaintCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [coats, setCoats] = useState('2');
  const [result, setResult] = useState('');

  const calculate = () => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);
    const c = parseInt(coats);
    if (isNaN(l) || isNaN(w) || isNaN(h) || isNaN(c)) return;
    const wallArea = 2 * (l + w) * h;
    const totalArea = wallArea * c;
    const gallons = totalArea / 350; // ~350 sq ft per gallon
    const liters = gallons * 3.785;
    setResult(`Wall Area: ${wallArea.toFixed(1)} sq ft\nTotal Area (${c} coats): ${totalArea.toFixed(1)} sq ft\n\nPaint Needed:\n${gallons.toFixed(2)} gallons (${liters.toFixed(2)} liters)\n\nBased on ~350 sq ft coverage per gallon`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-3 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-l`} className="block text-sm font-medium text-gray-700 mb-1">Room Length (ft)</label>
          <input id={`${toolId}-l`} type="text" inputMode="decimal" value={length} onChange={(e) => setLength(e.target.value)} placeholder="12" aria-label={`Length for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-w`} className="block text-sm font-medium text-gray-700 mb-1">Room Width (ft)</label>
          <input id={`${toolId}-w`} type="text" inputMode="decimal" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="10" aria-label={`Width for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-h`} className="block text-sm font-medium text-gray-700 mb-1">Wall Height (ft)</label>
          <input id={`${toolId}-h`} type="text" inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="8" aria-label={`Height for ${toolName}`} className="input-field" />
        </InputArea>
      </div>
      <InputArea>
        <label htmlFor={`${toolId}-coats`} className="block text-sm font-medium text-gray-700 mb-1">Number of Coats</label>
        <select id={`${toolId}-coats`} value={coats} onChange={(e) => setCoats(e.target.value)} aria-label={`Coats for ${toolName}`} className="input-field">
          <option value="1">1 coat</option>
          <option value="2">2 coats</option>
          <option value="3">3 coats</option>
        </select>
      </InputArea>
      <button onClick={calculate} className="btn-primary" aria-label="Calculate paint needed">Calculate</button>
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
