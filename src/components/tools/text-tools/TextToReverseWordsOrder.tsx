'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToReverseWordsOrder - Reverse the order of words in each sentence.
 */
export default function TextToReverseWordsOrder({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'per-line' | 'whole'>('per-line');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      if (mode === 'per-line') {
        const result = input
          .split('\n')
          .map(line => line.trim().split(/\s+/).reverse().join(' '))
          .join('\n');
        setOutput(result);
      } else {
        const result = input.trim().split(/\s+/).reverse().join(' ');
        setOutput(result);
      }
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, mode]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
            <select id={`${toolId}-mode`} value={mode} onChange={(e) => setMode(e.target.value as 'per-line' | 'whole')} aria-label="Reverse mode" className="input-field w-48">
              <option value="per-line">Reverse words per line</option>
              <option value="whole">Reverse all words</option>
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
            <label className="block text-sm font-medium text-gray-700">Result (Words Reversed)</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
