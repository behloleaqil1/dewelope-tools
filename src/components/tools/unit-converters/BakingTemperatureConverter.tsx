'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function BakingTemperatureConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('celsius');
  const [result, setResult] = useState('');

  const convert = () => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    let celsius: number;
    if (fromUnit === 'celsius') celsius = num;
    else if (fromUnit === 'fahrenheit') celsius = (num - 32) * 5 / 9;
    else celsius = (num * 14) + 121; // gas mark approx
    const fahrenheit = celsius * 9 / 5 + 32;
    const gasMark = Math.round((celsius - 121) / 14);
    const desc = celsius < 150 ? 'Cool' : celsius < 180 ? 'Moderate' : celsius < 220 ? 'Hot' : 'Very Hot';
    setResult(`Celsius: ${celsius.toFixed(0)}°C\nFahrenheit: ${fahrenheit.toFixed(0)}°F\nGas Mark: ${gasMark}\nDescription: ${desc}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-val`} className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
        <input id={`${toolId}-val`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 180" aria-label={`Temperature for ${toolName}`} className="input-field" />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">From Unit</label>
        <select id={`${toolId}-unit`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label={`Unit for ${toolName}`} className="input-field">
          <option value="celsius">Celsius (°C)</option>
          <option value="fahrenheit">Fahrenheit (°F)</option>
          <option value="gasmark">Gas Mark</option>
        </select>
      </InputArea>
      <button onClick={convert} className="btn-primary" aria-label="Convert temperature">Convert</button>
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
