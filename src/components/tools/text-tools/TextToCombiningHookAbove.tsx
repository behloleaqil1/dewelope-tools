'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToCombiningHookAbove - Add combining hook above (U+0309) to text characters.
 * Creates characters like ả and ẻ used in Vietnamese.
 */
export default function TextToCombiningHookAbove({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [applyTo, setApplyTo] = useState<'vowels' | 'all'>('vowels');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!input) { setOutput(''); return; }

    debounceRef.current = setTimeout(() => {
      const combiningHookAbove = '\u0309';
      const vowels = /[aeiouAEIOU]/;
      const result = input.split('').map((char) => {
        if (applyTo === 'vowels' && !vowels.test(char)) return char;
        if (applyTo === 'all' && !/[a-zA-Z]/.test(char)) return char;
        return char + combiningHookAbove;
      }).join('');
      setOutput(result);
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, applyTo]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-apply`} className="block text-sm font-medium text-gray-700 mb-1">Apply To</label>
            <select id={`${toolId}-apply`} value={applyTo} onChange={(e) => setApplyTo(e.target.value as 'vowels' | 'all')} className="input-field" aria-label="Apply to selection">
              <option value="vowels">Vowels only</option>
              <option value="all">All letters</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Enter text</label>
            <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type text to add hook above..." aria-label={`Text input for ${toolName}`} className="input-field h-32 resize-y font-mono" />
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
