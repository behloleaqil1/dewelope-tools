'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HtmlListGenerator - Generate HTML ordered/unordered lists from text lines.
 * Each non-empty line becomes a list item.
 */
export default function HtmlListGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [listType, setListType] = useState<'ul' | 'ol'>('ul');
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input.trim()) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      const lines = input.split('\n').filter((line) => line.trim());
      if (lines.length === 0) {
        setOutput('');
        return;
      }
      const items = lines.map((line) => `  <li>${line.trim()}</li>`).join('\n');
      const tag = listType;
      setOutput(`<${tag}>\n${items}\n</${tag}>`);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, listType]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="mb-3">
          <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">List Type</label>
          <select
            id={`${toolId}-type`}
            value={listType}
            onChange={(e) => setListType(e.target.value as 'ul' | 'ol')}
            className="input-field text-sm w-48"
            aria-label="List type selection"
          >
            <option value="ul">Unordered List (ul)</option>
            <option value="ol">Ordered List (ol)</option>
          </select>
        </div>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text lines (one item per line)
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'Apple\nBanana\nCherry\nDate'}
          aria-label={`Text input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated HTML List</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
