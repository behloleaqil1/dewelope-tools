'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DotenvGenerator - Generate .env file content from key-value form inputs.
 */
export default function DotenvGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [pairs, setPairs] = useState([{ key: '', value: '' }]);
  const [output, setOutput] = useState('');

  function addPair() {
    setPairs([...pairs, { key: '', value: '' }]);
  }

  function updatePair(index: number, field: 'key' | 'value', val: string) {
    const updated = [...pairs];
    updated[index][field] = val;
    setPairs(updated);
  }

  function generate() {
    const lines = pairs
      .filter((p) => p.key.trim())
      .map((p) => {
        const val = p.value.includes(' ') ? `"${p.value}"` : p.value;
        return `${p.key.trim().toUpperCase()}=${val}`;
      });
    setOutput(lines.join('\n'));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">Key-Value Pairs for {toolName}</label>
        {pairs.map((pair, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input type="text" value={pair.key} onChange={(e) => updatePair(i, 'key', e.target.value)} placeholder="KEY" aria-label={`Environment variable key ${i + 1}`} className="input-field flex-1" />
            <input type="text" value={pair.value} onChange={(e) => updatePair(i, 'value', e.target.value)} placeholder="value" aria-label={`Environment variable value ${i + 1}`} className="input-field flex-1" />
          </div>
        ))}
        <button onClick={addPair} className="text-sm text-blue-600 hover:underline" aria-label="Add another key-value pair">+ Add Row</button>
      </InputArea>

      <button onClick={generate} aria-label="Generate .env file" className="btn-primary">Generate .env</button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
