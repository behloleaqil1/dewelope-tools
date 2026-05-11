'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function MarkupToMarginConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [mode, setMode] = useState<'markup-to-margin' | 'margin-to-markup'>('markup-to-margin');
  const [result, setResult] = useState('');

  const calculate = () => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    if (mode === 'markup-to-margin') {
      const margin = (num / (100 + num)) * 100;
      setResult(`Markup: ${num}%\nMargin: ${margin.toFixed(4)}%\n\nFormula: Margin = Markup / (100 + Markup) × 100`);
    } else {
      const markup = (num / (100 - num)) * 100;
      setResult(`Margin: ${num}%\nMarkup: ${markup.toFixed(4)}%\n\nFormula: Markup = Margin / (100 - Margin) × 100`);
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">Conversion Direction</label>
        <select id={`${toolId}-mode`} value={mode} onChange={(e) => setMode(e.target.value as typeof mode)} aria-label={`Mode for ${toolName}`} className="input-field">
          <option value="markup-to-margin">Markup → Margin</option>
          <option value="margin-to-markup">Margin → Markup</option>
        </select>
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-val`} className="block text-sm font-medium text-gray-700 mb-1">{mode === 'markup-to-margin' ? 'Markup' : 'Margin'} (%)</label>
        <input id={`${toolId}-val`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 50" aria-label={`Percentage for ${toolName}`} className="input-field" />
      </InputArea>
      <button onClick={calculate} className="btn-primary" aria-label="Convert">Convert</button>
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
