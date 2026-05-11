'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextTruncator - Truncates text to a specified character or word limit with configurable suffix.
 */
export default function TextTruncator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [limit, setLimit] = useState('100');
  const [mode, setMode] = useState<'chars' | 'words'>('chars');
  const [suffix, setSuffix] = useState('...');
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!input) { setOutput(''); return; }

    debounceRef.current = setTimeout(() => {
      const max = parseInt(limit) || 100;
      if (mode === 'chars') {
        if (input.length <= max) { setOutput(input); return; }
        setOutput(input.slice(0, max - suffix.length) + suffix);
      } else {
        const words = input.split(/\s+/);
        if (words.length <= max) { setOutput(input); return; }
        setOutput(words.slice(0, max).join(' ') + suffix);
      }
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, limit, mode, suffix]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Text to truncate for {toolName}</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste long text here..." aria-label={`Text input for ${toolName}`} className="input-field h-32 resize-y" />
        <div className="flex gap-3 mt-3 items-end flex-wrap">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Limit</label>
            <input type="number" min="1" value={limit} onChange={(e) => setLimit(e.target.value)} aria-label="Character/word limit" className="input-field w-20 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Mode</label>
            <select value={mode} onChange={(e) => setMode(e.target.value as 'chars' | 'words')} aria-label="Truncation mode" className="input-field text-sm">
              <option value="chars">Characters</option>
              <option value="words">Words</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Suffix</label>
            <input type="text" value={suffix} onChange={(e) => setSuffix(e.target.value)} aria-label="Truncation suffix" className="input-field w-20 text-sm font-mono" />
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Truncated ({output.length} chars)</label>
              <CopyToClipboard text={output} />
            </div>
            <div className="text-sm text-gray-800 p-4 bg-gray-50 rounded-lg border border-gray-100">{output}</div>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
