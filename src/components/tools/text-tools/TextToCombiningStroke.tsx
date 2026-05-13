'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToCombiningStroke - Add combining short or long stroke overlay to text characters.
 * Creates characters like đ (d + U+0335) and ł (l + U+0335) or long stroke (U+0336).
 */
export default function TextToCombiningStroke({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [strokeType, setStrokeType] = useState<'short' | 'long'>('short');
  const [applyTo, setApplyTo] = useState<'all' | 'letters'>('letters');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!input) { setOutput(''); return; }

    debounceRef.current = setTimeout(() => {
      const combiningChar = strokeType === 'short' ? '\u0335' : '\u0336';
      const result = input.split('').map((char) => {
        if (applyTo === 'letters' && !/[a-zA-Z]/.test(char)) return char;
        return char + combiningChar;
      }).join('');
      setOutput(result);
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, strokeType, applyTo]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-4">
            <div>
              <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Stroke Type</label>
              <select id={`${toolId}-type`} value={strokeType} onChange={(e) => setStrokeType(e.target.value as 'short' | 'long')} className="input-field" aria-label="Stroke type">
                <option value="short">Short Stroke (U+0335)</option>
                <option value="long">Long Stroke (U+0336)</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-apply`} className="block text-sm font-medium text-gray-700 mb-1">Apply To</label>
              <select id={`${toolId}-apply`} value={applyTo} onChange={(e) => setApplyTo(e.target.value as 'all' | 'letters')} className="input-field" aria-label="Apply to selection">
                <option value="letters">Letters only</option>
                <option value="all">All characters</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Enter text</label>
            <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type text to add stroke overlay..." aria-label={`Text input for ${toolName}`} className="input-field h-32 resize-y font-mono" />
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
