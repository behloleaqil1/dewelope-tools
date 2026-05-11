'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextLineJoiner - Join multiple lines into a single line with configurable separator.
 * Supports common separators like comma, space, pipe, semicolon, or custom strings.
 */
export default function TextLineJoiner({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState(', ');
  const [customSep, setCustomSep] = useState('');
  const [trimLines, setTrimLines] = useState(true);
  const [skipEmpty, setSkipEmpty] = useState(true);
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const separatorOptions = [
    { label: 'Comma + Space', value: ', ' },
    { label: 'Comma', value: ',' },
    { label: 'Space', value: ' ' },
    { label: 'Pipe', value: ' | ' },
    { label: 'Semicolon', value: '; ' },
    { label: 'Tab', value: '\t' },
    { label: 'Custom', value: '__custom__' },
  ];

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!input) { setOutput(''); return; }

    debounceRef.current = setTimeout(() => {
      let lines = input.split('\n');
      if (trimLines) lines = lines.map((l) => l.trim());
      if (skipEmpty) lines = lines.filter((l) => l.length > 0);
      const sep = separator === '__custom__' ? customSep : separator;
      setOutput(lines.join(sep));
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, separator, customSep, trimLines, skipEmpty]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Lines to Join
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Line 1&#10;Line 2&#10;Line 3"
          aria-label={`Text input for ${toolName}`}
          className="input-field h-40 resize-y font-mono"
        />
        <div className="mt-3 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-sep`} className="block text-sm font-medium text-gray-700 mb-1">
              Separator
            </label>
            <select id={`${toolId}-sep`} value={separator} onChange={(e) => setSeparator(e.target.value)} aria-label={`Separator for ${toolName}`} className="input-field">
              {separatorOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          {separator === '__custom__' && (
            <div>
              <label htmlFor={`${toolId}-custom`} className="block text-sm font-medium text-gray-700 mb-1">
                Custom Separator
              </label>
              <input id={`${toolId}-custom`} type="text" value={customSep} onChange={(e) => setCustomSep(e.target.value)} aria-label={`Custom separator for ${toolName}`} className="input-field" />
            </div>
          )}
        </div>
        <div className="mt-3 flex gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={trimLines} onChange={(e) => setTrimLines(e.target.checked)} className="rounded" />
            Trim lines
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={skipEmpty} onChange={(e) => setSkipEmpty(e.target.checked)} className="rounded" />
            Skip empty lines
          </label>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Joined Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
