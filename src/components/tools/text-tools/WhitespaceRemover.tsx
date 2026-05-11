'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WhitespaceRemover - Removes extra whitespace from text with multiple cleaning options.
 */
export default function WhitespaceRemover({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [options, setOptions] = useState({
    trimLines: true,
    collapseSpaces: true,
    removeBlankLines: false,
    removeAllSpaces: false,
    trimEnds: true,
  });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      let result = input;

      if (options.removeAllSpaces) {
        result = result.replace(/[ \t]/g, '');
      } else {
        if (options.collapseSpaces) {
          result = result.replace(/[ \t]+/g, ' ');
        }
        if (options.trimLines) {
          result = result.split('\n').map((line) => line.trim()).join('\n');
        }
      }

      if (options.removeBlankLines) {
        result = result.split('\n').filter((line) => line.trim().length > 0).join('\n');
      }

      if (options.trimEnds) {
        result = result.trim();
      }

      setOutput(result);
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, options]);

  const saved = input.length - output.length;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Text to clean for {toolName}
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste text with extra   spaces,    tabs, or blank lines..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-36 resize-y font-mono text-sm"
        />
        <div className="flex flex-wrap gap-3 mt-3">
          {[
            { key: 'trimLines', label: 'Trim lines' },
            { key: 'collapseSpaces', label: 'Collapse spaces' },
            { key: 'removeBlankLines', label: 'Remove blank lines' },
            { key: 'removeAllSpaces', label: 'Remove all spaces' },
            { key: 'trimEnds', label: 'Trim start/end' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={options[key as keyof typeof options]}
                onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                className="rounded border-gray-300"
              />
              {label}
            </label>
          ))}
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Cleaned Text {saved > 0 && <span className="text-green-600 font-normal">({saved} chars removed)</span>}
              </label>
              <CopyToClipboard text={output} />
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 p-4 bg-gray-50 rounded-lg border border-gray-100 max-h-64 overflow-y-auto">
              {output}
            </pre>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
