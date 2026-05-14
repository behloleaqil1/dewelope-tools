'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextPatternExtractor - Extract patterns like emails, URLs, phone numbers from text
 */
export default function TextPatternExtractor({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [pattern, setPattern] = useState<'emails' | 'urls' | 'phones' | 'ips' | 'dates'>('emails');
  const [result, setResult] = useState<string[]>([]);
  const [error, setError] = useState<string | undefined>();

  function extract() {
    setError(undefined);
    setResult([]);

    if (!input.trim()) { setError('Please enter text to search'); return; }

    let regex: RegExp;
    switch (pattern) {
      case 'emails':
        regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        break;
      case 'urls':
        regex = /https?:\/\/[^\s<>"{}|\\^`[\]]+/g;
        break;
      case 'phones':
        regex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g;
        break;
      case 'ips':
        regex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
        break;
      case 'dates':
        regex = /\b\d{1,4}[-/]\d{1,2}[-/]\d{1,4}\b/g;
        break;
    }

    const matches = input.match(regex) || [];
    const unique = [...new Set(matches)];
    setResult(unique);
  }

  const copyText = result.join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Text Input</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste text containing patterns to extract" aria-label={`Text input for ${toolName}`} className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" />
        <label htmlFor={`${toolId}-pattern`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Pattern to Extract</label>
        <select id={`${toolId}-pattern`} value={pattern} onChange={(e) => setPattern(e.target.value as typeof pattern)} aria-label={`Pattern type for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="emails">Email Addresses</option>
          <option value="urls">URLs</option>
          <option value="phones">Phone Numbers</option>
          <option value="ips">IP Addresses</option>
          <option value="dates">Dates</option>
        </select>
      </InputArea>

      <button onClick={extract} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Extract</button>

      <OutputArea hasContent={result.length > 0}>
        {result.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm text-gray-600">Found {result.length} unique match{result.length !== 1 ? 'es' : ''}:</div>
            <ul className="space-y-1">
              {result.map((match, i) => (
                <li key={i} className="text-sm font-mono bg-white p-2 rounded border border-gray-200">{match}</li>
              ))}
            </ul>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
