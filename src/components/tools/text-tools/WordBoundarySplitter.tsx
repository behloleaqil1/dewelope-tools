'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WordBoundarySplitter - Splits camelCase, PascalCase, snake_case, kebab-case into separate words.
 * Detects naming conventions and splits them into human-readable words.
 */
export default function WordBoundarySplitter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [separator, setSeparator] = useState(' ');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input.trim()) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      const lines = input.split('\n');
      const results = lines.map((line) => splitWords(line.trim(), separator));
      setOutput(results.join('\n'));
    }, 200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, separator]);

  const splitWords = (text: string, sep: string): string => {
    if (!text) return '';

    // Replace underscores and hyphens with spaces first
    let result = text.replace(/[_-]/g, ' ');

    // Insert space before uppercase letters that follow lowercase letters (camelCase)
    result = result.replace(/([a-z])([A-Z])/g, '$1 $2');

    // Insert space between consecutive uppercase letters followed by lowercase (e.g., XMLParser -> XML Parser)
    result = result.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');

    // Split by spaces, filter empty, and join with separator
    const words = result.split(/\s+/).filter(Boolean);

    return words.join(sep);
  };

  const detectedFormat = (text: string): string => {
    if (!text.trim()) return '';
    const sample = text.split('\n')[0].trim();
    if (sample.includes('_')) return 'snake_case';
    if (sample.includes('-')) return 'kebab-case';
    if (/^[a-z]/.test(sample) && /[A-Z]/.test(sample)) return 'camelCase';
    if (/^[A-Z]/.test(sample) && /[a-z]/.test(sample)) return 'PascalCase';
    if (sample === sample.toUpperCase() && sample.includes('_')) return 'SCREAMING_SNAKE_CASE';
    return 'unknown';
  };

  const format = detectedFormat(input);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter identifiers (one per line)
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`camelCaseExample\nPascalCaseExample\nsnake_case_example\nkebab-case-example\nXMLHttpRequest`}
          aria-label={`Text input for ${toolName}`}
          className="input-field h-40 resize-y font-mono text-sm"
        />
      </InputArea>

      <div>
        <label htmlFor={`${toolId}-separator`} className="block text-sm font-medium text-gray-700 mb-1">
          Word Separator
        </label>
        <select
          id={`${toolId}-separator`}
          value={separator}
          onChange={(e) => setSeparator(e.target.value)}
          aria-label={`Separator for ${toolName}`}
          className="input-field w-auto"
        >
          <option value=" ">Space</option>
          <option value="-">Hyphen (-)</option>
          <option value="_">Underscore (_)</option>
          <option value=", ">Comma</option>
        </select>
      </div>

      {format && (
        <div className="text-sm text-gray-500">
          Detected format: <span className="font-medium text-gray-700">{format}</span>
        </div>
      )}

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Split Words</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
