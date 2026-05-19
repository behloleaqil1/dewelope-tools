'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PlaceholderTextReplacer - Find and replace multiple placeholders simultaneously.
 */
export default function PlaceholderTextReplacer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [replacements, setReplacements] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const replace = () => {
    setError('');
    setResult('');
    if (!input.trim()) { setError('Please enter text.'); return; }
    if (!replacements.trim()) { setError('Please enter replacement pairs.'); return; }

    const pairs = replacements.split('\n').filter((l) => l.trim()).map((line) => {
      const sepIdx = line.indexOf('->');
      if (sepIdx > 0) return { find: line.slice(0, sepIdx).trim(), replace: line.slice(sepIdx + 2).trim() };
      const eqIdx = line.indexOf('=');
      if (eqIdx > 0) return { find: line.slice(0, eqIdx).trim(), replace: line.slice(eqIdx + 1).trim() };
      return null;
    }).filter(Boolean) as { find: string; replace: string }[];

    if (pairs.length === 0) { setError('No valid replacement pairs found. Use "find -> replace" or "find = replace" format.'); return; }

    let output = input;
    for (const pair of pairs) {
      const flags = caseSensitive ? 'g' : 'gi';
      const escaped = pair.find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      output = output.replace(new RegExp(escaped, flags), pair.replace);
    }

    setResult(output);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div>
          <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Input Text</label>
          <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Text with placeholders to replace..." rows={5} aria-label={`Input text for ${toolName}`} className="input-field" />
        </div>
        <div className="mt-3">
          <label htmlFor={`${toolId}-pairs`} className="block text-sm font-medium text-gray-700 mb-1">Replacement Pairs (find -&gt; replace, one per line)</label>
          <textarea id={`${toolId}-pairs`} value={replacements} onChange={(e) => setReplacements(e.target.value)} placeholder={"[NAME] -> John Doe\n[DATE] -> 2024-01-15\n[COMPANY] -> Acme"} rows={4} aria-label={`Replacement pairs for ${toolName}`} className="input-field font-mono" />
        </div>
        <div className="mt-3">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} aria-label="Case sensitive" className="rounded" />
            Case sensitive
          </label>
        </div>
      </InputArea>

      <button onClick={replace} className="btn-primary" aria-label="Replace placeholders">Replace All</button>

      <OutputArea hasContent={result.length > 0}>
        {result && (
          <div className="space-y-3">
            <pre className="text-sm bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto whitespace-pre-wrap font-mono">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
