'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const INVISIBLE_CHARS: Record<string, string> = {
  '\u200B': 'Zero Width Space (U+200B)',
  '\u200C': 'Zero Width Non-Joiner (U+200C)',
  '\u200D': 'Zero Width Joiner (U+200D)',
  '\uFEFF': 'BOM / Zero Width No-Break Space (U+FEFF)',
  '\u00A0': 'Non-Breaking Space (U+00A0)',
  '\u2060': 'Word Joiner (U+2060)',
  '\u180E': 'Mongolian Vowel Separator (U+180E)',
  '\t': 'Tab (U+0009)',
};

export default function InvisibleCharacterDetector({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<{ char: string; name: string; count: number }[]>([]);

  const detect = () => {
    const found: Record<string, number> = {};
    for (const ch of input) {
      for (const [invisible, name] of Object.entries(INVISIBLE_CHARS)) {
        if (ch === invisible) {
          found[name] = (found[name] || 0) + 1;
        }
      }
    }
    setResults(Object.entries(found).map(([name, count]) => ({ char: '', name, count })));
  };

  const copyText = results.map(r => `${r.name}: ${r.count}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Paste text to inspect</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste text that may contain invisible characters..." aria-label={`Text input for ${toolName}`} className="input-field h-40 resize-y font-mono" />
      </InputArea>
      <button onClick={detect} className="btn-primary" aria-label="Detect invisible characters">Detect Characters</button>
      <OutputArea hasContent={results.length > 0}>
        {results.length > 0 && (
          <div className="space-y-2">
            {results.map((r, i) => (
              <div key={i} className="flex justify-between bg-gray-50 p-2 rounded border border-gray-200">
                <span className="text-sm text-gray-700">{r.name}</span>
                <span className="text-sm font-bold text-red-600">{r.count} found</span>
              </div>
            ))}
            <CopyToClipboard text={copyText} />
          </div>
        )}
        {results.length === 0 && input && (
          <p className="text-sm text-green-600">No invisible characters detected.</p>
        )}
      </OutputArea>
    </div>
  );
}
