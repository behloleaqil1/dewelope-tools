'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function NumberingSystemConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState('10');
  const [result, setResult] = useState('');

  const convert = () => {
    if (!input.trim()) return;
    try {
      const decimal = parseInt(input, parseInt(fromBase));
      if (isNaN(decimal)) { setResult('Invalid input for selected base'); return; }
      setResult(`Decimal (10): ${decimal}\nBinary (2): ${decimal.toString(2)}\nOctal (8): ${decimal.toString(8)}\nHexadecimal (16): ${decimal.toString(16).toUpperCase()}\nBase-36: ${decimal.toString(36)}`);
    } catch { setResult('Invalid input'); }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Enter number</label>
        <input id={`${toolId}-input`} type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. 255" aria-label={`Number for ${toolName}`} className="input-field font-mono" />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-base`} className="block text-sm font-medium text-gray-700 mb-1">Input Base</label>
        <select id={`${toolId}-base`} value={fromBase} onChange={(e) => setFromBase(e.target.value)} aria-label={`Base for ${toolName}`} className="input-field">
          <option value="2">Binary (2)</option>
          <option value="8">Octal (8)</option>
          <option value="10">Decimal (10)</option>
          <option value="16">Hexadecimal (16)</option>
          <option value="36">Base-36</option>
        </select>
      </InputArea>
      <button onClick={convert} className="btn-primary" aria-label="Convert number">Convert</button>
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
