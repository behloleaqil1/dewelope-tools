'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToAlternatingWords - Alternate between uppercase and lowercase words.
 */
export default function TextToAlternatingWords({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [startCase, setStartCase] = useState<'upper' | 'lower'>('upper');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      const lines = input.split('\n');
      let wordIndex = 0;

      const result = lines.map(line => {
        const words = line.split(/(\s+)/);
        return words.map(token => {
          if (token.trim() === '') return token;
          const isUpper = startCase === 'upper' ? wordIndex % 2 === 0 : wordIndex % 2 !== 0;
          wordIndex++;
          return isUpper ? token.toUpperCase() : token.toLowerCase();
        }).join('');
      }).join('\n');

      setOutput(result);
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, startCase]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-start`} className="block text-sm font-medium text-gray-700 mb-1">Start With</label>
            <select id={`${toolId}-start`} value={startCase} onChange={(e) => setStartCase(e.target.value as 'upper' | 'lower')} aria-label="Starting case" className="input-field w-48">
              <option value="upper">UPPERCASE first</option>
              <option value="lower">lowercase first</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Enter Text</label>
            <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="The quick brown fox jumps over the lazy dog" aria-label={`Text input for ${toolName}`} className="input-field h-40 resize-y font-mono" />
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Alternating Words Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
