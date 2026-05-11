'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToCsvColumns - Split text into CSV columns by delimiter or fixed width.
 * Supports custom delimiters, fixed-width splitting, and configurable output separator.
 */
export default function TextToCsvColumns({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'delimiter' | 'fixed'>('delimiter');
  const [delimiter, setDelimiter] = useState('\\t');
  const [fixedWidth, setFixedWidth] = useState('10');
  const [outputSeparator, setOutputSeparator] = useState(',');
  const [trimFields, setTrimFields] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input.trim()) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      const lines = input.split('\n');
      const resultLines: string[] = [];

      for (const line of lines) {
        let fields: string[];

        if (mode === 'delimiter') {
          const actualDelimiter = delimiter
            .replace(/\\t/g, '\t')
            .replace(/\\s/g, ' ')
            .replace(/\\n/g, '\n');
          fields = line.split(actualDelimiter);
        } else {
          const width = parseInt(fixedWidth) || 10;
          fields = [];
          for (let i = 0; i < line.length; i += width) {
            fields.push(line.substring(i, i + width));
          }
        }

        if (trimFields) {
          fields = fields.map((f) => f.trim());
        }

        // Quote fields that contain the output separator or quotes
        const quoted = fields.map((f) => {
          if (f.includes(outputSeparator) || f.includes('"') || f.includes('\n')) {
            return `"${f.replace(/"/g, '""')}"`;
          }
          return f;
        });

        resultLines.push(quoted.join(outputSeparator));
      }

      setOutput(resultLines.join('\n'));
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, mode, delimiter, fixedWidth, outputSeparator, trimFields]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Input Text
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste text with delimiters or fixed-width columns..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-40 resize-y font-mono"
        />
      </InputArea>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">Split Mode</label>
          <select id={`${toolId}-mode`} value={mode} onChange={(e) => setMode(e.target.value as 'delimiter' | 'fixed')} className="input-field" aria-label="Split mode">
            <option value="delimiter">By Delimiter</option>
            <option value="fixed">Fixed Width</option>
          </select>
        </div>
        {mode === 'delimiter' ? (
          <div>
            <label htmlFor={`${toolId}-delim`} className="block text-sm font-medium text-gray-700 mb-1">Delimiter</label>
            <input id={`${toolId}-delim`} type="text" value={delimiter} onChange={(e) => setDelimiter(e.target.value)} placeholder="\\t, |, ;, etc." className="input-field" aria-label="Delimiter" />
          </div>
        ) : (
          <div>
            <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">Column Width</label>
            <input id={`${toolId}-width`} type="number" min="1" value={fixedWidth} onChange={(e) => setFixedWidth(e.target.value)} className="input-field" aria-label="Column width" />
          </div>
        )}
        <div>
          <label htmlFor={`${toolId}-sep`} className="block text-sm font-medium text-gray-700 mb-1">Output Separator</label>
          <select id={`${toolId}-sep`} value={outputSeparator} onChange={(e) => setOutputSeparator(e.target.value)} className="input-field" aria-label="Output separator">
            <option value=",">Comma (,)</option>
            <option value=";">Semicolon (;)</option>
            <option value="\t">Tab</option>
            <option value="|">Pipe (|)</option>
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={trimFields} onChange={(e) => setTrimFields(e.target.checked)} className="rounded border-gray-300" />
            Trim fields
          </label>
        </div>
      </div>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">CSV Output</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
