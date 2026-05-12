'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToLeetAdvanced - Advanced leetspeak converter with multiple substitution levels.
 */
export default function TextToLeetAdvanced({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [level, setLevel] = useState<'basic' | 'intermediate' | 'advanced'>('basic');
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const leetMaps = {
    basic: { a: '4', e: '3', i: '1', o: '0', s: '5', t: '7', l: '1', b: '8' } as Record<string, string>,
    intermediate: { a: '@', e: '3', i: '!', o: '0', s: '$', t: '7', l: '1', b: '8', g: '9', z: '2', c: '(', d: '|)', n: '/\\/' } as Record<string, string>,
    advanced: { a: '@', e: '€', i: '|', o: '()', s: '$', t: '+', l: '|_', b: '|3', g: '6', z: '2', c: '<', d: '|)', n: '|\\|', h: '|-|', k: '|<', m: '|\\/|', r: '|2', u: '|_|', v: '\\/', w: '\\/\\/', x: '><', y: '`/' } as Record<string, string>,
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!input) { setOutput(''); return; }

    debounceRef.current = setTimeout(() => {
      const map = leetMaps[level];
      const result = input.split('').map(char => {
        const lower = char.toLowerCase();
        if (map[lower]) {
          return char === char.toUpperCase() ? map[lower].toUpperCase() : map[lower];
        }
        return char;
      }).join('');
      setOutput(result);
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, level]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Enter text to convert</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text to convert to leetspeak..." aria-label={`Text input for ${toolName}`} className="input-field h-32 resize-y" />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-level`} className="block text-sm font-medium text-gray-700 mb-1">Substitution Level</label>
        <select id={`${toolId}-level`} value={level} onChange={(e) => setLevel(e.target.value as 'basic' | 'intermediate' | 'advanced')} className="input-field" aria-label={`Level for ${toolName}`}>
          <option value="basic">Basic (simple number swaps)</option>
          <option value="intermediate">Intermediate (symbols + numbers)</option>
          <option value="advanced">Advanced (full character art)</option>
        </select>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Leetspeak Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
