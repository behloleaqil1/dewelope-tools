'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToCsvConverter - Converts lines of text to CSV format with configurable delimiter.
 * Each line becomes a row; words or custom splits become columns.
 */
export default function TextToCsvConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [delimiter, setDelimiter] = useState(',');
  const [splitBy, setSplitBy] = useState('tab');
  const [quoteFields, setQuoteFields] = useState(true);
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input.trim()) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      const lines = input.split('\n');
      const splitRegex = splitBy === 'tab' ? /\t/ : splitBy === 'space' ? /\s+/ : splitBy === 'pipe' ? /\|/ : /;/;

      const csvLines = lines.map((line) => {
        const fields = line.split(splitRegex);
        return fields
          .map((field) => {
            const trimmed = field.trim();
            if (quoteFields && (trimmed.includes(delimiter) || trimmed.includes('"') || trimmed.includes('\n'))) {
              return `"${trimmed.replace(/"/g, '""')}"`;
            }
            return quoteFields ? `"${trimmed}"` : trimmed;
          })
          .join(delimiter);
      });

      setOutput(csvLines.join('\n'));
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, delimiter, splitBy, quoteFields]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text (one row per line)
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"Name\tAge\tCity\nAlice\t30\tNew York\nBob\t25\tLondon"}
          aria-label={`Text input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
      </InputArea>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor={`${toolId}-split`} className="block text-sm font-medium text-gray-700 mb-1">
            Split columns by
          </label>
          <select
            id={`${toolId}-split`}
            value={splitBy}
            onChange={(e) => setSplitBy(e.target.value)}
            aria-label="Split columns by"
            className="input-field"
          >
            <option value="tab">Tab</option>
            <option value="space">Spaces</option>
            <option value="pipe">Pipe (|)</option>
            <option value="semicolon">Semicolon (;)</option>
          </select>
        </div>

        <div>
          <label htmlFor={`${toolId}-delimiter`} className="block text-sm font-medium text-gray-700 mb-1">
            Output delimiter
          </label>
          <select
            id={`${toolId}-delimiter`}
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            aria-label="Output delimiter"
            className="input-field"
          >
            <option value=",">Comma (,)</option>
            <option value=";">Semicolon (;)</option>
            <option value="|">Pipe (|)</option>
            <option value={'\t'}>Tab</option>
          </select>
        </div>

        <div className="flex items-end">
          <label className="inline-flex items-center gap-2 text-sm text-gray-600 pb-2">
            <input
              type="checkbox"
              checked={quoteFields}
              onChange={(e) => setQuoteFields(e.target.checked)}
              className="rounded border-gray-300"
            />
            Quote fields
          </label>
        </div>
      </div>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">CSV Output</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all max-h-96 overflow-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
