'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DotenvFileGenerator - Generate .env file content from key-value pair inputs.
 */
export default function DotenvFileGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [pairs, setPairs] = useState([{ key: '', value: '', comment: '' }]);

  const addPair = () => setPairs([...pairs, { key: '', value: '', comment: '' }]);
  const removePair = (i: number) => setPairs(pairs.filter((_, idx) => idx !== i));
  const updatePair = (i: number, field: 'key' | 'value' | 'comment', val: string) => {
    const next = [...pairs];
    next[i] = { ...next[i], [field]: val };
    setPairs(next);
  };

  const generateEnv = (): string => {
    const lines: string[] = [];
    for (const p of pairs) {
      if (!p.key.trim()) continue;
      if (p.comment.trim()) lines.push(`# ${p.comment.trim()}`);
      const key = p.key.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_');
      const value = p.value.includes(' ') ? `"${p.value}"` : p.value;
      lines.push(`${key}=${value}`);
    }
    return lines.join('\n');
  };

  const result = generateEnv();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      {pairs.map((p, i) => (
        <div key={i} className="flex gap-2 items-start">
          <div className="flex-1 space-y-1">
            <input type="text" value={p.key} onChange={(e) => updatePair(i, 'key', e.target.value)} placeholder="KEY_NAME" aria-label={`Environment variable key ${i + 1} for ${toolName}`} className="w-full p-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex-1 space-y-1">
            <input type="text" value={p.value} onChange={(e) => updatePair(i, 'value', e.target.value)} placeholder="value" aria-label={`Environment variable value ${i + 1} for ${toolName}`} className="w-full p-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex-1 space-y-1">
            <input type="text" value={p.comment} onChange={(e) => updatePair(i, 'comment', e.target.value)} placeholder="comment (optional)" aria-label={`Comment ${i + 1} for ${toolName}`} className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          {pairs.length > 1 && (
            <button onClick={() => removePair(i)} className="p-2 text-red-500 hover:text-red-700" aria-label="Remove pair">✕</button>
          )}
        </div>
      ))}
      <button onClick={addPair} className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800" aria-label="Add variable">+ Add Variable</button>
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
