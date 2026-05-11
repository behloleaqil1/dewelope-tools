'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToConstantCase - Convert any text to CONSTANT_CASE (uppercase with underscores).
 * Handles spaces, hyphens, camelCase, and mixed separators.
 */
export default function TextToConstantCase({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
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
      const converted = lines.map((line) => {
        if (!line.trim()) return '';
        // Insert underscore before uppercase letters in camelCase
        const expanded = line.replace(/([a-z])([A-Z])/g, '$1_$2');
        // Split on non-alphanumeric characters
        const words = expanded.split(/[^a-zA-Z0-9]+/).filter(Boolean);
        if (words.length === 0) return '';
        return words.map((w) => w.toUpperCase()).join('_');
      });
      setOutput(converted.join('\n'));
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to convert to CONSTANT_CASE
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'e.g. hello world\nmyVariableName\nsome-css-class'}
          aria-label={`Text input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">CONSTANT_CASE Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
